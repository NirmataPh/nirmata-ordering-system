# Nirmata Ordering System - Order Form Setup

Ito yung actual na order form na kumokonekta sa Supabase orders table mo.
Sundin mo lang itong mga hakbang para gumana ito.

## 1. I-configure ang Supabase connection

Buksan mo ang `script.js` at palitan ang dalawang linyang ito:

```
const SUPABASE_URL = "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";
```

Makukuha mo ang values na ito sa Supabase Dashboard:
Project Settings > API > Project URL at anon public key.

## 2. I-run ang SQL para sa auto order number

1. Pumunta sa Supabase Dashboard > SQL Editor > New Query
2. I-paste at i-run ang buong laman ng `supabase-schema.sql`
3. Ito ang gagawa ng auto order number tulad ng NIR-2026-0001, NIR-2026-0002, atbp.
   tuwing may bagong order na na-submit.

## 3. Gawin ang Storage bucket (kung gagamitin ang file upload)

1. Sa Supabase Dashboard, pumunta sa Storage
2. I-click ang "New bucket"
3. Pangalanan ng `order-files`
4. I-save, tapos balikan mo ang SQL Editor para i-run ang storage policies
   na nasa dulo ng `supabase-schema.sql` (yung dalawang `create policy` statements)

Kung hindi mo pa kailangan ang file upload feature ngayon, puwede mo munang
tanggalin ang file input sa `index.html` at ang related code sa `script.js`.

## 4. I-upload sa GitHub

I-upload ang tatlong files na ito sa repository mo:

- `index.html`
- `style.css`
- `script.js`

## 5. I-deploy ang website

Puwede mo itong i-deploy gamit ang alinman sa mga sumusunod (libre lahat):

- GitHub Pages (Settings > Pages sa repo mo)
- Vercel (i-import ang GitHub repo)
- Netlify (i-drag-and-drop ang folder o i-connect ang GitHub repo)

## 6. I-test

Buksan ang deployed na website, punan ang form, tapos i-submit.
Tingnan mo sa Supabase Dashboard > Table Editor > orders kung pumasok
ang bagong order kasama ang auto-generated order number.

## Susunod na hakbang pagkatapos nito

- Admin dashboard para makita/ma-manage ang mga orders
- Email notification papunta sa customer
- Automatic pricing/costing system
