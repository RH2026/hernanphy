/*
 * Obtiene la portada oficial de una playlist de Spotify al construir el
 * sitio (no en el navegador del visitante). Si Spotify no responde, devuelve
 * null y el sitio usa la portada geométrica, así la publicación nunca falla.
 */
const cache = new Map();

export async function spotifyCover(url) {
  if (!url) return null;
  if (cache.has(url)) return cache.get(url);
  const result = (await fromPage(url)) ?? (await fromOEmbed(url));
  cache.set(url, result);
  return result;
}

async function fromPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; HernanphySite/1.0)', 'accept-language': 'es' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return m && m[1].startsWith('https://') ? m[1] : null;
  } catch {
    return null;
  }
}

async function fromOEmbed(url) {
  try {
    const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.thumbnail_url === 'string' && data.thumbnail_url.startsWith('https://')
      ? data.thumbnail_url
      : null;
  } catch {
    return null;
  }
}
