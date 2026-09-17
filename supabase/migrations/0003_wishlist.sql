-- Fit Coder: per-user product wishlist.

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists idx_wishlist_items_user on public.wishlist_items (user_id);

alter table public.wishlist_items enable row level security;

-- Wishlist items are private to the account that saved them.
drop policy if exists "wishlist items readable by owner" on public.wishlist_items;
create policy "wishlist items readable by owner" on public.wishlist_items
  for select using (auth.uid() = user_id);

drop policy if exists "wishlist items insertable by owner" on public.wishlist_items;
create policy "wishlist items insertable by owner" on public.wishlist_items
  for insert with check (auth.uid() = user_id);

drop policy if exists "wishlist items deletable by owner" on public.wishlist_items;
create policy "wishlist items deletable by owner" on public.wishlist_items
  for delete using (auth.uid() = user_id);
