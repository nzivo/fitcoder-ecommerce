-- Dope Beyond: core schema, RLS policies, and starter seed data.

create extension if not exists "pgcrypto";

-- ---------- Tables ----------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2),
  currency text not null default 'KES',
  category_id uuid references public.categories (id) on delete set null,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal numeric(10, 2) not null default 0,
  shipping_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  currency text not null default 'KES',
  paystack_reference text unique,
  shipping_address jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  product_image text,
  price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  size text,
  color text
);

create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_orders_user on public.orders (user_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_order_items_order on public.order_items (order_id);

-- ---------- updated_at trigger ----------

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------- New user -> profile row ----------

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Stock helper ----------

create or replace function public.decrement_stock(p_product_id uuid, p_quantity integer)
returns void as $$
  update public.products
  set stock = greatest(0, stock - p_quantity)
  where id = p_product_id;
$$ language sql security definer set search_path = public;

-- ---------- RLS ----------

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$ language sql security definer stable set search_path = public;

-- Categories: public read, admin write.
create policy "categories readable by everyone" on public.categories
  for select using (true);
create policy "categories writable by admins" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- Products: public read of active products, admins see/manage everything.
create policy "active products readable by everyone" on public.products
  for select using (is_active or public.is_admin());
create policy "products writable by admins" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- Profiles: users read/update their own row, admins read all.
create policy "profiles readable by owner or admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles updatable by owner" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Orders: customers see their own orders, admins see/manage all.
-- Order creation happens server-side via the service-role key (Paystack webhook),
-- so there is no public insert policy here.
create policy "orders readable by owner or admin" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "orders writable by admins" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());
create policy "orders deletable by admins" on public.orders
  for delete using (public.is_admin());

-- Order items follow their parent order's visibility.
create policy "order items readable by owner or admin" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );
create policy "order items writable by admins" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Seed data ----------

insert into public.categories (name, slug, image_url, sort_order) values
  ('Angel Collection', 'angel-collection', null, 1),
  ('Hoodies', 'hoodies', null, 2),
  ('Sweatpants', 'sweatpants', null, 3),
  ('Jackets', 'jackets', null, 4)
on conflict (slug) do nothing;

insert into public.products (name, slug, description, price, compare_at_price, category_id, images, sizes, colors, stock, is_featured)
select
  p.name, p.slug, p.description, p.price, p.compare_at_price,
  c.id, p.images, p.sizes, p.colors, p.stock, p.is_featured
from (values
  ('Signature 555 Angel Number Hoodie — Brown', 'signature-555-angel-hoodie-brown',
   'Heavyweight fleece hoodie with embroidered angel-number graphic.', 119.99, null,
   'hoodies', array['/products/placeholder-1.svg'], array['S','M','L','XL','XXL'], array['Brown'], 24, true),
  ('Signature 11:11 Heavyweight Hoodie — Grey', 'signature-1111-heavyweight-hoodie-grey',
   'Heavyweight fleece hoodie, relaxed streetwear fit.', 119.99, null,
   'hoodies', array['/products/placeholder-2.svg'], array['S','M','L','XL','XXL'], array['Grey'], 18, true),
  ('Signature 777 Lightning Graphic Hoodie — Black', 'signature-777-lightning-hoodie-black',
   'Bold graphic hoodie with lightning bolt print.', 119.99, null,
   'hoodies', array['/products/placeholder-3.svg'], array['S','M','L','XL','XXL'], array['Black'], 30, true),
  ('Signature 222 Heavyweight Hoodie — Red', 'signature-222-heavyweight-hoodie-red',
   'Heavyweight fleece hoodie in signature red.', 119.99, null,
   'hoodies', array['/products/placeholder-4.svg'], array['S','M','L','XL','XXL'], array['Red'], 12, true),
  ('Legends Essential Joggers — Jet Black', 'legends-essential-joggers-jet-black',
   'Tapered fleece joggers with ribbed cuffs.', 79.99, 109.99,
   'sweatpants', array['/products/placeholder-5.svg'], array['S','M','L','XL'], array['Black'], 40, false),
  ('Signature Heavyweight Zip Jacket — Ink Navy', 'signature-heavyweight-zip-jacket-navy',
   'Full-zip heavyweight jacket built for layering.', 129.99, 169.99,
   'jackets', array['/products/placeholder-6.svg'], array['S','M','L','XL'], array['Navy'], 15, false)
) as p(name, slug, description, price, compare_at_price, category_slug, images, sizes, colors, stock, is_featured)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do nothing;
