# Giuliett Pâtisserie — CLAUDE.md

Fuente de verdad técnica del proyecto. Si algo de este archivo choca con una
sugerencia (mía o de una herramienta), **gana este archivo**.

> El brief de marca vive en [`AI_CONTEXT.md`](./AI_CONTEXT.md): filosofía, tono,
> identidad visual, inspiración. Este archivo es la capa técnica. Los dos se leen juntos.

---

## Qué es

Web de **Giuliett Pâtisserie** — pastelería francesa artesanal en Mendoza, Argentina.
No es una landing genérica: es una experiencia premium de boutique francesa.

Producción: https://giuliett-patisserie.vercel.app/

## Equipo

| Quién | Rol |
|---|---|
| **Marco (@maap00)** | Frontend: diseño, componentes, maquetado. Dueño del repo. |
| **Adrián (@AdrianGarciGeorgel)** | Lidera el desarrollo: backend, formularios, CMS, SEO, deploy. |

---

## Reglas NO NEGOCIABLES

### 1. Texto legal sobre el gluten

⚠️ **Nunca escribir "Sin TACC" ni usar el logo oficial de Sin TACC sin certificación ANMAT.**

La fórmula que usa el proyecto hoy, y la que se debe seguir usando, es:

> **"Elaborada sin ingredientes con gluten."** (o *"Elaborados…"* según el producto)

Por qué importa: en Argentina "Sin TACC" es una declaración regulada. Usarla sin el
certificado del RNPA correspondiente expone a la marca. La fórmula actual describe el
proceso sin hacer una declaración certificada.

Hoy aparece en `lib/products.ts` en **Marquise** y en **Macarons**. Al sumar productos
elaborados igual, copiar el texto **literal**, sin reescribirlo ni "mejorarlo".

> 🔲 **A confirmar con Adrián / Giu:** si existe una redacción legal aprobada distinta
> a la que está hoy en el código, reemplazarla acá y en `lib/products.ts` de una vez.

### 2. Paleta oficial

La paleta de marca (de `AI_CONTEXT.md`) es:

| Nombre | Hex |
|---|---|
| Lilac | `#BFB4DC` |
| Aubergine | `#51375C` |
| Warm White | `#FFF8E9` |
| Peach | `#E1B0AC` |
| Dark Gray | `#383838` |
| Chocolate | `#4F100B` |
| Warm Taupe | `#9C8065` |

⚠️ **Discrepancia detectada (22-09-2026):** `app/globals.css` **no** usa estos valores:

| Token en código | Valor actual | Valor de marca |
|---|---|---|
| `--lilac` | `#d8cbe8` | `#BFB4DC` |
| `--primary` / `--foreground` | `#3f2a50` | `#51375C` (Aubergine) |
| `--background` | `#f5f1eb` | `#FFF8E9` (Warm White) |

> 🔲 **A resolver con Marco antes de tocar nada:** ¿los valores del código son un ajuste
> deliberado de diseño, o hay que alinearlos al brief? **No cambiar la paleta
> unilateralmente** — es identidad de marca, no una decisión técnica.

Los colores se definen **solo** como tokens CSS en `app/globals.css`. Nunca hardcodear
un hex en un componente.

### 3. Performance manda sobre diseño

Si un efecto, animación, fuente o imagen cuesta performance, **se recorta el efecto**.
Ante la duda entre "más lindo" y "más rápido", gana rápido.

- Animaciones: sutiles, elegantes, nunca exageradas. Respetar **siempre**
  `prefers-reduced-motion` (ya hay soporte en `globals.css`).
- Nada de dependencias pesadas para efectos visuales. CSS y hooks propios primero.
- Medir con **Lighthouse sobre build de producción**, no en dev.

### 4. Git

- **NUNCA pushear directo a `main`.** Todo entra por rama + Pull Request.
- Ramas: `feat/…`, `fix/…`, `perf/…`, `chore/…`.
- Commits en **español**, imperativo, describiendo el porqué.
- El repo es de Marco: los PRs a `main` van **con @maap00 como reviewer**.

### 5. Copy

- Español **rioplatense** (vos, no tú). Muy breve. Emocional. Nada comercial.
- "Hace falta filtrar": cada pantalla comunica **una sola idea**.
- La fotografía vende, el texto acompaña. No al revés.

### 6. Mobile first

La mayoría llega desde Instagram y WhatsApp. Se diseña primero para celular;
desktop es la adaptación. El usuario debe poder escribir por WhatsApp en
**menos de 15 segundos**.

---

## Stack real

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16.2.6** (App Router, Turbopack) |
| UI | React 19 · TypeScript 5.7.3 |
| Estilos | **Tailwind CSS v4** (`@theme inline` en `globals.css`) |
| Componentes | shadcn + `@base-ui/react` · `lucide-react` (iconos) |
| Fuentes | `next/font/google`: **Poppins** (sans) + **Ephesis** (script) |
| Analytics | `@vercel/analytics` |
| Deploy | **Vercel** |
| Backend (Fase B) | **Supabase** (PostgreSQL + RLS) |

El frontend fue generado inicialmente con **v0.app** (`generator: 'v0.app'` en el layout).

