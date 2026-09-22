# Giuliett Pâtisserie — CLAUDE.md

Fuente de verdad técnica del proyecto. Si algo de este archivo choca con una
sugerencia (mía o de una herramienta), **gana este archivo**.

> El brief de marca vive en [`AI_CONTEXT.md`](./AI_CONTEXT.md): filosofía, tono,
> identidad visual, inspiración. Este archivo es la capa técnica. Los dos se leen juntos.

---

## Qué es

Web de **Giuliett Pâtisserie** — pastelería francesa artesanal en Mendoza, Argentina.
No es una landing genérica: es una experiencia premium de boutique francesa.

Producción (Vercel de Marco): https://giuliett-patisserie.vercel.app/

## Equipo

| Quién | Rol |
|---|---|
| **Marco (@maap00)** | Frontend: diseño, componentes, maquetado. Dueño del repo. |
| **Adrián (@AdrianGarciGeorgel)** | Lidera el desarrollo: backend, formularios, CMS, SEO, deploy. |
| **Giuliana (Giu)** | La clienta. Dueña de la marca. Usa el panel. |

# Notion Base de Operaciones

Este proyecto está documentado en Notion.
URL del proyecto: https://app.notion.com/p/39a5bca17c2b81b0889ac7aa1338feb0
Antes de hacer cambios estructurales, verificar el estado en Notion (ahí están el
Master Plan del cliente, la cotización, las decisiones y el historial).
Después de cambios significativos, actualizar Notion via MCP.

---

## Reglas NO NEGOCIABLES

### 1. Sin TACC: tercerizado, con aclaración legal, sin promesas

Según el **Master Plan v2 de Giuliana**: Giuliett **no elabora Sin TACC en su taller**.
Las opciones Sin TACC se **tercerizan** a un proveedor habilitado, **según disponibilidad**.

En la web esto se traduce en:

- Los **4 formularios** llevan el campo **obligatorio** "¿Necesitás una opción especial?"
  (No, ninguna / Sí, Sin TACC / Sí, otra) con la aclaración legal debajo.
- La aclaración vive en **un solo lugar**: `AVISO_SIN_TACC` en `lib/consultas/tipos.ts`.
  Un test (`test/consultas.formularios.test.ts`) verifica que diga "proveedor
  habilitado", "disponibilidad" y **no prometa tiempos**.
- **Nunca** escribir "Sin TACC" como si fuera producción propia, ni usar el logo oficial.
- **Nunca prometer tiempos** ("respondemos en 24 hs") en ningún texto.

> 🔲 **Redacción provisoria, a confirmar por Adrián / Giu antes del lanzamiento:**
> *"Las opciones Sin TACC se elaboran a través de un proveedor habilitado y están sujetas
> a disponibilidad. No se elaboran en el taller de Giuliett."*

> ⚠️ **A revisar con Marco y Giu:** `lib/products.ts` dice *"Elaborada sin ingredientes con
> gluten"* en **Marquise** y **Macarons**. Es una afirmación sobre el taller propio que puede
> no corresponder si el Sin TACC es tercerizado. No se tocó: es decisión de la clienta.

### 2. Paleta oficial

La paleta de marca (de `AI_CONTEXT.md` y del manual de Kate) es:

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

> 🔲 **A resolver con Marco antes de tocar nada:** ¿ajuste deliberado o hay que alinear al
> brief? **No cambiar la paleta unilateralmente** — es identidad de marca, no técnica.
> Preguntado en el PR #1.

Los colores se definen **solo** como tokens CSS en `app/globals.css`. Nunca hardcodear
un hex en un componente.

### 3. Performance manda sobre diseño

Si un efecto, animación, fuente o imagen cuesta performance, **se recorta el efecto**.
Core Web Vitals en verde es compromiso contractual de Adrián.

- Animaciones sutiles. Respetar **siempre** `prefers-reduced-motion` (ya está en `globals.css`).
- Nada de dependencias pesadas para efectos. CSS y hooks propios primero.
- **Zod no viaja al navegador**: el formulario valida a mano; Zod solo en servidor.
- Las páginas públicas son **estáticas** (○ en el build). Un formulario nunca debe
  volverlas dinámicas: los parámetros de URL se leen en el cliente, no con `searchParams`.
