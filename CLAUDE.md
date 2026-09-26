# Giuliett Pâtisserie — CLAUDE.md

Fuente de verdad técnica del proyecto. Si algo de este archivo choca con una
sugerencia (mía o de una herramienta), **gana este archivo**.

> El brief de marca vive en [`AI_CONTEXT.md`](./AI_CONTEXT.md): filosofía, tono,
> identidad visual, inspiración. Este archivo es la capa técnica. Los dos se leen juntos.

---

## Qué es

Web de **Giuliett Pâtisserie** — pastelería francesa artesanal en Mendoza, Argentina.
No es una landing genérica: es una experiencia premium de boutique francesa.

**Producción (dominio propio, desde el 26-09-2026): https://giuliettpatisserie.com/** — Vercel de
Adrián, proyecto `giuliett-patisserie`, desplegado desde el `main` del fork; `www` redirige (308) al
dominio. La misma build responde también en https://giuliett-patisserie-nu.vercel.app/ (URL técnica).
El Vercel de Marco (https://giuliett-patisserie.vercel.app/) quedó con la versión vieja de su `main`:
**no es la web oficial**.
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
- Medir con **Lighthouse sobre build de producción**, no en dev. La vara oficial es **PageSpeed
  Insights** (pagespeed.web.dev, desde los servidores de Google): Lighthouse en esta PC da números muy
  ruidosos en móvil (el mismo build dio 89 y 58 seguidos por el TBT). La API pública da 429 sin clave:
  usar la web de PSI con Playwright.
- **Imágenes (test/imagenes.test.tsx):** todo `<img>` hecho a mano va con `loading="lazy"`, y cada
  página precarga (next/image `priority`) **una sola** foto, la principal. Un `<img>` sin `lazy` en
  una página que el menú pre-carga se descarga en TODAS las páginas (React 19 le genera una pista
  de precarga en el RSC y Next la ejecuta al pre-cargar el link).

### 4. Git

- **NUNCA pushear directo a `main`.** Todo entra por rama + Pull Request.
- Ramas: `feat/…`, `fix/…`, `perf/…`, `chore/…`. Commits chicos y frecuentes.
- Commits en **español**, imperativo, describiendo el porqué.
- Un fix detectado en medio de una feature va en **commit aparte**, antes.
- **Dónde se trabaja (decisión del 22-09-2026, noche):** un solo repo de trabajo hasta que exista
  la organización de GitHub `giuliett-patisserie` (recomendación aceptada por Adrián; falta el
  OK de Marco para transferir su repo allí). Mientras tanto **los PRs van al repo de Marco**
  (`upstream` = `maap00/giuliett-patisserie`), que es la única verdad. El fork
  `AdrianGarciGeorgel/giuliett-patisserie` (`origin`) es **lo que se publica**: alimenta el Vercel de
  Adrián, que sirve el dominio oficial, y se sincroniza con `upstream` (`git pull upstream main`).
- Marco sigue siendo **reviewer**. PRs abiertos en su repo, **apilados** (cada uno con base en el
  anterior; se mergean en orden): #1 imágenes → #2 consultas → #3 SEO → #4 capa de datos + fix Atrás
  → #5 recuperación de contraseña + aviso + CSP → #6 código sin uso → #7 un solo h1 → #8 imágenes
  (performance). El `main` del fork se lleva a la
  punta de la rama más nueva (`git push origin <rama>:main`; si hubo rebase, `--force-with-lease`).
  ⚠️ **Desde el 26-09-2026 el `main` del fork es PRODUCCIÓN:** cada push sale en vivo en
  https://giuliettpatisserie.com. Antes de empujar: `npm test`, `npm run lint` y `npm run build` en verde.

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
| Componentes | `lucide-react`; `components.json` (shadcn) queda por si se agregan componentes, hoy sin dependencias de shadcn/base-ui |
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
    ├── acciones.ts               # server actions: login, logout, recuperación, contraseña, actualizar
    ├── login/                    # /admin/login (+ link "¿Olvidaste tu contraseña?")
    ├── recuperar/                # pide el email → Supabase manda el enlace
    ├── restablecer/              # elige la contraseña nueva (exige sesión: la del enlace o la del panel)
    ├── auth/callback/route.ts    # canjea el enlace del email por una sesión
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
├── admin/
│   ├── auth.ts                   # requerirAdministrador()
│   ├── rutas.ts                  # rutas públicas del panel, destinoSeguro() (anti open-redirect)
│   └── recuperacion.ts           # reglas de la recuperación de contraseña (puras, testeadas)
├── notificaciones/consulta-nueva.ts  # email a Giu por consulta nueva (Resend por HTTP; apagado sin variables)
├── catalogo.ts                   # ÚNICA puerta a productos/eventos desde app/ y components/
├── giuliett.ts                   # CONTACT, waLink(), EVENTOS (datos crudos)
└── products.ts                   # catálogo PRODUCTS (datos crudos, precios incluidos)
proxy.ts                          # protege /admin, refresca la sesión
supabase/migrations/              # esquema versionado (consultas, administradores, RLS)
scripts/crear-admin.mjs           # da acceso al panel a un email (--sin-contrasena / --nueva-contrasena)
knip.json                         # config de `npx knip` (código y dependencias sin uso)
test/                             # Vitest
```

## Fuente de verdad de los datos

| Dato | Dónde |
|---|---|
| Teléfono, email, Instagram, ciudad | `lib/giuliett.ts` → `CONTACT` |
| Productos, precios, galerías | `lib/products.ts` → `PRODUCTS` (se leen vía `lib/catalogo.ts`) |
| Fotos de Eventos | `lib/giuliett.ts` → `EVENTOS` (se leen vía `lib/catalogo.ts`) |
| **Consultas de clientes** | **Supabase**, tabla `consultas` (se ven en `/admin`) |
| Quién entra al panel | Supabase, tabla `administradores` |

Las **4 categorías** de producto: `tortas-clasicas`, `tortas-personalizadas`,
`galletas-personalizadas`, `boxes`. **Para agregar un producto:** sumar un objeto a
`PRODUCTS` con `slug` único, `category` válida y rutas de imagen que existan.

**Capa de acceso (`lib/catalogo.ts`).** Las páginas y componentes **no importan** `PRODUCTS`,
`getProductBySlug` ni `EVENTOS` directo: usan `getProductos()`, `getProductoPorSlug()`,
`getProductosPorCategoria()`, `getCategorias()` y `getEventos()`. Hoy leen los arrays estáticos;
cuando llegue el CMS (Fase D) cambian solo esas funciones. Un test (`test/catalogo.acceso.test.ts`)
falla si alguien se salta la capa. Son `async` a propósito: el contrato ya es el de una fuente remota.

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
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (opcional; el dominio final) | `lib/seo.ts`: canonical, sitemap, OG, enlaces de los emails. Si falta, usa la URL de producción de Vercel |
| `RESEND_API_KEY` | clave de Resend (opcional) | `lib/notificaciones/consulta-nueva.ts`: aviso a Giu por consulta nueva |
| `AVISOS_EMAIL_DESTINO` | a quién avisar, separado por comas (opcional) | ídem; sin esta y la anterior **no se manda nada** |
| `AVISOS_EMAIL_REMITENTE` | remitente (opcional; por defecto `Giuliett Web <avisos@giuliettpatisserie.com>`) | ídem; debe ser un dominio verificado en Resend (Fase E) |

Ninguna de las de Supabase lleva prefijo `NEXT_PUBLIC_`: nada de Supabase viaja al navegador.
Sin variables, la web sigue funcionando: el formulario muestra un error claro con
el WhatsApp directo como salida, y `/admin/login` explica qué falta.

## Comandos

```bash
npm install
npm run dev        # dev server
npm test           # Vitest (condición de salida)
npm run lint       # ESLint core-web-vitals: 0 errores; los avisos se leen, no frenan
npm run build      # build de producción, valida tipos (obligatorio antes de deploy)
node scripts/crear-admin.mjs correo@ejemplo.com "Nombre"   # acceso al panel (ver "Para dar acceso")
npx knip           # archivos, exports y dependencias sin uso (config en knip.json)
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
8. **Aviso a Giu (opcional):** después de responder, la API manda un email con los datos y el link
   al detalle (`after()` de Next: nunca demora ni rompe el registro; una consulta repetida no
   vuelve a avisar). Se activa con `RESEND_API_KEY` + `AVISOS_EMAIL_DESTINO`; el remitente tiene que
   ser un dominio verificado en Resend → **queda apagado hasta la Fase E**.

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

**Para dar acceso al panel a alguien (hoy, hasta la Fase E):** `node scripts/crear-admin.mjs email "Nombre"`
crea el usuario, lo suma a la allowlist e imprime la contraseña **una sola vez**; se le pasa a la
persona y **apenas entra la cambia** desde el panel (botón *Cambiar contraseña* → `/admin/restablecer`).
Si la olvida: `node scripts/crear-admin.mjs email --nueva-contrasena` (misma mecánica).

**Recuperación por email (`/admin/login` → *¿Olvidaste tu contraseña?*):** el código está completo y
probado end-to-end en el staging (enlace → `/admin/restablecer` → contraseña guardada → panel). ⚠️ Pero
el **email por defecto de Supabase solo llega a miembros del equipo del proyecto** (Adrián sí; Giu
recibiría *Email address not authorized*, y el formulario, a propósito, no lo dice). Queda operativo
para todas en la **Fase E**, con SMTP propio (Resend + dominio). Hasta entonces, `--sin-contrasena`
solo sirve para gente del equipo de Supabase.

**Configuración de Supabase Auth (hecha el 23-09-2026 por Playwright):**
- URL Configuration → **Site URL** = `https://giuliettpatisserie.com` (desde el 26-09-2026).
- URL Configuration → **Redirect URLs** = `https://giuliettpatisserie.com/**`,
  `https://giuliett-patisserie-nu.vercel.app/**` y `http://localhost:3000/**`. Si el enlace del
  email cae en `/admin/login?motivo=enlace-invalido`, lo primero a revisar es esta lista.
- Sign In / Providers → Email → **"Allow new users to sign up" apagado** (la allowlist protege igual).
- **Plantillas de email:** Supabase solo deja editarlas con **SMTP propio**; con el email por defecto
  van en inglés ("Reset your password", remitente `noreply@mail.app.supabase.io`). En Fase E:
  SMTP de Resend con el dominio → plantilla en español cuyo enlace sea
  `{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery` (el callback ya lo acepta).
- El callback acepta los dos formatos: `token_hash`+`type=recovery` y `code` (PKCE, el que usa hoy
  el botón del login).

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
4. ~~Falta metadata por página~~ → **resuelto en Fase C** (`lib/seo.ts`, robots, sitemap, OG, JSON-LD).
5. **La paleta del código no coincide con el brief** (ver Reglas → Paleta). Esperando la
   respuesta de Marco en el PR #1: es identidad, no un bug.
6. ~~`my-project`, dos lockfiles, sin ESLint~~ → **resuelto**: `giuliett-patisserie`, solo
   `package-lock.json`, ESLint instalado con `eslint.config.mjs`.
7. **Avisos de lint conocidos (6, no frenan):** `setState` dentro de efectos en `reveal.tsx` y
   `contact-form.tsx` (sincronizan con IntersectionObserver / sessionStorage; corregirlos es
   refactor); `<img>` en `trusted-clients.tsx` y `why-choose-us.tsx`; `window.location.assign` en
   `hero-carousel.tsx`. **Código sin uso (punto 1):** limpiado el 23-09-2026 con knip — 10
   componentes huérfanos, `getProductBySlug` y 4 dependencias fuera; quedan como *aviso* los exports
   sin uso de `atoms.tsx`, `line-art.tsx`, `Prose`, `AUDIENCES` y `STEPS` (sistema de diseño de
   Marco y datos del Master Plan: se dejan).
8. ~~Email decía obligatorio pero no se validaba~~ → resuelto: opcional y validado.
9. ~~El formulario no registraba nada~~ → resuelto en Fase B.
10. ⚠️ **Vercel en plan Hobby con el dominio comercial ya conectado (26-09-2026).** Los términos de
    Hobby son para uso personal no comercial: pasar a **Pro** (USD 20/mes) es decisión de Adrián y Giu,
    pendiente. La web funciona igual mientras tanto. **Región de Functions: `gru1` (São Paulo), verificada el 23-09-2026** en el header
    `X-Vercel-Id: gru1::gru1::…` de una ruta dinámica. Lo que pasó antes: el plan Hobby permite **una
    sola región** y habían quedado tildadas `iad1` y `gru1` a la vez, con lo que el botón Save no se
    habilitaba; hubo que destildar `iad1`, guardar y redeployar. Si algún día vuelve a `iad1`,
    ese es el primer lugar donde mirar.
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
- [x] **Recuperación y cambio de contraseña** (23-09-2026, PR #5): `/admin/recuperar`, callback,
      `/admin/restablecer`, botón *Cambiar contraseña* en el panel; `proxy.ts` solo abre login,
      recuperar y callback. Sign-ups apagados en Supabase. El email de recuperación llega a todas
      recién con SMTP propio (Fase E); hasta entonces la contraseña inicial la da el script.
- [x] **Usuario de Giu creado (26-09-2026)** con `scripts/crear-admin.mjs`, con el email del negocio
      (el de su cuenta de Namecheap; está en Notion, no en el repo). La contraseña inicial se le pasó a
      Adrián para que se la mande; **Giu la cambia al entrar** (botón *Cambiar contraseña*).
- [x] Aviso a Giu por consulta nueva: **código listo y testeado** (PR #5), apagado hasta tener
      Resend con el dominio verificado (Fase E).
- [x] PR #2 (`feat/supabase-consultas`) abierto en el repo de Marco con Marco como reviewer.
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
      (`next.config.mjs`). **CSP en bloqueo desde el 23-09-2026** (PR #5): calibrada primero en modo
      reporte sobre el staging (9 páginas + panel logueado, 0 avisos) y después enforzada (0 avisos,
      0 requests fallidas). `'unsafe-inline'` en scripts es inevitable hoy (hidratación de Next +
      JSON-LD inline). Para volver al modo reporte: cambiar la clave de la cabecera.
- [x] Un solo `h1` por página. El 22-09 se corrigió `/giu` (tenía cuatro); el **26-09**, en el barrido
      post-deploy sobre el dominio, aparecieron la **home con 4** (uno por slide del carrusel) y
      **galería con 2** (error propio de la Fase C: convertí el `h2` invisible de Marco en `h1` sin ver
      su "Hecho para disfrutar"). Corregido y **cubierto por `test/encabezados.test.tsx`**, que
      renderiza las 7 páginas públicas (PR #7).
- [x] Test de integridad del catálogo (`test/catalogo.test.ts`).
- [x] **Lighthouse (build de producción local, móvil 4G simulado):** Home **91 / 91 / 96 / 100**,
      ficha **91 / 91 / 96 / 100**, desktop **97 / 96 / 96 / 100** (Performance / Accesibilidad /
      Buenas prácticas / SEO). CLS 0, TBT ≤ 100 ms.
- [x] Contraste del nav móvil corregido (etiquetas de 10 px: taupe `#9C8065` → `#7D6650`, 5,1:1)
      y `role="group"` en los indicadores de los tres carruseles (`aria-label` en un `div` sin
      rol está prohibido). **Accesibilidad Lighthouse: 100** en la home (era 91).
- [x] **Auditoría de rutas sobre el staging (23-09-2026, puntos 2 y 3 del checklist):** todas las
      rutas fijas en 200, `/admin` → `/admin/login` (307), `/no-existe` y `/productos/no-existe` en
      404, `/api/consultas` por GET en 405, las **24 URLs del sitemap en 200**, `?categoria=inventada`
      cae en Tortas clásicas. Flujo **Categoría → Producto → Volver**: el botón "Volver" siempre
      funcionó; **"Atrás" del navegador mostraba la categoría anterior** (URL decía galletas, grilla
      mostraba Boxes) → corregido: `ProductCatalog` deriva la categoría de `useSearchParams()` en vez
      de un `useState` (`test/product-catalog.test.tsx`, render SSR con `next/navigation` mockeado).
      Verificado en escritorio (1280) y móvil (390) con Playwright, en las dos direcciones.
- [x] `NEXT_PUBLIC_SITE_URL=https://giuliettpatisserie.com` en Vercel (Production, tipo *Config*) desde
      el 26-09-2026: canonical, sitemap, robots, tarjetas OG y JSON-LD apuntan al dominio.
- [ ] GA4 / Search Console: el dominio ya está; falta decidir la cuenta de Google (ideal: la del
      negocio) y verificar con un registro TXT en Namecheap.
- [x] **Lighthouse en producción (26-09-2026, PageSpeed Insights sobre el dominio).** Primera medición:
      home móvil **83** (LCP 4,4 s, Speed Index 3,8 s). Causa: ~450 KB de imágenes de /contacto que
      bajaban en todas las páginas (ver regla 3, *Imágenes*) + /eventos precargando 3 fotos. Arreglado
      en el PR #8 (`loading="lazy"` en dos `<img>` y `priority` opcional en `HeroCarousel`). Después:
      **home móvil 99 / 100 / 100 / 100** (LCP **2,3 s**, TBT 30 ms, CLS 0, Speed Index 1,5 s) y **ficha
      móvil 98 / 100 / 100 / 100** (LCP 2,5 s). Escritorio (Lighthouse local contra producción): 99.
      Imágenes que baja la home en un celular: 13 (658 KB) → **4 (116 KB)**.
      **Core Web Vitals en verde en producción.**

Notas: el 404 de `/_vercel/insights/script.js` que aparece en local es Vercel Analytics, que solo
existe en Vercel. El viejo aviso de consola "*…was preloaded using link preload but not used*" (torre,
camión, alfajores, giu, logos) venía de /contacto pre-cargado desde el menú: resuelto el 26-09 (PR #8).
Las **previews de Vercel están detrás del login** (`vercel.com/sso-api`);
producción es pública. Para compartir una preview con Giu o Marco hay que apagar la protección
de previews en Settings → Deployment Protection.

### Fase D — CMS con roles (Giu / Jime) 🟡
- [x] Capa de acceso `lib/catalogo.ts` (23-09-2026): todo el frontend lee productos y eventos a
  través de ella. Migrar a datos editables = reimplementar 5 funciones, sin tocar páginas.
- [ ] Definir el CMS (Supabase con tablas `productos`/`eventos` + panel propio es el candidato natural:
  ya hay Auth, RLS y panel). ⚠️ No introducir un CMS antes de definir cuál. **Decisión de Adrián
  (23-09-2026): se define con Marco y Giu; no se arranca por cuenta propia.**
- [ ] Roles (Giu / Jime), carga de fotos, previsualización.

### Fase E — Dominio, lanzamiento y capacitación 🟡
**Dominio conectado el 26-09-2026: https://giuliettpatisserie.com** (Namecheap, a nombre de Giuliana).

**DNS** (Namecheap → Domain List → Manage → Advanced DNS; nameservers *Namecheap BasicDNS*):

| Tipo | Host | Valor | Para qué |
|---|---|---|---|
| A | `@` | `216.198.79.1` | la web (Vercel) |
| CNAME | `www` | `9bcfa4d79efbb484.vercel-dns-017.com.` | `www` → Vercel, que redirige 308 al dominio |
| MX ×5 + TXT (SPF) | `@` | `eforward1…5.registrar-servers.com` · `v=spf1 include:spf.efwd.registrar-servers.com ~all` | **correo**: *Mail Settings = Email Forwarding*; `hola@` reenvía al Gmail del negocio. **No tocar.** |

- Se borró la redirección de estacionamiento que traía Namecheap (`@ → http://www.giuliettpatisserie.com/`,
  que llevaba a un `www` que no existía: por eso el dominio "no cargaba nada").
- Vercel: `giuliettpatisserie.com` → Production; `www.giuliettpatisserie.com` → redirección 308. Certificado
  Let's Encrypt emitido solo (lo renueva Vercel). `http` sube a `https` y hay HSTS.
- Vercel recomienda los valores nuevos (`216.198.79.1`, `…vercel-dns-017.com`); los viejos
  (`76.76.21.21`, `cname.vercel-dns.com`) siguen andando.
- **Namecheap pide verificación de dispositivo** (código al email de la cuenta de Giu) en cada navegador
  nuevo. Lo profesional: que Giu comparta el dominio con una cuenta de Namecheap de Adrián
  (*Sharing & Transfer → Share Access*, permiso de DNS) y que cambie su contraseña.
- El registro vence el **20-07-2027**, con renovación automática y privacidad WHOIS activas.
- "No veo la web nueva en mi PC": es la caché DNS del equipo (TTL de 30 min). `ipconfig /flushdns` o esperar.

**Pendiente de la Fase E:**
- [ ] **Emails del dominio** (aviso por consulta nueva + recuperación de contraseña para cualquier
      administradora): Resend + dominio verificado. ⚠️ Resend pide MX/TXT en `send.` y un TXT DKIM; en
      Namecheap los MX solo se cargan pasando *Mail Settings* a **Custom MX**, y eso borra el reenvío de
      `hola@` **salvo que se vuelvan a cargar a mano los 5 MX `eforward` y el SPF**. Hacerlo con una prueba
      de envío a `hola@` antes y después. Decidir antes de quién es la cuenta de Resend (plan gratis: 3
      dominios, 3.000 mails/mes, 100/día).
- [ ] Supabase → Auth → SMTP con Resend → plantilla "Reset password" en español con
      `{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery` (el callback ya lo acepta).
- [ ] Search Console + GA4 (ver Fase C).
- [ ] Vercel Pro (deuda técnica 10).
- [ ] Capacitación del panel a Giu.
- [ ] **Textos alternativos de las 4 fotos de categoría** (`productCategories` en `lib/giuliett.ts`, las usan
      la home y galería): no describen su foto ("Tortas clásicas" dice *"Cookies artesanales glaseadas…"*).
      Revisarlos mirando cada foto, junto con una pasada de `alt` en todo el catálogo (checklist, punto 9).

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
