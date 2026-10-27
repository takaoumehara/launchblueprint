const {chromium}=require('/tmp/pw/node_modules/playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1600,height:960}});const errs=[];
pg.on('pageerror',e=>errs.push(String(e)));pg.on('console',m=>m.type()=='error'&&errs.push(m.text()));
fs.mkdirSync('../ui-shots/round2',{recursive:true});const N={1:'A-editorial',2:'B-instrument',3:'C-lineart'},U='file://'+process.cwd()+'/index.html';
for(const v of [1,2,3]){for(const th of ['light','dark'])for(const s of ['canvas','compare']){await pg.goto(`${U}?v=${v}&theme=${th}&s=${s}&shot=1`);await pg.waitForTimeout(500);await pg.screenshot({path:`../ui-shots/round2/${N[v]}-${s}-${th}.png`})}
 await pg.goto(`${U}?v=${v}&theme=light&s=canvas&shot=1`);await pg.waitForTimeout(400);await pg.click('.nd[data-id="z1"]',{force:true});await pg.waitForTimeout(400);await pg.screenshot({path:`../ui-shots/round2/${N[v]}-canvas-detail-light.png`})}
// reduced motion check
const c=await b.newContext({reducedMotion:'reduce'});const p2=await c.newPage();await p2.goto(U+'?v=1');await p2.waitForTimeout(300);console.log('rm anim:',await p2.evaluate(()=>getComputedStyle(document.querySelector('.flow')).animationName));
console.log('errors',errs);await b.close()})();
