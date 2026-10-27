import { chromium } from '@playwright/test'
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs'
const root = new URL('../dist/ar/',import.meta.url).pathname
function routes(dir, p='') {return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?routes(dir+e.name+'/',p+e.name+'/'):e.name==='index.html'?[p]:[])}
const out=new URL('../../artifacts/arabic/',import.meta.url).pathname
mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']})
const page=await browser.newPage({viewport:{width:1600,height:1100},deviceScaleFactor:1})
const errors=[]; page.on('pageerror',e=>errors.push(String(e)))
const results=[]
for(const route of routes(root)) {
 await page.goto('http://127.0.0.1:4173/pgt-mt-atlas/ar/'+route)
 await page.waitForTimeout(650)
 const n=await page.locator('.js-plotly-plot').count()
 if(n)await page.waitForFunction(()=>[...document.querySelectorAll('.js-plotly-plot')].every(p=>p._fullLayout))
 const entry={route,dir:await page.locator('html').getAttribute('dir'),plots:[],foreign:await page.locator('main').evaluate(el=>[...el.querySelectorAll('*')].filter(e=>e.childNodes.length===1&&e.firstChild?.nodeType===3&&/[А-Яа-яЁё\u3400-\u9fff]/.test(e.textContent)).map(e=>e.textContent))}
 for(let i=0;i<n;i++){
  const plot=page.locator('.js-plotly-plot').nth(i);await plot.scrollIntoViewIfNeeded()
  const state=()=>plot.evaluate(el=>({text:[...el.querySelectorAll('svg text')].map(x=>x.textContent),axes:Object.fromEntries(Object.entries(el._fullLayout).filter(([k])=>/^[xy]axis\d*$/.test(k)).map(([k,v])=>[k,{title:v.title.text,range:v.range}])) ,traces:el.data.map(d=>({name:d.name,text:d.text,hovertemplate:d.hovertemplate}))}))
  const before=await state()
  await plot.locator('xpath=..').getByRole('button',{name:'توسيع الرسم',exact:true}).click()
  await page.waitForTimeout(220)
  await plot.screenshot({path:out+route.replaceAll('/','-')+i+'-normal.png'})
  const zoom=plot.locator('.modebar-btn[data-title="تكبير"]').first()
  if(await zoom.count())await zoom.click({force:true})
  await page.waitForTimeout(120)
  const after=await state()
  await plot.screenshot({path:out+route.replaceAll('/','-')+i+'-zoom.png'})
  const pt=plot.locator('.scatterlayer .point').first()
  for(const mark of await plot.locator('.scatterlayer .point').all()) {
    const box=await mark.boundingBox()
    if(box && box.y>100 && box.y<850 && box.x>100 && box.x<1500) {await mark.hover({force:true}).catch(()=>{});await page.waitForTimeout(100);break}
  }
  await page.keyboard.press('Escape')
  entry.plots.push({before,after,hover:(await plot.locator('.hoverlayer text').allTextContents()).join(' '),controls:await plot.locator('.modebar-btn').evaluateAll(es=>es.map(e=>e.getAttribute('data-title')))})
 }
 const widgets = page.locator('.fd-widget')
 entry.widgets=[]
 for(let i=0;i<await widgets.count();i++) {
   const widget=widgets.nth(i)
   const id=await widget.getAttribute('id')
   for(const input of await widget.locator('input[type=range]').all()) {
     await input.fill('0'); await input.dispatchEvent('input'); await input.press('End'); await input.press('ArrowLeft')
   }
   for(const button of await widget.locator('button').all()) await button.click()
   entry.widgets.push({id,text:await widget.innerText(),svg:await widget.locator('svg text').allTextContents()})
   await widget.screenshot({path:out+route.replaceAll('/','-')+id+'-large.png'})
 }
 const advanced=page.getByRole('button',{name:'المستوى المتقدم',exact:false})
 if(await advanced.count()) {await advanced.first().click();entry.advanced=await page.locator('main').innerText()}
 await page.evaluate(()=>scrollTo(0,0))
 await page.screenshot({path:out+(route.replaceAll('/','-')||'home')+'-desktop.png',fullPage:true})
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(200)
 entry.mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)
 await page.screenshot({path:out+(route.replaceAll('/','-')||'home')+'-mobile.png',fullPage:true})
 await page.setViewportSize({width:1600,height:1100})
 results.push(entry)
 console.log(route||'home',n,'charts',entry.foreign.length,'foreign',entry.mobileOverflow?'overflow':'')
}
writeFileSync(out+'audit.json',JSON.stringify({errors,results},null,2))
await browser.close()
