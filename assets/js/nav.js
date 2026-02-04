(function () {
  'use strict';

  function initNav() {
    const nav = document.querySelector('aside#sidebar nav');
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll('a'));
    const hrefMatchesLocation = (href) => {
      try {
        const url = new URL(href, location.href);
        return url.pathname === location.pathname || location.href.endsWith(href);
      } catch (e) {
        return false;
      }
    };

    // Initialize links
    links.forEach(a => {
      a.setAttribute('tabindex', '0');
      if (hrefMatchesLocation(a.getAttribute('href') || '')) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });

    // Keyboard navigation: ArrowDown / ArrowUp
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const activeEl = document.activeElement;
      let idx = links.indexOf(activeEl);
      if (idx === -1) {
        idx = e.key === 'ArrowDown' ? 0 : links.length - 1;
        links[idx].focus();
        e.preventDefault();
        return;
      }
      const next = e.key === 'ArrowDown' ? Math.min(links.length - 1, idx + 1) : Math.max(0, idx - 1);
      links[next].focus();
      e.preventDefault();
    });

    // Click / hash handling and active-class management
    links.forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        a.addEventListener('click', (ev) => {
          ev.preventDefault();
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          links.forEach(l => { l.classList.remove('active'); l.removeAttribute('aria-current'); });
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        });
      } else {
        a.addEventListener('click', () => {
          links.forEach(l => { l.classList.remove('active'); l.removeAttribute('aria-current'); });
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();

