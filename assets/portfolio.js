const copyButton = document.querySelector('[data-copy-request]');
const requestText = document.querySelector('#request-template');
const copyStatus = document.querySelector('#copy-status');
if (copyButton && requestText && copyStatus) {
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(requestText.value);
      copyStatus.textContent = 'コピーしました。ご利用の媒体に貼り付けてください。';
    } catch {
      requestText.focus();
      requestText.select();
      copyStatus.textContent = '文章を選択しました。コピーしてご利用ください。';
    }
  });
}

const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('#main-nav');
if (navToggle && mainNav) {
  function closeMenu(){mainNav.classList.remove('is-open');navToggle.setAttribute('aria-expanded','false');}
  navToggle.addEventListener('click',()=>{const open=navToggle.getAttribute('aria-expanded')!=='true';mainNav.classList.toggle('is-open',open);navToggle.setAttribute('aria-expanded',String(open));});
  mainNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navToggle.getAttribute('aria-expanded')==='true'){closeMenu();navToggle.focus();}});
}

// Follow the system by default, with a visible, site-specific playback choice.
const motionButton = document.querySelector('[data-motion-toggle]');
const hero = document.querySelector('.hero');
if (motionButton && hero) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let choice = null;
  let visible = true;
  try {
    const saved = localStorage.getItem('kamon-motion-choice');
    if (saved === 'play' || saved === 'pause') choice = saved;
    // Keep a deliberate pause from the previous version.
    else if (localStorage.getItem('kamon-motion-paused') === 'true') choice = 'pause';
  } catch {}
  const wantsMotion = () => choice === 'play' || (choice !== 'pause' && !reducedMotion.matches);
  function updateMotion() {
    const playing = wantsMotion();
    document.documentElement.dataset.motion = playing && !document.hidden && visible ? 'on' : 'off';
    motionButton.textContent = playing ? '動きを停止' : '動きを再生';
    motionButton.setAttribute('aria-label', motionButton.textContent);
    motionButton.setAttribute('aria-pressed', String(playing));
    motionButton.title = !playing && reducedMotion.matches && choice === null
      ? '端末の設定に合わせて停止中。このサイトだけ再生できます。'
      : 'このサイトの背景アニメーションを切り替えます。';
    motionButton.hidden = false;
  }
  motionButton.addEventListener('click', () => {
    choice = wantsMotion() ? 'pause' : 'play';
    try { localStorage.setItem('kamon-motion-choice', choice); } catch {}
    updateMotion();
  });
  reducedMotion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; updateMotion(); }).observe(hero);
  }
  updateMotion();
}
