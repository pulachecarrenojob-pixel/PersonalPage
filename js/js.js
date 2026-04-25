/* ════════════════════════════════════════════════════
   PORTFOLIO JS — Job Pulache Carreño
   Cursor · Nav · Theme · Hero Canvas · Cluster Map
   Globe 3D · Stats Dashboard · Scroll Reveal · Form
════════════════════════════════════════════════════ */

// ─────────────────────────────────────────
// CURSOR PERSONALIZADO
// ─────────────────────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.11;
  followerY += (mouseY - followerY) * 0.11;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a,button,.service-card,.research-item,.project-card,.cluster-node,.stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('expand'); follower.classList.add('expand'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('expand'); follower.classList.remove('expand'); });
});

if ('ontouchstart' in window) {
  cursor.style.display = 'none';
  follower.style.display = 'none';
  document.body.style.cursor = 'auto';
}

// ─────────────────────────────────────────
// SCROLL PROGRESS
// ─────────────────────────────────────────
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ─────────────────────────────────────────
// NAV SCROLL
// ─────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').style.boxShadow =
    window.scrollY > 80 ? '0 4px 40px rgba(0,0,0,.35)' : 'none';
}, { passive: true });

// ─────────────────────────────────────────
// MOBILE MENU
// ─────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─────────────────────────────────────────
// DARK / LIGHT THEME
// ─────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
themeToggle.querySelector('.theme-icon').textContent = savedTheme === 'dark' ? '◐' : '◑';

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.querySelector('.theme-icon').textContent = next === 'dark' ? '◐' : '◑';
});

// ─────────────────────────────────────────
// SMOOTH ANCHOR SCROLL
// ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
  });
});

// ─────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));

// ─────────────────────────────────────────
// ACTIVE NAV LINK
// ─────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });
document.querySelectorAll('section[id],main[id]').forEach(s => sectionObs.observe(s));

// ─────────────────────────────────────────
// HERO CANVAS — Particle Network
// ─────────────────────────────────────────
const heroCanvas = document.getElementById('heroCanvas');
const hCtx = heroCanvas.getContext('2d');
function resizeHero() { heroCanvas.width = heroCanvas.offsetWidth; heroCanvas.height = heroCanvas.offsetHeight; }
resizeHero();
window.addEventListener('resize', resizeHero, { passive: true });

const hPoints = Array.from({ length: 90 }, () => ({
  x: Math.random() * heroCanvas.width,
  y: Math.random() * heroCanvas.height,
  vx: (Math.random() - .5) * .3,
  vy: (Math.random() - .5) * .3,
  size: Math.random() * 1.5 + .4,
  op: Math.random() * .4 + .1
}));

heroCanvas.addEventListener('mousemove', e => {
  const r = heroCanvas.getBoundingClientRect();
  const mx = e.clientX - r.left, my = e.clientY - r.top;
  hPoints.forEach(p => {
    const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
    if (d < 120) {
      p.vx -= dx / d * .35; p.vy -= dy / d * .35;
      const s = Math.hypot(p.vx, p.vy);
      if (s > 2.5) { p.vx = p.vx / s * 2.5; p.vy = p.vy / s * 2.5; }
    }
  });
}, { passive: true });

function drawHero() {
  hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  const isDark = root.getAttribute('data-theme') !== 'light';
  const dot  = isDark ? 'rgba(201,169,110,' : 'rgba(139,94,46,';
  const line = isDark ? 'rgba(201,169,110,' : 'rgba(139,94,46,';

  hPoints.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > heroCanvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > heroCanvas.height) p.vy *= -1;
  });

  for (let i = 0; i < hPoints.length; i++) {
    for (let j = i + 1; j < hPoints.length; j++) {
      const d = Math.hypot(hPoints[i].x - hPoints[j].x, hPoints[i].y - hPoints[j].y);
      if (d < 130) {
        hCtx.beginPath();
        hCtx.strokeStyle = line + (1 - d / 130) * .12 + ')';
        hCtx.lineWidth = .5;
        hCtx.moveTo(hPoints[i].x, hPoints[i].y);
        hCtx.lineTo(hPoints[j].x, hPoints[j].y);
        hCtx.stroke();
      }
    }
  }
  hPoints.forEach(p => {
    hCtx.beginPath();
    hCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    hCtx.fillStyle = dot + p.op + ')';
    hCtx.fill();
  });
  requestAnimationFrame(drawHero);
}
drawHero();

