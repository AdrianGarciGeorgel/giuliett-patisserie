import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from '@/types/product'

export const PRODUCT_CATEGORY_OPTIONS: ReadonlyArray<{ value: ProductCategory; label: string }> = [
  { value: PRODUCT_CATEGORIES.CLASSIC_CAKES, label: 'Tortas clásicas' },
  { value: PRODUCT_CATEGORIES.CUSTOM_CAKES, label: 'Tortas personalizadas' },
  { value: PRODUCT_CATEGORIES.CUSTOM_COOKIES, label: 'Galletas personalizadas' },
  { value: PRODUCT_CATEGORIES.BOXES, label: 'Boxes' },
]

/** Precios provisionales: editar este archivo al actualizar el catálogo. */
export const PRODUCTS: Product[] = [

  {
    id: 'marquise',
    slug: 'marquise',
    name: 'Marquise',
    category: PRODUCT_CATEGORIES.CLASSIC_CAKES,
    price: 24000,
    imagePrimary: '/images/PRODUCTOS/CLASSIC_CAKES/Marquise/MARQUISE_1.webp',
    imageSecondary: '/images/PRODUCTOS/CLASSIC_CAKES/Marquise/MARQUISE_2.webp',
    description: 'Base de chocolate, dulce de leche y crema Chantilly. Terminada con chocolates o frutillas, según la temporada.\n\n Elaborada sin ingredientes con gluten.',
    gallery: [
      '/images/PRODUCTOS/CLASSIC_CAKES/Marquise/MARQUISE_1.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/Marquise/MARQUISE_2.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/Marquise/MARQUISE_4.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/Marquise/MARQUISE_3.webp',
     
    ],
  },
  {
    id: 'ny-cheesecake',
    slug: 'ny-cheesecake',
    name: 'NY Cheesecake',
    category: PRODUCT_CATEGORIES.CLASSIC_CAKES,
    price: 26000,
    imagePrimary: '/images/PRODUCTOS/CLASSIC_CAKES/NY_CheeseCake/CHEESECAKE_2.webp',
    imageSecondary: '/images/PRODUCTOS/CLASSIC_CAKES/NY_CheeseCake/CHEESECAKE_3.webp',
    description: 'Cheesecake estilo New York, súper cremoso, con base de galletas y topping de frutos rojos',
    gallery: [
      '/images/PRODUCTOS/CLASSIC_CAKES/NY_CheeseCake/CHEESECAKE_2.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/NY_CheeseCake/CHEESECAKE_3.webp',
      
    ],
  },
  {
    id: 'lemon-pie',
    slug: 'lemon-pie',
    name: 'Lemon Pie',
    category: PRODUCT_CATEGORIES.CLASSIC_CAKES,
    price: 22000,
    imagePrimary: '/images/PRODUCTOS/CLASSIC_CAKES/LemonPie/LEMON_PIE_2.webp',
    imageSecondary: '/images/PRODUCTOS/CLASSIC_CAKES/LemonPie/LEMON_PIE_1.webp',
    description: 'Masa sablée de vainilla, curd de limón y merengue italiano. Un clásico fresco y equilibrado.',
    gallery: [
      '/images/PRODUCTOS/CLASSIC_CAKES/LemonPie/LEMON_PIE_1.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/LemonPie/LEMON_PIE_2.webp',
      
    ],
  },
  {
    id: 'tarta-casha',
    slug: 'tarta-casha',
    name: 'Tarta Cabsha',
    category: PRODUCT_CATEGORIES.CLASSIC_CAKES,
    price: 23000,
    imagePrimary: '/images/PRODUCTOS/CLASSIC_CAKES/Cabsha/CABSHA_2.webp',
    imageSecondary: '/images/PRODUCTOS/CLASSIC_CAKES/Cabsha/CABSHA_1.webp',
    description: 'Base de vainilla, dulce de leche y ganache de chocolate. Un clásico simple e irresistible.',
    gallery: [
      '/images/PRODUCTOS/CLASSIC_CAKES/Cabsha/CABSHA_2.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/Cabsha/CABSHA_1.webp',
    ],
  },
  {
    id: 'chocotorta-premium',
    slug: 'chocotorta-premium',
    name: 'Súper Chocotorta',
    category: PRODUCT_CATEGORIES.CLASSIC_CAKES,
    price: 25000,
    imagePrimary: '/images/PRODUCTOS/CLASSIC_CAKES/ChocotartaPremium/chocotorta_premium.webp',
    imageSecondary: '/images/PRODUCTOS/CLASSIC_CAKES/ChocotartaPremium/chocotorta_premium_2.webp',
    description: 'Nuestra chocotorta más especial: mucho dulce de leche, chocolates y Oreos bañadas. También podés pedirla personalizada con colores, temática y detalles especiales.\n\nPetit: rinde aproximadamente 15–20 personas.\nSuper: rinde aproximadamente 30–35 personas.\n\nLas personalizaciones especiales pueden tener un costo adicional.',
    gallery: [
      '/images/PRODUCTOS/CLASSIC_CAKES/ChocotartaPremium/chocotorta_premium.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/ChocotartaPremium/chocotorta_premium_2.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/ChocotartaPremium/chocotorta_premium_3.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/ChocotartaPremium/chocotorta_premium_4.webp',
    ],
  },
  {
    id: 'bomba-oreo',
    slug: 'bomba-oreo',
    name: 'Bomba Oreo',
    category: PRODUCT_CATEGORIES.CLASSIC_CAKES,
    price: 24000,
    imagePrimary: '/images/PRODUCTOS/CLASSIC_CAKES/Bomba_Oreo/B0_4.webp',
    imageSecondary: '/images/PRODUCTOS/CLASSIC_CAKES/Bomba_Oreo/B0_3.webp',
    description: 'Doble base de Oreo, mucho dulce de leche y una terminación irresistible con Oreos y Kit Kat.',
    gallery: [
      
      '/images/PRODUCTOS/CLASSIC_CAKES/Bomba_Oreo/B0_4.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/Bomba_Oreo/B0_3.webp',
      
    ],
  },
  {
    id: 'tarta-frutilla',
    slug: 'tarta-frutilla',
    name: 'Tarta de Frutilla',
    category: PRODUCT_CATEGORIES.CLASSIC_CAKES,
    price: 23000,
    imagePrimary: '/images/PRODUCTOS/CLASSIC_CAKES/TartaDeFrutilla/TF_3.webp',
    imageSecondary: '/images/PRODUCTOS/CLASSIC_CAKES/TartaDeFrutilla/TF_1.webp',
    description: 'Masa sablée de vainilla, dulce de leche, crema Chantilly y abundantes frutillas frescas.',
    gallery: [
      '/images/PRODUCTOS/CLASSIC_CAKES/TartaDeFrutilla/TF_1.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/TartaDeFrutilla/TF_3.webp',
     
    ],
  },
  
 
  {
    id: 'mil-hojas',
    slug: 'mil-hojas',
    name: 'Mil Hojas',
    category: PRODUCT_CATEGORIES.CLASSIC_CAKES,
    price: 27000,
    imagePrimary: '/images/PRODUCTOS/CLASSIC_CAKES/MilHojas/MILHOJAS_1.webp',
    imageSecondary: '/images/PRODUCTOS/CLASSIC_CAKES/MilHojas/MILHOJAS_2.webp',
    description: 'Un clásico elaborado con capas de hojaldre, relleno de dulce de leche y decorado con merengue italiano y flores naturales.\n\nRinde aproximadamente 25 a 30 porciones.',
    gallery: [
      '/images/PRODUCTOS/CLASSIC_CAKES/MilHojas/MILHOJAS_1.webp',
      '/images/PRODUCTOS/CLASSIC_CAKES/MilHojas/MILHOJAS_2.webp',
    ],
  },
  {
    id: 'torta-butter',
    slug: 'torta-butter',
    name: 'Buttercream Cakes',
    category: PRODUCT_CATEGORIES.CUSTOM_CAKES,
    price: 38000,
    imagePrimary: '/images/PRODUCTOS/CUSTOM_CAKES/ButtercreamCake/BC_7.webp',
    imageSecondary: '/images/PRODUCTOS/CUSTOM_CAKES/ButtercreamCake/BC_1.webp',
    description: 'Tortas 100% personalizadas, con bizcochuelo de chocolate o vainilla, rellenos a elección y buttercream en los colores que quieras. \n\n Rellenos a elección:\n-Dulce de leche\n-Dulce de leche con merenguitos\n-Ganache de chocolate\n-Crema Chocotorta \n-Mousse de limón\n-⁠Crema Bariloche \n\n Tamaños disponibles:\n-15/20 personas\n-30/40 personas\n-50/60 personas\nConsultar por opciones para más invitados.\n\nFormato:\nCircular\nRectangular',
    gallery: [
      '/images/PRODUCTOS/CUSTOM_CAKES/ButtercreamCake/BC_7.webp',
      '/images/PRODUCTOS/CUSTOM_CAKES/ButtercreamCake/BC_1.webp',
      '/images/PRODUCTOS/CUSTOM_CAKES/ButtercreamCake/BC_4.webp',
      '/images/PRODUCTOS/CUSTOM_CAKES/ButtercreamCake/BC_2.webp',
      '/images/PRODUCTOS/CUSTOM_CAKES/ButtercreamCake/BC_6.webp',

    ],
  },
  {
    id: 'flower-cake',
    slug: 'flower-cake',
    name: 'Flower Cake',
    category: PRODUCT_CATEGORIES.CUSTOM_CAKES,
    price: 38000,
    imagePrimary: '/images/PRODUCTOS/CUSTOM_CAKES/FlowerCake/FLOWER_1.webp',
    imageSecondary: '/images/PRODUCTOS/CUSTOM_CAKES/FlowerCake/FLOWER_2.webp',
    description: 'Tortas personalizadas con flores naturales y  buttercream, diseñadas especialmente para cada ocasión. \n\n Rellenos a elección:\n-Dulce de leche\n-Dulce de leche con merenguitos\n-Ganache de chocolate\n-Crema Chocotorta \n-Mousse de limón\n-⁠Crema Bariloche \n\n Tamaños disponibles:\n-15/20 personas\n-30/40 personas\n-50/60 personas\nConsultar por opciones para más invitados.\n\nFormato:\nCircular\nRectangular',
    gallery: [
      '/images/PRODUCTOS/CUSTOM_CAKES/FlowerCake/FLOWER_1.webp',
      '/images/PRODUCTOS/CUSTOM_CAKES/FlowerCake/FLOWER_2.webp',
     
    ],
  },
  {
    id: 'torta-letter',
    slug: 'torta-letter',
    name: 'Letter Cake',
    category: PRODUCT_CATEGORIES.CUSTOM_CAKES,
    price: 38000,
    imagePrimary: '/images/PRODUCTOS/CUSTOM_CAKES/LetterCake/LETTER_3.webp',
    imageSecondary: '/images/PRODUCTOS/CUSTOM_CAKES/LetterCake/LETTER_2.webp',
    description: 'Base de brownie o sablée de vainilla, con dulce de leche, crema y chocolates. Personalizada en forma de letra o número.',
    gallery: [
      '/images/PRODUCTOS/CUSTOM_CAKES/LetterCake/LETTER_3.webp',
      '/images/PRODUCTOS/CUSTOM_CAKES/LetterCake/LETTER_2.webp',
      '/images/PRODUCTOS/CUSTOM_CAKES/LetterCake/LETTER_1.webp',
      
    ],
  },
  {
    id: 'wedding-cake',
    slug: 'wedding-cake',
    name: 'Wedding Cake',
    category: PRODUCT_CATEGORIES.CUSTOM_CAKES,
    price: 38000,
    imagePrimary: '/images/PRODUCTOS/CUSTOM_CAKES/WeddingCake/WC_2.webp',
    imageSecondary: '/images/PRODUCTOS/CUSTOM_CAKES/WeddingCake/WC_1.webp',
    description: 'Una torta única para un día único. Personalizamos sabores, colores, flores y cada detalle para que acompañe la estética de su casamiento.',
    gallery: [
      '/images/PRODUCTOS/CUSTOM_CAKES/WeddingCake/WC_2.webp',
      '/images/PRODUCTOS/CUSTOM_CAKES/WeddingCake/WC_1.webp',
      
    ],
  },
  {
    id: 'galletas-artesanales',
    slug: 'galletas-artesanales',
    name: 'Galletas Artesanales',
    category: PRODUCT_CATEGORIES.CUSTOM_COOKIES,
    price: 18000,
    imagePrimary: '/images/PRODUCTOS/COOKIES/CELEBRATIONS/CELE_7.webp',
    imageSecondary: '/images/PRODUCTOS/COOKIES/CELEBRATIONS/CELE_8.webp',
    description: 'Tu idea, hecha galleta.\n\nCreamos galletas personalizadas con fotos, nombres, ilustraciones o el diseño que quieras. Un detalle original para cumpleaños, casamientos, eventos, souvenirs y regalos especiales.\n\nElaboradas con sablée de vainilla, rellenas con dulce de leche y terminadas con impresión comestible de alta calidad.\n\nInformación:\n\n-6,5 cm de diámetro\n-Presentación individual\n-Diseño personalizado\n-Envíos a toda Argentina 🇦🇷',
    gallery: [
      
      '/images/PRODUCTOS/COOKIES/CELEBRATIONS/CELE_7.webp',
      '/images/PRODUCTOS/COOKIES/CELEBRATIONS/CELE_8.webp',
      '/images/PRODUCTOS/COOKIES/CELEBRATIONS/CELE_6.webp',
     
    ],
  },
  {
    id: 'galletas-empresas',
    slug: 'galletas-empresas',
    name: 'Galletas para Empresas',
    category: PRODUCT_CATEGORIES.CUSTOM_COOKIES,
    price: 18000,
    imagePrimary: '/images/PRODUCTOS/COOKIES/COMPANIES/MARCAS_1.webp',
    imageSecondary: '/images/PRODUCTOS/COOKIES/COMPANIES/MARCAS_2.webp',
    description: 'Tu marca, en un detalle que se recuerda.\n\nPersonalizamos nuestras galletas con logos, isotipos, iniciales o diseños de marca, creando un producto pensado especialmente para tu empresa.\n\nIdeales para eventos corporativos, lanzamientos, regalos empresariales, acciones de marca y obsequios para clientes o equipos.\n\nTambién realizamos pedidos por cantidad y venta mayorista, con propuestas adaptadas a las necesidades de cada empresa.\n\nElaboradas con sablée de vainilla, rellenas con dulce de leche y terminadas con impresión comestible de alta calidad.\n\nInformación:\n-4 cm de diámetro\n-Presentación individual\n-Personalización con identidad de marca\n-Venta mayorista y pedidos por cantidad\n-Envíos a toda Argentina 🇦🇷',
    gallery: [
      '/images/PRODUCTOS/COOKIES/COMPANIES/MARCAS_1.webp',
      '/images/PRODUCTOS/COOKIES/COMPANIES/MARCAS_2.webp',
      '/images/PRODUCTOS/COOKIES/COMPANIES/MARCAS_3.webp',

    ],
  },
  {
    id: 'box-cookies',
    slug: 'box-cookies',
    name: 'Box Cookies',
    category: PRODUCT_CATEGORIES.BOXES,
    price: 16000,
    imagePrimary: '/images/PRODUCTOS/BOXS/BOX COOKIES/BOX_COOKIES_1.webp',
    imageSecondary: '/images/PRODUCTOS/BOXS/BOX COOKIES/BOX_COOKIES_3.webp',
    description: '6 cookies estilo New York, grandes y bien cargadas, en una selección de nuestros sabores. \n\nSabores disponibles: \n·Clásica de vainilla \n· Red Velvet \n· Limón & Chocolate \n· Doble Chocolate \n· Frambuesa & Chocolate \n· Salted Caramel.',
    gallery: [
      '/images/PRODUCTOS/BOXS/BOX COOKIES/BOX_COOKIES_1.webp',
      '/images/PRODUCTOS/BOXS/BOX COOKIES/BOX_COOKIES_2.webp',
      '/images/PRODUCTOS/BOXS/BOX COOKIES/BOX_COOKIES_3.webp',
      '/images/PRODUCTOS/BOXS/BOX COOKIES/BOX_COOKIES_4.webp',
    ],
  },
  {
    id: 'box-macarons',
    slug: 'box-macarons',
    name: 'Box Macarons',
    category: PRODUCT_CATEGORIES.BOXES,
    price: 19000,
    imagePrimary: '/images/PRODUCTOS/BOXS/BOX MACARONS/BOX_MACARONS_1.webp',
    imageSecondary: '/images/PRODUCTOS/BOXS/BOX MACARONS/BOX_MACARONS_2.webp',
    description: 'Selección de macarons en colores y sabores surtidos. Un clásico Giuliett, ideal para regalar o disfrutar. \n\n Elaborados sin ingredientes con gluten.',
    gallery: [
      '/images/PRODUCTOS/BOXS/BOX MACARONS/BOX_MACARONS_1.webp',
      '/images/PRODUCTOS/BOXS/BOX MACARONS/BOX_MACARONS_2.webp',
      '/images/PRODUCTOS/BOXS/BOX MACARONS/BOX_MACARONS_3.webp',
      '/images/PRODUCTOS/BOXS/BOX MACARONS/BOX_MACARONS_4.webp',
    ],
  },
  {
    id: 'box-parisino',
    slug: 'box-parisino',
    name: 'Box Parisino',
    category: PRODUCT_CATEGORIES.BOXES,
    price: 22000,
    imagePrimary: '/images/PRODUCTOS/BOXS/BOX PARISINO/BOX_PARISINO_1.webp',
    imageSecondary: '/images/PRODUCTOS/BOXS/BOX PARISINO/BOX_PARISINO_3.webp',
    description: 'Una selección inspirada en la pâtisserie francesa: macarons, madeleines, mini choux y éclairs. Ideal para compartir entre 2–3 personas.',
    gallery: [
      '/images/PRODUCTOS/BOXS/BOX PARISINO/BOX_PARISINO_1.webp',
      '/images/PRODUCTOS/BOXS/BOX PARISINO/BOX_PARISINO_3.webp',
    ],
  },
  {
    id: 'box-souvenirs',
    slug: 'box-souvenirs',
    name: 'Box Souvenirs',
    category: PRODUCT_CATEGORIES.BOXES,
    price: 22000,
    imagePrimary: '/images/PRODUCTOS/BOXS/BOX SOUVENIR/BOX_SOUVENIR_1.webp',
    imageSecondary: '/images/PRODUCTOS/BOXS/BOX SOUVENIR/BOX_SOUVENIR_2.webp',
    description: 'Macarons presentados en cajitas individuales y personalizados con colores, etiquetas y detalles para cada ocasión. Ideales para cumpleaños, casamientos, baby showers y eventos corporativos.',
    gallery: [
      '/images/PRODUCTOS/BOXS/BOX SOUVENIR/BOX_SOUVENIR_1.webp',
      '/images/PRODUCTOS/BOXS/BOX SOUVENIR/BOX_SOUVENIR_2.webp',
      '/images/PRODUCTOS/BOXS/BOX SOUVENIR/BOX_SOUVENIR_3.webp',
      
    ],
  },
]

export function isProductCategory(value: string | null): value is ProductCategory {
  return PRODUCT_CATEGORY_OPTIONS.some((category) => category.value === value)
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug)
}