---

## Estructura

```
app/
├── layout.tsx              # metadata global, fuentes, nav
├── globals.css             # TOKENS de color, radios, sombras, easings
├── page.tsx                # home
├── productos/
│   ├── page.tsx            # catálogo
│   └── [slug]/page.tsx     # ficha de producto (dinámica)
├── eventos/  · giu/  · galeria/  · contacto/
components/
├── giuliett/               # componentes propios de la marca
│   ├── sections/           # secciones de página (hero, manifesto, process…)
│   ├── contact-form.tsx    # formulario → abre WhatsApp
│   ├── hero-carousel.tsx · product-catalog.tsx · product-gallery.tsx
│   └── …
└── ui/                     # primitivas shadcn
lib/
├── giuliett.ts             # CONTACT, waLink(), catálogo de EVENTOS
├── products.ts             # catálogo PRODUCTS (precios incluidos)
└── utils.ts
types/product.ts            # Product, PRODUCT_CATEGORIES
public/images/              # todas las imágenes, en WebP
```

## Fuente de verdad de los datos

Hoy **no hay CMS ni base de datos**. Todo es estático en el código:

| Dato | Archivo |
|---|---|
| Teléfono, email, Instagram, ciudad | `lib/giuliett.ts` → `CONTACT` |
| Link de WhatsApp | `lib/giuliett.ts` → `waLink()` |
| Fotos de Eventos (bodas/empresas/…) | `lib/giuliett.ts` → `EVENTOS` |
| Productos, precios, galerías | `lib/products.ts` → `PRODUCTS` |
| Categorías | `types/product.ts` → `PRODUCT_CATEGORIES` |

Las **4 categorías** son: `tortas-clasicas`, `tortas-personalizadas`,
`galletas-personalizadas`, `boxes`.

**Para agregar un producto:** sumar un objeto a `PRODUCTS` en `lib/products.ts` con
`slug` único, `category` válida y rutas de imagen que existan en `public/images/`.

---

## Comandos

```bash
npm install
npm run dev      # dev server
npm run build    # build de producción (obligatorio antes de deploy)
npm run lint     # eslint
```

⚠️ Si `npm run build` falla **solo** por la descarga de Google Fonts, es problema de
red, no de código.

---

## Reglas de código

- Componentes funcionales con hooks. Nunca clases.
- **Server Components por defecto.** `'use client'` solo cuando hace falta estado,
  efectos o eventos del navegador.
- Tailwind con los tokens de `globals.css`. Nunca un hex suelto.
- TypeScript con tipos explícitos en props y datos de dominio.
- Sin `console.log` ni código experimental en lo que se mergea.
- `alt` descriptivo en **todas** las imágenes. Keys únicas en todos los `.map()`.
- Ningún `<Image>` puede recibir `src=""`.

---

## Deuda técnica conocida

Detectada al auditar el repo el 22-09-2026. Resolver antes del deploy final:

1. **`next.config.mjs` tiene `images: { unoptimized: true }`** → `next/image` no
   optimiza nada. Choca de frente con la regla de performance. Revisar al cerrar
   la optimización de imágenes.
2. **`next.config.mjs` tiene `typescript: { ignoreBuildErrors: true }`** → el build
   pasa aunque haya errores de tipos. Hay que apagarlo y arreglar lo que aparezca.
3. **El campo Email del formulario dice obligatorio (`*`) pero no se valida.**
   En `components/giuliett/contact-form.tsx`, `handleSubmit` valida `name`,
   `whatsapp` y `orderType`, pero nunca setea `nextErrors.email`.
4. **Falta metadata por página**: solo hay metadata global en `layout.tsx`.
   Sin `metadataBase`, sin canonical, sin Twitter/X, sin `robots.txt`, sin `sitemap.xml`,
   sin metadata dinámica por producto.
5. **La paleta del código no coincide con el brief** (ver Reglas → Paleta).
6. **El formulario no registra nada**: arma un texto y abre WhatsApp. Si el usuario
   no envía el mensaje, la consulta se pierde. Lo resuelve la Fase B.

---

## Roadmap

### Fase A — Frontend y performance ✅ (en curso de mergearse)
- Maquetado completo de las 6 rutas (Marco).
- **Optimización de imágenes**: 232MB → 15MB (−93%), 129 WebP, 163 referencias
  migradas, fix de `manifiesto-manos` que apuntaba a una ruta inexistente.

### Fase B — Supabase, formularios y registro de consultas 🔲
Persistir las consultas en vez de perderlas en WhatsApp. Ver el plan detallado
acordado con Adrián antes de codear.

### Fase C — CMS, SEO y deploy 🔲
- Metadata completa, sitemap, robots, OG por producto.
- Arquitectura lista para migrar datos a un CMS **sin rehacer el frontend**.
  ⚠️ No introducir un CMS antes de definir cuál.
- Dominio propio, DNS, SSL, redirects, Lighthouse en producción.

---

# Checklist técnico de Marco

> Enviado por Marco (@maap00) el 22-09-2026. Adrián lo define como
> **regla inquebrantable**. Es el criterio de aceptación del proyecto.

