-- Fase B — registro de consultas y acceso al panel.
--
-- Se aplica al proyecto de Supabase (dashboard → SQL editor, o MCP). Vive en
-- el repo para que el esquema esté versionado junto al código que lo usa.

-- ---------------------------------------------------------------------------
-- consultas: lo que entra por los cuatro recorridos del Master Plan
-- (particular, evento, empresa, mayorista). Se guarda ANTES de abrir WhatsApp,
-- así ninguna consulta se pierde.
-- ---------------------------------------------------------------------------
create table public.consultas (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- de qué recorrido vino
  origen            text not null
                    check (origen in ('particular', 'evento', 'empresa', 'mayorista')),

  -- contacto
  nombre            text not null check (char_length(nombre) between 2 and 120),
  whatsapp          text not null check (char_length(whatsapp) between 6 and 30),
  email             text check (email is null or char_length(email) <= 160),
  empresa           text check (empresa is null or char_length(empresa) <= 120),   -- empresa o nombre del local
  localidad         text check (localidad is null or char_length(localidad) <= 120),

  -- el pedido
  tipo_pedido       text check (tipo_pedido is null or char_length(tipo_pedido) <= 60),
  fecha_evento      date,
  cantidad_personas integer
                    check (cantidad_personas is null or cantidad_personas between 1 and 100000),
  volumen           text check (volumen is null or char_length(volumen) <= 120),     -- mayoristas
  frecuencia        text check (frecuencia is null or char_length(frecuencia) <= 40), -- mayoristas
  tematica          text check (tematica is null or char_length(tematica) <= 120),
  intereses         text[] not null default '{}',
  -- "¿Necesitás una opción especial?" — obligatorio (Master Plan v2, Sin TACC tercerizado)
  opcion_especial   text not null default 'ninguna'
                    check (opcion_especial in ('ninguna', 'sin_tacc', 'otra')),
  mensaje           text check (mensaje is null or char_length(mensaje) <= 2000),

  -- trazabilidad: para saber qué vende y desde dónde
  producto_slug     text check (producto_slug is null or char_length(producto_slug) <= 80),
  pagina_origen     text check (pagina_origen is null or char_length(pagina_origen) <= 200),
  utm               jsonb,

  -- operación: el seguimiento que hace Giu desde el panel
  estado            text not null default 'nueva'
                    check (estado in ('nueva', 'contactada', 'presupuestada', 'cerrada', 'perdida')),
  notas_internas    text check (notas_internas is null or char_length(notas_internas) <= 4000),
  abrio_whatsapp    boolean not null default false
);

comment on table public.consultas is
  'Consultas que entran por los formularios de la web. Se guardan antes de abrir WhatsApp.';

create index consultas_created_at_idx on public.consultas (created_at desc);
create index consultas_estado_idx     on public.consultas (estado);

-- updated_at automático al editar desde el panel
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

create trigger consultas_set_updated_at
  before update on public.consultas
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- administradores: allowlist de emails que pueden entrar al panel /admin.
-- Tener usuario en Auth no alcanza: además hay que estar en esta tabla.
-- ---------------------------------------------------------------------------
create table public.administradores (
  email       text primary key,
  nombre      text,
  created_at  timestamptz not null default now()
);

comment on table public.administradores is
  'Allowlist de emails con acceso al panel /admin. Se carga con scripts/crear-admin.mjs.';

-- ¿El usuario logueado está en la allowlist?
-- security definer: la policy de consultas la usa sin abrir administradores al público.
create or replace function public.es_administrador()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.administradores a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- El esquema public otorga EXECUTE a anon por defecto: se revoca explícito.
revoke all on function public.es_administrador() from public, anon;
grant execute on function public.es_administrador() to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
--   anon          → ninguna policy: no lee ni escribe. Los inserts entran por el
--                   servidor de Next con la clave secreta (que saltea RLS).
--   authenticated → lee y actualiza SOLO si está en administradores. Nunca borra.
-- ---------------------------------------------------------------------------
alter table public.consultas       enable row level security;
alter table public.administradores enable row level security;

create policy "administradores leen consultas"
  on public.consultas
  for select
  to authenticated
  using ((select public.es_administrador()));

create policy "administradores actualizan consultas"
  on public.consultas
  for update
  to authenticated
  using ((select public.es_administrador()))
  with check ((select public.es_administrador()));

-- administradores no tiene policies a propósito: nadie la lee desde el cliente,
-- solo la función es_administrador().
