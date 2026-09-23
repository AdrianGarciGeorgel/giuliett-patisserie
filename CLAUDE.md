# Giuliett Pâtisserie — CLAUDE.md

Fuente de verdad técnica del proyecto. Si algo de este archivo choca con una
sugerencia (mía o de una herramienta), **gana este archivo**.

> El brief de marca vive en [`AI_CONTEXT.md`](./AI_CONTEXT.md): filosofía, tono,
> identidad visual, inspiración. Este archivo es la capa técnica. Los dos se leen juntos.

---

## Qué es

Web de **Giuliett Pâtisserie** — pastelería francesa artesanal en Mendoza, Argentina.
No es una landing genérica: es una experiencia premium de boutique francesa.

Producción hoy (Vercel de Marco): https://giuliett-patisserie.vercel.app/
Staging (Vercel de Adrián, desde el fork): https://giuliett-patisserie-nu.vercel.app/
Repo de trabajo: `maap00/giuliett-patisserie` hasta que exista la organización (ver Git).

## Equipo

| Quién | Rol |
|---|---|
| **Marco (@maap00)** | Frontend: diseño, componentes, maquetado. Dueño del repo. |
| **Adrián (@AdrianGarciGeorgel)** | Lidera el desarrollo: backend, formularios, CMS, SEO, deploy. |
| **Giuliana (Giu)** | La clienta. Dueña de la marca y del dominio `giuliettpatisserie.com`. Usa el panel. |
| **Cecilia Frías** | Ingeniera comercial de Giu. Autora del brief de traspaso de la App de Cocina. |

**Proyecto hermano (otro repo, misma clienta):** la **App de Cocina y Administración**
(pedidos, producción, stock, finanzas con sueldos confidenciales), hoy en ChatGPT Sites +
Cloudflare D1, a migrar a Next.js + Supabase + Vercel. Ficha en Notion:
*Giuliett — App de Cocina y Administración (traspaso)*. Comparte stack y auth con este
panel; no mezclar repos.

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

> ✅ **Redacción confirmada por Adrián (22-09-2026):**
> *"Las opciones Sin TACC se elaboran a través de un proveedor habilitado y están sujetas
> a disponibilidad. No se elaboran en el taller de Giuliett."*

> ✅ **Decisión (Adrián, 22-09-2026):** el copy *"Elaborada sin ingredientes con gluten"* de
> **Marquise** y **Macarons** en `lib/products.ts` **se respeta tal cual**. No reabrir.

