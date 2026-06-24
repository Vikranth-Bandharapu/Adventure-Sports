// ============================================================
//  WildPeak Adventures — Dashboard JavaScript
//  Admin & Customer Dashboards
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ── Load user from localStorage ── */
  const email = localStorage.getItem('wp_user_email') || 'explorer@wildpeak.in';
  const role  = localStorage.getItem('wp_user_role')  || 'customer';
  const name  = localStorage.getItem('wp_reg_name')   || email.split('@')[0];

  // Populate all dynamic email/name elements
  document.querySelectorAll('.dash-user-email').forEach(el => {
    el.textContent = email;
  });
  document.querySelectorAll('.dash-user-name').forEach(el => {
    el.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  });
  document.querySelectorAll('.dash-user-avatar-letter').forEach(el => {
    el.textContent = (name.charAt(0) || email.charAt(0)).toUpperCase();
  });
  document.querySelectorAll('.topbar-email').forEach(el => {
    el.textContent = email;
  });

  /* ── Sidebar Collapse Toggle ── */
  const sidebar      = document.getElementById('sidebar');
  const dashMain     = document.getElementById('dashMain');
  const sideToggle   = document.getElementById('sidebarToggle');
  const mobileToggle = document.getElementById('mobileSidebarToggle');

  if (sideToggle && sidebar) {
    sideToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      dashMain?.classList.toggle('collapsed');
      const icon = sideToggle.querySelector('i');
      if (icon) {
        icon.className = sidebar.classList.contains('collapsed')
          ? 'fa-solid fa-chevron-right'
          : 'fa-solid fa-chevron-left';
      }
    });
  }

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
    // Close sidebar on outside click (mobile)
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }

  /* ── Sidebar Nav Active Link ── */
  document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') e.preventDefault();
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      // Show/hide sections
      const target = this.dataset.section;
      if (target) {
        document.querySelectorAll('.dash-section').forEach(s => {
          s.style.display = s.id === target ? 'block' : 'none';
        });
        // Update page title
        const titleEl = document.getElementById('dashPageTitle');
        if (titleEl) titleEl.textContent = this.querySelector('.sidebar-link-text')?.textContent || 'Dashboard';
        // Close mobile sidebar
        sidebar?.classList.remove('mobile-open');
      }
    });
  });

  /* ── Logout ── */
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('wp_user_email');
      localStorage.removeItem('wp_user_role');
      localStorage.removeItem('wp_reg_name');
      window.location.href = 'index.html';
    });
  });

  /* ── Date in Topbar ── */
  const dateEl = document.getElementById('topbarDate');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-IN', {
      weekday:'long', year:'numeric', month:'long', day:'numeric'
    });
  }

  /* ── Chart.js Charts (Admin Only) ── */
  const bookingChartEl = document.getElementById('bookingChart');
  if (bookingChartEl && typeof Chart !== 'undefined') {
    const bookingCtx = bookingChartEl.getContext('2d');
    new Chart(bookingCtx, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          label: 'Bookings',
          data: [65, 89, 120, 145, 180, 210, 245, 260, 195, 170, 140, 190],
          backgroundColor: 'rgba(74,222,128,0.2)',
          borderColor: '#4ade80',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },{
          label: 'Revenue (₹K)',
          data: [48, 72, 95, 118, 140, 165, 195, 210, 155, 135, 110, 148],
          backgroundColor: 'rgba(45,122,79,0.2)',
          borderColor: '#2d7a4f',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#9ca3af', font: { family: 'Outfit' } } },
          tooltip: {
            backgroundColor: 'rgba(6,13,8,0.92)',
            titleColor: '#fff',
            bodyColor: '#9ca3af',
            borderColor: 'rgba(74,222,128,0.3)',
            borderWidth: 1,
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6b7280' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#6b7280' }
          }
        }
      }
    });
  }

  const userChartEl = document.getElementById('userChart');
  if (userChartEl && typeof Chart !== 'undefined') {
    const userCtx = userChartEl.getContext('2d');
    new Chart(userCtx, {
      type: 'doughnut',
      data: {
        labels: ['Trekking','Rafting','Camping','Paragliding','Climbing','Ziplining'],
        datasets: [{
          data: [35, 22, 18, 12, 8, 5],
          backgroundColor: [
            'rgba(74,222,128,0.8)',
            'rgba(45,122,79,0.8)',
            'rgba(139,94,60,0.8)',
            'rgba(107,114,128,0.8)',
            'rgba(134,239,172,0.8)',
            'rgba(62,159,100,0.8)',
          ],
          borderColor: 'rgba(6,13,8,0.5)',
          borderWidth: 2,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#9ca3af',
              font: { family: 'Outfit', size: 12 },
              padding: 16,
              usePointStyle: true,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(6,13,8,0.92)',
            titleColor: '#fff',
            bodyColor: '#9ca3af',
            borderColor: 'rgba(74,222,128,0.3)',
            borderWidth: 1,
          }
        }
      }
    });
  }

  /* ── Animated Counters in Dashboard ── */
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = 'true';
        const target = parseFloat(e.target.dataset.counter);
        const isFloat = e.target.dataset.float === 'true';
        const prefix = e.target.dataset.prefix || '';
        const suffix = e.target.dataset.suffix || '';
        const dur = 1800;
        const start = performance.now();
        function update(now) {
          const prog = Math.min((now-start)/dur, 1);
          const eased = 1 - Math.pow(1-prog, 3);
          const val = isFloat ? (eased * target).toFixed(1) : Math.round(eased * target).toLocaleString();
          e.target.textContent = prefix + val + suffix;
          if (prog < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));

  /* ── Chart Period Buttons ── */
  document.querySelectorAll('.chart-period-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.chart-period-btns')?.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ── Notification Bell ── */
  const notifBtn = document.getElementById('notifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      const badge = notifBtn.querySelector('.notif-badge');
      if (badge) badge.style.display = 'none';
    });
  }

});
