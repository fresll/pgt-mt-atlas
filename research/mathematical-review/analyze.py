"""Read-only source audit; Python standard library only. Run: python3 analyze.py."""
from pathlib import Path
import csv,json,math,statistics,hashlib,subprocess,sys,os

ROOT=Path(__file__).resolve().parent
REPO=Path(os.environ.get('ATLAS_REPO',str(ROOT.parents[1])))
SHA='8c3bdc241504cf9605bc341a2bdd642afb68b958'
def write(name, rows):
    rows=list(rows)
    fields=list(dict.fromkeys(k for r in rows for k in r))
    with (ROOT/name).open('w',newline='',encoding='utf-8') as f:
        w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(rows)

def wilson(k,n):
    z=1.959963984540054;d=1+z*z/n
    c=(k/n+z*z/(2*n))/d;h=z*math.sqrt(k/n*(1-k/n)/n+z*z/(4*n*n))/d
    return c-h,c+h
def atleast(q,n):
    assert 0<=q<=1 and n>=0
    return 0. if n==0 else 1. if q==1 else -math.expm1(n*math.log1p(-q))
def bb(mu,rho,n):
    if rho==0:return atleast(mu,n)
    if mu in [0,1]:return atleast(mu,n)
    c=1/rho-1;a=mu*c;b=(1-mu)*c
    return 1-math.prod((b+j)/(a+b+j) for j in range(n))
def beta_scaled(a,b,e,n):
    # exact finite expansion, reliable in the modest N range audited here
    return 1-sum(math.comb(n,j)*(-e)**j*math.prod((a+r)/(a+b+r) for r in range(j)) for j in range(n+1))
def fpolys(x,terms):
    # 2F1(1-i,i+2;2;x) = 2 P'_i(1-2x)/(i(i+1)); stable Legendre recurrence.
    z=1-2*x;pa,pb,da,db=1.,z,0.,1.;out=[]
    for i in range(1,terms+1):
        out.append(2*db/(i*(i+1)))
        pc=((2*i+1)*z*pb-i*pa)/(i+1)
        dc=((2*i+1)*(pb+z*db)-i*da)/(i+1)
        pa,pb,da,db=pb,pc,db,dc
    return out
def kimura(p,b,t=.15,terms=60,steps=4000):
    assert 0<p<1 and 0<b<1 and steps%2==0
    f=fpolys(p,terms)
    coef=[(2*i+1)*p*(1-p)*f[i-1]*b**(i*(i+1)/2) for i in range(1,terms+1)]
    m0=1-p-sum(coef);m1=p+sum((-1)**i*coef[i-1] for i in range(1,terms+1))
    def density(x):return sum(i*(i+1)*coef[i-1]*v for i,v in enumerate(fpolys(x,terms),1))
    def integral(fn,top):
        h=top/steps
        return h/3*(fn(0)+fn(top)+sum((4 if j%2 else 2)*fn(j*h) for j in range(1,steps)))
    norm=m0+m1+integral(density,1)
    mean=m1+integral(lambda x:x*density(x),1)
    second=m1+integral(lambda x:x*x*density(x),1)
    fourth=m0*p**4+m1*(1-p)**4+integral(lambda x:(x-p)**4*density(x),1)
    return dict(cdf=m0+integral(density,t),mass0=m0,mass1=m1,norm=norm,mean=mean,variance=second-mean*mean,fourth_central=fourth)

observations=[]
def obs(pub,mother,cycle,eid,v,value,stage,pgta,locator,**extra):
    r=dict(publication=pub,source_locator=locator,family_id=pub+'-'+mother,mother_id=pub+'-'+mother,
           cycle_id=pub+'-'+mother+'-'+str(cycle) if cycle else '',object_id=pub+'-'+mother+'-'+str(eid),
           object_type='embryo',variant=v,value_pct=value,qualifier='exact',stage=stage,pgta_status=pgta,
           derivation='as_reported',lod_pct='',age_at_retrieval='',material='',sample_id='',**extra)
    observations.append(r);return r

