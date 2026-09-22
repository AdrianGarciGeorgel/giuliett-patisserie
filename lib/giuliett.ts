/* Fuente única de verdad: contacto, copy de productos y audiencias. */

export const CONTACT = {
  phoneDisplay: '+54 9 261 713 7765',
  phoneRaw: '5492617137765',
  email: 'giuliettpatisserie@giuliett.com',
  instagramHandle: '@giuliettpatisserie',
  instagramUrl: 'https://instagram.com/giuliettpatisserie',
  city: 'Mendoza, Argentina',
} as const

/** Abre WhatsApp con un mensaje pre-escrito como lo escribiría el cliente. */
export function waLink(message: string) {
  return `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(message)}`
}

export const WA_GENERAL = 'Hola Giuliett, quiero hacer una consulta.'

export type EventImage = {
  image: string
  src: string
  alt: string
  /** Copy opcional superpuesto en la parte inferior de la fotografía. */
  text?: string
}

/** Fotografías para las tres propuestas de Eventos. */
export const EVENTOS = {
  bodas: [
    {
      image: '/images/EVENTOS/BODAS/BODA_1.webp',
      src: '/images/EVENTOS/BODAS/BODA_1.webp',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Mesas dulces que acompañan momentos únicos',
    },
    {
      image: '/images/EVENTOS/BODAS/BODA_2.webp',
      src: '/images/EVENTOS/BODAS/BODA_2.webp',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Pastelería pensada para ser parte de tu gran día',
    },
    {
      image: '/images/EVENTOS/BODAS/BODA_3.webp',
      src: '/images/EVENTOS/BODAS/BODA_3.webp',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Cada detalle, diseñado para tu celebración',
    },
    {
      image: '/images/EVENTOS/BODAS/BODA_4.webp',
      src: '/images/EVENTOS/BODAS/BODA_4.webp',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Sabores únicos para un día inolvidable',
    },
    {
      image: '/images/EVENTOS/BODAS/BODA_6.webp',
      src: '/images/EVENTOS/BODAS/BODA_6.webp',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Una mesa dulce tan especial como tu boda',
    },
    {
      image: '/images/EVENTOS/BODAS/BODA_7.webp',
      src: '/images/EVENTOS/BODAS/BODA_7.webp',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Un momento para recordar siempre',
    },
  ],
  empresas: [
    {
      image: '/images/EVENTOS/EMPRESAS/COMPANY_1.webp',
      src: '/images/EVENTOS/EMPRESAS/COMPANY_1.webp',
      alt: 'Propuesta corporativa de Giuliett para LTN',
      text: 'Detalles personalizados con identidad de marca',
    },
    {
      image: '/images/EVENTOS/EMPRESAS/COMPANY_2.webp',
      src: '/images/EVENTOS/EMPRESAS/COMPANY_2.webp',
      alt: 'Mesa corporativa de Giuliett para LTN',
      text: 'Experiencias dulces para eventos corporativos',
    },
    {
      image: '/images/EVENTOS/EMPRESAS/COMPANY_3.webp',
      src: '/images/EVENTOS/EMPRESAS/COMPANY_3.webp',
      alt: 'Propuesta corporativa de Giuliett',
      text: 'Regalos corporativos para fechas especiales',
    },
    {
      image: '/images/EVENTOS/EMPRESAS/COMPANY_4.webp',
      src: '/images/EVENTOS/EMPRESAS/COMPANY_4.webp',
      alt: 'Propuesta corporativa de Giuliett',
      text: 'Ediciones especiales para sorprender a tu equipo',
    },
    {
      image: '/images/EVENTOS/EMPRESAS/COMPANY_5.webp',
      src: '/images/EVENTOS/EMPRESAS/COMPANY_5.webp',
      alt: 'Propuesta corporativa de Giuliett',
      text: 'Mesas dulces pensadas para cada evento',
    },
    {
      image: '/images/EVENTOS/EMPRESAS/COMPANY_6.webp',
      src: '/images/EVENTOS/EMPRESAS/COMPANY_6.webp',
      alt: 'Propuesta corporativa de Giuliett',
      text: 'Pastelería que transforma cada encuentro',
    },
  ],
  celebraciones: [
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_1.webp',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_1.webp',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Hacemos más dulce cada celebración',
    },
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_2.webp',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_2.webp',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Una mesa pensada especialmente para tu evento',
    },
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_3.webp',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_3.webp',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Pequeños detalles que hacen la diferencia',
    },
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_4.webp',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_4.webp',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Tus ideas, convertidas en algo delicioso',
    },
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_5.webp',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_5.webp',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Pastelería personalizada para celebrar.',
    },
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_6.webp',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_6.webp',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Porque cada ocasión merece algo especial',
    },
  ],
} as const satisfies Record<'bodas' | 'empresas' | 'celebraciones', readonly EventImage[]>

