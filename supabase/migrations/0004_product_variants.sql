-- Fit Coder: per-variant (size × color) stock tracking.
--
-- products.stock stays as the aggregate total, kept in sync by trigger
-- whenever a product has variant rows. Products with no variant rows
-- (e.g. products with no sizes/colors) keep working exactly as before —
-- decrement_variant_stock falls back to decrementing products.stock
-- directly when no matching variant exists.

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null default '',
  color text not null default '',
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size, color)
);

create index if not exists idx_product_variants_product on public.product_variants (product_id);

drop trigger if exists trg_product_variants_updated_at on public.product_variants;
create trigger trg_product_variants_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

-- ---------- Keep products.stock as the sum of its variants ----------

create or replace function public.sync_product_stock()
returns trigger as $$
declare
  affected_product uuid := coalesce(new.product_id, old.product_id);
begin
  update public.products
  set stock = (
    select coalesce(sum(stock), 0)
    from public.product_variants
    where product_id = affected_product
  )
  where id = affected_product;
  return null;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_product_variants_sync_stock on public.product_variants;
create trigger trg_product_variants_sync_stock
  after insert or update or delete on public.product_variants
  for each row execute function public.sync_product_stock();

-- ---------- Variant-aware stock decrement ----------

create or replace function public.decrement_variant_stock(
  p_product_id uuid,
  p_size text,
  p_color text,
  p_quantity integer
)
returns void as $$
declare
  matched integer;
begin
  update public.product_variants
  set stock = greatest(0, stock - p_quantity)
  where product_id = p_product_id
    and size = coalesce(p_size, '')
    and color = coalesce(p_color, '');
  get diagnostics matched = row_count;

  if matched = 0 then
    update public.products
    set stock = greatest(0, stock - p_quantity)
    where id = p_product_id;
  end if;
end;
$$ language plpgsql security definer set search_path = public;

-- ---------- RLS ----------

alter table public.product_variants enable row level security;

drop policy if exists "product variants readable by everyone" on public.product_variants;
create policy "product variants readable by everyone" on public.product_variants
  for select using (true);

drop policy if exists "product variants writable by admins" on public.product_variants;
create policy "product variants writable by admins" on public.product_variants
  for all using (public.is_admin()) with check (public.is_admin());
