'use strict';

(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
  let ticking = false;
  const updateLocation = () => {
    const marker = window.scrollY + 150;
    let active = 0;
    sections.forEach((section, index) => {
      if (section.offsetTop <= marker) active = index;
    });
    navLinks.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateLocation);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateLocation);
  window.addEventListener('load', updateLocation);
  updateLocation();

  const dialog = document.getElementById('figure-dialog');
  const dialogImage = document.getElementById('dialog-image');
  let figureOpener = null;
  document.querySelectorAll('[data-figure]').forEach(link => {
    link.addEventListener('click', event => {
      if (typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      figureOpener = link;
      const caption = link.dataset.caption;
      document.getElementById('dialog-title').textContent = caption;
      dialogImage.src = link.dataset.figure;
      dialogImage.alt = caption;
      dialog.showModal();
    });
  });
  document.getElementById('close-figure').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => figureOpener?.focus({ preventScroll: true }));

  const tabs = [...document.querySelectorAll('.demo-tabs [role="tab"]')];
  const video = document.getElementById('demo-video');
  const playButton = document.getElementById('demo-play');
  playButton.hidden = false;
  playButton.addEventListener('click', async () => {
    try { await video.play(); }
    catch (_) { playButton.querySelector('span').textContent = 'Try playing again'; }
  });
  video.addEventListener('play', () => { playButton.hidden = true; });
  video.addEventListener('pause', () => { playButton.hidden = false; });
  video.addEventListener('ended', () => {
    playButton.hidden = false;
    playButton.querySelector('span').textContent = 'Replay recording';
  });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (tab.getAttribute('aria-selected') === 'true') return;
      video.pause();
      tabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      video.removeAttribute('poster');
      video.src = tab.dataset.src;
      video.setAttribute('aria-label', `Case ${tab.dataset.case}: local TMP drafting demonstration`);
      playButton.hidden = false;
      playButton.setAttribute('aria-label', `Play Case ${tab.dataset.case} recording`);
      playButton.querySelector('span').textContent = 'Play recording';
      video.load();
      document.getElementById('demo-panel').setAttribute('aria-labelledby', tab.id);
      document.getElementById('demo-case-label').textContent = `CASE ${tab.dataset.case}`;
      document.getElementById('recording-link').href = tab.dataset.src;
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    });
  });
  // Restore the first recording's poster when returning to its tab.
  tabs[0].addEventListener('click', () => video.setAttribute('poster', 'static/images/demo-poster.jpg'));

  const copyButton = document.getElementById('copy-btn');
  const copyStatus = document.getElementById('copy-status');
  let copyTimer;
  const fallbackCopy = text => {
    const area = document.createElement('textarea');
    area.value = text;
    area.readOnly = true;
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    let success = false;
    try { success = document.execCommand('copy'); }
    catch (_) { /* The status message provides a manual fallback. */ }
    area.remove();
    copyButton.focus({ preventScroll: true });
    return success;
  };
  copyButton.addEventListener('click', async () => {
    const text = document.getElementById('bibtex-code').textContent.trim();
    let success = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (_) { /* Fall back for restricted clipboard contexts. */ }
    }
    if (!success) success = fallbackCopy(text);
    copyButton.textContent = success ? 'Copied!' : 'Copy citation';
    copyStatus.textContent = success ? 'Citation copied to clipboard.' : 'Copy was unavailable. Select and copy the BibTeX text above.';
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copyButton.textContent = 'Copy citation';
      copyStatus.textContent = '';
    }, 4000);
  });
})();
