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

  function initMobileToggle() {
    // Only add toggle for non-fullscreen pages (i.e., not index.html)
    if (document.body.classList.contains('fullscreen')) return;
    
    // Create hamburger toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'nav-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle navigation');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = '<span></span><span></span><span></span>';
    
    document.body.appendChild(toggleBtn);
    
    // Toggle navigation
    toggleBtn.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      toggleBtn.setAttribute('aria-expanded', isOpen.toString());
    });
    
    // Close nav when clicking on overlay (outside sidebar)
    document.addEventListener('click', (e) => {
      if (document.body.classList.contains('nav-open')) {
        const sidebar = document.getElementById('sidebar');
        const clickedInsideSidebar = sidebar && sidebar.contains(e.target);
        const clickedToggle = toggleBtn.contains(e.target);
        
        if (!clickedInsideSidebar && !clickedToggle) {
          document.body.classList.remove('nav-open');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
    
    // Close nav when clicking on nav links
    const navLinks = document.querySelectorAll('#sidebar nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initNav();
      initMobileToggle();
    });
  } else {
    initNav();
    initMobileToggle();
  }
})();