// ─────────────────────────────────────────
// CONTACT CANVAS — Falling Particles
// ─────────────────────────────────────────
const cCanvas = document.getElementById('contactCanvas');
const cCtx = cCanvas.getContext('2d');
function resizeContact() { cCanvas.width = cCanvas.offsetWidth; cCanvas.height = cCanvas.offsetHeight; }
resizeContact();
window.addEventListener('resize', resizeContact, { passive: true });

const cParticles = Array.from({ length: 60 }, () => ({
  x: Math.random() * 2000, y: Math.random() * 800,
  speed: Math.random() * .5 + .15,
  size: Math.random() * 1 + .3,
  op: Math.random() * .25 + .05
}));

function drawContact() {
  cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
  const isDark = root.getAttribute('data-theme') !== 'light';
  const col = isDark ? 'rgba(201,169,110,' : 'rgba(139,94,46,';
  cParticles.forEach(p => {
    p.y += p.speed;
    if (p.y > cCanvas.height) { p.y = 0; p.x = Math.random() * cCanvas.width; }
    cCtx.beginPath();
    cCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    cCtx.fillStyle = col + p.op + ')';
    cCtx.fill();
  });
  requestAnimationFrame(drawContact);
}
drawContact();

// ─────────────────────────────────────────
// CLUSTER MAP — Animated Lines
// ─────────────────────────────────────────
const clCanvas = document.getElementById('clusterCanvas');
const clCtx = clCanvas.getContext('2d');

function resizeCluster() {
  const wrap = clCanvas.parentElement;
  clCanvas.width  = wrap.offsetWidth;
  clCanvas.height = wrap.offsetHeight;
}
resizeCluster();
window.addEventListener('resize', () => { resizeCluster(); }, { passive: true });

// Get center positions of each node relative to the wrap
function getNodeCenter(el) {
  const wrap = clCanvas.parentElement.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2  - wrap.left,
    y: rect.top  + rect.height / 2 - wrap.top
  };
}

let clusterTime = 0;
const pulseNodes = {};  // store per-node pulse phase

function drawCluster() {
  clCtx.clearRect(0, 0, clCanvas.width, clCanvas.height);
  clusterTime += 0.018;

  const isDark = root.getAttribute('data-theme') !== 'light';
  const lineCol  = isDark ? 'rgba(201,169,110,' : 'rgba(139,94,46,';
  const pulseCol = isDark ? 'rgba(201,169,110,' : 'rgba(139,94,46,';

  const centerNode = document.querySelector('[data-id="center"] .node-inner');
  const satellites = document.querySelectorAll('.node-satellite .node-inner');

  if (!centerNode) { requestAnimationFrame(drawCluster); return; }

  const cPos = getNodeCenter(centerNode);

  satellites.forEach((sat, i) => {
    const sPos = getNodeCenter(sat);
    const phase = (clusterTime + i * 1.5) % (Math.PI * 2);

    // Dashed animated line
    const grad = clCtx.createLinearGradient(cPos.x, cPos.y, sPos.x, sPos.y);
    grad.addColorStop(0, isDark ? 'rgba(201,169,110,0.05)' : 'rgba(139,94,46,0.05)');
    grad.addColorStop(0.5, isDark ? 'rgba(201,169,110,0.35)' : 'rgba(139,94,46,0.3)');
    grad.addColorStop(1, isDark ? 'rgba(201,169,110,0.05)' : 'rgba(139,94,46,0.05)');

    clCtx.beginPath();
    clCtx.setLineDash([6, 8]);
    clCtx.lineDashOffset = -clusterTime * 18;
    clCtx.strokeStyle = grad;
    clCtx.lineWidth = 1;
    clCtx.moveTo(cPos.x, cPos.y);
    clCtx.lineTo(sPos.x, sPos.y);
    clCtx.stroke();
    clCtx.setLineDash([]);

    // Travelling dot along the line
    const t = (Math.sin(phase) + 1) / 2;
    const dotX = cPos.x + (sPos.x - cPos.x) * t;
    const dotY = cPos.y + (sPos.y - cPos.y) * t;
    const dotSize = 3 + Math.sin(phase * 2) * 1;

    clCtx.beginPath();
    clCtx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
    clCtx.fillStyle = pulseCol + '.9)';
    clCtx.fill();

    // Glow around travelling dot
    const grd = clCtx.createRadialGradient(dotX, dotY, 0, dotX, dotY, dotSize * 5);
    grd.addColorStop(0, pulseCol + '.4)');
    grd.addColorStop(1, pulseCol + '0)');
    clCtx.beginPath();
    clCtx.arc(dotX, dotY, dotSize * 5, 0, Math.PI * 2);
    clCtx.fillStyle = grd;
    clCtx.fill();
  });

  // Pulse ring around center
  const pulseR = 30 + Math.sin(clusterTime * 2) * 10;
  const pulseAlpha = 0.15 + Math.sin(clusterTime * 2) * 0.08;
  const pGrd = clCtx.createRadialGradient(cPos.x, cPos.y, pulseR * .5, cPos.x, cPos.y, pulseR);
  pGrd.addColorStop(0, pulseCol + pulseAlpha + ')');
  pGrd.addColorStop(1, pulseCol + '0)');
  clCtx.beginPath();
  clCtx.arc(cPos.x, cPos.y, pulseR, 0, Math.PI * 2);
  clCtx.fillStyle = pGrd;
  clCtx.fill();

  requestAnimationFrame(drawCluster);
}