# Ji Table 3, p.3256: every source object is retained; 2.5 is described as degenerate,
# not silently reinterpreted as a normally fertilized embryo.
ji1=[(1,70.9,'4BB','chaotic_aneuploid'),(2,31.7,'4AB','mosaic_segmental'),(3,99.7,'4BC','chaotic_aneuploid'),
 (4,98.7,'4CB','chaotic_aneuploid'),(5,99.,'4BB','chaotic_aneuploid'),(6,29.4,'4BC','chaotic_aneuploid'),
 (7,58.9,'','chaotic_aneuploid'),(8,99.3,'','chaotic_aneuploid'),(10,23.5,'','euploid'),(11,99.4,'4BB','no_result')]
ji2=[(1,53.9,'5BB','euploid'),(2,67.,'5BB','segmental_only'),(3,statistics.mean([32.8,33.5,43.1,35.4,38.7,35.4]),'','not_reported'),
 (4,34.3,'5BB','euploid'),(5,43.9,'','not_reported'),(6,46.7,'5BB','aneuploid'),(7,47.3,'5BC','mosaic'),
 (8,85.3,'5BB','euploid'),(9,100.,'','not_reported'),(10,100.,'5BB','mosaic'),(11,15.2,'5BC','aneuploid_and_mosaic')]
for cycle,data in [(1,ji1),(2,ji2)]:
    for eid,value,grade,pgta in data:
        r=obs('ji2021','P1',cycle,f'{cycle}.{eid}','m.3697G>A',value,'blastocyst' if grade else 'arrested',pgta,'Table 3, p.3256',morphology=grade)
        r['age_at_retrieval']=30;r['material']='te_biopsy' if grade else 'arrested_embryo'
        r['culture']='IVM' if cycle==1 and eid in [4,6,10] else 'IVF'
        if cycle==2 and eid in [3,9]:r['derivation']='mean_of_6_blastomeres';r['material']='six_blastomeres'
        if cycle==2 and eid==5:r.update(object_type='degenerate_source_object',stage='degenerate',material='as_reported_in_table')
        if cycle==1 and eid==10:r['pgta_note']='XY in source; described as euploid in Table 3 interpretation'
for eid in [9,12]:
    r=obs('ji2021','P1',1,f'1.{eid}','m.3697G>A','','unfertilized','not_reported','Table 3, p.3256');r['object_type']='oocyte';r['qualifier']='not_reported'
for eid,values in [(3,[32.8,33.5,43.1,35.4,38.7,35.4]),(9,[100.]*6)]:
    for j,value in enumerate(values,1):
        r=obs('ji2021','P1',2,f'2.{eid}-blastomere-{j}','m.3697G>A',value,'cleavage','not_reported','Table 3, p.3256')
        r.update(object_type='blastomere',parent_object_id=f'ji2021-P1-2.{eid}',material='single_blastomere')

# Spath Supplemental Table 3, mmc3.pdf, pp.1–3. ND kept censored; value 0 is a code,
# never a statement of true molecular absence. All embryo objects plus oocytes.
def sp(mother,cycle,eid,value,stage,pgta,page,material,**kw):
    v={'A':'m.8993T>G','B':'m.8993T>G','C':'m.10191T>C','D':'m.3243A>G'}[mother]
    r=obs('spath2021',mother,cycle,eid,v,value,stage,pgta,f'Supplemental Table 3, p.{page}',**kw)
    r['material']=material
    if value==0:r['qualifier']='not_detected'
    return r
for eid,cycle,value,stage,e,mat in [(1,1,0,'blastocyst','aneuploid','te_biopsy'),(2,1,0,'arrested_cleavage','euploid','whole_embryo'),(3,2,88.7,'arrested_cleavage','aneuploid','whole_embryo'),(4,2,91.2,'unfertilized','not_tested','oocyte')]:
    r=sp('A',cycle,eid,value,stage,e,1,mat)
    if mat=='oocyte':r['object_type']='oocyte'
