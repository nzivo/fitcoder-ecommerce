-- Fit Coder: content management — categories become full CRUD, homepage
-- sections/testimonials/FAQs become editable rows, and a Storage bucket is
-- added so the admin dashboard can upload real images instead of pasting URLs.

-- ---------- Storage ----------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ---------- Site sections (hero, story, winter banner, lifestyle banner) ----------

create table if not exists public.site_sections (
  id text primary key,
  eyebrow text,
  title text,
  subtitle text,
  body text,
  image_url text,
  image_url_2 text,
  cta_label text,
  cta_href text,
  cta2_label text,
  cta2_href text,
  updated_at timestamptz not null default now()
);

alter table public.site_sections enable row level security;

drop policy if exists "site sections readable by everyone" on public.site_sections;
create policy "site sections readable by everyone" on public.site_sections
  for select using (true);

drop policy if exists "site sections writable by admins" on public.site_sections;
create policy "site sections writable by admins" on public.site_sections
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists trg_site_sections_updated_at on public.site_sections;
create trigger trg_site_sections_updated_at
  before update on public.site_sections
  for each row execute function public.set_updated_at();

insert into public.site_sections (id, eyebrow, title, subtitle, image_url, cta_label, cta_href, cta2_label, cta2_href) values
  ('hero', 'Lifestyle of Legends', 'Built for those who move different',
   'Heavyweight streetwear designed for those who create their own path.',
   '/lifestyle/hero.svg', 'Shop Now', '/shop', 'Explore Collection', '/shop')
on conflict (id) do nothing;

insert into public.site_sections (id, eyebrow, title, body, image_url, image_url_2, cta_label, cta_href) values
  ('story', 'Our Story', 'Move with Fit Coder Forever',
   'Fit Coder creates exclusive streetwear pieces designed for individuals who embrace creativity, confidence, and originality.',
   '/lifestyle/story-1.svg', '/lifestyle/story-2.svg', 'Our Story', '/contact')
on conflict (id) do nothing;

insert into public.site_sections (id, eyebrow, title, image_url, cta_label, cta_href) values
  ('winter_banner', 'New Drop', 'Winter Collections', '/lifestyle/winter.svg', 'Shop the Collection', '/shop')
on conflict (id) do nothing;

insert into public.site_sections (id, title, subtitle, image_url, cta_label, cta_href) values
  ('lifestyle_banner', 'The Lifestyle of Legends', 'Heavyweight streetwear. Designed in Canada. Shipped worldwide.',
   '/lifestyle/lifestyle-footer.svg', 'Shop All', '/shop')
on conflict (id) do nothing;

-- ---------- Testimonials ----------

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  product_name text,
  rating integer not null default 5 check (rating between 1 and 5),
  quote text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "testimonials readable by everyone" on public.testimonials;
create policy "testimonials readable by everyone" on public.testimonials
  for select using (is_active or public.is_admin());

drop policy if exists "testimonials writable by admins" on public.testimonials;
create policy "testimonials writable by admins" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.testimonials (customer_name, product_name, rating, quote, sort_order) values
  ('Owen Clarke', 'Signature 555 Angel Number', 5, 'If you''re into manifestation and angel numbers this is a must cop. Grey is clean and versatile with everything.', 1),
  ('Tyrese Hamilton', 'Signature 444 Heavyweight', 5, 'Not usually a yellow guy but I saw this on socials and had to try. Got compliments on this all night.', 2),
  ('Andre Whitfield', 'Signature 555 Angel Number', 5, 'Brown shade is perfect, not too dark not too light either. Quality is good, heavy cotton, well made.', 3),
  ('Miguel Santos', 'Signature 222 Heavyweight', 5, 'The red caught my eye so I locked up with 222 meaning. Quality is legit impressive, heavyweight, well made.', 4)
on conflict do nothing;

-- ---------- FAQs ----------

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  placement text not null default 'home' check (placement in ('home', 'shop')),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.faqs enable row level security;

drop policy if exists "faqs readable by everyone" on public.faqs;
create policy "faqs readable by everyone" on public.faqs
  for select using (is_active or public.is_admin());

drop policy if exists "faqs writable by admins" on public.faqs;
create policy "faqs writable by admins" on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.faqs (placement, question, answer, sort_order) values
  ('home', 'How long does delivery take?', 'Standard delivery within Kenya takes 2–4 business days. International orders take 7–14 business days depending on destination.', 1),
  ('home', 'Do you offer refunds?', 'Yes — unworn items in original condition can be returned within 14 days of delivery for a full refund.', 2),
  ('home', 'How do I care for my clothing?', 'Machine wash cold, inside out, with like colors. Tumble dry low or hang dry to preserve print and fabric quality.', 3),
  ('home', 'Where can I track my order?', 'Once your order ships you''ll receive a tracking link by email. You can also view order status from your account page.', 4),
  ('shop', 'How long does it take to get my products?', 'Standard delivery within Kenya takes 2–4 business days. International orders take 7–14 business days depending on destination.', 1),
  ('shop', 'Do you offer refunds or exchanges?', 'Yes — unworn items in original condition can be returned or exchanged within 14 days of delivery.', 2),
  ('shop', 'How do Fit Coder clothes fit?', 'Our pieces run true to size with a relaxed, heavyweight streetwear fit. Check the size guide on each product page if you''re between sizes.', 3),
  ('shop', 'How do I keep my gear fresh? (Care Instructions)', 'Machine wash cold, inside out, with like colors. Tumble dry low or hang dry to preserve print and fabric quality.', 4)
on conflict do nothing;

-- ---------- Categories: add is_active so hidden categories can be staged ----------

alter table public.categories add column if not exists is_active boolean not null default true;

drop policy if exists "categories readable by everyone" on public.categories;
create policy "categories readable by everyone" on public.categories
  for select using (is_active or public.is_admin());
