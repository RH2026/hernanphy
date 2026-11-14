/*
 * SELECCIONES — tus playlists de Spotify.
 *
 * Para añadir una playlist: copia un bloque { ... }, pégalo donde quieras
 * que aparezca y cambia los datos. El número (N° 01, 02...) se pone solo
 * según el orden. Para quitarla, borra su bloque.
 *
 *   title        Nombre de la colección.
 *   description  Una o dos frases.
 *   spotifyUrl   En Spotify: ••• > Compartir > Copiar enlace. Con null
 *                aparece como "Próximamente" y no se puede reproducir.
 *   tracks       Número de canciones (o null).
 *   cover        (opcional) Qué portada mostrar:
 *                  sin escribirlo → la portada oficial de Spotify (si hay enlace)
 *                  'forma'        → la portada geométrica de abajo
 *                  'images/mi-portada.jpg' → una imagen tuya en public/images/
 *   form         Forma de la portada geométrica: 'dintel', 'arco', 'losa',
 *                'eclipse' o 'escalon'. Se usa si no hay portada de Spotify.
 *   tone         Fondo de la portada: 'grafito', 'obsidiana', 'piedra',
 *                'basalto' o 'sombra'.
 */
export const playlists = [
  {
    title: 'Low Ceremony',
    description:
      'Ceremonia a baja intensidad. Un ritual lento, de pulso contenido, que se escucha con el cuerpo.',
    spotifyUrl: 'https://open.spotify.com/playlist/1HbZo4OZqlCApodM0ylfWt',
    tracks: 21,
    form: 'dintel',
    tone: 'grafito'
  },
  {
    title: 'Ritual Frequency',
    description: 'Percusión tribal y repetición hipnótica. Un recorrido hacia adentro.',
    spotifyUrl: null,
    tracks: null,
    form: 'arco',
    tone: 'piedra'
  },
  {
    title: 'Ancient Future',
    description:
      'Lo primitivo y lo sintético en el mismo pulso. La colección que da nombre a todo.',
    spotifyUrl: null,
    tracks: null,
    form: 'losa',
    tone: 'obsidiana'
  },
  {
    title: 'Dark Matter',
    description: 'Minimal oscuro, bajos profundos y espacio. Lo que se siente antes de oírse.',
    spotifyUrl: null,
    tracks: null,
    form: 'eclipse',
    tone: 'basalto'
  },
  {
    title: 'Primal Motion',
    description: 'Progressive en ascenso constante. Movimiento, tensión y liberación.',
    spotifyUrl: null,
    tracks: null,
    form: 'escalon',
    tone: 'sombra'
  }
];
