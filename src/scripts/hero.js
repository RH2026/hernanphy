/*
 * Portada interactiva.
 * 1. Campo de cursores (viga en I) en <canvas>: se orientan y encienden
 *    hacia el puntero; una onda lenta los recorre como sonido; cada clic o
 *    toque lanza un pulso circular. En reposo, pulsos suaves cada ~2 s.
 * 2. Nombre: decodifica DEZ ↔ PHY con caracteres de código.
 * 3. Roles: se teclean y borran uno tras otro.
 * Todo se detiene cuando la portada sale de pantalla o la pestaña se oculta,
 * y queda quieto con "reducir movimiento".
 */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  fitName(hero);
  initField(hero);
  initName(hero);
  initRoles(hero);
}

/* ---------------- Campo de cursores ---------------- */
function initField(hero) {
  const canvas = hero.querySelector('[data-field]');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;

  const COL_DIM = [168, 174, 181];   // titanio
  const COL_LIT = [242, 240, 234];   // marfil
  let W = 0, H = 0, dpr = 1, gap = 28, cells = [];
  const pointer = { x: -9999, y: -9999, sx: -9999, sy: -9999, active: false, last: 0 };
  const pulses = [];
  let running = false, raf = 0, lastAuto = 0;

  const resize = () => {
    const r = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.round(r.width);
    H = Math.round(r.height);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    gap = W < 700 ? 22 : 28;
    cells = [];
    const ox = ((W % gap) + gap) / 2, oy = ((H % gap) + gap) / 2;
    for (let y = oy; y < H; y += gap) for (let x = ox; x < W; x += gap) cells.push({ x, y, e: 0 });
    if (!running) draw(performance.now());
  };

  const local = (cx, cy) => {
    const r = hero.getBoundingClientRect();
    return { x: cx - r.left, y: cy - r.top };
  };

  const move = (cx, cy) => {
    const p = local(cx, cy);
    pointer.x = p.x; pointer.y = p.y;
    if (!pointer.active) { pointer.sx = p.x; pointer.sy = p.y; }
    pointer.active = true; pointer.last = performance.now();
  };
  const pulse = (x, y, strength = 1) => {
    pulses.push({ x, y, t0: performance.now(), s: strength });
    if (pulses.length > 8) pulses.shift();
  };

  hero.addEventListener('pointermove', (e) => move(e.clientX, e.clientY), { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.active = false; });
  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    const p = local(e.clientX, e.clientY);
    move(e.clientX, e.clientY);
    pulse(p.x, p.y, 1);
    const hint = hero.querySelector('[data-hint]');
    if (hint) hint.classList.add('is-gone');
  });

  function draw(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // suavizado del puntero
    pointer.sx += (pointer.x - pointer.sx) * 0.14;
    pointer.sy += (pointer.y - pointer.sy) * 0.14;
    const idle = !pointer.active || t - pointer.last > 4000;
    const sigma = Math.max(110, Math.min(W, H) * 0.16);
    const s2 = 2 * sigma * sigma;

    // pulsos automáticos en reposo
    if (!reduce && idle && t - lastAuto > 2100) {
      lastAuto = t;
      pulse(W * (0.55 + Math.random() * 0.4), H * (0.12 + Math.random() * 0.5), 0.55);
    }
    for (let i = pulses.length - 1; i >= 0; i--) if (t - pulses[i].t0 > 2200) pulses.splice(i, 1);

    const k = reduce ? 0 : t;
    for (const c of cells) {
      let f = 0, ang = 0;
      if (pointer.active) {
        const dx = c.x - pointer.sx, dy = c.y - pointer.sy;
        f = Math.exp(-(dx * dx + dy * dy) / s2);
        ang = Math.atan2(dy, dx) * f; // se inclinan alrededor del puntero
      }
      for (const p of pulses) {
        const age = t - p.t0, r = age * 0.55;
        const d = Math.hypot(c.x - p.x, c.y - p.y);
        const band = Math.exp(-((d - r) * (d - r)) / 1800);
        f += band * p.s * (1 - age / 2200);
      }
      // onda lenta que atraviesa el campo
      const w = Math.sin(c.x * 0.011 - k * 0.0011 + Math.sin(c.y * 0.009 + k * 0.0005) * 1.6);
      const e = Math.min(1, f + (w + 1) * 0.06);
      c.e += (e - c.e) * 0.25;

      const h = 5 + c.e * 20;
      const a = 0.1 + c.e * 0.8;
      const mix = Math.min(1, c.e * 1.4);
      const R = COL_DIM[0] + (COL_LIT[0] - COL_DIM[0]) * mix;
      const G = COL_DIM[1] + (COL_LIT[1] - COL_DIM[1]) * mix;
      const B = COL_DIM[2] + (COL_LIT[2] - COL_DIM[2]) * mix;
      ctx.fillStyle = `rgba(${R | 0},${G | 0},${B | 0},${a.toFixed(3)})`;

      ctx.setTransform(dpr, 0, 0, dpr, c.x * dpr, c.y * dpr);
      if (ang) ctx.rotate(ang * 0.9);
      const sw = 1.2 + c.e * 0.8;          // grosor del asta
      const cap = 3 + c.e * 4;             // ancho de las alas
      ctx.fillRect(-sw / 2, -h / 2, sw, h);
      if (c.e > 0.18) {
        ctx.fillRect(-cap / 2, -h / 2, cap, sw);
        ctx.fillRect(-cap / 2, h / 2 - sw, cap, sw);
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  const loop = (t) => {
    draw(t);
    raf = running ? requestAnimationFrame(loop) : 0;
  };
  const start = () => { if (!running && !reduce) { running = true; raf = requestAnimationFrame(loop); } };
  const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop())).observe(hero);
  } else start();
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}