- Medir con **Lighthouse sobre build de producción**, no en dev.

### 4. Git

- **NUNCA pushear directo a `main`.** Todo entra por rama + Pull Request.
- Ramas: `feat/…`, `fix/…`, `perf/…`, `chore/…`. Commits chicos y frecuentes.
- Commits en **español**, imperativo, describiendo el porqué.
- Un fix detectado en medio de una feature va en **commit aparte**, antes.
- El repo es de Marco: los PRs a `main` van **con @maap00 como reviewer**.

### 5. Copy

- Español **rioplatense** (vos, no tú). Muy breve. Emocional. Nada comercial.
- "Hace falta filtrar": cada pantalla comunica **una sola idea**.
- La fotografía vende, el texto acompaña. No al revés.
- Sin promesas de tiempos de respuesta ni de entrega.

### 6. Mobile first

La mayoría llega desde Instagram y WhatsApp. Se diseña primero para celular.
El usuario debe poder escribir por WhatsApp en **menos de 15 segundos**: por eso el
WhatsApp directo sigue siendo el CTA principal y el formulario es el camino que **registra**.

### 7. Loop Engineering: los tests son la condición de salida

- **Tests primero**, código después. `npm test` en verde + `npm run build` en verde es lo
  que declara "listo", no el juicio del agente.
- Los módulos de reglas (`lib/consultas/*`, `app/api/*`) tienen tests en `test/`.
- **Prueba de mutación** al cerrar un módulo: romper 5-15 reglas a propósito y confirmar
  que la suite las caza. Una suite que no caza la mutación es decorativa.

---

## Stack real

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16.2.6** (App Router, Turbopack, `proxy.ts` en vez de `middleware.ts`) |
| UI | React 19 · TypeScript 5.7.3 |
| Estilos | **Tailwind CSS v4** (`@theme inline` en `globals.css`) |
| Componentes | shadcn + `@base-ui/react` · `lucide-react` |
| Fuentes | `next/font/google`: **Poppins** + **Ephesis** |
| Backend | **Supabase** (Postgres + RLS + Auth) via `@supabase/supabase-js` y `@supabase/ssr` |
| Validación | **Zod 4** (solo servidor) |
| Tests | **Vitest 5** (`npm test`) |
| Analytics | `@vercel/analytics` |
| Deploy | **Vercel** |

El frontend fue generado inicialmente con **v0.app** (`generator: 'v0.app'` en el layout).

---

## Estructura

```
app/
├── layout.tsx                    # metadata global, fuentes, nav
├── globals.css                   # TOKENS de color, radios, sombras, easings
├── page.tsx · giu/ · galeria/    # páginas estáticas
├── productos/[slug]/page.tsx     # ficha + formulario "particular" plegado (<details>)
├── eventos/page.tsx              # 3 propuestas + sección "Tu evento" con el formulario
├── contacto/page.tsx             # formulario con selector de los 4 recorridos
├── api/consultas/route.ts        # POST: valida, anti-spam, guarda en Supabase
├── api/consultas/[id]/whatsapp/  # POST: marca que el usuario abrió WhatsApp
└── admin/                        # panel de consultas (login + lista + detalle)
    ├── acciones.ts               # server actions: login, logout, actualizar
    ├── login/                    # /admin/login
    └── consultas/[id]/           # detalle + seguimiento
components/giuliett/
├── contact-form.tsx              # UN formulario, 4 recorridos, guarda → WhatsApp
└── …                             # componentes de Marco
lib/
├── consultas/
│   ├── tipos.ts                  # recorridos, estados, opción especial, AVISO_SIN_TACC (sin Zod)
│   ├── schema.ts                 # validación Zod (servidor)
│   ├── formularios.ts            # qué campos tiene cada recorrido
│   └── whatsapp.ts               # armado del mensaje, normalización de números
├── supabase/
│   ├── admin.ts                  # clave SECRETA, solo servidor (server-only)
│   └── server.ts                 # cliente con sesión (cookies) para el panel
├── admin/auth.ts                 # requerirAdministrador()
├── giuliett.ts                   # CONTACT, waLink(), EVENTOS
└── products.ts                   # catálogo PRODUCTS (precios incluidos)
proxy.ts                          # protege /admin, refresca la sesión
supabase/migrations/              # esquema versionado (consultas, administradores, RLS)
scripts/crear-admin.mjs           # da acceso al panel a un email
test/                             # Vitest
```

