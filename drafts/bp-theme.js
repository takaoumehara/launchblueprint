/* Blueprint theme: light default, follows OS until the user picks; choice persists. Load in <head> (no defer) to avoid flash. */
(function(){
  var K='bp-theme',d=document.documentElement,q=new URLSearchParams(location.search).get('theme');
  function sys(){return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}
  function stored(){try{return localStorage.getItem(K)}catch(e){return null}}
  function apply(t){d.classList.add('theme-switching');d.dataset.theme=t;requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.remove('theme-switching')})});render()}
  d.dataset.theme=q||stored()||sys();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(!stored()&&!q)apply(sys())});
  var btn;
  function render(){if(!btn)return;var dark=d.dataset.theme==='dark';btn.setAttribute('aria-pressed',dark);btn.setAttribute('aria-label',dark?'明るい表示にする':'暗い表示にする');
    btn.innerHTML=(dark?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>明るく':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>暗く')}
  document.addEventListener('DOMContentLoaded',function(){
    btn=document.createElement('button');btn.type='button';btn.className='bp-theme';
    var slot=document.querySelector('[data-theme-slot]');if(slot)slot.appendChild(btn);else{btn.classList.add('bp-theme-float');document.body.appendChild(btn)}
    btn.onclick=function(){var t=d.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(K,t)}catch(e){}apply(t)};render()});
})();
