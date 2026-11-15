/*
 * Información del artista.
 * Todo lo que diga null todavía no se muestra en el sitio (o muestra
 * "Próximamente"). Cuando tengas el dato, reemplaza null por el valor
 * entre comillas.
 */
export const artist = {
  firstName: 'Rigoberto',
  lastName: 'Hernandez',
  // Alias: comparte "HERNAN" con el apellido; la portada alterna entre los dos.
  alias: 'Hernanphy',
  name: 'Rigoberto Hernandez',
  tagline: 'Ancient Future',
  role: 'Selector',

  // Lo que se teclea en la portada, uno tras otro.
  roles: ['programador', 'melómano', 'DJ'],

  // Texto para Google y para cuando se comparte el enlace.
  seoDescription:
    'Rigoberto Hernandez es Hernanphy: programador, melómano y DJ. Deep house, tech house, minimal, techno y dub, siempre con una progresión. Ancient Future.',

  // Sección "Acerca".
  bio: {
    quote: 'No me encasillo en un solo estilo. Lo que me importa es el viaje.',
    paragraphs: [
      'Rigoberto Hernandez es Hernanphy: programador, melómano y DJ. En sus selecciones conviven el deep house, el tech house, el minimal, el techno y el dub, unidos por una sola regla: todo tiene que llevar una progresión. Ningún track está ahí solo por estar; cada uno prepara al siguiente.',
      'Todo empezó a finales de los 90 y principios de los 2000, cuando el progressive house era un viaje épico y atmosférico que se construía durante horas, sin prisa. De esa escuela vienen sus referentes: John Digweed, Satoshi Tomiie, Dave Seaman y Hernán Cattáneo, selectores que convirtieron una pista de baile en una narrativa.',
      'Este espacio es una forma de compartir eso: la buena música, lo que lo mueve y lo hace feliz. No es un catálogo, es un recorrido.'
    ],
    // Ficha breve que aparece junto al texto.
    facts: [
      { label: 'Sonido', value: 'Deep house · Tech house · Minimal · Techno · Dub' },
      { label: 'Raíz', value: 'Progressive house, finales de los 90' },
      { label: 'Referentes', value: 'John Digweed · Satoshi Tomiie · Dave Seaman · Hernán Cattáneo' },
      { label: 'Método', value: 'Progresión antes que impacto' }
    ]
  },

  // Correo de booking, p. ej. 'booking@hernanphy.com'
  bookingEmail: null
};