// Start cluster after layout settles
setTimeout(() => { resizeCluster(); drawCluster(); }, 300);
window.addEventListener('resize', () => setTimeout(resizeCluster, 100), { passive: true });

// Node hover highlight
document.querySelectorAll('.cluster-node').forEach(node => {
  node.addEventListener('mouseenter', () => {
    node.querySelector('.node-inner').style.boxShadow = '0 0 40px rgba(201,169,110,0.3)';
  });
  node.addEventListener('mouseleave', () => {
    node.querySelector('.node-inner').style.boxShadow = '';
  });
});

// ─────────────────────────────────────────
// GLOBE 3D CANVAS
// ─────────────────────────────────────────
const globeCanvas = document.getElementById('globeCanvas');
const gCtx = globeCanvas.getContext('2d');

function resizeGlobe() {
  const card = globeCanvas.parentElement;
  globeCanvas.width  = card.offsetWidth;
  globeCanvas.height = card.offsetHeight;
}
resizeGlobe();
window.addEventListener('resize', resizeGlobe, { passive: true });

// Generate geodesic-like points on a sphere
function generateSpherePoints(n) {
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
  }
  return pts;
}

const spherePts = generateSpherePoints(120);
const sphereEdges = [];

// Connect nearby points
for (let i = 0; i < spherePts.length; i++) {
  for (let j = i + 1; j < spherePts.length; j++) {
    const dx = spherePts[i].x - spherePts[j].x;
    const dy = spherePts[i].y - spherePts[j].y;
    const dz = spherePts[i].z - spherePts[j].z;
    const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
    if (d < 0.38) sphereEdges.push([i, j]);
  }
}

let globeRotY = 0, globeRotX = 0.25;
let globeTargetY = 0, globeTargetX = 0.25;
let isDragging = false, lastMX = 0, lastMY = 0;

globeCanvas.addEventListener('mousedown', e => { isDragging = true; lastMX = e.clientX; lastMY = e.clientY; });
window.addEventListener('mouseup',   () => { isDragging = false; });
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  globeTargetY += (e.clientX - lastMX) * .008;
  globeTargetX += (e.clientY - lastMY) * .008;
  lastMX = e.clientX; lastMY = e.clientY;
});

function project3D(pt, rotY, rotX, cx, cy, radius) {
  // Rotate Y
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
  let x = pt.x * cosY - pt.z * sinY;
  let z = pt.x * sinY + pt.z * cosY;
  let y = pt.y;
  // Rotate X
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const y2 = y * cosX - z * sinX;
  const z2 = y * sinX + z * cosX;
  // Perspective
  const persp = 2.2 / (2.2 + z2);
  return { sx: cx + x * radius * persp, sy: cy + y2 * radius * persp, z: z2, persp };
}

