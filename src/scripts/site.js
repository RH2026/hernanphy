/*
 * Interacción del sitio: menú móvil, monolito con luz, reproductor fijo,
 * enlaces internos sin "#" en la dirección, aparición al hacer scroll y
 * sección activa en el menú. Sin dependencias.
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Menú móvil ---------- */
function initMenu() {
  const btn = document.querySelector('[data-menu-btn]');
  const menu = document.querySelector('[data-menu]');
  if (!btn || !menu) return;
  const label = btn.querySelector('[data-menu-label]');
  const links = menu.querySelectorAll('[data-menu-link]');

  const set = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    links.forEach((a) => a.setAttribute('tabindex', open ? '0' : '-1'));
    if (label) label.textContent = open ? 'Cerrar' : 'Menú';
    if (open && links[0]) links[0].focus({ preventScroll: true });
  };

  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  links.forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      set(false);
      btn.focus();
    }
  });
  window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
    if (e.matches) set(false);
  });
}

/* ---------- Enlaces internos sin "#" en la dirección ---------- */
function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  });
}

/* ---------- Monolito con luz ----------
 * La luz sigue al cursor (o al dedo). Si nadie la mueve, deriva sola como
 * un sol lento. Solo se anima mientras la portada está en pantalla. */
function initMonolith() {
  const scenes = Array.from(document.querySelectorAll('[data-monolith]'));
  if (!scenes.length) return;

  const apply = (el, lx, ly) => {
    const skew = Math.max(-62, Math.min(62, (0.5 - lx) * 130));
    const len = Math.max(0.25, Math.min(1.1, 0.25 + ly * 1.2));
    el.style.setProperty('--lx', lx.toFixed(4));
    el.style.setProperty('--ly', ly.toFixed(4));
    el.style.setProperty('--skew', `${skew.toFixed(2)}deg`);
    el.style.setProperty('--len', len.toFixed(3));
    el.style.setProperty('--lumL', (0.6 + (1 - lx) * 0.85).toFixed(3));
    el.style.setProperty('--lumR', (0.55 + lx * 0.85).toFixed(3));
  };

  // Posición de reposo (luz alta a la izquierda).
  scenes.forEach((el) => apply(el, 0.24, 0.2));
  if (reduceMotion.matches) return;

  const state = scenes.map(() => ({ x: 0.24, y: 0.2, tx: 0.24, ty: 0.2 }));
  let pointer = null; // { x, y } en pantalla
  let lastMove = 0;
  let visible = true;
  let raf = 0;

  const onMove = (x, y) => {
    pointer = { x, y };
    lastMove = performance.now();
  };
  window.addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', (e) => e.touches[0] && onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

  const tick = (t) => {
    const idle = !pointer || t - lastMove > 3500;
    scenes.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const s = state[i];
      if (idle) {
        s.tx = 0.5 + 0.38 * Math.sin(t / 7000);
        s.ty = 0.22 + 0.12 * Math.cos(t / 9000);
      } else {
        s.tx = (pointer.x - r.left) / r.width;
        s.ty = (pointer.y - r.top) / r.height;
      }
      s.tx = Math.max(-0.1, Math.min(1.1, s.tx));
      s.ty = Math.max(0.04, Math.min(0.62, s.ty));
      const k = idle ? 0.02 : 0.09;
      s.x += (s.tx - s.x) * k;
      s.y += (s.ty - s.y) * k;
      apply(el, s.x, s.y);
    });
    raf = visible ? requestAnimationFrame(tick) : 0;
  };

  const hero = document.getElementById('inicio');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    }).observe(hero);
  }
  raf = requestAnimationFrame(tick);
}

/* ---------- Reproductores ----------
 * Spotify, SoundCloud y Mixcloud suenan en una barra fija abajo que sigue
 * sonando mientras se recorre el sitio. YouTube se abre en su lugar.
 * Nada de terceros se descarga hasta que el visitante pulsa el botón. */
