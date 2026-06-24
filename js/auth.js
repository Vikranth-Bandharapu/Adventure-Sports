// ============================================================
//  WildPeak Adventures — Auth JavaScript
//  Handles: Login, Signup, Validation, localStorage
// ============================================================

/* ── Utility Functions ── */
function showErr(fieldId, msg) {
  const errEl = document.getElementById(fieldId + 'Err');
  const field  = document.getElementById(fieldId);
  if (errEl) errEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
  if (field)  field.classList.add('is-error');
}
function clearErr(fieldId) {
  const errEl = document.getElementById(fieldId + 'Err');
  const field  = document.getElementById(fieldId);
  if (errEl) errEl.innerHTML = '';
  if (field)  field.classList.remove('is-error');
}
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidPhone(p) { return /^(\+91)?[6-9]\d{9}$/.test(p.replace(/\s/g,'')); }

/* ── Password Toggle ── */
document.querySelectorAll('.pwd-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const inp = btn.previousElementSibling || btn.parentElement.querySelector('input');
    if (!inp) return;
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    btn.querySelector('i').className = isText ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
  });
});

/* ── Password Strength Indicator ── */
const pwdInput    = document.getElementById('password');
const pwdStrength = document.getElementById('pwdStrength');
if (pwdInput && pwdStrength) {
  const bars = pwdStrength.querySelectorAll('.pwd-bar');
  pwdInput.addEventListener('input', () => {
    const v = pwdInput.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    bars.forEach((b, i) => {
      b.className = 'pwd-bar';
      if (i < score) {
        if (score <= 1) b.classList.add('weak');
        else if (score === 2 || score === 3) b.classList.add('medium');
        else b.classList.add('strong');
      }
    });
  });
}

/* ── LOGIN FORM ── */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const email    = document.getElementById('email');
    const password = document.getElementById('password');
    const role     = document.querySelector('input[name="role"]:checked');

    // Email
    if (!email.value.trim()) {
      showErr('email', 'Email address is required.'); valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showErr('email', 'Please enter a valid email address.'); valid = false;
    } else { clearErr('email'); }

    // Password
    if (!password.value) {
      showErr('password', 'Password is required.'); valid = false;
    } else if (password.value.length < 6) {
      showErr('password', 'Password must be at least 6 characters.'); valid = false;
    } else { clearErr('password'); }

    // Role
    const roleErr = document.getElementById('roleErr');
    if (!role) {
      if (roleErr) roleErr.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please select a role.';
      valid = false;
    } else {
      if (roleErr) roleErr.innerHTML = '';
    }

    if (!valid) return;

    // Store in localStorage
    localStorage.setItem('wp_user_email', email.value.trim());
    localStorage.setItem('wp_user_role', role.value);

    // Redirect
    if (role.value === 'admin') {
      window.location.href = 'dashboard-admin.html';
    } else {
      window.location.href = 'dashboard-customer.html';
    }
  });

  // Real-time validation
  ['email','password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearErr(id));
  });
}

/* ── SIGNUP FORM ── */
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name      = document.getElementById('fullName');
    const email     = document.getElementById('email');
    const phone     = document.getElementById('phone');
    const password  = document.getElementById('password');
    const confirm   = document.getElementById('confirmPassword');
    const terms     = document.getElementById('terms');

    // Full Name
    if (!name.value.trim()) {
      showErr('fullName', 'Full name is required.'); valid = false;
    } else if (name.value.trim().length < 2) {
      showErr('fullName', 'Name must be at least 2 characters.'); valid = false;
    } else { clearErr('fullName'); }

    // Email
    if (!email.value.trim()) {
      showErr('email', 'Email address is required.'); valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showErr('email', 'Please enter a valid email address.'); valid = false;
    } else { clearErr('email'); }

    // Phone
    if (!phone.value.trim()) {
      showErr('phone', 'Phone number is required.'); valid = false;
    } else if (!isValidPhone(phone.value.trim())) {
      showErr('phone', 'Please enter a valid 10-digit Indian mobile number.'); valid = false;
    } else { clearErr('phone'); }

    // Password
    if (!password.value) {
      showErr('password', 'Password is required.'); valid = false;
    } else if (password.value.length < 8) {
      showErr('password', 'Password must be at least 8 characters.'); valid = false;
    } else if (!/[A-Z]/.test(password.value)) {
      showErr('password', 'Password must contain at least one uppercase letter.'); valid = false;
    } else if (!/[0-9]/.test(password.value)) {
      showErr('password', 'Password must contain at least one number.'); valid = false;
    } else { clearErr('password'); }

    // Confirm Password
    if (!confirm.value) {
      showErr('confirmPassword', 'Please confirm your password.'); valid = false;
    } else if (confirm.value !== password.value) {
      showErr('confirmPassword', 'Passwords do not match.'); valid = false;
    } else { clearErr('confirmPassword'); }

    // Terms
    const termsErr = document.getElementById('termsErr');
    if (terms && !terms.checked) {
      if (termsErr) termsErr.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> You must accept the terms and conditions.';
      valid = false;
    } else {
      if (termsErr) termsErr.innerHTML = '';
    }

    if (!valid) return;

    // Store user data
    localStorage.setItem('wp_reg_email', email.value.trim());
    localStorage.setItem('wp_reg_name', name.value.trim());

    // Redirect to login
    window.location.href = 'login.html?registered=true';
  });

  // Real-time validation
  ['fullName','email','phone','password','confirmPassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearErr(id));
  });
}

/* ── Show success message on login if coming from signup ── */
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('registered') === 'true') {
  const successBanner = document.getElementById('signupSuccessBanner');
  if (successBanner) successBanner.style.display = 'flex';
  // Pre-fill email
  const regEmail = localStorage.getItem('wp_reg_email');
  const emailInput = document.getElementById('email');
  if (regEmail && emailInput) emailInput.value = regEmail;
}
