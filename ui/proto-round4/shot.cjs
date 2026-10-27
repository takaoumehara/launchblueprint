const {chromium}=require('/tmp/pw/node_modules/playwright');const fs=require('fs');const tag=process.argv[2]||'';
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];pg.on('pageerror',e=>errs.push(String(e)));pg.on('console',m=>m.type()=='error'&&errs.push(m.text()));
const O='../ui-shots/round4/';fs.mkdirSync(O,{recursive:true});const U='file://'+process.cwd()+'/index.html';
for(const th of ['light','dark']){await pg.goto(`${U}?theme=${th}`);await pg.waitForTimeout(400);await pg.screenshot({path:`${O}${tag}rest-${th}.png`});
 const box=await (await pg.$('.nd[data-id="z1"] .dot')).boundingBox();await pg.mouse.move(box.x+3,box.y+3);await pg.waitForTimeout(350);await pg.screenshot({path:`${O}${tag}hover-${th}.png`});
 await pg.mouse.click(box.x+3,box.y+3);await pg.waitForTimeout(350);await pg.screenshot({path:`${O}${tag}detail-${th}.png`})}
const c=await b.newContext({reducedMotion:'reduce'});const p2=await c.newPage();await p2.goto(U);console.log('rm:',await p2.evaluate(()=>getComputedStyle(document.querySelector('.comet')).display));
console.log('paths',await pg.evaluate(()=>document.querySelectorAll('#bund path').length),'errors',errs);await b.close()})();