for eid in range(1,19):
    stage='arrested_cleavage' if eid in [11,13] else 'arrested_blastocyst' if eid==14 else 'unfertilized' if eid==16 else 'blastocyst'
    e='euploid' if eid in [1,2,3,4,6,8,9,10,12,18] else 'aneuploid'
    mat='multiple_blastomeres' if eid in [11,13] else 'whole_embryo' if eid==14 else 'oocyte' if eid==16 else 'te_biopsy'
    r=sp('B',1,eid,0,stage,e,1 if eid<=14 else 2,mat)
    if mat=='oocyte':r['object_type']='oocyte'
    if mat=='multiple_blastomeres':r['derivation']='all_reported_blastomeres_ND'
for eid in range(1,12):
    cycle=1 if eid<=3 else 2
    stage='cleavage' if eid in [3,5,6,9] else 'unfertilized' if eid in [2,10,11] else 'arrested_cleavage'
    e='euploid' if eid in [3,5] else 'aneuploid' if eid in [6,9] else 'not_tested'
    r=sp('C',cycle,eid,0,stage,e,2,'single_blastomere' if stage=='cleavage' else 'whole_embryo')
    if stage=='unfertilized':r['object_type']='oocyte';r['material']='oocyte'
    if eid==1:r['material']='multiple_blastomeres';r['derivation']='all_reported_blastomeres_ND'
dvalues={1:29.2,2:36.3,3:11.5,4:0,5:0,6:37.5,7:0,8:37.,9:3.1,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:38.,18:0,19:5.7,20:0}
te={1,3,7,9,11,12,13,14,16}
for eid,val in dvalues.items():
    stage='blastocyst' if eid in te else 'arrested_blastocyst' if eid==5 else 'unfertilized' if eid==6 else 'arrested_cleavage'
    e='euploid' if eid in [7,9,11] else 'aneuploid' if eid in te else 'not_tested'
    r=sp('D',1,eid,val,stage,e,2 if eid<=13 else 3,'te_biopsy' if eid in te else 'whole_embryo' if eid==5 else 'oocyte' if eid==6 else 'half_embryo')
    if eid==6:r['object_type']='oocyte'
    if r['material']=='half_embryo':r['derivation']='mean_of_halves' if eid!=15 else 'one_half_ND_other_failed_amplification'

# Monnot Table 3, p.120: overall embryo if available; mean blastomeres otherwise,
# exactly following the published footnote. Cycle allocation for patient 2 not provided.
mon2=[0,0,0,0,0,0,5,7.5,13,15,14.5,15,16,23,23,28,30,37,42,42,43,47,48,50,50,50,50,55,60,62,63,66,74,74.5,75]
for mother,vals in [('P1',[18,23,50]),('P2',mon2)]:
    for eid,val in enumerate(vals,1):
        r=obs('monnot2011',mother,1 if mother=='P1' else '',eid,'m.3243A>G',val,'mixed_cleavage_blastocyst','not_tested','Table 3 and footnote, p.120')
        r['derivation']='overall_embryo_or_mean_blastomeres_per_source';r['material']='mixed_source_material'
        if val==0:r['qualifier']='not_detected';r['lod_pct']=2

# Sallevelt 2017 Supplementary Table SI: diagnostic mean; if no diagnostic
# measurement, the reported reanalysis. 3PN is explicitly marked, never eligible
# merely because heteroplasmy is low. Repeat biopsies do not create embryos.
sal1=[(97.6,97.8),(95.3,95.6),(90.7,89.5),(48.9,53.7),(87.5,88.9),(93.2,93.2),(63.2,55.6),(59.3,54.2)]
sal2=[(5.4,6.1),(65.6,93),(96.9,96),(96.6,96.2),(96.7,100),(63.7,65),(12.2,12.3),(100,96.8),(19.7,22.5),(61.2,63.8),(21.4,),(100,),(8,),(43.6,)]
for cycle,vals in [(1,sal1),(2,sal2)]:
    for eid,measurements in enumerate(vals,1):
        r=obs('sallevelt2017','P1',cycle,eid,'m.14487T>C',statistics.mean(measurements),'cleavage','not_tested','Supplementary Table SI, p.1')
        r.update(material='diagnostic_blastomeres' if not(cycle==2 and eid>=12) else 'multiple_blastomeres_reanalysis',
                 derivation='mean_diagnostic_blastomeres' if len(measurements)==2 else 'single_reported_value',
                 fertilization='3PN' if cycle==2 and eid>=12 else '2PN')