## Fuente de verdad de los datos

| Dato | Dónde |
|---|---|
| Teléfono, email, Instagram, ciudad | `lib/giuliett.ts` → `CONTACT` |
| Productos, precios, galerías | `lib/products.ts` → `PRODUCTS` |
| Fotos de Eventos | `lib/giuliett.ts` → `EVENTOS` |
| **Consultas de clientes** | **Supabase**, tabla `consultas` (se ven en `/admin`) |
| Quién entra al panel | Supabase, tabla `administradores` |

Las **4 categorías** de producto: `tortas-clasicas`, `tortas-personalizadas`,
`galletas-personalizadas`, `boxes`. **Para agregar un producto:** sumar un objeto a
`PRODUCTS` con `slug` único, `category` válida y rutas de imagen que existan.

---

## Variables de entorno

Copiar `.env.example` a `.env.local` (ignorado por git). En Vercel van las mismas tres.

| Variable | Qué es | Dónde se usa |
|---|---|---|
| `SUPABASE_URL` | URL del proyecto | servidor |
| `SUPABASE_PUBLISHABLE_KEY` | clave publicable (`sb_publishable_…`) | panel y `proxy.ts` (sesión) |
| `SUPABASE_SECRET_KEY` | clave secreta (`sb_secret_…`) | **solo** `lib/supabase/admin.ts` y el script de admins |

Ninguna lleva prefijo `NEXT_PUBLIC_`: nada de Supabase viaja al navegador.
Sin variables, la web sigue funcionando: el formulario muestra un error claro con
el WhatsApp directo como salida, y `/admin/login` explica qué falta.

## Comandos

```bash
npm install
npm run dev        # dev server
npm test           # Vitest (condición de salida)
npm run build      # build de producción (obligatorio antes de deploy)
node scripts/crear-admin.mjs correo@ejemplo.com "Nombre"   # acceso al panel
```

⚠️ `npm run lint` **no funciona**: ESLint no está instalado en el repo (pendiente, PR aparte).
⚠️ Si `npm run build` falla **solo** por descarga de Google Fonts, es red, no código.

---

## Cómo funcionan las consultas (Fase B)

1. El usuario completa uno de los **4 recorridos** (`particular`, `evento`, `empresa`,
   `mayorista`) — un solo componente, `<ContactForm origen=…>`.
2. Al enviar, el formulario valida a mano y hace `POST /api/consultas`.
3. La API valida con Zod, frena bots (campo trampa, tiempo mínimo en el formulario,
   límite por IP), evita duplicados (mismo WhatsApp + origen + mensaje en 2 minutos)
   y **guarda la fila con la clave secreta**.
4. Recién entonces el formulario muestra "¡Gracias!" con el botón **Abrir WhatsApp**
   (mensaje ya armado). Si el usuario lo abre, se marca `abrio_whatsapp`.
5. Si la API falla, el formulario ofrece igual el WhatsApp directo: **ninguna consulta se
   pierde por un problema técnico**.
6. Giu entra a `/admin` (email + contraseña), ve las consultas, filtra por estado,
   abre el detalle, le escribe por WhatsApp con un clic y deja notas y estado.
7. El borrador se guarda en `sessionStorage`: si recarga o vuelve atrás, no pierde lo escrito.

**Seguridad:** RLS activo. `anon` no lee ni escribe nada. `authenticated` lee y actualiza
solo si su email está en `administradores` (función `es_administrador()`, security definer).
Nadie borra consultas desde la web.

**Dónde está cada recorrido:**

