import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();
const files=fs.readdirSync('dist/ar',{recursive:true}).filter(p=>p.endsWith('index.html'));
const out=[];
for(const f of files){
 const route=f.replace(/index.html$/,'');await page.goto('http://127.0.0.1:4173/pgt-mt-atlas/ar/'+route);await page.waitForTimeout(250);
 await page.locator('details').evaluateAll(es=>es.forEach(e=>e.open=true));
 const advanced=page.getByRole('button',{name:'المستوى المتقدم',exact:false});if(await advanced.count())await advanced.first().click();
 const text=await page.locator('body').innerText();
 const attrs=await page.locator('[aria-label],[title],[placeholder],[data-title],img[alt]').evaluateAll(es=>es.flatMap(e=>['aria-label','title','placeholder','data-title','alt'].map(a=>e.getAttribute(a)).filter(Boolean)));
 const plots=await page.locator('.js-plotly-plot').evaluateAll(es=>es.map(e=>({data:e.data?.map(d=>({name:d.name,text:d.text,hovertemplate:d.hovertemplate})),layout:e.layout})));
 out.push({route,text,attrs,plots});
}
fs.writeFileSync('../artifacts/arabic-text-audit.json',JSON.stringify(out,null,2));console.log('Audited',out.length,'pages');await browser.close();
