/*
 * Información del artista.
 * Todo lo que diga null todavía no se muestra en el sitio (o muestra
 * "Próximamente"). Cuando tengas el dato, reemplaza null por el valor
 * entre comillas.
 */
export const artist = {
  name: 'HERNANPHY',
  tagline: 'Ancient Future',
  role: 'Selector',

  // Texto para Google y para cuando se comparte el enlace.
  seoDescription:
    'HERNANPHY — Ancient Future. Selecciones de tech house tribal, minimal y progressive: colecciones curadas en Spotify y sesiones grabadas.',

  bio: {
    lead: 'Hernanphy es un selector. Melómano antes que DJ, construye sus sesiones como se construye un espacio: con estructura, peso y silencio.',
    body: 'Su territorio es el tech house tribal, el minimal y el progressive. Su método, la selección paciente y la mezcla con intención. Ancient Future es la idea que lo ordena todo: lo ritual y lo preciso en la misma frecuencia.'
  },

  // Retrato para la portada. Guarda la foto en public/images/
  // y escribe su nombre, p. ej. 'images/retrato.jpg'. Con null se muestra
  // el arco de piedra.
  portrait: null,
  portraitAlt: 'Retrato de Hernanphy',

  // Correo de booking, p. ej. 'booking@hernanphy.com'
  bookingEmail: null
};