r=obs('sallevelt2017','P1',1,9,'m.14487T>C',95.2,'unfertilized','not_tested','Supplementary Table SI, p.1')
r.update(object_type='oocyte',material='MI_oocyte')
for sample,material,age in [('cord','cord_blood','birth'),('swab2w','cheek_swab','2_weeks'),('swab3w','cheek_swab','3_weeks')]:
    r=obs('spath2021','B','','PGT-child-'+sample,'m.8993T>G',0,'postnatal','not_applicable','Supplemental Table 4, p.1')
    r.update(object_type='child_sample',child_id='spath2021-B-PGT-child',material=material,qualifier='not_detected',age_at_measurement=age)
r=obs('sallevelt2017','P1','','PGT-child-cord','m.14487T>C',5,'postnatal','not_applicable','p.701')
r.update(object_type='child_sample',child_id='sallevelt2017-P1-PGT-child',material='cord_blood',qualifier='approximate',age_at_measurement='birth',clinical_follow_up='healthy_at_7_months')
r=obs('ji2021','P1',2,'fetus-amniotic','m.3697G>A',49.7,'prenatal','euploid','pp.3257–3258; outcome after transfer 2.1')
r.update(object_type='fetal_sample',parent_object_id='ji2021-P1-2.1',material='amniotic_fluid',age_at_measurement='20th_week_in_results_text',clinical_follow_up='termination_after_severe_cleft_lip_palate; causality_not_established')
for r in observations:
    if r['publication']=='sallevelt2017' and r['cycle_id']:
        r['object_id']=r['cycle_id']+'-object-'+r['object_id'].rsplit('-',1)[-1]
    r['assay_method']={'ji2021':'WGA followed by NGS; see Methods pp.3253–3254','spath2021':'NGS mutation-site sequencing; WGA/PCR per specimen','monnot2011':'semiquantitative fluorescent PCR-HaeIII restriction test','sallevelt2017':'fluorescent PCR-TspRI restriction test'}[r['publication']]
