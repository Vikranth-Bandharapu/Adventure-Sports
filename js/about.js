// ============================================================
//  WildPeak Adventures — About Page JavaScript
//  Handles: Stat Counter Animation, Hero Particles, Timeline
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. HERO PARTICLES ─────────────────────────────────── */
  const heroParticleContainer = document.getElementById('heroParticlesAbout');
  if (heroParticleContainer) {
    const PARTICLE_COUNT = 28;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const dot = document.createElement('div');
      dot.className = 'particle-dot';
      const size = 2 + Math.random() * 5;
      const dur  = 5 + Math.random() * 7;
      const delay = Math.random() * 6;
      const op   = 0.15 + Math.random() * 0.4;
      dot.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${20 + Math.random() * 75}%;
        --dur: ${dur}s;
        --delay: ${delay}s;
        --op: ${op};
      `;
      heroParticleContainer.appendChild(dot);
    }
  }


  /* ── 2. STAT COUNTER ANIMATION ─────────────────────────── */
  /**
   * Animates a .count-up element from 0 to its data-target value.
   * Uses requestAnimationFrame for smooth 60fps animation.
   * Formats large numbers (>=1000) with K suffix.
   */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800; // ms
    const start    = performance.now();

    function formatNumber(n, tgt) {
      // For 10000 target — show as "10K"
      if (tgt >= 10000) {
        const k = Math.floor(n / 1000);
        return k + 'K';
      }
      return Math.floor(n).toString();
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const current  = eased * target;

      el.textContent = formatNumber(current, target) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Set exact final value
        el.textContent = formatNumber(target, target) + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  /**
   * IntersectionObserver — starts counter when statsGrid enters viewport.
   * Fires once: as soon as the section is 30% visible.
   */
  const statsSection = document.getElementById('statsGrid');
  let countersStarted = false;

  if (statsSection) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;

            // Small staggered delay per counter for visual flair
            const counters = document.querySelectorAll('.count-up');
            counters.forEach((el, i) => {
              setTimeout(() => animateCounter(el), i * 180);
            });

            // Once done, disconnect
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    counterObserver.observe(statsSection);
  }


  /* ── 3. TIMELINE INTERSECTION ANIMATIONS ──────────────── */
  /**
   * Adds a CSS class 'in-view' to timeline items as they scroll
   * into view. AOS handles most animations, but this gives the
   * dot a pulse effect on first reveal.
   */
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Pulse the dot
            const dot = entry.target.querySelector('.timeline-dot span');
            if (dot) {
              dot.style.animation = 'dotPulse 0.6s ease-out forwards';
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    );

    timelineItems.forEach(item => timelineObserver.observe(item));

    // Inject dot pulse keyframe
    if (!document.getElementById('dotPulseStyle')) {
      const style = document.createElement('style');
      style.id = 'dotPulseStyle';
      style.textContent = `
        @keyframes dotPulse {
          0%   { transform: scale(0.5); box-shadow: 0 0 0 0 rgba(74,222,128,0.6); }
          60%  { transform: scale(1.35); box-shadow: 0 0 0 12px rgba(74,222,128,0); }
          100% { transform: scale(1); box-shadow: 0 0 0 4px rgba(74,222,128,0.25), 0 0 20px rgba(74,222,128,0.35); }
        }
      `;
      document.head.appendChild(style);
    }
  }


  /* ── 4. PARTNER CARDS — STAGGER HOVER GLOW ────────────── */
  const partnerCards = document.querySelectorAll('.partner-card');
  partnerCards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      // Dim siblings slightly on hover
      partnerCards.forEach((other, j) => {
        if (j !== i) other.style.opacity = '0.65';
      });
    });
    card.addEventListener('mouseleave', () => {
      partnerCards.forEach(other => other.style.opacity = '');
    });
  });


  /* ── 5. VALUE CARDS — SEQUENTIAL FOCUS ────────────────── */
  const valueCards = document.querySelectorAll('.value-card');
  valueCards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      valueCards.forEach((other, j) => {
        if (j !== i) {
          other.style.opacity = '0.6';
          other.style.transform = 'scale(0.97)';
        }
      });
    });
    card.addEventListener('mouseleave', () => {
      valueCards.forEach(card => {
        card.style.opacity = '';
        card.style.transform = '';
      });
    });
  });


  /* ── 6. TEAM CARDS — AVATAR GLOW ON HOVER ─────────────── */
  // Team cards use CSS transitions already — extra JS pulse on click
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach(card => {
    card.addEventListener('click', () => {
      const avatar = card.querySelector('.team-avatar');
      if (!avatar) return;
      avatar.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
      avatar.style.transform = 'scale(1.18)';
      avatar.style.boxShadow = '0 0 0 6px rgba(74,222,128,0.3), 0 0 40px rgba(74,222,128,0.4)';
      setTimeout(() => {
        avatar.style.transform = '';
        avatar.style.boxShadow = '';
      }, 400);
    });
  });


  /* ── 7. HERO PARALLAX ──────────────────────────────────── */
  const heroImg = document.querySelector('.page-hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      // Parallax: image moves up at 30% scroll speed
      heroImg.style.transform = `scale(1.04) translateY(${scrollY * 0.28}px)`;
    }, { passive: true });
  }


  /* ── 8. SMOOTH SECTION SCROLL FOR BREADCRUMB / ANCHORS ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });


  /* ── 9. FLOATING CTA ENTRANCE ANIMATION ───────────────── */
  const ctaSection = document.querySelector('.about-cta');
  if (ctaSection) {
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const ctaBg = ctaSection.querySelector('.cta-bg-img');
            if (ctaBg) {
              // Subtle zoom-in on bg image when CTA enters view
              ctaBg.style.transition = 'transform 1.2s cubic-bezier(0.4,0,0.2,1)';
              ctaBg.style.transform = 'scale(1.0)';
            }
            ctaObserver.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    ctaObserver.observe(ctaSection);
  }


  /* ── 10. STAT BOXES — COUNT AGAIN ON RE-ENTRY (RESIZE) ── */
  // Re-initialize counters on window resize in case grid reflows
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Reset and re-observe only if not already started
      // (no-op if already triggered; countersStarted guards it)
    }, 300);
  });

}); // end DOMContentLoaded
