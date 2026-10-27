import { expect, test } from './fixtures'
test.skip(process.env.ATLAS_ARABIC_E2E !== '1', 'Arabic is checked only in its private review build')
const noForeignWords = /[А-Яа-яЁё\u3400-\u9fff]|\b(?:heteroplasmy|remaining|biopsy|blastocyst|median|range|wild-type|prenatal|postnatal|tissue|Zoom|Reset|Download)\b/i
test('Arabic charts keep Arabic labels when expanded, zoomed, hovered and reset', async ({page}) => {
 const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message))
 await page.setViewportSize({width:1600,height:1100})
 for(const route of ['embryo-concordance','embryo-to-offspring','heteroplasmy-landscape','pgt-mt-pgt-a-model']) {
  await page.goto(`ar/science/${route}/`)
  const plots=page.locator('.js-plotly-plot');await plots.first().waitFor()
  for(let i=0;i<await plots.count();i++) {
   const frame=page.locator('.chart-frame').nth(i),plot=plots.nth(i)
   await frame.getByRole('button',{name:'توسيع الرسم',exact:true}).click()
   await expect(frame).toHaveAttribute('role','dialog')
   await expect(frame.getByRole('button',{name:'إغلاق العرض الموسع'})).toBeFocused()
   await expect.poll(()=>plot.evaluate((e:any)=>e._fullLayout?.width??0)).toBeGreaterThan(1000)
   const check=async()=>{
    const text=await plot.locator('svg text').allTextContents()
    expect(text.join(' ')).not.toMatch(noForeignWords)
    const controls=await plot.locator('.modebar-btn').evaluateAll(es=>es.map(e=>e.getAttribute('data-title')).join(' '))
    expect(controls).not.toMatch(noForeignWords)
   }
   await check()
   const zoom=plot.locator('.modebar-btn[data-title="تكبير"]')
   if(await zoom.count()) {await zoom.click({force:true});await check()}
   const points=plot.locator('.scatterlayer .point')
   let hovered=false
   for(const point of await points.all()) {
    const r=await point.boundingBox()
    if(r&&r.x>150&&r.x<1400&&r.y>140&&r.y<800){await point.hover({force:true});hovered=true;break}
   }
   if(hovered) {await page.waitForTimeout(100);expect((await plot.locator('.hoverlayer text').allTextContents()).join(' ')).not.toMatch(noForeignWords)}
   await page.keyboard.press('Escape');await expect(frame).toHaveAttribute('role','figure')
   await frame.getByRole('button',{name:'العودة إلى العرض الأصلي'}).click()
  }
 }
 expect(errors).toEqual([])
})
test('Arabic routes fit mobile and language switching resets document direction', async ({page})=>{
 await page.setViewportSize({width:390,height:844})
 for(const route of ['','about/','science/data/','science/embryo-concordance/','science/pgt-mt-pgt-a-model/','fundamentals/mitochondrial-genetic-bottleneck/']){
  await page.goto(`ar/${route}`);await expect(page.locator('html')).toHaveAttribute('dir','rtl')
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 }
 await page.goto('ar/science/embryo-concordance/?x=1#content')
 await page.getByRole('link',{name:'الروسية',exact:true}).click()
 await expect(page.locator('html')).toHaveAttribute('dir','ltr')
 await expect(page).toHaveURL(/\/ru\/science\/embryo-concordance\/\?x=1#content$/)
})

test('Arabic scientific charts keep category labels apart on portrait and landscape screens', async ({page}) => {
 test.setTimeout(180000)
 const sizes = [[320,568],[375,667],[390,844],[430,932],[667,375],[844,390],[932,430],[768,1024],[1440,900]]
 for(const [width,height] of sizes) {
  await page.setViewportSize({width,height})
  for(const route of ['heteroplasmy-landscape','embryo-concordance','embryo-to-offspring','pgt-mt-pgt-a-model']) {
   await page.goto(`ar/science/${route}/`)
   await page.locator('.js-plotly-plot').first().waitFor()
   await expect.poll(()=>page.locator('.js-plotly-plot').first().evaluate((e:any)=>!!e._fullLayout)).toBe(true)
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
   const plots=page.locator('.js-plotly-plot')
   for(let i=0;i<await plots.count();i++) {
    const plot=plots.nth(i)
    if(!await plot.isVisible()) continue
    const viewport=plot.locator('xpath=..')
    expect(await viewport.getAttribute('dir')).toBe('ltr')
    const collisions=await plot.evaluate((el:Element)=>{
     const texts=[...el.querySelectorAll('.xaxislayer-above .xtick text')]
     const rects=texts.map(t=>({text:t.textContent,box:t.getBoundingClientRect()})).filter(r=>r.box.width>0&&r.box.height>0)
     const out:string[]=[]
     for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++) {
      const a=rects[i].box,b=rects[j].box
      if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)out.push(`${rects[i].text} / ${rects[j].text}`)
     }
     return out
    })
    expect(collisions,`${route} ${width}x${height} chart ${i}`).toEqual([])
    if(await viewport.evaluate(e=>e.scrollWidth>e.clientWidth+1)) await expect(viewport).toHaveAttribute('tabindex','0')
   }
   if(width===390&&height===844 || width===844&&height===390) await page.screenshot({path:`../artifacts/arabic-responsive/${route}-${width}x${height}.png`,fullPage:true})
  }
 }
})

