/*
 * Convierte un enlace normal de Spotify, SoundCloud o YouTube en la
 * dirección de su reproductor oficial. Si el enlace no se reconoce,
 * devuelve null y el sitio muestra "Próximamente".
 */
export function embedFor(url) {
  if (!url || typeof url !== 'string') return null;
  let u;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, '');

  if (host === 'open.spotify.com') {
    const m = u.pathname.match(/\/(playlist|album|track|episode|show|artist)\/([A-Za-z0-9]+)/);
    if (!m) return null;
    const [, type, id] = m;
    const compact = type === 'track' || type === 'episode';
    return {
      provider: 'spotify',
      label: 'Spotify',
      src: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
      href: `https://open.spotify.com/${type}/${id}`,
      height: compact ? 152 : 352,
      ratio: null
    };
  }

  if (host === 'soundcloud.com' || host === 'on.soundcloud.com' || host === 'm.soundcloud.com') {
    const clean = `https://soundcloud.com${u.pathname}`;
    const isSet = u.pathname.includes('/sets/');
    const params = new URLSearchParams({
      url: clean,
      color: '#a8aeb5',
      auto_play: 'true',
      hide_related: 'true',
      show_comments: 'false',
      show_user: 'true',
      show_reposts: 'false',
      visual: 'false'
    });
    return {
      provider: 'soundcloud',
      label: 'SoundCloud',
      src: `https://w.soundcloud.com/player/?${params.toString()}`,
      href: url,
      height: isSet ? 450 : 166,
      ratio: null
    };
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') {
    let id = null;
    if (host === 'youtu.be') id = u.pathname.slice(1);
    else if (u.searchParams.get('v')) id = u.searchParams.get('v');
    else {
      const m = u.pathname.match(/\/(embed|live|shorts)\/([A-Za-z0-9_-]{6,})/);
      if (m) id = m[2];
    }
    if (!id || !/^[A-Za-z0-9_-]{6,}$/.test(id)) return null;
    return {
      provider: 'youtube',
      label: 'YouTube',
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      href: `https://www.youtube.com/watch?v=${id}`,
      height: null,
      ratio: '16 / 9'
    };
  }

  return null;
}

export const pad = (n) => String(n).padStart(2, '0');
