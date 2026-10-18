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

// Motion is opt-in when reduced motion is requested; pause off-screen as well.
const motionButton = document.querySelector('[data-motion-toggle]');
const hero = document.querySelector('.hero');
if (motionButton && hero) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let visible = true;
  try { paused = paused || localStorage.getItem('kamon-motion-paused') === 'true'; } catch {}
  function updateMotion() {
    document.documentElement.dataset.motion = !paused && !document.hidden && visible && !reducedMotion.matches ? 'on' : 'off';
    motionButton.textContent = paused ? '背景の動きを再開' : '背景の動きを停止';
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.hidden = reducedMotion.matches;
  }
  motionButton.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('kamon-motion-paused', String(paused)); } catch {}
    updateMotion();
  });
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updateMotion(); });
  document.addEventListener('visibilitychange', updateMotion);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; updateMotion(); }).observe(hero);
  }
  updateMotion();
}
