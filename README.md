# HERNANPHY — Ancient Future

Sitio oficial. Una sola página, hecha con [Astro](https://astro.build) y publicada en GitHub Pages.

## Editar el contenido (sin tocar el diseño)

Todo el contenido vive en `src/data/`. Cada archivo explica dentro qué va en cada campo.

| Archivo | Qué contiene |
| --- | --- |
| `src/data/playlists.js` | Tus playlists de Spotify (Selecciones). Copia un bloque para añadir una, bórralo para quitarla. |
| `src/data/sets.js` | Sesiones grabadas (Archivo): Spotify, SoundCloud o YouTube. |
| `src/data/artist.js` | Biografía, correo de booking, retrato de portada y texto para Google. |
| `src/data/social.js` | Redes sociales. Solo aparecen las que tienen enlace. |

Lo que esté en `null` no se muestra (o aparece como «Próximamente»), así el sitio nunca tiene enlaces rotos.

**Enlace de Spotify:** en la playlist, `•••` › Compartir › Copiar enlace, y pégalo en `spotifyUrl`. El sitio lo convierte solo en el reproductor oficial, que se carga cuando el visitante pulsa «Escuchar aquí».

**Retrato:** guarda la foto en `public/images/` (JPG de unos 1600 px de alto) y escribe su nombre en `artist.js`, p. ej. `portrait: 'images/retrato.jpg'`. Se muestra en blanco y negro dentro del arco.

## Publicar en GitHub Pages (una sola vez)

1. Crea un repositorio en GitHub (p. ej. `hernanphy`) y sube todos estos archivos a la rama `main`.
2. En el repositorio: **Settings › Pages › Build and deployment › Source: GitHub Actions**.
3. Listo. Cada vez que subas un cambio, GitHub construye y publica el sitio en unos 2 minutos (pestaña **Actions**). La dirección aparece en Settings › Pages, normalmente `https://tu-usuario.github.io/hernanphy/`.

Dominio propio (opcional): en Settings › Pages › Custom domain escribe `hernanphy.com` y configura el DNS como indica GitHub.

## Trabajar en tu computadora (opcional)

Necesitas Node.js 20 o superior.

```bash
npm install
npm run dev      # vista local en http://localhost:4321
npm run build    # genera el sitio en dist/
```

## Estructura

```
src/
  data/         contenido editable
  components/   piezas de la página (Hero, Selecciones, Acerca, Archivo, Contacto, Pie)
  layouts/      cabecera HTML, SEO y fuentes
  lib/embed.js  convierte enlaces de Spotify, SoundCloud y YouTube en reproductores
  scripts/      menú móvil, reproductores, aparición al hacer scroll
  styles/       paleta mineral, tipografía y estilos
public/         favicon, imagen para compartir, robots.txt
```

Paleta: Obsidiana `#0C0E11`, Grafito `#1A1E23`, Basalto `#262A30`, Titanio `#A8AEB5`, Plata `#CDD1D5`, Marfil `#F2F0EA`.
Tipografía: Archivo (Expanded en títulos) e IBM Plex Mono.
