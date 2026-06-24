// ============================================================
//  WildPeak Adventures — Home Page JavaScript
//  Handles: Counters, Lightbox, Testimonial Slider, Particles
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ── Hero Particles ── */
  const particlesWrap = document.querySelector('.hero-particles');
  if (particlesWrap) {
    const sizes   = [6, 8, 10, 14, 18, 22];
    const counts  = 18;
    for (let i = 0; i < counts; i++) {
      const dot = document.createElement('div');
      dot.className = 'p-dot';
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      dot.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        --dur:${4 + Math.random() * 5}s;
        --delay:${Math.random() * 3}s;
        opacity:${0.15 + Math.random() * 0.4};
      `;
      particlesWrap.appendChild(dot);
    }
  }

  /* ── Animated Counters (Intersection Observer) ── */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.done) {
        entry.target.dataset.done = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2200;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(update);
  }

  /* ── Gallery Lightbox ── */
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lightboxImg');
  const lbClose     = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (lightbox && lbImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.src || item.querySelector('img')?.dataset.src;
        if (src) {
          lbImg.src = src;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ── Testimonials Slider ── */
  const slider   = document.querySelector('.testimonials-slider');
  const dots     = document.querySelectorAll('.t-dot');
  const prevBtn  = document.getElementById('tPrev');
  const nextBtn  = document.getElementById('tNext');

  if (slider) {
    let current  = 0;
    let itemsPerView = getItemsPerView();
    let total = slider.children.length;
    let maxSlide = Math.max(0, total - itemsPerView);
    let autoplayTimer;

    function getItemsPerView() {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function getCardStep() {
      // Measure real rendered card width + gap between cards
      const cards = slider.children;
      if (cards.length < 2) return cards[0]?.offsetWidth || 0;
      const r1 = cards[0].getBoundingClientRect();
      const r2 = cards[1].getBoundingClientRect();
      return r2.left - r1.left; // card width + gap, exactly
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxSlide));
      const step = getCardStep();
      slider.style.transform = `translateX(-${current * step}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function autoplay() {
      autoplayTimer = setInterval(() => {
        goTo(current >= maxSlide ? 0 : current + 1);
      }, 4500);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplay();
    }

    dots.forEach((d, i) => {
      d.addEventListener('click', () => { goTo(i); resetAutoplay(); });
    });
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

    window.addEventListener('resize', () => {
      itemsPerView = getItemsPerView();
      maxSlide = Math.max(0, total - itemsPerView);
      goTo(Math.min(current, maxSlide));
    });

    // Touch swipe
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAutoplay(); }
    });

    goTo(0);
    autoplay();
  }

  /* ── Newsletter Form ── */
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = nlForm.querySelector('input[type="email"]');
      const emailErr   = document.getElementById('nlEmailErr');
      let valid = true;

      if (!emailInput.value.trim()) {
        showErr(emailErr, 'Email address is required.');
        emailInput.classList.add('is-error');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        showErr(emailErr, 'Please enter a valid email address.');
        emailInput.classList.add('is-error');
        valid = false;
      } else {
        clearErr(emailErr);
        emailInput.classList.remove('is-error');
      }

      if (valid) window.location.href = '404.html';
    });
  }

  function showErr(el, msg) { if (el) { el.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`; } }
  function clearErr(el) { if (el) el.innerHTML = ''; }

});