assert len({r['object_id'] for r in observations})==len(observations)
assert sum(r['publication']=='spath2021' and r['object_type']=='embryo' for r in observations)==47
assert sum(r['publication']=='sallevelt2017' and r['object_type']=='embryo' for r in observations)==22
write('maternal_measurements.csv',[
 dict(publication='ji2021',mother_id='ji2021-P1',tissue='blood',value_pct=52.3,qualifier='as_reported',source_locator='p.3252',age_at_PGT=30),
 *[dict(publication='sallevelt2017',mother_id='sallevelt2017-P1',tissue=t,value_pct=v,qualifier='approximate',source_locator='p.699',age_at_measurement='not_specified',age_at_PGD_start=40) for t,v in [('lymphocytes',32),('urine',65),('muscle',55)]],
 *[dict(publication='spath2021',mother_id='spath2021-'+m,tissue=t,value_pct=v,sd_pct=sd,qualifier=q,source_locator='pp.1522,1527; Supplemental Table 2',age_at_measurement='not_specified') for m,t,v,sd,q in [('A','blood',54.3,1.0,'mean_sd'),('A','cheek_swab',55.7,.5,'mean_sd'),('B','blood',0,'','not_detected'),('B','urine',0,'','not_detected'),('B','cheek_swab',0,'','not_detected'),('C','blood',0,'','not_detected'),('C','urine',0,'','not_detected'),('D','blood',7.3,1.1,'mean_sd'),('D','cheek_swab',11.4,7.3,'mean_sd'),('D','muscle',28,'','approximate_reference_laboratory')]]
])
write('observations.csv',observations)
write('complete_cycle_counts.csv',[
 dict(publication='sallevelt2017',cycle_id='sallevelt2017-P1-1',retrieved_oocytes=12,fertilized=11,n_2PN_biopsied=8,n_2PN_numeric=8,n_2PN_inconclusive=0,n_3PN=0,n_2PN_below18=0,source_locator='pp.700–701; Table SI',other_objects='2 degenerate; 1 0PN no result; 1 MI oocyte'),
 dict(publication='sallevelt2017',cycle_id='sallevelt2017-P1-2',retrieved_oocytes=18,fertilized=18,n_2PN_biopsied=15,n_2PN_numeric=11,n_2PN_inconclusive=4,n_3PN=3,n_2PN_below18=2,source_locator='pp.700–701; Table SI',other_objects='four positive-blank results above transfer threshold; exact values unavailable')
])
write('clinical_outcomes.csv',[
 dict(publication='ji2021',mother_id='ji2021-P1',route='PGT',event_id='cycle1-transfer',embryo_id='ji2021-P1-1.2',outcome='positive_hCG_no_clinical_pregnancy',source_locator='p.3255',limitation='H31.7 mosaic embryo; did not meet modeled strict joint criteria'),
 dict(publication='ji2021',mother_id='ji2021-P1',route='PGT',event_id='cycle2-transfer',embryo_id='ji2021-P1-2.1',outcome='clinical_pregnancy_then_termination',source_locator='pp.3257–3258',limitation='H53.9 euploid; fetal amniotic H49.7; severe cleft lip/palate; mtDNA causality not established'),
 dict(publication='spath2021',mother_id='spath2021-B',route='PGT',event_id='B-transfer1',embryo_id='',outcome='live_birth',gestation='40_weeks',child_id='spath2021-B-PGT-child',follow_up='newborn_samples_up_to_3_weeks',source_locator='p.1527; Supplemental Table 4',limitation='exact transferred embryo ID not reported; selected case'),
 dict(publication='spath2021',mother_id='spath2021-C',route='PGT',event_id='C-transfer1',embryo_id='spath2021-C-3',outcome='failed_implantation',source_locator='p.1527; Supplemental Table 3'),
 dict(publication='spath2021',mother_id='spath2021-C',route='PGT',event_id='C-transfer2',embryo_id='spath2021-C-5',outcome='early_pregnancy_loss',source_locator='p.1527; Supplemental Table 3'),
 dict(publication='spath2021',mother_id='spath2021-C',route='natural_after_PGT',event_id='C-natural',embryo_id='',outcome='live_birth',gestation='full_term',source_locator='p.1527',limitation='PND ND; all lifetime pregnancies not documented'),
 *[dict(publication='spath2021',mother_id='spath2021-D',route='PGT',event_id='D-transfer'+str(i),embryo_id='',outcome='miscarriage',gestation='8_weeks',source_locator='p.1527',limitation='transferred ND euploid embryos 7 and 11; order not reported') for i in [1,2]],
 dict(publication='sallevelt2017',mother_id='sallevelt2017-P1',route='PGT',event_id='transfer_double',embryo_id='cycle2:1 and 7',outcome='singleton_live_birth',source_locator='pp.700–701',limitation='double transfer; which embryo produced child unknown; no model of clinical risk fitted')
])
write('families.csv',[
 dict(publication='ji2021',mother_id='ji2021-P1',variant='m.3697G>A',n_cycles=2,n_source_objects=21,age=30,maternal_blood_pct=52.3,source_locator='Case description p.3252; Table 3 p.3256'),
 dict(publication='monnot2011',mother_id='monnot2011-P1',variant='m.3243A>G',n_cycles=1,n_source_objects=3,source_locator='Methods p.117; Table 3 p.120'),
 dict(publication='monnot2011',mother_id='monnot2011-P2',variant='m.3243A>G',n_cycles=3,n_source_objects=35,source_locator='Methods p.117; Table 3 p.120',cycle_mapping='not_reported'),
 dict(publication='sallevelt2017',mother_id='sallevelt2017-P1',variant='m.14487T>C',n_cycles=2,n_source_objects=22,age_at_PGD_start=40,age_at_birth=42,maternal_lymphocyte_pct=32,maternal_qualifier='approximate',source_locator='Results pp.699–700; Supplementary Table SI',limitation='22 numeric embryos exclude 4 inconclusive 2PN; complete biopsied 2PN=23'),
 *[dict(publication='spath2021',mother_id='spath2021-'+m,variant={'A':'m.8993T>G','B':'m.8993T>G','C':'m.10191T>C','D':'m.3243A>G'}[m],n_cycles=2 if m in ['A','C'] else 1,n_source_objects=sum(r['publication']=='spath2021' and r['mother_id']=='spath2021-'+m and r['object_type']=='embryo' for r in observations),source_locator='Supplemental Table 3, pp.1–3') for m in 'ABCD']
])

