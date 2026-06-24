// ============================================================
//  WildPeak Adventures — Global JavaScript
//  Handles: Loader, Navbar, Scroll, AOS, Hamburger, ScrollTop
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ── Premium Loader ── */
  const loader = document.getElementById('pageLoader');
  if (loader) {
    // Spawn particles
    const particleContainer = loader.querySelector('.ldr-particles');
    if (particleContainer) {
      for (let i = 0; i < 22; i++) {
        const p = document.createElement('div');
        p.className = 'ldr-particle';
        const size = 3 + Math.random() * 6;
        p.style.cssText = `
          width:${size}px; height:${size}px;
          left:${Math.random()*100}%;
          --dur:${4 + Math.random()*5}s;
          --delay:${Math.random()*4}s;
          --op:${0.2 + Math.random()*0.5};
        `;
        particleContainer.appendChild(p);
      }
    }

    // Percentage counter
    const pctEl = loader.querySelector('.ldr-pct');
    const statusEl = loader.querySelector('.ldr-status-text');
    const statuses = [
      'Loading adventure map...',
      'Preparing your trail...',
      'Checking safety gear...',
      'Summoning the wild...',
      'Ready to explore!'
    ];
    let pct = 0;
    const pctInterval = setInterval(() => {
      pct = Math.min(pct + Math.floor(Math.random() * 8 + 3), 100);
      if (pctEl) pctEl.textContent = pct + '%';
      if (statusEl) statusEl.textContent = statuses[Math.floor(pct / 25)];
      if (pct >= 100) clearInterval(pctInterval);
    }, 60);

    // Hide loader on page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        pct = 100;
        if (pctEl) pctEl.textContent = '100%';
        if (statusEl) statusEl.textContent = 'Ready to explore!';
        clearInterval(pctInterval);
        setTimeout(() => loader.classList.add('loaded'), 400);
      }, 1400);
    });
  }


  /* ── AOS Init ── */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      delay: 0,
    });
  }

  /* ── Scroll Progress Bar ── */
  const prog = document.getElementById('scrollProgress');
  function updateProgress() {
    if (!prog) return;
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (scrolled / total) * 100 + '%';
  }

  /* ── Navbar Scroll Effect ── */
  const navbar = document.querySelector('.navbar');
  function handleScroll() {
    updateProgress();
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
      if (window.scrollY > 400) scrollTopBtn.classList.add('show');
      else scrollTopBtn.classList.remove('show');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  /* ── Hamburger Menu ── */
  const hamburger = document.getElementById('hamburger');
  const navCenter = document.getElementById('navCenter');
  if (hamburger && navCenter) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navCenter.classList.toggle('open');
      document.body.style.overflow = navCenter.classList.contains('open') ? 'hidden' : '';
    });
    // Close on nav link click
    navCenter.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navCenter.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navCenter.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Active Nav Link ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll To Top ── */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Smooth Scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ── Parallax on Hero ── */
  const heroBg = document.querySelector('.hero-bg-img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `scale(1.08) translateY(${scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ── Ripple Button Effect ── */
  document.querySelectorAll('.btn.ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:rgba(255,255,255,0.35);
        width:10px; height:10px;
        transform:scale(0) translate(-50%,-50%);
        animation:rippleAnim 0.6s ease-out forwards;
        left:${e.clientX - rect.left}px;
        top:${e.clientY - rect.top}px;
        pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* Inject ripple keyframe */
  if (!document.getElementById('rippleStyle')) {
    const s = document.createElement('style');
    s.id = 'rippleStyle';
    s.textContent = `@keyframes rippleAnim { to { transform:scale(30) translate(-50%,-50%); opacity:0; } }`;
    document.head.appendChild(s);
  }

});
