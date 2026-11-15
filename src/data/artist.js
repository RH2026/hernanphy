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
    'Rigoberto Hernandez es Hernanphy: programador, melómano y DJ. Ancient Future — selecciones de tech house tribal, minimal y progressive.',

  bio: {
    lead: 'Rigoberto Hernandez es Hernanphy: programador, melómano y DJ. Construye sus sesiones como construye su código: con estructura, peso y silencio.',
    body: 'Su territorio es el tech house tribal, el minimal y el progressive. Su método, la selección paciente y la mezcla con intención. Ancient Future es la idea que lo ordena todo: lo ritual y lo preciso en la misma frecuencia.'
  },

  // Correo de booking, p. ej. 'booking@hernanphy.com'
  bookingEmail: null
};