DATAFILE=ROOT/'inputs/atlas_snapshot.json'
if not DATAFILE.exists():DATAFILE=REPO/'site/src/data/atlas.json'
data=json.loads(DATAFILE.read_text())
results=[]
def result(metric,value,status,scope,**kwargs):results.append(dict(metric=metric,value=value,status=status,scope=scope,**kwargs))
def qualifies(o,t):return (o['high'] if o['q']=='interval' else o['value'])<=t
for v,expected in data['stats']['fig3']['by_variant'].items():
    xs=[o for o in data['fig3'] if o['variant']==v]
    for t in [18,30]:
        k=sum(qualifies(o,t) for o in xs);n=len(xs);assert expected['le'+str(t)]==dict(k=k,n=n)
        result('p_het',k/n,'оценка по данным',v,threshold=t,k=k,n=n)
        lo,hi=wilson(k,n);result('Wilson95',k/n,'условная iid-оценка',v,threshold=t,low=lo,high=hi)
        # Stage filter is only a metadata sensitivity check.
        ys=[x for x in xs if x['stage']=='blastocyst']
        if ys:result('metadata_blastocyst_fraction',sum(qualifies(o,t) for o in ys)/len(ys),'оценка по данным',v,threshold=t,n=len(ys),limitation='not a source-confirmed complete blastocyst cohort')
        for pub in sorted({x['pub'] for x in xs}):
            ys=[x for x in xs if x['pub']!=pub]
            if ys:result('leave_publication_out',sum(qualifies(o,t) for o in ys)/len(ys),'сценарий',v,threshold=t,excluded_publication=pub,n=len(ys))
for rho in [0,.05,.1,.2,.4]:
    value=bb(41/87*.5,rho,6);result('P_atleast1_beta_binomial',value,'сценарий','m.3243A>G',rho=rho,N=6,eupl=.5)
assert abs(bb(41/87*.5,.1,6)-.715787131483766)<1e-12
assert abs(bb(.2,1e-8,6)-atleast(.2,6))<1e-7
for q in [0,.2,1]:
    assert atleast(q,0)==0
    assert abs(bb(q,.2,1)-q)<1e-12
for n in [1,3,6]:result('Atlas_example',atleast(41/87*.5,n),'сценарий','m.3243A>G',N=n)
result('Jeffreys_scaled_beta_predictive',beta_scaled(41.5,46.5,.5,6),'условная iid-оценка','m.3243A>G',N=6)
for pub in ['ji2021','spath2021']:
    mothers=sorted({r['mother_id'] for r in observations if r['publication']==pub})
    for m in mothers:
        xs=[r for r in observations if r['mother_id']==m and r['stage']=='blastocyst' and r['object_type']=='embryo']
        if not xs:continue
        for t in [18,30]:
            eligible=[r for r in xs if r['pgta_status'] not in ['no_result','not_reported','not_tested']]
            for denominator,ys in [('all_blastocysts',xs),('informative_pgta',eligible)]:
                h=sum(r['value_pct']<=t for r in ys);e=sum(r['pgta_status']=='euploid' for r in ys)
                both=sum(r['value_pct']<=t and r['pgta_status']=='euploid' for r in ys);n=len(ys)
                result('joint_observed',both/n,'оценка по данным',m,threshold=t,N=n,k=both,h=h,e=e,denominator=denominator,product_marginals=h*e/n**2,ND_assumption='ND below threshold; LOD unknown in Spath')
    # Cycle 1 of different mothers is not one clinical cycle. Keep zero yields.
    for mother in mothers:
        for cid in sorted({r['cycle_id'] for r in observations if r['mother_id']==mother and r['cycle_id']}):
            xs=[r for r in observations if r['publication']==pub and r['mother_id']==mother and r['cycle_id']==cid and r['stage']=='blastocyst' and r['object_type']=='embryo']
            result('source_cycle_blastocysts',len(xs),'оценка по данным',mother,cycle_id=cid)