function initPlayers() {
  const buttons = Array.from(document.querySelectorAll('[data-embed]'));
  if (!buttons.length) return;

  const bar = document.querySelector('[data-pbar]');
  const barFrame = bar && bar.querySelector('[data-pbar-frame]');
  const barTitle = bar && bar.querySelector('[data-pbar-title]');
  const barClose = bar && bar.querySelector('[data-pbar-close]');
  let barOwner = null;

  const makeIframe = (btn, height, ratio) => {
    const iframe = document.createElement('iframe');
    iframe.src = btn.dataset.embed;
    iframe.title = btn.dataset.embedTitle || 'Reproductor';
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.setAttribute('allowfullscreen', '');
    if (ratio) {
      iframe.style.aspectRatio = ratio;
      iframe.style.height = 'auto';
    } else {
      iframe.height = String(height || 152);
    }
    return iframe;
  };

  const setLabel = (btn, active) => {
    const l = btn.querySelector('[data-label]');
    if (!l) return;
    btn.dataset.labelIdle = btn.dataset.labelIdle || l.textContent;
    l.textContent = active ? 'Detener' : btn.dataset.labelIdle;
  };

  const markOff = (btn) => {
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('is-open');
    setLabel(btn, false);
  };
  const markOn = (btn) => {
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-open');
    setLabel(btn, true);
  };

  const syncBodyPadding = () => {
    const h = bar && !bar.hidden ? bar.offsetHeight : 0;
    document.body.style.paddingBottom = h ? `${h}px` : '';
  };

  const closeBar = () => {
    if (!bar) return;
    barFrame.replaceChildren();
    bar.classList.remove('is-open');
    bar.hidden = true;
    if (barOwner) markOff(barOwner);
    barOwner = null;
    syncBodyPadding();
  };

  const openBar = (btn) => {
    if (barOwner && barOwner !== btn) markOff(barOwner);
    barFrame.replaceChildren(makeIframe(btn, btn.dataset.embedBarHeight || btn.dataset.embedHeight));
    barTitle.textContent = btn.dataset.embedName || '';
    bar.hidden = false;
    requestAnimationFrame(() => bar.classList.add('is-open'));
    barOwner = btn;
    markOn(btn);
    syncBodyPadding();
  };

  const closeInline = (btn) => {
    const frame = document.getElementById(btn.getAttribute('aria-controls'));
    if (frame) frame.replaceChildren();
    markOff(btn);
  };
  const openInline = (btn) => {
    const frame = document.getElementById(btn.getAttribute('aria-controls'));
    if (!frame) return;
    frame.replaceChildren(makeIframe(btn, btn.dataset.embedHeight, btn.dataset.embedRatio));
    markOn(btn);
  };

  buttons.forEach((btn) => {
    const inline = btn.dataset.embedInline === 'true' || !bar;
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (inline) {
        buttons.forEach((b) => b !== btn && b.dataset.embedInline === 'true' && b.getAttribute('aria-expanded') === 'true' && closeInline(b));
        isOpen ? closeInline(btn) : openInline(btn);
        if (!isOpen) closeBar(); // un solo reproductor a la vez
      } else {
        buttons.forEach((b) => b.dataset.embedInline === 'true' && b.getAttribute('aria-expanded') === 'true' && closeInline(b));
        isOpen ? closeBar() : openBar(btn);
      }
    });
  });

  if (barClose) barClose.addEventListener('click', closeBar);
  window.addEventListener('resize', syncBodyPadding, { passive: true });
}

/* ---------- Aparición al hacer scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Sección activa en el menú ---------- */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('[data-nav]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const a = map.get(e.target.id);
        if (a && e.isIntersecting) {
          links.forEach((l) => l.removeAttribute('aria-current'));
          a.setAttribute('aria-current', 'true');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  map.forEach((_, id) => {
    const s = document.getElementById(id);
    if (s) io.observe(s);
  });
}

initMenu();
initAnchors();
initMonolith();
initPlayers();
initReveal();
initScrollSpy();
