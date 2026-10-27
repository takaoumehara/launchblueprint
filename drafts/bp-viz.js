/* Blueprint shared viz helpers — CREATIVITY IS EVERYWHERE, LLC
   Every screen embeds its data as <script type="application/json" id="bp-data"> and links the same file via <link rel="alternate" type="application/json">. */
window.BP=(function(){
  const ns='http://www.w3.org/2000/svg';
  function data(){return JSON.parse(document.getElementById('bp-data').textContent)}
  function el(t,a,p){const e=document.createElementNS(ns,t);for(const k in a||{}){const v=a[k];if(v==null)continue;if(typeof v=='string'&&/^(var|color-mix)\(/.test(v)&&/^(fill|stroke|stop-color)$/.test(k))e.style.setProperty(k,v);else e.setAttribute(k,v)}if(p)p.appendChild(e);return e}
  /* horizontal bezier from port to port */
  function wire(x1,y1,x2,y2,bend){const dx=Math.max(40,Math.abs(x2-x1)*(bend||.5));const s=x2>=x1?1:-1;return `M${x1},${y1} C${x1+s*dx},${y1} ${x2-s*dx},${y2} ${x2},${y2}`}
  /* deterministic pseudo-random for stable layouts */
  function rng(seed){let s=seed>>>0||1;return()=>((s=Math.imul(s^s>>>15,2246822507)^Math.imul(s^s>>>13,3266489909),(s^=s>>>16)>>>0)/4294967296)}
  function hash(str){let h=2166136261;for(const c of str)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
  document.addEventListener('DOMContentLoaded',()=>{const l=document.querySelector('link[rel=alternate][type="application/json"]'),slot=document.querySelector('[data-data-slot]');
    if(l&&slot){const a=document.createElement('a');a.className='data-link';a.href=l.getAttribute('href');a.textContent='/'+l.getAttribute('href');a.title='この画面のデータ（機械可読 JSON）';slot.appendChild(a)}});
  return {data,el,wire,rng,hash,ns};
})();