## 1. Auditoría general
Revisar estructura Next.js; arquitectura de componentes y separación de
responsabilidades; código duplicado, código muerto y componentes innecesariamente
complejos; imports, dependencias y archivos sin usar; naming, TypeScript y buenas
prácticas de React/Next.js; que no existan errores ni warnings en consola; que no
haya `console.log`, debugging temporal ni código experimental.

## 2. Rutas y navegación
Verificar manualmente `/`, `/productos`, `/productos/[slug]`, `/eventos`, `/giu`,
`/contacto` y cualquier otra ruta. Comprobar: navegación desde menú, enlaces internos,
botones, URLs directas, refresh en cada ruta, páginas inexistentes → 404 correcta,
enlaces externos, WhatsApp, Instagram/redes.

## 3. Navegación producto → categoría
Revisar el flujo **Categoría → Producto → volver**, con el botón "Volver", con el botón
atrás del navegador y en navegación móvil.
Ejemplo: Tortas Personalizadas → Flower Cake → atrás → Tortas Personalizadas.
La categoría debe conservarse **dinámicamente según el producto**, sin hardcodearla.

## 4. Catálogo y datos
Productos con datos completos; cada `slug` único; cada imagen existe; ningún `<Image>`
con `src=""`; sin imágenes rotas; correspondencia producto → categoría → imágenes;
revisar catálogos de PRODUCTOS y EVENTOS; que los `HeroCarousel` reciban el catálogo
correcto; keys únicas en todos los `.map()`.

## 5. Formulario de contacto
Testear como usuario real: campos obligatorios, validaciones, email, WhatsApp, fecha,
cantidad de invitados, temática, selección de productos/servicios, mensaje, errores de
validación, envío exitoso, datos incompletos, comportamiento en móvil, generación y
redirección a WhatsApp, mensaje generado correctamente, caracteres especiales y tildes,
protección contra envíos accidentales o múltiples.
Verificar también qué pasa si el usuario recarga, vuelve atrás, abandona el formulario
o envía dos veces.

## 6. SEO técnico
`<title>` y `description` por página; Open Graph; Twitter/X metadata; canonical URLs;
`robots.txt`; `sitemap.xml`; URLs limpias; headings H1/H2/H3 bien estructurados; `alt`
descriptivos; metadata dinámica para productos; metadata adecuada para compartir
productos en WhatsApp/redes; evitar contenido duplicado; revisar indexabilidad.

## 7. Performance
Optimización de imágenes con `next/image`; tamaños y formatos; imágenes
above-the-fold; lazy loading; fuentes; JavaScript innecesario; componentes
Client/Server; bundle; carga inicial; animaciones; cantidad de requests.
Ejecutar **Lighthouse en producción**, no solo en desarrollo: Performance,
Accessibility, Best Practices, SEO, LCP, CLS, INP.

## 8. Responsive / dispositivos
Mínimo: Desktop grande, Laptop, Tablet, Mobile pequeño, Mobile grande.
Y Safari iOS, Chrome Android, Chrome desktop, Safari desktop.
Revisar: navegación, carruseles, formularios, imágenes, botones, safe areas, scroll,
viewport, orientación.

## 9. Accesibilidad
`alt`; labels de formularios; `aria-label`; navegación por teclado; focus states;
contraste; botones vs. links; elementos interactivos accesibles;
`prefers-reduced-motion`; jerarquía semántica HTML.

## 10. Seguridad y robustez
Revisar variables de entorno; no exponer secrets; dependencias vulnerables
(`npm audit` y evaluar); inputs externos; links externos; headers cuando corresponda;
que producción no exponga información de desarrollo.

## 11. Código y escalabilidad
Que la estructura permita incorporar después: CMS, nuevos productos, nuevos eventos,
categorías, precios, contenido editable, pedidos, integraciones.
**Importante:** no introducir un CMS innecesariamente si todavía no está definido cuál.
Primero dejar la arquitectura preparada para migrar los datos sin rehacer el frontend.

## 12. Build y CI
Antes del deploy: `npm run lint` y `npm run build`. Resolver errores y warnings
relevantes. Verificar build limpio, rutas generadas, imágenes, variables de entorno,
errores en runtime, producción vs. desarrollo.

## 13. Deploy
Proyecto de producción; repositorio conectado; variables de entorno; dominio propio;
DNS; HTTPS/SSL; redirects; www vs. dominio principal; todas las rutas funcionando
directo en producción; OG/social previews sobre el dominio final.

## 14. Post-deploy
Recorrer toda la web; probar formulario real; probar WhatsApp; probar todos los
productos; probar todos los eventos; probar navegación atrás; revisar consola; revisar
404/500; ejecutar Lighthouse; verificar sitemap, robots e indexación; comprobar dominio
y SSL.

## 15. Entrega técnica
URL definitiva; repositorio actualizado; variables y configuración documentadas;
CMS/configuración si corresponde; instrucciones para agregar/modificar productos;
instrucciones para modificar contenido; documentación mínima de deploy; listado de
funcionalidades implementadas; listado de pruebas realizadas; problemas conocidos.
