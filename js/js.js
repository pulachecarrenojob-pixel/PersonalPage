/* ════════════════════════════════════════════════════
   PORTFOLIO JS — Job Pulache Carreño
════════════════════════════════════════════════════ */

// ─────────────────────────────────────────
// CURSOR
// ─────────────────────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
});
(function loopFollower() {
  followerX += (mouseX - followerX) * 0.11;
  followerY += (mouseY - followerY) * 0.11;
  follower.style.left = followerX + 'px'; follower.style.top = followerY + 'px';
  requestAnimationFrame(loopFollower);
})();
document.querySelectorAll('a,button,.service-card,.research-item,.project-card,.stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('expand'); follower.classList.add('expand'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('expand'); follower.classList.remove('expand'); });
});
if ('ontouchstart' in window) {
  cursor.style.display = 'none'; follower.style.display = 'none';
  document.body.style.cursor = 'auto';
  document.querySelectorAll('button,a,.mm-link,.mm-cv').forEach(el => el.style.cursor = 'pointer');
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
// NAV SHADOW
// ─────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').style.boxShadow = window.scrollY > 80 ? '0 4px 40px rgba(0,0,0,.35)' : 'none';
}, { passive: true });

// ─────────────────────────────────────────
// SMOOTH ANCHOR
// ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return; e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
  });
});

// ─────────────────────────────────────────
// THEME
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
// MOBILE MENU — creative version
// ─────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  if (isOpen) startMmCanvas();
});

// Close on link click
document.querySelectorAll('.mm-link').forEach(l => {
  l.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Mobile menu background canvas — particle field
let mmAnimating = false;
function startMmCanvas() {
  if (mmAnimating) return;
  mmAnimating = true;
  const mc  = document.getElementById('mmCanvas');
  const mCtx = mc.getContext('2d');
  function resizeMm() { mc.width = mc.offsetWidth; mc.height = mc.offsetHeight; }
  resizeMm();

  const pts = Array.from({ length: 50 }, () => ({
    x: Math.random() * mc.width,
    y: Math.random() * mc.height,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    s: Math.random() * 1.2 + .3,
    o: Math.random() * .3 + .05
  }));

  function drawMm() {
    if (!mobileMenu.classList.contains('open')) { mmAnimating = false; return; }
    mCtx.clearRect(0, 0, mc.width, mc.height);
    const isDark = root.getAttribute('data-theme') !== 'light';
    const col = isDark ? 'rgba(201,169,110,' : 'rgba(139,94,46,';
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > mc.width)  p.vx *= -1;
      if (p.y < 0 || p.y > mc.height) p.vy *= -1;
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 100) {
          mCtx.beginPath();
          mCtx.strokeStyle = col + (1 - d / 100) * .1 + ')';
          mCtx.lineWidth = .5;
          mCtx.moveTo(pts[i].x, pts[i].y);
          mCtx.lineTo(pts[j].x, pts[j].y);
          mCtx.stroke();
        }
      }
    }
    pts.forEach(p => {
      mCtx.beginPath();
      mCtx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      mCtx.fillStyle = col + p.o + ')';
      mCtx.fill();
    });
    requestAnimationFrame(drawMm);
  }
  drawMm();
}

// ─────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));

// ─────────────────────────────────────────
// ACTIVE NAV
// ─────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.3 }).observe && document.querySelectorAll('section[id],main[id]').forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.35 }).observe(s);
});

// ─────────────────────────────────────────
// HERO CANVAS
// ─────────────────────────────────────────
const heroCanvas = document.getElementById('heroCanvas');
const hCtx = heroCanvas.getContext('2d');
function resizeHero() { heroCanvas.width = heroCanvas.offsetWidth; heroCanvas.height = heroCanvas.offsetHeight; }
resizeHero();
window.addEventListener('resize', resizeHero, { passive: true });

const hPts = Array.from({ length: 90 }, () => ({
  x: Math.random() * heroCanvas.width, y: Math.random() * heroCanvas.height,
  vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
  s: Math.random() * 1.5 + .4, o: Math.random() * .4 + .1
}));

heroCanvas.addEventListener('mousemove', e => {
  const r = heroCanvas.getBoundingClientRect();
  const mx = e.clientX - r.left, my = e.clientY - r.top;
  hPts.forEach(p => {
    const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
    if (d < 120) { p.vx -= dx / d * .3; p.vy -= dy / d * .3; }
  });
}, { passive: true });