function drawGlobe() {
  if (!globeCanvas.parentElement) { requestAnimationFrame(drawGlobe); return; }
  resizeGlobe();
  gCtx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);

  globeRotY += (globeTargetY - globeRotY) * .08;
  globeRotX += (globeTargetX - globeRotX) * .08;
  if (!isDragging) globeTargetY += 0.005;

  const cx = globeCanvas.width / 2;
  const cy = globeCanvas.height / 2;
  const radius = Math.min(cx, cy) * 0.75;

  const isDark = root.getAttribute('data-theme') !== 'light';
  const baseCol = isDark ? '201,169,110' : '139,94,46';

  // Project all points
  const projected = spherePts.map(p => project3D(p, globeRotY, globeRotX, cx, cy, radius));

  // Draw edges (back first)
  sphereEdges.forEach(([i, j]) => {
    const a = projected[i], b = projected[j];
    const avgZ = (a.z + b.z) / 2;
    if (avgZ < 0) {
      const alpha = (0.4 + avgZ * .35) * .25;
      gCtx.beginPath();
      gCtx.strokeStyle = `rgba(${baseCol},${Math.max(0, alpha)})`;
      gCtx.lineWidth = .5;
      gCtx.moveTo(a.sx, a.sy);
      gCtx.lineTo(b.sx, b.sy);
      gCtx.stroke();
    }
  });

  // Draw edges (front)
  sphereEdges.forEach(([i, j]) => {
    const a = projected[i], b = projected[j];
    const avgZ = (a.z + b.z) / 2;
    if (avgZ >= 0) {
      const alpha = .12 + avgZ * .3;
      gCtx.beginPath();
      gCtx.strokeStyle = `rgba(${baseCol},${Math.min(.6, alpha)})`;
      gCtx.lineWidth = .7;
      gCtx.moveTo(a.sx, a.sy);
      gCtx.lineTo(b.sx, b.sy);
      gCtx.stroke();
    }
  });

  // Draw points
  projected.forEach(p => {
    if (p.z < 0) return;
    const alpha = .3 + p.z * .5;
    const size  = (.8 + p.z * .8) * p.persp;
    gCtx.beginPath();
    gCtx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
    gCtx.fillStyle = `rgba(${baseCol},${Math.min(.9, alpha)})`;
    gCtx.fill();
  });

  // Equator glow ring
  const ringGrd = gCtx.createRadialGradient(cx, cy, radius * .85, cx, cy, radius * 1.05);
  ringGrd.addColorStop(0, `rgba(${baseCol},0.06)`);
  ringGrd.addColorStop(1, `rgba(${baseCol},0)`);
  gCtx.beginPath();
  gCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  gCtx.fillStyle = ringGrd;
  gCtx.fill();

  requestAnimationFrame(drawGlobe);
}
drawGlobe();

// ─────────────────────────────────────────
// STATS — Animated Bar Chart in Globe Card
// ─────────────────────────────────────────
function buildStatBars() {
  const container = document.getElementById('statBars');
  if (!container) return;
  const vals = [3, 5, 4, 7, 6, 8, 5, 9, 7, 10];
  vals.forEach((v, i) => {
    const bar = document.createElement('div');
    bar.className = 'stat-bar';
    bar.style.cssText = `
      height: ${v * 4}px;
      background: var(--accent);
      opacity: 0.25;
      width: 6px;
      border-radius: 2px 2px 0 0;
      transition: opacity .3s, height .5s ease;
      transition-delay: ${i * .06}s;
      flex-shrink: 0;
    `;
    container.appendChild(bar);
    setTimeout(() => { bar.style.opacity = '0.7'; }, 800 + i * 60);
  });

  // Animate bars cyclically
  let barFrame = 0;
  setInterval(() => {
    const bars = container.querySelectorAll('.stat-bar');
    bars.forEach((b, i) => {
      const h = 12 + Math.abs(Math.sin((barFrame + i * 0.8) * 0.5)) * 28;
      b.style.height = h + 'px';
    });
    barFrame++;
  }, 600);
}

// ─────────────────────────────────────────
// STATS — Counter Animation
// ─────────────────────────────────────────
function animateCount(el, target, duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// ─────────────────────────────────────────
// STATS — Ring Progress
// ─────────────────────────────────────────
function animateRing(pct = 85) {
  const ring = document.getElementById('ringFill');
  if (!ring) return;
  const circumference = 2 * Math.PI * 50; // r=50
  ring.style.strokeDasharray  = circumference;
  ring.style.strokeDashoffset = circumference;
  setTimeout(() => {
    ring.style.transition = 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)';
    ring.style.strokeDashoffset = circumference * (1 - pct / 100);
  }, 300);
}

// ─────────────────────────────────────────
// STATS — Commit Bars
// ─────────────────────────────────────────
function animateCommitBars() {
  document.querySelectorAll('.commit-bar-fill').forEach(bar => {
    const w = bar.getAttribute('data-w');
    setTimeout(() => { bar.style.width = w + '%'; }, 400);
  });
}

// ─────────────────────────────────────────
// STATS — Timeline fill
// ─────────────────────────────────────────
function animateTimeline() {
  const fill = document.getElementById('timelineFill');
  if (!fill) return;
  setTimeout(() => {
    fill.style.transition = 'width 2.5s cubic-bezier(.4,0,.2,1)';
    fill.style.width = '100%';
    // Activate dots sequentially
    const dots = document.querySelectorAll('.tl-dot');
    dots.forEach((dot, i) => {
      setTimeout(() => dot.classList.add('active'), i * 800);
    });
  }, 500);
}

