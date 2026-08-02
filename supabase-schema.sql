-- ============================================================
-- NIRMATA ORDERING SYSTEM - Auto Order Number Generator
-- ============================================================
-- I-run mo ito sa Supabase Dashboard > SQL Editor > New Query
-- Layunin: awtomatikong gagawa ng order_number tulad ng
-- NIR-2026-0001, NIR-2026-0002, atbp. tuwing may bagong order.
-- ============================================================

create sequence if not exists orders_order_number_seq start 1;

create or replace function generate_order_number()
returns trigger as $$
begin
  if new.order_number is null then
    new.order_number := 'NIR-' || extract(year from now())::text
      || '-' || lpad(nextval('orders_order_number_seq')::text, 4, '0');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_generate_order_number on public.orders;

create trigger trg_generate_order_number
before insert on public.orders
for each row
execute function generate_order_number();

-- ============================================================
-- OPTIONAL: Storage policies para sa file upload feature
-- Gawin muna ang bucket na "order-files" sa Storage section ng
-- Supabase dashboard bago i-run ang mga policy na ito.
-- ============================================================

-- Payagan ang sinuman (kahit hindi naka-login) na mag-upload ng file
create policy "Anyone can upload order files"
on storage.objects
for insert
to anon
with check (bucket_id = 'order-files');

-- Payagan na makita/ma-access ang mga na-upload na file (para gumana
-- ang file_url na naka-save sa orders table)
create policy "Anyone can view order files"
on storage.objects
for select
to anon
using (bucket_id = 'order-files');