(function drawHero() {
  hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  const isDark = root.getAttribute('data-theme') !== 'light';
  const col = isDark ? 'rgba(201,169,110,' : 'rgba(139,94,46,';
  hPts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > heroCanvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > heroCanvas.height) p.vy *= -1;
  });
  for (let i = 0; i < hPts.length; i++) {
    for (let j = i + 1; j < hPts.length; j++) {
      const d = Math.hypot(hPts[i].x - hPts[j].x, hPts[i].y - hPts[j].y);
      if (d < 130) { hCtx.beginPath(); hCtx.strokeStyle = col + (1 - d / 130) * .12 + ')'; hCtx.lineWidth = .5; hCtx.moveTo(hPts[i].x, hPts[i].y); hCtx.lineTo(hPts[j].x, hPts[j].y); hCtx.stroke(); }
    }
  }
  hPts.forEach(p => { hCtx.beginPath(); hCtx.arc(p.x, p.y, p.s, 0, Math.PI * 2); hCtx.fillStyle = col + p.o + ')'; hCtx.fill(); });
  requestAnimationFrame(drawHero);
})();

// ─────────────────────────────────────────
// CONTACT CANVAS
// ─────────────────────────────────────────
const cCanvas = document.getElementById('contactCanvas');
const cCtx = cCanvas.getContext('2d');
function resizeContact() { cCanvas.width = cCanvas.offsetWidth; cCanvas.height = cCanvas.offsetHeight; }
resizeContact();
window.addEventListener('resize', resizeContact, { passive: true });
const cPts = Array.from({ length: 55 }, () => ({ x: Math.random() * 2000, y: Math.random() * 800, s: Math.random() * .5 + .15, sz: Math.random() + .3, o: Math.random() * .2 + .05 }));
(function drawContact() {
  cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
  const col = root.getAttribute('data-theme') !== 'light' ? 'rgba(201,169,110,' : 'rgba(139,94,46,';
  cPts.forEach(p => { p.y += p.s; if (p.y > cCanvas.height) { p.y = 0; p.x = Math.random() * cCanvas.width; } cCtx.beginPath(); cCtx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); cCtx.fillStyle = col + p.o + ')'; cCtx.fill(); });
  requestAnimationFrame(drawContact);
})();

// ─────────────────────────────────────────
// CLUSTER MAP — HTML nodes + SVG animated lines
// ─────────────────────────────────────────
(function initClusterMap() {
  const svg      = document.getElementById('clusterSvg');
  const centerEl = document.getElementById('cn-center');
  const satellites = [
    document.getElementById('cn-ia'),
    document.getElementById('cn-web'),
    document.getElementById('cn-data'),
    document.getElementById('cn-infra'),
  ];

  if (!svg || !centerEl) return; // safety guard

  // Build one <line> + one animated <circle> per satellite
  const lines = [];
  const dots  = [];

  satellites.forEach((sat, i) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke-dasharray', '5 10');
    line.setAttribute('stroke-linecap', 'round');
    line.style.cssText = `stroke:var(--accent);stroke-width:1;opacity:.25;stroke-dashoffset:0`;
    svg.appendChild(line);
    lines.push(line);

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '3');
    dot.style.cssText = `fill:var(--accent);opacity:.85`;
    svg.appendChild(dot);
    dots.push(dot);
  });

  // Helper: get center of an element relative to the SVG container
  function center(el) {
    const wrapRect = svg.parentElement.getBoundingClientRect();
    const rect     = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width  / 2 - wrapRect.left,
      y: rect.top  + rect.height / 2 - wrapRect.top,
    };
  }

  let t = 0;
  let dashOffset = 0;

  function animateCluster() {
    t += 0.012;
    dashOffset -= 0.35;

    // Update SVG size to match container
    const wrap = svg.parentElement;
    svg.setAttribute('width',  wrap.offsetWidth);
    svg.setAttribute('height', wrap.offsetHeight);

    const cPos = center(centerEl);

    satellites.forEach((sat, i) => {
      const sPos  = center(sat);
      const phase = (t + i * 1.6) % (Math.PI * 2);
      const prog  = (Math.sin(phase) + 1) / 2;

      // Update line endpoints
      lines[i].setAttribute('x1', cPos.x);
      lines[i].setAttribute('y1', cPos.y);
      lines[i].setAttribute('x2', sPos.x);
      lines[i].setAttribute('y2', sPos.y);
      lines[i].style.strokeDashoffset = dashOffset;

      // Travelling dot
      const dx   = sPos.x - cPos.x;
      const dy   = sPos.y - cPos.y;
      dots[i].setAttribute('cx', cPos.x + dx * prog);
      dots[i].setAttribute('cy', cPos.y + dy * prog);
    });

    requestAnimationFrame(animateCluster);
  }

  // Wait for layout then start
  setTimeout(animateCluster, 200);

  // Hover interactions on nodes
  const allNodes = [centerEl, ...satellites];
  allNodes.forEach((node, ni) => {
    node.addEventListener('mouseenter', () => {
      node.classList.add('cm-hovered');
      // Brighten connected lines
      if (ni === 0) {
        lines.forEach(l => { l.style.opacity = '.6'; l.style.strokeWidth = '1.5'; });
      } else {
        const li = ni - 1;
        if (lines[li]) { lines[li].style.opacity = '.7'; lines[li].style.strokeWidth = '1.5'; }
      }
    });
    node.addEventListener('mouseleave', () => {
      node.classList.remove('cm-hovered');
      lines.forEach(l => { l.style.opacity = '.25'; l.style.strokeWidth = '1'; });
    });
  });
})();