El aviso de privacidad bajo el botón (*"Usamos tus datos solo para responder esta consulta.
No los compartimos con nadie."*) también quedó confirmado el 22-09-2026.

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
- **Dónde se trabaja (decisión del 22-09-2026, noche):** un solo repo de trabajo hasta que exista
  la organización de GitHub `giuliett-patisserie` (recomendación aceptada por Adrián; falta el
  OK de Marco para transferir su repo allí). Mientras tanto **los PRs van al repo de Marco**
  (`upstream` = `maap00/giuliett-patisserie`), que es la única verdad. El fork
  `AdrianGarciGeorgel/giuliett-patisserie` (`origin`) es **staging**: alimenta el Vercel de
  Adrián y se sincroniza con `upstream` (`git pull upstream main`).
- Marco sigue siendo **reviewer**. El PR #1 está abierto en el repo de Marco.

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
| Framework | **Next.js 16.3.6** (App Router, Turbopack, `proxy.ts` en vez de `middleware.ts`). Mantenerlo al día: `npm audit` en cada sprint |
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
Proyecto de Supabase: **`giuliett-patisserie`**, ref `evpuimzqgkxfwbifnbgf`, región São Paulo,
organización de Adrián. Creado y migrado el 22-09-2026. El conector MCP de Supabase **no
expone la clave secreta**: sale del dashboard (API Keys → Copy).
Vercel: proyecto `giuliett-patisserie` (`prj_3H5SN1fT4uk5FAhgh6mTsxeZE9sH`) en el equipo
`adriangarcigeorgels-projects`. El conector de Vercel **solo lee** (403 al crear/actualizar):
la configuración se toca en el dashboard, o con Playwright sobre la sesión de Adrián.

| Variable | Qué es | Dónde se usa |
|---|---|---|
| `SUPABASE_URL` | URL del proyecto | servidor |
| `SUPABASE_PUBLISHABLE_KEY` | clave publicable (`sb_publishable_…`) | panel y `proxy.ts` (sesión) |
| `SUPABASE_SECRET_KEY` | clave secreta (`sb_secret_…`) | **solo** `lib/supabase/admin.ts` y el script de admins |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (opcional; el dominio final) | `lib/seo.ts`: canonical, sitemap, OG. Si falta, usa la URL de producción de Vercel |

Ninguna lleva prefijo `NEXT_PUBLIC_`: nada de Supabase viaja al navegador.
Sin variables, la web sigue funcionando: el formulario muestra un error claro con
el WhatsApp directo como salida, y `/admin/login` explica qué falta.

## Comandos

```bash
npm install
npm run dev        # dev server
npm test           # Vitest (condición de salida)
npm run lint       # ESLint core-web-vitals: 0 errores; los avisos se leen, no frenan
npm run build      # build de producción, valida tipos (obligatorio antes de deploy)
node scripts/crear-admin.mjs correo@ejemplo.com "Nombre"   # acceso al panel
```

⚠️ Si `npm run build` falla **solo** por descarga de Google Fonts, es red, no código.
El repo usa **npm** (un solo lockfile, `package-lock.json`). No agregar `pnpm-lock.yaml`.

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

Detectada el 22-09-2026. Lo resuelto se resolvió con el menor impacto posible (decisión de Adrián).

1. ~~`images: { unoptimized: true }`~~ → **resuelto**: `next/image` optimiza (WebP/AVIF y
   tamaños por dispositivo). Los `<Image fill sizes=…>` de Marco ya estaban listos para esto.
2. ~~`ignoreBuildErrors: true` tapaba 7 errores de tipos~~ → **resuelto**: `SectionLockup`
   acepta `id`; `social-proof.tsx` renderiza `client.text`. La bandera se apagó: el build
   valida tipos.
3. ~~3 botones flotantes de WhatsApp y 3 `<h1>` en `/eventos`~~ → **resuelto**: un botón por
   página; la primera propuesta es `h1`, las otras `h2`, mismo estilo visual.
4. **Falta metadata por página**: sin `metadataBase`, canonical, Twitter/X, `robots.txt`,
   `sitemap.xml` ni metadata dinámica por producto. Fase C.
5. **La paleta del código no coincide con el brief** (ver Reglas → Paleta). Esperando la
   respuesta de Marco en el PR #1: es identidad, no un bug.
6. ~~`my-project`, dos lockfiles, sin ESLint~~ → **resuelto**: `giuliett-patisserie`, solo
   `package-lock.json`, ESLint instalado con `eslint.config.mjs`.
7. **Avisos de lint conocidos (no frenan):** `setState` dentro de efectos en `reveal.tsx`,
   `sections/products.tsx` y `contact-form.tsx` (sincronizan con IntersectionObserver /
   sessionStorage; corregirlos es refactor); `<img>` en `trusted-clients.tsx` y
   `why-choose-us.tsx`; `window.location.assign` en `hero-carousel.tsx`.
8. ~~Email decía obligatorio pero no se validaba~~ → resuelto: opcional y validado.
9. ~~El formulario no registraba nada~~ → resuelto en Fase B.
10. **Vercel en plan Hobby** (según sus términos, uso no comercial): pasar a **Pro** al lanzar
    con dominio. Región de Functions: Adrián la cambió a `gru1` (São Paulo) el 23-09-2026, pero el
    primer deploy posterior seguía reportando `iad1` → **verificar en el próximo deploy** (Vercel →
    Deployments → el deploy → "Regions"); si sigue en `iad1`, rehacer Settings → Functions → Save.
11. **Rotación de la clave secreta (22/23-09-2026):** `giuliett_servidor` es la clave en uso
    (`.env.local` y Vercel, probada). `servidor_web` fue borrada. La secreta `default` de Supabase
    **no se puede borrar desde el menú de la fila** (Supabase la protege): queda sin usar. Si algún
    día hace falta rotar de nuevo: New secret key → `.env.local` → Vercel (lo pega Adrián) → borrar.

---

## Roadmap

### Fase A — Frontend y performance ✅
Maquetado de Marco + optimización de imágenes 232MB → 15MB (−93%).
PR #1: https://github.com/maap00/giuliett-patisserie/pull/1 (pendiente de review de Marco).

### Fase B — Supabase, 4 formularios, Sin TACC legal, registro y panel 🟡
**Código listo y testeado (49 tests + prueba de mutación 15/15 + build verde + Playwright).**
- [x] Proyecto de Supabase creado: `evpuimzqgkxfwbifnbgf` (São Paulo), 22-09-2026.
- [x] Migración aplicada (+ `revoke execute … from anon` sobre `es_administrador()`).
- [x] `.env.local` completo con las tres claves (la secreta se copió del dashboard con
      Playwright, sin pasar por el chat). Nunca commitear, nunca pegar en un chat.
- [x] Aviso Sin TACC y aviso de privacidad confirmados.
- [x] Fork a la cuenta de Adrián (hoy: staging).
- [x] **Staging en Vercel**: https://giuliett-patisserie-nu.vercel.app (cuenta de Adrián,
      importado desde el fork con Playwright; las 3 variables cargadas subiendo `.env.local`
      con "Import .env"; Deployment Protection apagada para que Giu y Marco puedan verlo).
      Hoy sirve `main` del fork = el `main` de Marco; la Fase B se ve cuando se mergee.
