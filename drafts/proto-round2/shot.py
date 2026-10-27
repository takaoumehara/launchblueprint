import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1600,'height':960},device_scale_factor=1)
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    import os;os.makedirs('../ui-shots/round2',exist_ok=True)
    names={1:'A-editorial',2:'B-instrument',3:'C-lineart'}
    for v in (1,2,3):
      for th in ('light','dark'):
        for s in ('canvas','compare'):
          await pg.goto(f'file://{os.getcwd()}/index.html?v={v}&theme={th}&s={s}&shot=1');await pg.wait_for_timeout(500)
          await pg.screenshot(path=f'../ui-shots/round2/{names[v]}-{s}-{th}.png')
      await pg.goto(f'file://{os.getcwd()}/index.html?v={v}&theme=light&s=canvas&shot=1');await pg.wait_for_timeout(400)
      await pg.click('.nd[data-id="z1"]',force=True);await pg.wait_for_timeout(400);await pg.screenshot(path=f'../ui-shots/round2/{names[v]}-canvas-detail-light.png')
    print('errors',errs);await b.close()
asyncio.run(main())