/* ---------------- Nombre a todo el ancho ---------------- */
function fitName(hero) {
  const name = hero.querySelector('[data-name]');
  if (!name) return;
  const fit = () => {
    const box = name.parentElement;
    const cs = getComputedStyle(box);
    const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    name.style.fontSize = '100px';
    const w = name.scrollWidth;
    if (!w) return;
    const maxByHeight = window.innerHeight * 0.34;
    name.style.fontSize = `${Math.min((100 * avail * 0.965) / w, maxByHeight)}px`;
  };
  fit();
  window.addEventListener('resize', fit, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
}

/* ---------------- Nombre: DEZ ↔ PHY ---------------- */
function initName(hero) {
  const name = hero.querySelector('[data-name]');
  const tail = name && name.querySelector('[data-tail]');
  if (!tail) return;
  const A = name.dataset.a, B = name.dataset.b;
  const chars = tail.querySelectorAll('.hx__ch');
  const GLYPHS = '01<>/{}[]=+*#$%&;:';
  let showing = A, timer = 0, frame = 0;

  const decode = (to) => {
    if (to === showing) return;
    showing = to;
    name.classList.toggle('is-alias', to === B);
    if (reduce) { chars.forEach((c, i) => (c.textContent = to[i])); return; }
    cancelAnimationFrame(frame);
    const t0 = performance.now();
    const step = (t) => {
      let done = true;
      chars.forEach((c, i) => {
        const settle = 260 + i * 140;
        if (t - t0 >= settle) c.textContent = to[i];
        else { done = false; c.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0]; }
      });
      if (!done) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  };

  const cycle = () => {
    clearTimeout(timer);
    timer = setTimeout(() => { decode(showing === A ? B : A); cycle(); }, showing === A ? 4200 : 2600);
  };

  name.addEventListener('pointerenter', () => { clearTimeout(timer); decode(B); });
  name.addEventListener('pointerleave', () => { decode(A); cycle(); });
  if (!reduce) setTimeout(cycle, 1400);
}

/* ---------------- Roles tecleados ---------------- */
function initRoles(hero) {
  const el = hero.querySelector('[data-typed]');
  if (!el) return;
  let roles = [];
  try { roles = JSON.parse(el.dataset.roles); } catch { return; }
  if (reduce || roles.length < 2) { el.textContent = roles.join(' · '); return; }
  let i = 0, n = roles[0].length, deleting = false;
  const tick = () => {
    const word = roles[i];
    if (!deleting) {
      n++;
      el.textContent = word.slice(0, n);
      if (n >= word.length) { deleting = true; return setTimeout(tick, 1900); }
      return setTimeout(tick, 85);
    }
    n--;
    el.textContent = word.slice(0, Math.max(0, n));
    if (n <= 0) { deleting = false; i = (i + 1) % roles.length; return setTimeout(tick, 260); }
    setTimeout(tick, 45);
  };
  setTimeout(() => { deleting = true; tick(); }, 2200);
}