export type Product = {
  id: string
  label: string
  script: string
  image: string
  alt: string
  desire: string
  fact: string
  waMessage: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'macarons',
    label: 'Macarons',
    script: 'artesanales',
    image: '/images/PRODUCTOS/OURS_PRODUCTS/MACAROS_1.webp',
    alt: 'Macarons artesanales en tonos lavanda y crema apilados sobre lino',
    desire: 'Receta francesa. Sin conservantes.',
    fact: 'Desde 24 unidades.',
    waMessage: 'Hola Giuliett, quiero consultar por macarons.',
  },
  {
    id: 'giu',
    label: 'Tortas personalizadas',
    script: 'con tu marca',
    image: '/images/PRODUCTOS/OURS_PRODUCTS/GIU_2.webp',
    alt: 'Tortas personalizadas con el logo de Giuliett sobre mármol blanco',
    desire: 'Tu logo, glaseado a mano, una por una.',
    fact: 'Desde 20 unidades.',
    waMessage: 'Hola Giuliett, me interesan las cookies con mi logo.',
  },
  {
    id: 'tortas',
    label: 'Tortas clasicas',
    script: 'con tu marca',
    image: '/images/PRODUCTOS/OURS_PRODUCTS/PIE_3.webp',
    alt: 'Tortas clásicas con el logo de Giuliett sobre mármol blanco',
    desire: 'Tu logo, glaseado a mano, una por una.',
    fact: 'Desde 20 unidades.',
    waMessage: 'Hola Giuliett, me interesan las tortas clásicas con mi logo.',
  },
  {
    id: 'mesas',
    label: 'Mesas dulces',
    script: 'personalizados',
    image: '/images/PRODUCTOS/OURS_PRODUCTS/MESA_4.webp',
    alt: 'Caja de regalo lila abierta con una hilera de macarons y cinta de raso',
    desire: 'Elegís los sabores, nosotros la presentación.',
    fact: 'Desde 10 cajas.',
    waMessage: 'Hola Giuliett, me interesan los kits personalizados.',
  },
  {
    id: 'boxes',
    label: 'Boxes',
    script: 'para eventos',
    image: '/images/PRODUCTOS/OURS_PRODUCTS/BOX_5.webp',
    alt: 'Mesa dulce montada con stands de cerámica lila, macarons y flores secas',
    desire: 'Montamos todo. Vos recibís a tu gente.',
    fact: 'Consultamos según evento.',
    waMessage: 'Hola Giuliett, estoy organizando un evento.',
  },
]

export type Audience = {
  id: string
  pill: string
  bullets: { title: string; text: string }[]
}

export const AUDIENCES: Audience[] = [
  {
    id: 'empresas',
    pill: 'Empresas',
    bullets: [
      { title: 'Regalos corporativos', text: 'El detalle que se comenta después.' },
      { title: 'Kits de bienvenida', text: 'El primer día no se olvida.' },
      { title: 'Catering', text: 'Mesas dulces para reuniones que importan.' },
    ],
  },
  {
    id: 'cafeterias',
    pill: 'Cafeterías & Locales',
    bullets: [
      { title: 'Pastelería para vitrina', text: 'Producto de autor, fresco, con rotación semanal.' },
      { title: 'Cookies con tu marca', text: 'Volvete memorable.' },
    ],
  },
]

export const REASONS = [
  { id: 'francia', text: 'Formación en Francia', Image: '/images/torre.webp' },
  { id: 'entregas', text: 'Entregas a domicilio', Image: '/images/camion.webp' },
  { id: 'presentacion', text: 'Presentación premium', Image: '/images/alfajores.webp' },
  { id: 'fundadora', text: 'Hablás con la fundadora', Image: '/images/giu.webp' },
] as const

export const STEPS = [
  { n: '1', title: 'Contanos', text: 'Un mensaje alcanza. Sin compromiso.' },
  { n: '2', title: 'Diseñamos', text: 'Sabores, cantidades, tu marca.' },
  { n: '3', title: 'Entregamos', text: 'El día que lo necesitás.' },
] as const

export const CLIENTS = [
  { id: 'LTN', text: 'LTN', Image: '/images/LOGOS/LTN.webp' },
  { id: 'Marisolfa', text: 'Marisolfa', Image: '/images/LOGOS/Marisolfa.webp' },
  { id: 'UltraTex', text: 'UltraTex', Image: '/images/LOGOS/ULTRATEX.webp' },
  { id: 'Andreu', text: 'Andreu', Image: '/images/LOGOS/ANDREU.webp' },
] as const

export const productCategories = [
  {
    id: 1,
    name: 'Tortas clásicas',
    src: '/images/Tortas_clasicas.webp',
    alt: 'Cookies artesanales glaseadas con el logo de Giuliett sobre mármol blanco',
    imageFirstOnDesktop: false,
    category: 'tortas-clasicas',
    bgColor: '#e2b0ac',
    textColor: '#3f2a50',
  },
  {
    id: 2,
    name: 'Tortas personalizadas',
    src: '/images/Tortas_Personalizadas.webp',
    alt: 'Mesa dulce montada con macarons, flores y cerámica lila',
    imageFirstOnDesktop: true,
    category: 'tortas-personalizadas',
    bgColor: '#51375c',
    textColor: '#f5f1eb',
  },
  {
    id: 3,
    name: 'Galletas personalizadas',
    src: '/images/Galletas_personalizadas.webp',
    alt: 'Manos decorando una cookie glaseada a mano',
    imageFirstOnDesktop: false,
    category: 'galletas-personalizadas',
    bgColor: '#beb4dc',
    textColor: '#3f2a50',
  },
  {
    id: 4,
    name: 'Boxes',
    src: '/images/Boxes.webp',
    alt: 'Caja de regalo lila con macarons y cinta de raso',
    imageFirstOnDesktop: true,
    category: 'boxes',
    bgColor: '#f5f1eb',
    textColor: '#3f2a50',
  },
] as const