for m in ['P1','P2']:
    xs=[r for r in observations if r['mother_id']=='monnot2011-'+m];values=[r['value_pct']/100 for r in xs]
    mean=statistics.mean(values);variance=statistics.variance(values);b=1-variance/(mean*(1-mean))
    result('source_mean',mean,'оценка по данным','monnot2011-'+m,n=len(values))
    result('moment_b',b,'условная iid-оценка','monnot2011-'+m,n=len(values),limitation='mixed measurements; cycle membership P2 unknown')
    for t in [18,30]:result('family_fraction',sum(v*100<=t for v in values)/len(values),'оценка по данным','monnot2011-'+m,threshold=t,n=len(values))
for selection in ['all_embryos','2PN_only']:
    for cycle in ['',1,2]:
        ys=[r for r in observations if r['publication']=='sallevelt2017' and r['object_type']=='embryo' and (selection=='all_embryos' or r['fertilization']=='2PN') and (not cycle or r['cycle_id'].endswith('-'+str(cycle)))]
        for t in [18,30]:
            k=sum(r['value_pct']<=t for r in ys)
            result('source_threshold_fraction',k/len(ys),'оценка по данным','sallevelt2017',threshold=t,k=k,n=len(ys),cycle=cycle,selection=selection)
assert sum(r['value_pct']<=18 for r in observations if r['publication']=='sallevelt2017' and r['object_type']=='embryo')==3
result('confirmed_below18_yield_2PN',2/23,'оценка по данным','sallevelt2017',threshold=18,k=2,n=23,limitation='confirmed low diagnostic results per attempted 2PN biopsy; four positive-blank results are inconclusive, not proven true H>18')
result('complete_biopsied_2PN_threshold_bounds','','оценка по данным','sallevelt2017',threshold=18,low=2/23,high=6/23,n=23,limitation='partial classification with four technically inconclusive results; assumes classifications of the 19 conclusive records; not a confidence interval or full latent-H error model')
result('complete_biopsied_2PN_threshold_bounds','','оценка по данным','sallevelt2017',threshold=30,low=4/23,high=8/23,n=23,limitation='four inconclusive values only known to exceed 18%; bounds not confidence interval')

# Ji 2023: summarized Brown oocyte parameters, not a new fit or new cohort.
p=.1264;variance=.014;b=1-variance/(p*(1-p))
for terms,steps in [(40,2000),(60,4000)]:
    kr=kimura(p,b,terms=terms,steps=steps)
    assert abs(kr['norm']-1)<1e-8 and abs(kr['mean']-p)<1e-8 and abs(kr['variance']-variance)<1e-8
    for key,val in kr.items():result('Kimura_'+key,val,'сценарий','Brown/Ji summarized parameters',terms=terms,steps=steps,p0=p,b=b)
# Independent b=.87 rounded Table5/other literature sensitivity.
for b0 in [.87,b]:result('Kimura_CDF15',kimura(p,b0)['cdf'],'сценарий','rounded parameter sensitivity',p0=p,b=b0)
# Wonnapinij 2010 Eq.2: exact variance of unbiased sample variance under iid.
# D4 computed by integrating the Kimura density INCLUDING endpoint masses.
kr=kimura(p,b)
for n in [10,20,50,82]:
    se=math.sqrt((kr['fourth_central']-(n-3)/(n-1)*variance**2)/n)
    result('Kimura_sample_variance_SE',se,'сценарий','Wonnapinij 2010 Eq.2; Brown summarized parameters',n=n,relative_SE=se/variance)
