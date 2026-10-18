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

// Ambient motion runs automatically; hidden tabs do no unnecessary animation work.
function syncAmbientVisibility() {
  document.documentElement.dataset.motion = document.hidden ? 'off' : 'on';
}
document.addEventListener('visibilitychange', syncAmbientVisibility);
syncAmbientVisibility();
