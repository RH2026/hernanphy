// @ts-check
import { defineConfig } from 'astro/config';

/*
 * GitHub Pages
 * - SITE: la dirección de tu cuenta, p. ej. https://tu-usuario.github.io
 * - BASE: el nombre del repositorio con "/" delante, p. ej. /hernanphy
 *   Si usas un dominio propio (hernanphy.com) o el repo se llama
 *   tu-usuario.github.io, deja BASE en "/".
 * El workflow de GitHub las rellena solo; aquí quedan valores por defecto
 * para trabajar en tu computadora.
 */
const SITE = process.env.SITE_URL || 'https://example.github.io';
const BASE = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true
});
