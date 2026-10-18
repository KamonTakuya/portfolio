(() => {
  'use strict';

  const root = document.documentElement;
  let observer;
  let arrivingTarget;
  let arrivalTimer;
  let arrivalFrame;
  const pending = new Set();

  function clearArrival() {
    window.clearTimeout(arrivalTimer);
    window.cancelAnimationFrame(arrivalFrame);
    if (arrivingTarget) arrivingTarget.classList.remove('hash-arrive');
    arrivingTarget = null;
  }

  function hashTarget() {
    if (!location.hash) return null;
    try {
      return document.getElementById(decodeURIComponent(location.hash.slice(1)));
    } catch {
      return null;
    }
  }

  function showDirect(element) {
    pending.delete(element);
    if (observer) observer.unobserve(element);
    element.classList.remove('reveal-pending', 'reveal-enter');
    element.classList.add('reveal-direct');
  }

  function protectHashTarget() {
    const target = hashTarget();
    if (!target) return;
    document.querySelectorAll('[data-reveal]').forEach(element => {
      if (element === target || element.contains(target) || target.contains(element)) {
        showDirect(element);
      }
    });
  }

  if (location.hash) root.setAttribute('data-page-hash', '');
  protectHashTarget();

  window.addEventListener('pagereveal', event => {
    if (event.viewTransition) root.setAttribute('data-native-transition', '');
  });

  window.addEventListener('pageshow', event => {
    clearArrival();
    if (event.persisted) {
      root.setAttribute('data-page-restored', '');
      document.querySelectorAll('[data-reveal]').forEach(showDirect);
    }
    protectHashTarget();
  });

  window.addEventListener('hashchange', () => {
    clearArrival();
    protectHashTarget();
    const target = hashTarget();
    if (!target) return;
    arrivingTarget = target;
    const startedAt = performance.now();
    let previousScroll = window.scrollY;
    let stillFrames = 0;
    function finishArrival(now) {
      if (arrivingTarget !== target) return;
      stillFrames = Math.abs(window.scrollY - previousScroll) < 1 ? stillFrames + 1 : 0;
      previousScroll = window.scrollY;
      /* Wait for the native smooth scroll, so the fade is visible on arrival. */
      if ((now - startedAt >= 60 && stillFrames >= 2) || now - startedAt >= 1000) {
        void target.offsetWidth;
        target.classList.add('hash-arrive');
        arrivalTimer = window.setTimeout(clearArrival, 360);
      } else {
        arrivalFrame = window.requestAnimationFrame(finishArrival);
      }
    }
    arrivalFrame = window.requestAnimationFrame(finishArrival);
  });

  if (!('IntersectionObserver' in window)) return;

  try {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || !pending.has(entry.target)) return;
        pending.delete(entry.target);
        observer.unobserve(entry.target);
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('reveal-enter');
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

    document.querySelectorAll('[data-reveal]:not(.reveal-direct)').forEach(element => {
      /* Initial viewport content uses the page entry, not a second reveal. */
      if (element.getBoundingClientRect().top < window.innerHeight - 24) {
        showDirect(element);
      } else {
        observer.observe(element);
        pending.add(element);
        element.classList.add('reveal-pending');
      }
    });
  } catch {
    if (observer) observer.disconnect();
    pending.forEach(showDirect);
  }
})();
