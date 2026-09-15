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
      image: '/images/EVENTOS/BODAS/BODA_1.jpeg',
      src: '/images/EVENTOS/BODAS/BODA_1.jpeg',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/BODAS/BODA_2.jpeg',
      src: '/images/EVENTOS/BODAS/BODA_2.jpeg',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/BODAS/BODA_3.jpeg',
      src: '/images/EVENTOS/BODAS/BODA_3.jpeg',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/BODAS/BODA_4.jpeg',
      src: '/images/EVENTOS/BODAS/BODA_4.jpeg',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/BODAS/BODA_5.jpeg',
      src: '/images/EVENTOS/BODAS/BODA_5.jpeg',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/BODAS/BODA_6.jpeg',
      src: '/images/EVENTOS/BODAS/BODA_6.jpeg',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/BODAS/BODA_7.jpeg',
      src: '/images/EVENTOS/BODAS/BODA_7.jpeg',
      alt: 'Propuesta dulce para una boda de Giuliett',
      text: 'Mesa dulce para bodas',
    },
  ],
  empresas: [
    {
      image: '/images/EVENTOS/EMPRESAS/COMPANY_1.png',
      src: '/images/EVENTOS/EMPRESAS/COMPANY_1.png',
      alt: 'Propuesta corporativa de Giuliett para LTN',
      text: 'Regalos corporativos personalizados',
    },
    {
      image: '/images/EVENTOS/EMPRESAS/COMPANY_2.png',
      src: '/images/EVENTOS/EMPRESAS/COMPANY_2.png',
      alt: 'Mesa corporativa de Giuliett para LTN',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/EMPRESAS/COMPANY_3.jpeg',
      src: '/images/EVENTOS/EMPRESAS/COMPANY_3.jpeg',
      alt: 'Propuesta corporativa de Giuliett',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/EMPRESAS/COMPANY_4.jpeg',
      src: '/images/EVENTOS/EMPRESAS/COMPANY_4.jpeg',
      alt: 'Propuesta corporativa de Giuliett',
      text: 'Mesa dulce para bodas',
    },
  ],
  celebraciones: [
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_1.jpeg',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_1.jpeg',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Detalles para celebrar',
    },
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_2.jpeg',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_2.jpeg',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_3.jpeg',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_3.jpeg',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_4.jpeg',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_4.jpeg',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_5.jpeg',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_5.jpeg',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Mesa dulce para bodas',
    },
    {
      image: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_6.jpeg',
      src: '/images/EVENTOS/CELEBRACIONES/CELEBRATE_6.jpeg',
      alt: 'Propuesta dulce para una celebración de Giuliett',
      text: 'Mesa dulce para bodas',
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
    id: 'cookies',
    label: 'Cookies',
    script: 'con tu marca',
    image: '/images/producto-cookies.png',
    alt: 'Cookies artesanales glaseadas con el logo de Giuliett sobre mármol blanco',
    desire: 'Tu logo, glaseado a mano, una por una.',
    fact: 'Desde 20 unidades.',
    waMessage: 'Hola Giuliett, me interesan las cookies con mi logo.',
  },
  {
    id: 'macarons',
    label: 'Macarons',
    script: 'artesanales',
    image: '/images/producto-macarons.png',
    alt: 'Macarons artesanales en tonos lavanda y crema apilados sobre lino',
    desire: 'Receta francesa. Sin conservantes.',
    fact: 'Desde 24 unidades.',
    waMessage: 'Hola Giuliett, quiero consultar por macarons.',
  },
  {
    id: 'kits',
    label: 'Kits & Boxes',
    script: 'personalizados',
    image: '/images/producto-kits.png',
    alt: 'Caja de regalo lila abierta con una hilera de macarons y cinta de raso',
    desire: 'Elegís los sabores, nosotros la presentación.',
    fact: 'Desde 10 cajas.',
    waMessage: 'Hola Giuliett, me interesan los kits personalizados.',
  },
  {
    id: 'mesas',
    label: 'Mesas Dulces',
    script: 'para eventos',
    image: '/images/producto-mesas.png',
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
  { id: 'francia', text: 'Formación en Francia', Image: '/images/torre.png' },
  { id: 'entregas', text: 'Entregas a domicilio', Image: '/images/camion.png' },
  { id: 'presentacion', text: 'Presentación premium', Image: '/images/alfajores.png' },
  { id: 'fundadora', text: 'Hablás con la fundadora', Image: '/images/giu.png' },
] as const

export const STEPS = [
  { n: '1', title: 'Contanos', text: 'Un mensaje alcanza. Sin compromiso.' },
  { n: '2', title: 'Diseñamos', text: 'Sabores, cantidades, tu marca.' },
  { n: '3', title: 'Entregamos', text: 'El día que lo necesitás.' },
] as const

export const CLIENTS = ['LTN', 'Marisolfa', 'UltraTex', 'Andreu'] as const

export const productCategories = [
  {
    id: 1,
    name: 'Tortas clásicas',
    src: '/images/producto-cookies.png',
    alt: 'Cookies artesanales glaseadas con el logo de Giuliett sobre mármol blanco',
    imageFirstOnDesktop: false,
    category: 'tortas-clasicas',
    bgColor: '#e2b0ac',
    textColor: '#3f2a50',
  },
  {
    id: 2,
    name: 'Tortas personalizadas',
    src: '/images/producto-mesas.png',
    alt: 'Mesa dulce montada con macarons, flores y cerámica lila',
    imageFirstOnDesktop: true,
    category: 'tortas-personalizadas',
    bgColor: '#51375c',
    textColor: '#f5f1eb',
  },
  {
    id: 3,
    name: 'Galletas personalizadas',
    src: '/images/manifiesto-manos.png',
    alt: 'Manos decorando una cookie glaseada a mano',
    imageFirstOnDesktop: false,
    category: 'galletas-personalizadas',
    bgColor: '#beb4dc',
    textColor: '#3f2a50',
  },
  {
    id: 4,
    name: 'Boxes',
    src: '/images/producto-kits.png',
    alt: 'Caja de regalo lila con macarons y cinta de raso',
    imageFirstOnDesktop: true,
    category: 'boxes',
    bgColor: '#f5f1eb',
    textColor: '#3f2a50',
  },
] as const
