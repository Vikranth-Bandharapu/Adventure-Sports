// ============================================================
//  WildPeak Adventures — Contact Page JavaScript
//  contact.js
//  Handles: Form Validation, FAQ Accordion
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     CONTACT FORM VALIDATION
  ────────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Field references
  const fields = {
    name:    { el: document.getElementById('contactName'),    err: document.getElementById('nameError') },
    email:   { el: document.getElementById('contactEmail'),   err: document.getElementById('emailError') },
    phone:   { el: document.getElementById('contactPhone'),   err: document.getElementById('phoneError') },
    subject: { el: document.getElementById('contactSubject'), err: document.getElementById('subjectError') },
    message: { el: document.getElementById('contactMessage'), err: document.getElementById('messageError') },
  };

  /* ── Validation Rules ── */
  const validators = {
    name(val) {
      if (!val.trim()) return 'Full name is required.';
      if (val.trim().length < 2) return 'Name must be at least 2 characters.';
      if (!/^[a-zA-Z\s'.,-]+$/.test(val.trim())) return 'Name contains invalid characters.';
      return '';
    },
    email(val) {
      if (!val.trim()) return 'Email address is required.';
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!re.test(val.trim())) return 'Please enter a valid email address.';
      return '';
    },
    phone(val) {
      if (!val.trim()) return 'Phone number is required.';
      // Strip spaces, dashes, and +91 prefix
      const cleaned = val.trim().replace(/[\s\-]/g, '').replace(/^\+91/, '').replace(/^91/, '');
      if (!/^\d{10}$/.test(cleaned)) return 'Enter a valid 10-digit Indian mobile number.';
      return '';
    },
    subject(val) {
      if (!val || val === '') return 'Please select a subject.';
      return '';
    },
    message(val) {
      if (!val.trim()) return 'Message is required.';
      if (val.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    },
  };

  /* ── Show / Clear Error ── */
  function showError(fieldKey, msg) {
    const { el, err } = fields[fieldKey];
    if (msg) {
      err.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
      err.setAttribute('role', 'alert');
      err.setAttribute('aria-live', 'assertive');
      el.classList.add('is-error');
      el.classList.remove('is-valid');
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', err.id);
    } else {
      err.innerHTML = '';
      err.removeAttribute('role');
      err.removeAttribute('aria-live');
      el.classList.remove('is-error');
      el.classList.add('is-valid');
      el.setAttribute('aria-invalid', 'false');
      el.removeAttribute('aria-describedby');
    }
  }

  /* ── Validate Single Field ── */
  function validateField(key) {
    const val = fields[key].el.value;
    const msg = validators[key](val);
    showError(key, msg);
    return msg === '';
  }

  /* ── Live Validation on Blur ── */
  Object.keys(fields).forEach(key => {
    const { el } = fields[key];
    el.addEventListener('blur', () => validateField(key));
    el.addEventListener('input', () => {
      // Only clear error once user starts fixing, don't re-add on every keystroke
      if (el.classList.contains('is-error')) validateField(key);
    });
    el.addEventListener('change', () => {
      if (key === 'subject') validateField(key);
    });
  });

  /* ── Submit Handler ── */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let allValid = true;
    Object.keys(fields).forEach(key => {
      if (!validateField(key)) allValid = false;
    });

    if (!allValid) {
      // Scroll to first error
      const firstError = form.querySelector('.is-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Valid — animate button then redirect
    const submitBtn = form.querySelector('.form-submit-btn');
    if (submitBtn) {
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> &nbsp;Sending...';
      submitBtn.style.opacity = '0.8';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> &nbsp;Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg,#2d7a4f,#4ade80)';
        setTimeout(() => {
          window.location.href = '404.html';
        }, 700);
      }, 1400);
    } else {
      window.location.href = '404.html';
    }
  });

  /* ──────────────────────────────────────────────
     FAQ ACCORDION
  ────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    const icon     = item.querySelector('.faq-icon i');

    if (!question || !answer) return;

    // Set initial aria attributes
    question.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');
    const answerId = 'faq-answer-' + Math.random().toString(36).slice(2, 8);
    answer.id = answerId;
    question.setAttribute('aria-controls', answerId);

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others (optional: comment out for multi-open)
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          const otherQ = other.querySelector('.faq-question');
          const otherA = other.querySelector('.faq-answer');
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
          if (otherA) otherA.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.setAttribute('aria-hidden', String(isOpen));
    });

    // Keyboard: Enter / Space
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });

    // Make question focusable
    question.setAttribute('tabindex', '0');
    question.setAttribute('role', 'button');
  });

  /* ──────────────────────────────────────────────
     PHONE INPUT: auto-format helper (optional UX)
  ────────────────────────────────────────────── */
  const phoneInput = document.getElementById('contactPhone');
  if (phoneInput) {
    phoneInput.addEventListener('keypress', (e) => {
      // Allow: digits, +, -, space, backspace, tab
      const allowed = /[\d\+\-\s]/;
      if (!allowed.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
        e.preventDefault();
      }
    });
  }

});