test('Arabic expanded plots scroll on small portrait and landscape screens without changing their data', async ({page}) => {
 test.setTimeout(120000)
 for(const [width,height] of [[390,844],[844,390]]) {
  await page.setViewportSize({width,height})
  for(const route of ['heteroplasmy-landscape','embryo-concordance','embryo-to-offspring','pgt-mt-pgt-a-model']) {
   await page.goto(`ar/science/${route}/`)
   await page.locator('.js-plotly-plot').first().waitFor()
   if(route==='pgt-mt-pgt-a-model' && width===390) {
    const tabs=page.locator('.panel-tabs button')
    for(let i=0;i<await tabs.count();i++){await tabs.nth(i).click();await expect(tabs.nth(i)).toHaveAttribute('aria-pressed','true')}
   }
   const frames=page.locator('.chart-frame')
   for(let i=0;i<await frames.count();i++) {
    const frame=frames.nth(i);if(!await frame.isVisible())continue
    const plot=frame.locator('.js-plotly-plot'),viewport=frame.locator('.ar-chart-viewport')
    await expect.poll(()=>plot.evaluate((e:any)=>!!e._fullLayout)).toBe(true)
    const snapshot=()=>plot.evaluate((e:any)=>JSON.stringify({data:e.data.map((d:any)=>({x:d.x,y:d.y,customdata:d.customdata})),axes:Object.fromEntries(Object.entries(e._fullLayout).filter(([k])=>/^[xy]axis\d*$/.test(k)).map(([k,v]:any)=>[k,v.range]))}))
    const before=await snapshot()
    await frame.getByRole('button',{name:'توسيع الرسم',exact:true}).click()
    await expect(frame).toHaveAttribute('role','dialog')
    if (await viewport.evaluate(e=>e.scrollWidth>e.clientWidth+1)) {
      await viewport.focus();await viewport.press('ArrowRight')
      await expect.poll(()=>viewport.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0)
    }
    expect(await snapshot()).toBe(before)
    await frame.screenshot({path:`../artifacts/arabic-responsive/${route}-${width}x${height}-expanded-${i}.png`})
    await page.keyboard.press('Escape');await expect(frame).toHaveAttribute('role','figure')
   }
  }
 }
})

test('Arabic educational diagrams and controls remain usable on narrow screens', async ({page})=>{
 test.setTimeout(90000)
 for(const [width,height] of [[320,568],[390,844],[844,390],[1440,900]]) {
  await page.setViewportSize({width,height})
  for(const route of ['mtdna-and-maternal-inheritance','heteroplasmy-and-threshold-effects','mitochondrial-genetic-bottleneck','embryo-development-and-biopsy']) {
   await page.goto(`ar/fundamentals/${route}/`)
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} ${width}`).toBe(true)
   const widgets=page.locator('.fd-widget')
   await expect(widgets.first()).toBeVisible()
   for(const input of await widgets.locator('input[type=range]').all()) {await input.fill('0');await input.dispatchEvent('input');await input.press('End')}
   if(route==='embryo-development-and-biopsy') for(const button of await widgets.locator('.fd-parts button').all())await button.click()
   if(width===390||width===844)await widgets.first().screenshot({path:`../artifacts/arabic-responsive/widget-${route}-${width}.png`})
  }
 }
})