// ─────────────────────────────────────────
// GLOBE 3D
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

function genSphere(n) {
  const pts = []; const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), t = phi * i;
    pts.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
  }
  return pts;
}
const sPts = genSphere(120);
const sEdges = [];
for (let i = 0; i < sPts.length; i++)
  for (let j = i + 1; j < sPts.length; j++) {
    const d = Math.hypot(sPts[i].x - sPts[j].x, sPts[i].y - sPts[j].y, sPts[i].z - sPts[j].z);
    if (d < 0.38) sEdges.push([i, j]);
  }

let gRotY = 0, gRotX = .25, gTgtY = 0, gTgtX = .25;
let gDrag = false, gLX = 0, gLY = 0;

globeCanvas.addEventListener('mousedown', e => { gDrag = true; gLX = e.clientX; gLY = e.clientY; });
window.addEventListener('mouseup', () => { gDrag = false; });
window.addEventListener('mousemove', e => {
  if (!gDrag) return;
  gTgtY += (e.clientX - gLX) * .008; gTgtX += (e.clientY - gLY) * .008;
  gLX = e.clientX; gLY = e.clientY;
});

// Touch drag on globe
globeCanvas.addEventListener('touchstart', e => { gDrag = true; gLX = e.touches[0].clientX; gLY = e.touches[0].clientY; }, { passive: true });
globeCanvas.addEventListener('touchmove',  e => {
  if (!gDrag) return;
  gTgtY += (e.touches[0].clientX - gLX) * .008; gTgtX += (e.touches[0].clientY - gLY) * .008;
  gLX = e.touches[0].clientX; gLY = e.touches[0].clientY;
}, { passive: true });
globeCanvas.addEventListener('touchend',   () => { gDrag = false; });

function proj3D(p, rotY, rotX, cx, cy, rad) {
  const cY = Math.cos(rotY), sY = Math.sin(rotY);
  let x = p.x * cY - p.z * sY, z = p.x * sY + p.z * cY, y = p.y;
  const cX = Math.cos(rotX), sX = Math.sin(rotX);
  const y2 = y * cX - z * sX, z2 = y * sX + z * cX;
  const per = 2.2 / (2.2 + z2);
  return { sx: cx + x * rad * per, sy: cy + y2 * rad * per, z: z2, per };
}

(function drawGlobe() {
  resizeGlobe();
  gCtx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);
  gRotY += (gTgtY - gRotY) * .08; gRotX += (gTgtX - gRotX) * .08;
  if (!gDrag) gTgtY += .005;

  const cx = globeCanvas.width / 2, cy = globeCanvas.height / 2;
  const rad = Math.min(cx, cy) * 0.72;
  const isDark = root.getAttribute('data-theme') !== 'light';
  const rgb = isDark ? '201,169,110' : '139,94,46';

  const proj = sPts.map(p => proj3D(p, gRotY, gRotX, cx, cy, rad));

  sEdges.forEach(([i, j]) => {
    const a = proj[i], b = proj[j], avgZ = (a.z + b.z) / 2;
    if (avgZ < 0) {
      gCtx.beginPath(); gCtx.strokeStyle = `rgba(${rgb},${Math.max(0, (0.4 + avgZ * .35) * .22)})`; gCtx.lineWidth = .4; gCtx.moveTo(a.sx, a.sy); gCtx.lineTo(b.sx, b.sy); gCtx.stroke();
    }
  });
  sEdges.forEach(([i, j]) => {
    const a = proj[i], b = proj[j], avgZ = (a.z + b.z) / 2;
    if (avgZ >= 0) {
      gCtx.beginPath(); gCtx.strokeStyle = `rgba(${rgb},${Math.min(.55, .1 + avgZ * .3)})`; gCtx.lineWidth = .65; gCtx.moveTo(a.sx, a.sy); gCtx.lineTo(b.sx, b.sy); gCtx.stroke();
    }
  });
  proj.forEach(p => {
    if (p.z < 0) return;
    gCtx.beginPath(); gCtx.arc(p.sx, p.sy, (.7 + p.z * .7) * p.per, 0, Math.PI * 2);
    gCtx.fillStyle = `rgba(${rgb},${Math.min(.9, .3 + p.z * .5)})`; gCtx.fill();
  });

  requestAnimationFrame(drawGlobe);
})();

