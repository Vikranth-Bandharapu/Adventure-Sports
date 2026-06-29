/* ============================================================
   WildPeak Adventures — Blog Page JavaScript
   blog.js | Handles: Category filter, Search, Newsletter
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     STATE
     ============================================================ */
  const state = {
    activeCategory: 'all',
    searchQuery: ''
  };


  /* ============================================================
     DOM CACHE
     ============================================================ */
  const dom = {
    filterTabs:      () => document.querySelectorAll('.filter-tab'),
    sidebarCatBtns:  () => document.querySelectorAll('.sidebar-cat-btn'),
    blogCards:       () => document.querySelectorAll('.blog-card'),
    blogGrid:        () => document.getElementById('blogGridContainer'),
    emptyState:      () => document.getElementById('blogEmptyState'),
    resetFilterBtn:  () => document.getElementById('resetFilterBtn'),
    searchInput:     () => document.getElementById('blogSearchInput'),
    searchBtn:       () => document.getElementById('blogSearchBtn'),
    nlForm:          () => document.getElementById('blogNlForm'),
    nlEmailInput:    () => document.getElementById('blogNlEmail'),
    nlBtn:           () => document.getElementById('blogNlBtn'),
    nlMsg:           () => document.getElementById('blogNlMsg'),
  };


  /* ============================================================
     CATEGORY FILTER
     Syncs filter tabs (top bar) and sidebar category buttons.
     Filters cards by data-category attribute.
     Uses CSS class animation for smooth show/hide.
     ============================================================ */
  function applyFilter() {
    const cat     = state.activeCategory;
    const query   = state.searchQuery.toLowerCase().trim();
    const cards   = dom.blogCards();
    let   visible = 0;

    cards.forEach(card => {
      const cardCat   = (card.dataset.category || '').toLowerCase();
      const cardTitle = (card.dataset.title     || '').toLowerCase();

      const catMatch   = (cat === 'all') || cardCat.includes(cat);
      const queryMatch = !query || cardTitle.includes(query);
      const show       = catMatch && queryMatch;

      if (show) {
        card.style.display = '';
        card.classList.remove('fade-out');
        card.classList.add('fade-in');
        visible++;
      } else {
        card.classList.add('fade-out');
        card.classList.remove('fade-in');
        // Hide after transition
        setTimeout(() => {
          if (card.classList.contains('fade-out')) {
            card.style.display = 'none';
          }
        }, 320);
      }
    });

    // Show / hide empty state
    const emptyEl = dom.emptyState();
    if (emptyEl) {
      if (visible === 0) {
        // Small delay so cards can fade out first
        setTimeout(() => {
          emptyEl.style.display = 'block';
        }, 350);
      } else {
        emptyEl.style.display = 'none';
      }
    }
  }


  /* ---- Update active tab UI ---- */
  function setActiveFilterTab(filter) {
    dom.filterTabs().forEach(tab => {
      const isActive = tab.dataset.filter === filter;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  }


  /* ---- Update active sidebar cat btn UI ---- */
  function setActiveSidebarCat(filter) {
    dom.sidebarCatBtns().forEach(btn => {
      const isActive = btn.dataset.catFilter === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }


  /* ---- Bind filter tab clicks ---- */
  function bindFilterTabs() {
    dom.filterTabs().forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        if (filter === state.activeCategory) return;

        state.activeCategory = filter;
        state.searchQuery    = '';

        // Clear search input
        const searchInput = dom.searchInput();
        if (searchInput) searchInput.value = '';

        setActiveFilterTab(filter);
        setActiveSidebarCat(filter);
        applyFilter();

        // Smooth scroll to grid
        const gridSection = document.getElementById('blogGrid');
        if (gridSection) {
          gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }


  /* ---- Bind sidebar category button clicks ---- */
  function bindSidebarCats() {
    dom.sidebarCatBtns().forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.catFilter;
        if (filter === state.activeCategory) return;

        state.activeCategory = filter;
        state.searchQuery    = '';

        const searchInput = dom.searchInput();
        if (searchInput) searchInput.value = '';

        setActiveFilterTab(filter);
        setActiveSidebarCat(filter);
        applyFilter();

        // On mobile, scroll to grid
        const gridSection = document.getElementById('blogGrid');
        if (gridSection && window.innerWidth < 900) {
          gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }


  /* ---- Bind reset filter button (in empty state) ---- */
  function bindResetFilter() {
    const btn = dom.resetFilterBtn();
    if (!btn) return;
    btn.addEventListener('click', () => {
      state.activeCategory = 'all';
      state.searchQuery    = '';

      const searchInput = dom.searchInput();
      if (searchInput) searchInput.value = '';

      setActiveFilterTab('all');
      setActiveSidebarCat('all');
      applyFilter();
    });
  }


  /* ============================================================
     SEARCH
     Filters blog cards by title as user types.
     Resets to 'all' category when searching.
     ============================================================ */
  function bindSearch() {
    const input = dom.searchInput();
    const btn   = dom.searchBtn();
    if (!input) return;

    let debounceTimer;

    function doSearch() {
      const query = input.value.trim();
      state.searchQuery = query;

      // When searching, show all categories so results aren't filtered out
      if (query) {
        state.activeCategory = 'all';
        setActiveFilterTab('all');
        setActiveSidebarCat('all');
      }

      applyFilter();
    }

    // Live search with debounce
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(doSearch, 220);
    });

    // Search on Enter key
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(debounceTimer);
        doSearch();
      }
    });

    // Search on button click
    if (btn) {
      btn.addEventListener('click', () => {
        clearTimeout(debounceTimer);
        doSearch();
      });
    }
  }


  /* ============================================================
     NEWSLETTER FORM
     Validates email format.
     Shows inline success or error message.
     No redirect.
     ============================================================ */
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  function isValidEmail(email) {
    return EMAIL_REGEX.test(email.trim());
  }

  function showNlMessage(type, text) {
    const msgEl = dom.nlMsg();
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = `blog-nl-msg ${type}`;
  }

  function clearNlMessage() {
    const msgEl = dom.nlMsg();
    if (!msgEl) return;
    msgEl.textContent = '';
    msgEl.className = 'blog-nl-msg';
  }

  function bindNewsletter() {
    const form    = dom.nlForm();
    const emailEl = dom.nlEmailInput();
    const btn     = dom.nlBtn();
    if (!form || !emailEl) return;

    // Clear error on input
    emailEl.addEventListener('input', clearNlMessage);

    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = emailEl.value.trim();

      if (!email) {
        showNlMessage('error', '\u26a0\ufe0f Please enter your email address.');
        emailEl.focus();
        return;
      }

      if (!isValidEmail(email)) {
        showNlMessage('error', '\u274c Please enter a valid email address (e.g. you@example.com).');
        emailEl.focus();
        return;
      }

      // Simulate success (no backend)
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';
      }

      setTimeout(() => {
        showNlMessage('success', '\uD83C\uDF89 You\u2019re in! Check your inbox for a welcome email.');
        emailEl.value = '';
        emailEl.disabled = true;

        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
          btn.style.background = 'var(--grad-accent)';
        }
      }, 900);
    });
  }


  /* ============================================================
     RIPPLE EFFECT (matching main.js pattern)
     ============================================================ */
  function addRippleEffect(btn) {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${e.clientX - rect.left - size / 2}px`,
        `top:${e.clientY - rect.top - size / 2}px`,
        'position:absolute',
        'border-radius:50%',
        'background:rgba(255,255,255,0.25)',
        'pointer-events:none',
        'transform:scale(0)',
        'animation:rippleAnim 0.6s linear',
        'z-index:10'
      ].join(';');
      this.style.position = 'relative';
      this.style.overflow  = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  }

  function bindRippleButtons() {
    document.querySelectorAll('.ripple').forEach(addRippleEffect);
  }


  /* ============================================================
     HERO PARTICLE SPARKLES
     ============================================================ */
  function initHeroParticles() {
    const container = document.getElementById('blogParticles');
    if (!container) return;

    const count = window.matchMedia('(max-width:640px)').matches ? 8 : 18;

    for (let i = 0; i < count; i++) {
      const p   = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const x    = Math.random() * 100;
      const y    = Math.random() * 100;
      const dur  = Math.random() * 6 + 4;
      const del  = Math.random() * 6;

      p.style.cssText = [
        'position:absolute',
        `width:${size}px`,
        `height:${size}px`,
        `left:${x}%`,
        `top:${y}%`,
        'border-radius:50%',
        'background:rgba(74,222,128,0.65)',
        `animation:particleFloat ${dur}s ${del}s ease-in-out infinite alternate`,
        'pointer-events:none'
      ].join(';');
      container.appendChild(p);
    }

    // Inject keyframes if not already present
    if (!document.getElementById('particleStyles')) {
      const style = document.createElement('style');
      style.id = 'particleStyles';
      style.textContent = `
        @keyframes particleFloat {
          from { transform: translateY(0) scale(1);   opacity: 0.3; }
          to   { transform: translateY(-30px) scale(1.4); opacity: 0.9; }
        }
        @keyframes rippleAnim {
          to { transform: scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }


  /* ============================================================
     NAVBAR ACTIVE STATE
     ============================================================ */
  function setNavActive() {
    // Blog link already has .active in HTML but ensure main.js doesn't override
    const navBlog = document.getElementById('navBlog');
    if (navBlog) {
      navBlog.classList.add('active');
    }
  }


  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    bindFilterTabs();
    bindSidebarCats();
    bindResetFilter();
    bindSearch();
    bindNewsletter();
    bindRippleButtons();
    initHeroParticles();
    setNavActive();

    // Ensure all cards are visible initially
    dom.blogCards().forEach(card => {
      card.style.display = '';
      card.classList.add('fade-in');
    });

    // Hide empty state on init
    const emptyEl = dom.emptyState();
    if (emptyEl) emptyEl.style.display = 'none';
  }


  /* ---- Run after DOM ready ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