- [x] **Prueba real contra Supabase (22-09-2026):** la API guarda, el doble envío no duplica,
      el flag de WhatsApp se marca; panel: login, lista con conteos, detalle, cambio de estado
      y notas, todo persistido. Datos de prueba borrados (fila y usuario descartable).
- [ ] Usuario de Giu con `scripts/crear-admin.mjs` (esperando su email). Apagar
      "Allow new users to sign up" en Auth → Providers → Email.
- [ ] Aviso a Giu por cada consulta nueva (email vía Resend o Telegram) — se pidió panel primero.
- [ ] PR #2 (`feat/supabase-consultas` → `main` del **repo de Marco**) con Marco como reviewer.
- [ ] Organización de GitHub `giuliett-patisserie` (esperando el OK de Marco) y, después,
      reconectar el Vercel al repo de la organización.

### Fase C — SEO técnico 🟡 (rama `feat/seo-tecnico`, 22-09-2026)
- [x] `lib/seo.ts` con tests: URL del sitio, metadata, robots, sitemap, Schema.org.
- [x] Título, descripción, canonical, Open Graph y Twitter en las 6 páginas; `generateMetadata`
      en la ficha de producto, que pasa a **estática** (`generateStaticParams`).
- [x] `/robots.txt` (bloquea `/admin` y `/api`) y `/sitemap.xml` (24 URLs).
- [x] JSON-LD: `Bakery` en todo el sitio; `Product` + `Offer` + `BreadcrumbList` por producto.
- [x] Tarjetas Open Graph generadas (`app/opengraph-image.tsx` y por producto): JPEG de ~60 KB
      con foto + nombre + precio y paleta oficial. `sharp` **siempre en la misma versión que
      trae Next** (hoy 0.35.4): dos versiones conviviendo rompen el build (`colourspace`).
- [x] **Seguridad (punto 10):** `npm audit` en 0 (Next 16.3.6 cerró una crítica de bypass del
      proxy); cabeceras `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
      `Permissions-Policy` en todo el sitio y `noindex` + `no-store` en `/admin`
      (`next.config.mjs`). Sin CSP todavía (JSON-LD inline).
- [x] Un solo `h1` por página (`/giu` tenía cuatro, `/galeria` ninguno).
- [x] Test de integridad del catálogo (`test/catalogo.test.ts`).
- [x] **Lighthouse (build de producción local, móvil 4G simulado):** Home **91 / 91 / 96 / 100**,
      ficha **91 / 91 / 96 / 100**, desktop **97 / 96 / 96 / 100** (Performance / Accesibilidad /
      Buenas prácticas / SEO). CLS 0, TBT ≤ 100 ms. Pendiente medir en producción con dominio.
- [x] Contraste del nav móvil corregido (etiquetas de 10 px: taupe `#9C8065` → `#7D6650`, 5,1:1)
      y `role="group"` en los indicadores de los tres carruseles (`aria-label` en un `div` sin
      rol está prohibido). **Accesibilidad Lighthouse: 100** en la home (era 91).
- [ ] `NEXT_PUBLIC_SITE_URL` en Vercel cuando exista el dominio (hoy usa la URL de producción de
      Vercel sola).
- [ ] GA4 / Search Console (necesita el dominio y una cuenta de Google de Giuliett).
- [ ] Medir Lighthouse en producción y revisar el LCP móvil (3,4 s simulado: hero image).

Notas: el 404 de `/_vercel/insights/script.js` que aparece en local es Vercel Analytics, que solo
existe en Vercel. Las **previews de Vercel están detrás del login** (`vercel.com/sso-api`);
producción es pública. Para compartir una preview con Giu o Marco hay que apagar la protección
de previews en Settings → Deployment Protection.

### Fase D — CMS con roles (Giu / Jime) 🔲
Arquitectura lista para migrar `PRODUCTS` y `EVENTOS` a datos editables **sin rehacer el
frontend**. ⚠️ No introducir un CMS antes de definir cuál.

### Fase E — Dominio, lanzamiento y capacitación 🔲
**Dominio: `giuliettpatisserie.com`** (Namecheap, a nombre de Giuliana; confirmado el 23-09-2026).
Plan: agregar el dominio al proyecto de Vercel de Adrián (Domains → Add, con `www` redirigiendo
al apex) → cargar en Namecheap los registros que Vercel indique (A / CNAME) → SSL automático →
`NEXT_PUBLIC_SITE_URL=https://giuliettpatisserie.com` en Vercel → redeploy → Lighthouse en
producción → Search Console y GA4 → capacitación del panel. Hasta que el DNS apunte, **no**
poner el dominio en `NEXT_PUBLIC_SITE_URL` (canonical y sitemap apuntarían a algo que no responde).

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