// ─────────────────────────────────────────
// STATS — Bar chart
// ─────────────────────────────────────────
function buildStatBars() {
  const container = document.getElementById('statBars');
  if (!container) return;
  const vals = [3, 5, 4, 7, 6, 8, 5, 9, 7, 10];
  vals.forEach((v, i) => {
    const bar = document.createElement('div');
    bar.style.cssText = `height:${v * 3.5}px;background:var(--accent);opacity:.22;width:7px;border-radius:2px 2px 0 0;transition:opacity .3s,height .5s ease;transition-delay:${i * .06}s;flex-shrink:0;`;
    container.appendChild(bar);
    setTimeout(() => { bar.style.opacity = '.75'; }, 600 + i * 60);
  });
  let frame = 0;
  setInterval(() => {
    container.querySelectorAll('div').forEach((b, i) => {
      b.style.height = (10 + Math.abs(Math.sin((frame + i * .8) * .45)) * 26) + 'px';
    });
    frame++;
  }, 550);
}

// ─────────────────────────────────────────
// STATS — Counter
// ─────────────────────────────────────────
function animateCount(el, target, dur = 1800) {
  let start = 0;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(step); else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// ─────────────────────────────────────────
// STATS — on scroll trigger
// ─────────────────────────────────────────
let statsTriggered = false;
const statsEl = document.getElementById('stats');
if (statsEl) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !statsTriggered) {
      statsTriggered = true;
      document.querySelectorAll('.count-num').forEach(el => animateCount(el, parseInt(el.getAttribute('data-target'))));

      // Ring
      const ring = document.getElementById('ringFill');
      if (ring) { const c = 2 * Math.PI * 50; ring.style.strokeDasharray = c; ring.style.strokeDashoffset = c; setTimeout(() => { ring.style.transition = 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)'; ring.style.strokeDashoffset = c * (1 - .82); }, 300); }

      // Commit bars
      document.querySelectorAll('.commit-bar-fill').forEach(b => setTimeout(() => { b.style.width = b.getAttribute('data-w') + '%'; }, 400));

      // Timeline
      const fill = document.getElementById('timelineFill');
      if (fill) { setTimeout(() => { fill.style.transition = 'width 2.5s cubic-bezier(.4,0,.2,1)'; fill.style.width = '100%'; document.querySelectorAll('.tl-dot').forEach((d, i) => setTimeout(() => d.classList.add('active'), i * 800)); }, 500); }

      buildStatBars();
    }
  }, { threshold: 0.2 }).observe(statsEl);
}

// ─────────────────────────────────────────
// FORM
// ─────────────────────────────────────────
document.querySelectorAll('.form-group input,.form-group textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.toggle('has-value', el.value.trim().length > 0));
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const nombre  = document.getElementById('nombre').value.trim();
    const email   = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    document.getElementById('formSuccess').classList.remove('visible');
    document.getElementById('formError').classList.remove('visible');
    if (!nombre || !email || !mensaje || !ok) {
      document.getElementById('formError').classList.add('visible');
      contactForm.style.animation = 'shake .4s ease';
      setTimeout(() => { contactForm.style.animation = ''; }, 400);
      return;
    }
    const btn = document.getElementById('submitBtn');
    btn.disabled = true; btn.querySelector('.btn-text').textContent = 'Enviando...';
    await new Promise(r => setTimeout(r, 1500));
    btn.disabled = false; btn.querySelector('.btn-text').textContent = 'Enviar mensaje';
    document.getElementById('formSuccess').classList.add('visible');
    contactForm.reset();
    document.querySelectorAll('.form-group input,.form-group textarea').forEach(i => i.classList.remove('has-value'));
  });
}

