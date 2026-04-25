/* ================================================
   PORTFOLIO JS — Job Pulache Carreño
================================================ */

// ─── CURSOR PERSONALIZADO ───
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor expand on hover
document.querySelectorAll('a, button, .service-card, .research-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    follower.style.opacity = '0.8';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.opacity = '0.5';
  });
});

// Hide cursor on mobile
if ('ontouchstart' in window) {
  cursor.style.display = 'none';
  follower.style.display = 'none';
  document.body.style.cursor = 'auto';
}

// ─── SCROLL PROGRESS BAR ───
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ─── NAV SCROLL EFFECT ───
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 80) {
    nav.style.boxShadow = '0 4px 40px rgba(0,0,0,0.3)';
  } else {
    nav.style.boxShadow = 'none';
  }
  lastScroll = currentScroll;
}, { passive: true });

// ─── MOBILE MENU ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── DARK/LIGHT THEME ───
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
themeToggle.querySelector('.theme-icon').textContent = savedTheme === 'dark' ? '◐' : '◑';

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.querySelector('.theme-icon').textContent = next === 'dark' ? '◐' : '◑';
});

// ─── HERO CANVAS — FLOATING GRID ───
const heroCanvas = document.getElementById('heroCanvas');
const hCtx = heroCanvas.getContext('2d');

function resizeHeroCanvas() {
  heroCanvas.width  = heroCanvas.offsetWidth;
  heroCanvas.height = heroCanvas.offsetHeight;
}
resizeHeroCanvas();
window.addEventListener('resize', resizeHeroCanvas, { passive: true });

class GridPoint {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * heroCanvas.width;
    this.y = Math.random() * heroCanvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > heroCanvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > heroCanvas.height) this.vy *= -1;
  }
}

const heroPoints = Array.from({ length: 80 }, () => new GridPoint());
const CONNECTION_DIST = 120;
let heroAnimFrame;

function drawHero() {
  hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

  const isDark = root.getAttribute('data-theme') !== 'light';
  const dotColor = isDark ? 'rgba(201,169,110,' : 'rgba(139,94,46,';
  const lineColor = isDark ? 'rgba(201,169,110,' : 'rgba(139,94,46,';

  heroPoints.forEach(p => p.update());

  // Draw connections
  for (let i = 0; i < heroPoints.length; i++) {
    for (let j = i + 1; j < heroPoints.length; j++) {
      const dx = heroPoints[i].x - heroPoints[j].x;
      const dy = heroPoints[i].y - heroPoints[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECTION_DIST) {
        const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
        hCtx.beginPath();
        hCtx.strokeStyle = lineColor + alpha + ')';
        hCtx.lineWidth = 0.5;
        hCtx.moveTo(heroPoints[i].x, heroPoints[i].y);
        hCtx.lineTo(heroPoints[j].x, heroPoints[j].y);
        hCtx.stroke();
      }
    }
  }

  // Draw points
  heroPoints.forEach(p => {
    hCtx.beginPath();
    hCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    hCtx.fillStyle = dotColor + p.opacity + ')';
    hCtx.fill();
  });

  heroAnimFrame = requestAnimationFrame(drawHero);
}
drawHero();

// Mouse interaction on hero
heroCanvas.addEventListener('mousemove', e => {
  const rect = heroCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  heroPoints.forEach(p => {
    const dx = mx - p.x;
    const dy = my - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      p.vx += -dx / dist * 0.3;
      p.vy += -dy / dist * 0.3;
      const maxSpeed = 2;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxSpeed) { p.vx = (p.vx / speed) * maxSpeed; p.vy = (p.vy / speed) * maxSpeed; }
    }
  });
}, { passive: true });

// ─── CONTACT CANVAS — PARTICLE RAIN ───
const contactCanvas = document.getElementById('contactCanvas');
const cCtx = contactCanvas.getContext('2d');

function resizeContactCanvas() {
  contactCanvas.width  = contactCanvas.offsetWidth;
  contactCanvas.height = contactCanvas.offsetHeight;
}
resizeContactCanvas();
window.addEventListener('resize', resizeContactCanvas, { passive: true });

const rainParticles = Array.from({ length: 50 }, () => ({
  x: Math.random() * 2000,
  y: Math.random() * 800,
  speed: Math.random() * 0.5 + 0.2,
  size: Math.random() * 1 + 0.3,
  opacity: Math.random() * 0.3 + 0.05
}));

function drawRain() {
  cCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
  const isDark = root.getAttribute('data-theme') !== 'light';
  const color = isDark ? 'rgba(201,169,110,' : 'rgba(139,94,46,';

  rainParticles.forEach(p => {
    p.y += p.speed;
    if (p.y > contactCanvas.height) { p.y = 0; p.x = Math.random() * contactCanvas.width; }
    cCtx.beginPath();
    cCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    cCtx.fillStyle = color + p.opacity + ')';
    cCtx.fill();
  });
  requestAnimationFrame(drawRain);
}
drawRain();

// ─── SCROLL REVEAL ───
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ─── MAGNETIC BUTTON ───
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    setTimeout(() => { btn.style.transition = ''; }, 500);
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.1s ease';
  });
});

// ─── ACTIVE NAV LINK ───
const sections = document.querySelectorAll('section[id], main[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// Active nav link style
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-link.active { color: var(--text) !important; } .nav-link.active::after { width: 100% !important; }`;
document.head.appendChild(navStyle);

// ─── FLOATING LABELS FIX ───
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
  // Keep label up if there's a value
  input.addEventListener('input', () => {
    if (input.value.trim()) {
      input.classList.add('has-value');
    } else {
      input.classList.remove('has-value');
    }
  });
});

// ─── CONTACT FORM — VALIDATION & SUBMISSION ───
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const nombre  = document.getElementById('nombre').value.trim();
  const email   = document.getElementById('email').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  formSuccess.classList.remove('visible');
  formError.classList.remove('visible');

  if (!nombre || !email || !mensaje || !emailRx.test(email)) {
    formError.classList.add('visible');
    // Shake animation
    contactForm.style.animation = 'shake 0.4s ease';
    setTimeout(() => { contactForm.style.animation = ''; }, 400);
    return;
  }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Enviando...';

  // Simulate send (replace with actual API/EmailJS call)
  await new Promise(r => setTimeout(r, 1500));

  btn.disabled = false;
  btn.querySelector('.btn-text').textContent = 'Enviar mensaje';
  formSuccess.classList.add('visible');
  contactForm.reset();
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(i => i.classList.remove('has-value'));
});

// Shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
  @keyframes scrollAnim {
    0%,100%{transform:scaleY(1);opacity:1}
    50%{transform:scaleY(0.4);opacity:0.2}
  }
`;
document.head.appendChild(shakeStyle);

// ─── SMOOTH ANCHOR SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── TYPING EFFECT on section-tag of hero ───
const eyebrowText = document.querySelector('.eyebrow-text');
if (eyebrowText) {
  const text = eyebrowText.textContent;
  eyebrowText.textContent = '';
  let i = 0;
  setTimeout(() => {
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        eyebrowText.textContent += text[i++];
      } else {
        clearInterval(typeInterval);
      }
    }, 45);
  }, 500);
}

// ─── PAGE LOAD — fade in ───
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
