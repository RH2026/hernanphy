/*
 * Interacción del sitio: menú móvil, reproductores bajo demanda,
 * aparición al hacer scroll y sección activa en el menú.
 * Sin dependencias.
 */

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

/* ---------- Reproductores (Spotify, SoundCloud, YouTube) ----------
 * El iframe solo se crea cuando el visitante pulsa el botón: la página
 * carga rápido y no se descarga nada de terceros hasta entonces.
 * Solo suena un reproductor a la vez. */
function initPlayers() {
  const buttons = Array.from(document.querySelectorAll('[data-embed]'));
  if (!buttons.length) return;

  const close = (btn) => {
    const frame = document.getElementById(btn.getAttribute('aria-controls'));
    if (frame) frame.replaceChildren();
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('is-open');
    const l = btn.querySelector('[data-label]');
    if (l && btn.dataset.labelIdle) l.textContent = btn.dataset.labelIdle;
  };

  const open = (btn) => {
    const frame = document.getElementById(btn.getAttribute('aria-controls'));
    if (!frame) return;
    const iframe = document.createElement('iframe');
    iframe.src = btn.dataset.embed;
    iframe.title = btn.dataset.embedTitle || 'Reproductor';
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.setAttribute('allowfullscreen', '');
    if (btn.dataset.embedRatio) {
      iframe.style.aspectRatio = btn.dataset.embedRatio;
      iframe.style.height = 'auto';
    } else {
      iframe.height = btn.dataset.embedHeight || '352';
    }
    frame.replaceChildren(iframe);
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-open');
    const l = btn.querySelector('[data-label]');
    if (l) {
      btn.dataset.labelIdle = btn.dataset.labelIdle || l.textContent;
      l.textContent = 'Cerrar reproductor';
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      buttons.forEach((b) => b !== btn && b.getAttribute('aria-expanded') === 'true' && close(b));
      isOpen ? close(btn) : open(btn);
    });
  });
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
        if (!a) return;
        if (e.isIntersecting) {
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
initPlayers();
initReveal();
initScrollSpy();