// ─────────────────────────────────────────
// MAGNETIC BUTTON
// ─────────────────────────────────────────
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .25}px)`;
    btn.style.transition = 'transform .1s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)'; btn.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
  });
});

// ─────────────────────────────────────────
// EYEBROW TYPEWRITER
// ─────────────────────────────────────────
const eyebrow = document.querySelector('.eyebrow-text');
if (eyebrow) {
  const txt = eyebrow.textContent; eyebrow.textContent = ''; let i = 0;
  setTimeout(() => { const iv = setInterval(() => { if (i < txt.length) eyebrow.textContent += txt[i++]; else clearInterval(iv); }, 42); }, 500);
}

// ─────────────────────────────────────────
// EXTRA STYLES
// ─────────────────────────────────────────
const s = document.createElement('style');
s.textContent = `
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
  .tl-dot.active span{color:var(--text)!important}
  .tl-dot.active em{color:var(--accent)!important}
  #globeCanvas{cursor:grab} #globeCanvas:active{cursor:grabbing}
  .nav-link.active{color:var(--text)!important} .nav-link.active::after{width:100%!important}
  .commit-bar-fill{transition:width 1.8s cubic-bezier(.4,0,.2,1)!important}
  #clusterCanvas{display:block}
`;
document.head.appendChild(s);

// PAGE LOAD
window.addEventListener('load', () => {
  document.body.style.opacity = '0'; document.body.style.transition = 'opacity .5s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});

//icon - logo animated in page
const canvas = document.createElement("canvas");
canvas.width = 64;
canvas.height = 64;
const ctx = canvas.getContext("2d");

const favicon = document.getElementById("favicon");

/* =========================
   ESTADO DEL SISTEMA
========================= */
let t = 0;
let activity = 0;      // actividad usuario
let focus = 1;         // pestaña activa
let pulse = 0;

/* =========================
   EVENTOS DEL USUARIO
========================= */
document.addEventListener("mousemove", () => activity = 1);
document.addEventListener("keydown", () => activity = 1);

setInterval(() => {
    activity *= 0.92; // decay suave (memoria)
}, 80);

document.addEventListener("visibilitychange", () => {
    focus = document.hidden ? 0 : 1;
});

/* =========================
   FUNCIONES DE SISTEMA
========================= */
function noise(x) {
    return Math.sin(x) * 0.6 + Math.sin(x * 1.7) * 0.3;
}

function stateEngine() {
    const energy = activity + focus + noise(t);

    if (energy > 1.5) return "SURGE";
    if (energy > 1.0) return "ACTIVE";
    if (energy > 0.3) return "IDLE";
    return "DORMANT";
}

function glitch(prob) {
    return Math.random() < prob ? (Math.random() * 4 - 2) : 0;
}

/* =========================
   RENDER CORE
========================= */
function draw() {
    t += 0.07;

    const state = stateEngine();

    // reset
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 64, 64);

    /* =========================
       PALETA DINÁMICA
    ========================= */
    let color = "#00ff88";
    let glow = 8;

    if (state === "SURGE") {
        color = "#ff0033";   // peligro / singularidad
        glow = 18;
    } else if (state === "ACTIVE") {
        color = "#00ffcc";
        glow = 12;
    } else if (state === "IDLE") {
        color = "#00ff88";
        glow = 9;
    } else {
        color = "#006644";
        glow = 5;
    }

    /* =========================
       LATIDO (HEARTBEAT)
    ========================= */
    pulse = Math.sin(t * (2 + activity * 6)) * 2;

    ctx.shadowColor = color;
    ctx.shadowBlur = glow + pulse;

    ctx.fillStyle = color;
    ctx.font = "bold 44px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    /* =========================
       GLITCH CONTROLADO
    ========================= */
    const g = state === "SURGE" ? 0.6 : 0.2;

    const gx = glitch(g) + noise(t * 1.3);
    const gy = glitch(g) + noise(t * 1.1);

    /* =========================
       LETRA PRINCIPAL (J)
    ========================= */
    ctx.fillText("J", 32 + gx, 34 + gy);

    /* =========================
       SOMBRA DIGITAL (eco)
    ========================= */
    if (state !== "DORMANT") {
        ctx.fillStyle = color + "55";
        ctx.fillText("J", 32 - gx, 34 - gy);
    }

    /* =========================
       CORRUPCIÓN (SOLO EN SURGE)
    ========================= */
    if (state === "SURGE") {
        for (let i = 0; i < 14; i++) {
            ctx.fillStyle = color;
            ctx.fillRect(
                32 + Math.sin(t * i) * 22,
                32 + Math.cos(t * i * 1.4) * 22,
                1,
                1
            );
        }

        // micro blackout (fallo de sistema)
        if (Math.random() < 0.08) {
            ctx.fillStyle = "rgba(0,0,0,0.4)";
            ctx.fillRect(0, 0, 64, 64);
        }
    }

    /* =========================
       UPDATE FAVICON
    ========================= */
    favicon.href = canvas.toDataURL("image/png");
}

setInterval(draw, 50);