for center in [38.9066,37.9384]:
    for age in [30,35,40]:
        y=-2.6518+.2231659-.2045457*(age-center);p_art=1/(1+math.exp(-y))
        result('ART_p_eupl_blast_per_MII',p_art,'сценарий','Esteves 2019 Table 2; Ejaculate',age=age,centering=center,limitation='published centering discrepancy; not calibrated to PGT-mt')
for succ,definition in [(.6553,'p_as_success'),(1-.6553,'p_as_reported_risk_complement')]:
    x=math.log(.05)/math.log1p(-succ)/.493
    exact=math.log(.05)/math.log1p(-.493*succ)
    result('Ji_Eq9_oocyte_bound',x,'сценарий',definition,k=.493,p=.6553,integer_min=math.floor(x)+1)
    result('oocyte_Bernoulli_thinning_bound',exact,'сценарий',definition,k=.493,p=.6553,integer_min=math.ceil(exact))
# Consistent nested thresholds: a single 3-cell Dirichlet posterior, not two independent Betas.
cats=[41,52-41,87-52];alpha=[v+.5 for v in cats]
result('Dirichlet_p18_mean',alpha[0]/sum(alpha),'условная iid-оценка','m.3243A>G',prior='Dirichlet(.5,.5,.5)')
result('Dirichlet_p30_mean',sum(alpha[:2])/sum(alpha),'условная iid-оценка','m.3243A>G',prior='Dirichlet(.5,.5,.5)')
result('rho_estimate','','неидентифицируемо','population families/cycles',reason='pilot does not identify family, cycle and variant variances separately')
write('results.csv',results)
cycle_rows=[]
for pub in ['ji2021','spath2021','sallevelt2017','monnot2011']:
    for mother in sorted({r['mother_id'] for r in observations if r['publication']==pub}):
        for cid in sorted({r['cycle_id'] for r in observations if r['mother_id']==mother and r['cycle_id']}):
            group=[r for r in observations if r['publication']==pub and r['mother_id']==mother and r['cycle_id']==cid]
            embryos=[r for r in group if r['object_type']=='embryo']
            cycle_rows.append(dict(publication=pub,mother_id=mother,cycle_id=cid,
                                   n_blastocysts='' if pub=='monnot2011' else sum(r['stage']=='blastocyst' for r in embryos),
                                   n_source_embryos=len(embryos),
                                   source_locator='Table 3' if pub in ['ji2021','monnot2011'] else 'Supplemental Table 3' if pub=='spath2021' else 'Supplementary Table SI',
                                   count_scope='numeric source embryo records; not necessarily complete clinically eligible pool',
                                   stage_count_status='individual stages not transcribed' if pub=='monnot2011' else 'source-confirmed stages'))
write('cycles.csv',cycle_rows)
write('unassigned_cycle_embryos.csv',[r for r in observations if r['object_type']=='embryo' and not r['cycle_id']])
local_sha=subprocess.check_output(['git','-C',str(REPO),'rev-parse','HEAD'],text=True).strip() if (REPO/'.git').exists() else 'not_available_using_archived_snapshot'
manifest=dict(atlas_sha=SHA,local_sha=local_sha,python=sys.version,seed=20261011,atlas_json_sha256=hashlib.sha256(DATAFILE.read_bytes()).hexdigest(),n_observation_rows=len(observations),n_results=len(results))
assert manifest['atlas_json_sha256']=='4d075b1b810da6a782eb85fc0703bc950b11c53dd04607ca9a2317926e4df55d'
(ROOT/'run_manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(json.dumps(manifest,ensure_ascii=False,indent=2))
print('PASS: denominators, boundary cases, beta-binomial limit, Kimura total mass/mean/variance')
