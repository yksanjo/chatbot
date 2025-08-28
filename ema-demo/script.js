/* globals window, document */
(function(){
  const wall = document.getElementById('wall');
  const hooksContainer = document.getElementById('hooks');
  const hangBtn = document.getElementById('hangBtn');
  const roleSel = document.getElementById('role');
  const ribbonSel = document.getElementById('ribbon');

  const HOOK_COUNT = 10;
  const WALL_PADDING = 40; // px left/right

  function createHooks(){
    const wallWidth = wall.clientWidth;
    const usable = wallWidth - WALL_PADDING * 2;
    for(let i=0;i<HOOK_COUNT;i++){
      const x = WALL_PADDING + Math.round((usable / (HOOK_COUNT-1)) * i);
      const el = document.createElement('div');
      el.className = 'hook';
      el.style.left = `${x}px`;
      hooksContainer.appendChild(el);
    }
  }

  function svgEma({ ribbonColor = '#C43A3A', role = 'Founder' }){
    // minimal wood plaque with ribbon and role seal
    const roleFill = '#2A3A8F';
    const stampStroke = '#B33';
    return `
<svg width="180" height="140" viewBox="0 0 180 140" xmlns="http://www.w3.org/2000/svg" aria-label="絵馬">
  <defs>
    <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8CFA6"/>
      <stop offset="100%" stop-color="#D8B787"/>
    </linearGradient>
  </defs>
  <path d="M10,50 L90,10 L170,50 L170,120 L10,120 Z" fill="url(#wood)" stroke="#9C7A4C" stroke-width="2"/>
  <path d="M90,8 C85,15 95,15 90,8" fill="none" stroke="${ribbonColor}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="140" cy="95" r="14" fill="none" stroke="${stampStroke}" stroke-width="3"/>
  <text x="134" y="100" font-size="12" fill="${stampStroke}">祈</text>
  <rect x="18" y="90" width="66" height="22" rx="6" fill="#F0F3FF" stroke="#5A67D8"/>
  <text x="23" y="105" font-size="12" font-weight="700" fill="${roleFill}">${role}</text>
</svg>`;
  }

  function pickRandomHookX(){
    const hooks = hooksContainer.querySelectorAll('.hook');
    if(hooks.length === 0) return WALL_PADDING;
    const idx = Math.floor(Math.random() * hooks.length);
    const el = hooks[idx];
    const left = parseInt(el.style.left || '0', 10);
    // add slight jitter so not all overlap
    const jitter = Math.round((Math.random() - 0.5) * 24);
    return Math.max(WALL_PADDING, Math.min(wall.clientWidth - WALL_PADDING - 180, left + jitter));
  }

  function hangEma(){
    const role = roleSel.value;
    const ribbonColor = ribbonSel.value;
    const wrap = document.createElement('div');
    wrap.className = 'ema-wrap drop';
    wrap.setAttribute('role','img');
    wrap.setAttribute('aria-label', `${role} の絵馬を掛けました`);
    wrap.style.left = `${pickRandomHookX()}px`;
    wrap.style.top = `${80 + Math.round(Math.random()*40)}px`;
    wrap.innerHTML = svgEma({ ribbonColor, role });
    wall.appendChild(wrap);
    // after the initial drop animation, make it idle sway
    window.setTimeout(()=>{
      wrap.classList.remove('drop');
      wrap.classList.add('idle');
    }, 2300);
  }

  function onResize(){
    // recreate hooks on resize for correct spacing
    hooksContainer.innerHTML = '';
    createHooks();
  }

  // init
  window.addEventListener('resize', onResize);
  document.addEventListener('DOMContentLoaded', ()=>{
    createHooks();
    hangBtn.addEventListener('click', hangEma);
    // seed a few
    const seed = ['Founder','#C43A3A'], s2=['Investor','#2F855A'], s3=['Builder','#1F7A8C'];
    [seed,s2,s3].forEach(([r,c])=>{
      roleSel.value = r; ribbonSel.value = c; hangEma();
    });
  });
})();

