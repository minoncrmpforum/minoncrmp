/* ═══════════════════════════════════════════
   MinionRP — script.js
═══════════════════════════════════════════ */

/* ── Custom cursor ── */
const cursor = document.getElementById('cursor');
const cursorPupil = document.getElementById('cursorPupil');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Rotate pupil toward edges
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  if (cursorPupil) {
    cursorPupil.style.transform = `translate(${dx * 5}px, ${dy * 5}px)`;
  }
});

(function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  if (cursor) {
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
  }
  requestAnimationFrame(animateCursor);
})();

/* ── Decorative eyes track cursor ── */
const decoEyes = document.querySelectorAll('[data-eye]');
document.addEventListener('mousemove', e => {
  decoEyes.forEach(eye => {
    const rect = eye.getBoundingClientRect();
    const ex = rect.left + rect.width / 2;
    const ey = rect.top  + rect.height / 2;
    const angle = Math.atan2(e.clientY - ey, e.clientX - ex);
    const dist  = Math.min(rect.width * 0.18, 14);
    const pupil = eye.querySelector('.deco-pupil');
    if (pupil) {
      pupil.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
    }
  });
});

/* ── Big eye tracks cursor ── */
const bigEye   = document.getElementById('bigEye');
const bigPupil = document.getElementById('bigPupil');
if (bigEye && bigPupil) {
  document.addEventListener('mousemove', e => {
    const rect = bigEye.getBoundingClientRect();
    const ex = rect.left + rect.width / 2;
    const ey = rect.top  + rect.height / 2;
    const angle = Math.atan2(e.clientY - ey, e.clientX - ex);
    const dist  = 22;
    bigPupil.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
  });
}

/* ── Logo pupil tracks cursor ── */
const logoPupil = document.getElementById('logoPupil');
if (logoPupil) {
  document.addEventListener('mousemove', e => {
    const logoEye = logoPupil.closest('.logo-eye');
    if (!logoEye) return;
    const rect = logoEye.getBoundingClientRect();
    const ex = rect.left + rect.width / 2;
    const ey = rect.top  + rect.height / 2;
    const angle = Math.atan2(e.clientY - ey, e.clientX - ex);
    logoPupil.style.transform = `translate(${Math.cos(angle) * 4}px, ${Math.sin(angle) * 4}px)`;
  });
}

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Burger menu ── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Accordion ── */
document.querySelectorAll('.acc-head').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.acc-item');
    const body = item.querySelector('.acc-body');
    const inner = item.querySelector('.acc-body-inner') || body;
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.acc-item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.acc-body').style.maxHeight = '0';
      open.querySelector('.acc-body').style.padding   = '0';
    });

    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
      // Add inner padding via wrapper
      // We use acc-body-inner pattern — inject if missing
      ensureInner(body);
      // Recalc after inner appears
      setTimeout(() => {
        body.style.maxHeight = body.scrollHeight + 'px';
      }, 10);
    }
  });
});

function ensureInner(body) {
  if (!body.querySelector('.acc-body-inner')) {
    const inner = document.createElement('div');
    inner.className = 'acc-body-inner';
    while (body.firstChild) inner.appendChild(body.firstChild);
    body.appendChild(inner);
  }
}

// Init: wrap all acc-body content in acc-body-inner
document.querySelectorAll('.acc-body').forEach(body => {
  ensureInner(body);
});

/* ── Reveal on scroll ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Count-up animation ── */
function countUp(el, target, duration = 1800) {
  const start = performance.now();
  const format = n => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);

  (function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const val = Math.round(ease * target);
    el.textContent = target >= 1000 ? (val >= 1000 ? (val / 1000).toFixed(1) + 'K' : val) : val;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = target >= 1000 ? (target / 1000).toFixed(1) + 'K' : target;
  })(start);
}

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      countUp(el, parseInt(el.dataset.count));
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

/* ── Particles ── */
const particlesEl = document.getElementById('particles');
if (particlesEl) {
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: -10px;
      animation-duration: ${Math.random() * 14 + 10}s;
      animation-delay: ${Math.random() * 12}s;
    `;
    particlesEl.appendChild(p);
  }
}



/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Active nav highlight ── */
const sections  = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(l => l.style.color = '');
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--yellow)';
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

/* ── Hover glow on cards ── */
document.querySelectorAll('.about-card, .donate-card, .admin-role-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,213,79,0.06) 0%, transparent 60%), var(--navy-card)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ── Parallax for hero deco eyes ── */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.deco-eye').forEach((eye, i) => {
    const speed = [0.15, 0.08, 0.2, 0.12][i] || 0.1;
    eye.style.transform = `translateY(${sy * speed}px)`;
  });
});