// ─────────────────────────────────────────
// STATS — Trigger on scroll into view
// ─────────────────────────────────────────
let statsTriggered = false;
const statsSection = document.getElementById('stats');
const statsObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !statsTriggered) {
    statsTriggered = true;

    // Count nums
    document.querySelectorAll('.count-num').forEach(el => {
      animateCount(el, parseInt(el.getAttribute('data-target')));
    });

    // Ring (85% fill for 8+ clients feels natural)
    animateRing(82);

    // Commit bars
    animateCommitBars();

    // Timeline
    animateTimeline();

    // Build + animate globe bar chart
    buildStatBars();
  }
}, { threshold: 0.2 });
if (statsSection) statsObs.observe(statsSection);

// ─────────────────────────────────────────
// FLOATING LABELS FIX
// ─────────────────────────────────────────
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.toggle('has-value', input.value.trim().length > 0);
  });
});

// ─────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const nombre  = document.getElementById('nombre').value.trim();
    const email   = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    formSuccess.classList.remove('visible');
    formError.classList.remove('visible');

    if (!nombre || !email || !mensaje || !emailOk) {
      formError.classList.add('visible');
      contactForm.style.animation = 'shake .4s ease';
      setTimeout(() => { contactForm.style.animation = ''; }, 400);
      return;
    }

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Enviando...';
    await new Promise(r => setTimeout(r, 1500));
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'Enviar mensaje';
    formSuccess.classList.add('visible');
    contactForm.reset();
    document.querySelectorAll('.form-group input,.form-group textarea')
      .forEach(i => i.classList.remove('has-value'));
  });
}

// ─────────────────────────────────────────
// MAGNETIC BUTTON
// ─────────────────────────────────────────
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * .25;
    const y = (e.clientY - r.top  - r.height / 2) * .25;
    btn.style.transform = `translate(${x}px,${y}px)`;
    btn.style.transition = 'transform .1s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
    btn.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
  });
});

// ─────────────────────────────────────────
// TYPING EFFECT — eyebrow text
// ─────────────────────────────────────────
const eyebrow = document.querySelector('.eyebrow-text');
if (eyebrow) {
  const txt = eyebrow.textContent; eyebrow.textContent = ''; let i = 0;
  setTimeout(() => {
    const iv = setInterval(() => {
      if (i < txt.length) { eyebrow.textContent += txt[i++]; }
      else clearInterval(iv);
    }, 42);
  }, 500);
}

// ─────────────────────────────────────────
// INJECT EXTRA STYLES
// ─────────────────────────────────────────
const extraStyle = document.createElement('style');
extraStyle.textContent = `
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
  .tl-dot.active span{color:var(--text)!important}
  .tl-dot.active em{color:var(--accent)!important}
  #globeCanvas{cursor:grab}
  #globeCanvas:active{cursor:grabbing}
  .nav-link.active{color:var(--text)!important}
  .nav-link.active::after{width:100%!important}
  .commit-bar-fill{transition:width 1.8s cubic-bezier(.4,0,.2,1)!important}
`;
document.head.appendChild(extraStyle);

// ─────────────────────────────────────────
// PAGE LOAD FADE
// ─────────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
const frames = [
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#020305"/>
<text x="10" y="38" fill="#00FF9C" font-size="18" font-family="monospace">>_</text>
</svg>`,

`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#020305"/>
<text x="10" y="38" fill="#00FF9C" font-size="18" font-family="monospace">J_</text>
</svg>`,

`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#020305"/>
<text x="10" y="38" fill="#00FF9C" font-size="18" font-family="monospace">/J</text>
</svg>`,

`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#020305"/>
<path d="M38 14 V34 C38 46 30 52 22 52 C16 52 12 48 11 42"
      stroke="#00FF9C"
      stroke-width="3"
      fill="none"
      stroke-linecap="round"/>
</svg>`
];
let i = 0;
let cycles = 0;
const icon = document.getElementById("favicon");

const anim = setInterval(() => {
  const svg = frames[i];
  const url = "data:image/svg+xml," + encodeURIComponent(svg);
  icon.href = url;

  i++;

  if (i === frames.length) {
    i = 0;
    cycles++;
  }

  // después de unos ciclos se queda fijo en la J final
  if (cycles === 3) {
    clearInterval(anim);

    const final = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="#020305"/>
    <path d="M38 14 V34 C38 46 30 52 22 52 C16 52 12 48 11 42"
          stroke="#00FF9C"
          stroke-width="3"
          fill="none"
          stroke-linecap="round"/>
    </svg>`;

    icon.href = "data:image/svg+xml," + encodeURIComponent(final);
  }

}, 500);