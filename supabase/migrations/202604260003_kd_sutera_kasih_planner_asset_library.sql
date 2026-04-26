alter table public.kd_sutera_kasih_planner_assets
  add column if not exists collection text not null default 'props',
  add column if not exists subtype text not null default 'decor',
  add column if not exists category text not null default 'decor',
  add column if not exists note text,
  add column if not exists zone_hint text,
  add column if not exists shape text not null default 'rectangle',
  add column if not exists color text not null default '#d9c2a3',
  add column if not exists width integer not null default 24,
  add column if not exists depth integer not null default 24,
  add column if not exists height integer not null default 24,
  add column if not exists mesh_height integer not null default 12,
  add column if not exists icon_name text not null default 'layout_grid',
  add column if not exists sort_order integer not null default 999,
  add column if not exists fallback_model_filename text,
  add column if not exists model_rotation_offset numeric(8,2),
  add column if not exists model_scale_multiplier numeric(8,2);

alter table public.kd_sutera_kasih_planner_assets
  drop constraint if exists kd_sutera_kasih_planner_assets_collection_check;

alter table public.kd_sutera_kasih_planner_assets
  add constraint kd_sutera_kasih_planner_assets_collection_check
  check (collection in ('furniture', 'props', 'butterfly_companion'));

alter table public.kd_sutera_kasih_planner_assets
  drop constraint if exists kd_sutera_kasih_planner_assets_subtype_check;

alter table public.kd_sutera_kasih_planner_assets
  add constraint kd_sutera_kasih_planner_assets_subtype_check
  check (subtype in ('chairs', 'tables', 'seating', 'service', 'stage', 'wall', 'floor', 'decor', 'butterfly_companion'));

alter table public.kd_sutera_kasih_planner_assets
  drop constraint if exists kd_sutera_kasih_planner_assets_category_check;

alter table public.kd_sutera_kasih_planner_assets
  add constraint kd_sutera_kasih_planner_assets_category_check
  check (category in ('furniture', 'decor', 'companion'));

alter table public.kd_sutera_kasih_planner_assets
  drop constraint if exists kd_sutera_kasih_planner_assets_shape_check;

alter table public.kd_sutera_kasih_planner_assets
  add constraint kd_sutera_kasih_planner_assets_shape_check
  check (shape in ('rectangle', 'circle'));

create table if not exists public.kd_sutera_kasih_planner_asset_variants (
  variant_id text primary key,
  planner_item_id text not null references public.kd_sutera_kasih_planner_assets(planner_item_id) on delete cascade,
  label text not null,
  description text not null default '',
  bucket_id text not null default 'kd_sutera_kasih_planner_assets',
  color text,
  width integer,
  depth integer,
  height integer,
  mesh_height integer,
  shape text,
  sort_order integer not null default 999,
  fallback_model_filename text,
  model_storage_path text,
  model_public_url text,
  model_filename text,
  model_rotation_offset numeric(8,2),
  model_scale_multiplier numeric(8,2),
  thumbnail_storage_path text,
  thumbnail_public_url text,
  thumbnail_filename text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.kd_sutera_kasih_planner_asset_variants
  drop constraint if exists kd_sutera_kasih_planner_asset_variants_shape_check;

alter table public.kd_sutera_kasih_planner_asset_variants
  add constraint kd_sutera_kasih_planner_asset_variants_shape_check
  check (shape is null or shape in ('rectangle', 'circle'));

alter table public.kd_sutera_kasih_planner_asset_variants enable row level security;

grant select on public.kd_sutera_kasih_planner_asset_variants to anon;
grant select on public.kd_sutera_kasih_planner_asset_variants to authenticated;
grant insert, update, delete on public.kd_sutera_kasih_planner_asset_variants to authenticated;

drop policy if exists kd_sutera_kasih_planner_asset_variants_select_public on public.kd_sutera_kasih_planner_asset_variants;
create policy kd_sutera_kasih_planner_asset_variants_select_public
on public.kd_sutera_kasih_planner_asset_variants
for select
using (
  is_active
  or public.kd_sutera_kasih_is_admin(auth.uid())
);

drop policy if exists kd_sutera_kasih_planner_asset_variants_insert_admin on public.kd_sutera_kasih_planner_asset_variants;
create policy kd_sutera_kasih_planner_asset_variants_insert_admin
on public.kd_sutera_kasih_planner_asset_variants
for insert
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_planner_asset_variants_update_admin on public.kd_sutera_kasih_planner_asset_variants;
create policy kd_sutera_kasih_planner_asset_variants_update_admin
on public.kd_sutera_kasih_planner_asset_variants
for update
using (public.kd_sutera_kasih_is_admin(auth.uid()))
with check (public.kd_sutera_kasih_is_admin(auth.uid()));

drop policy if exists kd_sutera_kasih_planner_asset_variants_delete_admin on public.kd_sutera_kasih_planner_asset_variants;
create policy kd_sutera_kasih_planner_asset_variants_delete_admin
on public.kd_sutera_kasih_planner_asset_variants
for delete
using (public.kd_sutera_kasih_is_admin(auth.uid()));

drop trigger if exists kd_sutera_kasih_planner_assets_touch_updated_at on public.kd_sutera_kasih_planner_assets;
create trigger kd_sutera_kasih_planner_assets_touch_updated_at
before update on public.kd_sutera_kasih_planner_assets
for each row execute function public.kd_sutera_kasih_touch_updated_at();

drop trigger if exists kd_sutera_kasih_planner_asset_variants_touch_updated_at on public.kd_sutera_kasih_planner_asset_variants;
create trigger kd_sutera_kasih_planner_asset_variants_touch_updated_at
before update on public.kd_sutera_kasih_planner_asset_variants
for each row execute function public.kd_sutera_kasih_touch_updated_at();