| Recorrido | Dónde | Cómo se llega |
|---|---|---|
| Particular | `/contacto` (selector, default) y ficha de producto (plegado) | nav "Hacé tu Pedido", producto |
| Evento | `/eventos` (sección final) y `/contacto?para=evento` | página Eventos |
| Empresa | `/contacto?para=empresa` | link en la sección Empresas de `/eventos` |
| Mayorista | `/contacto?para=mayorista` | selector de `/contacto` |

**Para dar acceso al panel a alguien:** `node scripts/crear-admin.mjs email "Nombre"`
(imprime la contraseña una sola vez). En el dashboard de Supabase conviene apagar
"Allow new users to sign up" (Auth → Providers → Email); la allowlist protege igual.

---

## Deuda técnica conocida

Detectada el 22-09-2026. Resolver antes del deploy final:

1. **`next.config.mjs`: `images: { unoptimized: true }`** → `next/image` no optimiza.
   Choca con la regla de performance. PR aparte, hablado con Marco.
2. **`next.config.mjs`: `typescript: { ignoreBuildErrors: true }`** → tapa **7 errores de
   tipos** en `sections/audiences.tsx`, `closing.tsx`, `products.tsx`, `reasons.tsx` y
   `social-proof.tsx` (prop `id` que el componente no acepta; `key` con objeto).
   Arreglarlos y apagar la bandera. `npx tsc --noEmit` los lista.
3. **`/eventos` renderiza 3 veces el botón flotante de WhatsApp** (uno por sección,
   todos `fixed` en el mismo lugar) y **tiene 3 `<h1>`**. Punto 6 del checklist.
4. **Falta metadata por página**: sin `metadataBase`, canonical, Twitter/X, `robots.txt`,
   `sitemap.xml` ni metadata dinámica por producto. Fase C.
5. **La paleta del código no coincide con el brief** (ver Reglas → Paleta).
6. **Higiene:** `package.json` se llama `my-project`; conviven `package-lock.json` y
   `pnpm-lock.yaml`; no hay ESLint aunque `npm run lint` existe.
7. ~~El campo Email decía obligatorio pero no se validaba~~ → resuelto en Fase B: email
   opcional y validado.
8. ~~El formulario no registraba nada~~ → resuelto en Fase B.

---

## Roadmap

### Fase A — Frontend y performance ✅
Maquetado de Marco + optimización de imágenes 232MB → 15MB (−93%).
PR #1: https://github.com/maap00/giuliett-patisserie/pull/1 (pendiente de review de Marco).

### Fase B — Supabase, 4 formularios, Sin TACC legal, registro y panel 🟡
**Código listo y testeado (49 tests + prueba de mutación + build verde).** Falta la
infraestructura, que requiere manos humanas:
- [ ] Crear el proyecto de Supabase (São Paulo) — el permiso de la sesión lo bloqueó.
- [ ] Aplicar `supabase/migrations/20260922120000_consultas.sql`.
- [ ] Cargar `.env.local` con las tres claves y probar el flujo real.
- [ ] Crear el usuario de Giu con `scripts/crear-admin.mjs`.
- [ ] Variables en Vercel (proyecto de Marco → lo carga él, o se hace fork a la cuenta de Adrián).
- [ ] Confirmar la redacción del aviso Sin TACC y del aviso de privacidad.
- [ ] Aviso a Giu por cada consulta nueva (email vía Resend o Telegram) — no está; se pidió panel.

### Fase C — SEO técnico 🔲
Metadata por página, OG por producto, `robots.txt` (con `Disallow: /admin`), `sitemap.xml`,
Schema.org, GA4 / Search Console. Arreglar los 3 `<h1>` de `/eventos`.

### Fase D — CMS con roles (Giu / Jime) 🔲
Arquitectura lista para migrar `PRODUCTS` y `EVENTOS` a datos editables **sin rehacer el
frontend**. ⚠️ No introducir un CMS antes de definir cuál.

### Fase E — Dominio, lanzamiento y capacitación 🔲
Giuliana ya tiene el dominio contratado en **Namecheap** (dato del 22-09-2026; falta el
nombre exacto). DNS, SSL, redirects www, Lighthouse en producción, capacitación del panel.

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
