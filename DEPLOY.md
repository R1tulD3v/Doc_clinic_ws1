# Dental Care — Go-Live Notes

All clinic content lives in **`js/clinic-data.js`** (phone numbers, timings, services, FAQ, chatbot answers, reviews, credentials).
Edit that one file and every page updates.

## 1. Images & language

**Service images**
- Home page cards use the glossy illustrations in `assets/images/services/<id>.svg`.
- The Treatments page (`services.html`) shows a photo from `assets/images/services/photos/<id>.jpg` when one exists,
  otherwise the illustration. Prompts for AI photos + exact file names: `../SERVICE-IMAGE-PROMPTS.md`.
- Which 5 treatments appear on the home page: `featured: true` in `js/clinic-data.js`.

**Doctor photo** → `assets/images/team/dr-manish-kumar.jpg` (portrait, 4:5). Until then the doctor page uses clinic photo 4.

**Award / certificate photos** → `assets/images/awards/…`, then set `photo:` on that item in `credentials` in `clinic-data.js`.

**English / Hindi:** all button/heading text is in `js/i18n.js` (`['English', 'हिंदी']`); clinic data (services, FAQ, chatbot)
is in `js/clinic-data.js` as `{ en, hi }`. A Hindi link can be shared as `yourdomain.in/?lang=hi`.

**After editing CSS/JS:** bump `?v=5` → `?v=5` in the 4 HTML files so visitors' browsers load the new version.

## 2. Confirm with the doctor before launch
- [ ] Mon–Sat two shifts (10–2:30, 3:30–7) + Sunday 10–4 — correct?
- [ ] 99050 57644 = clinic/form/WhatsApp number; 70912 38383 = personal (doctor page) — correct?
- [ ] OK to show the Google reviews on the site
- [ ] Happy Patients / Patients Treated numbers (add to `stats` only if he gives real numbers)
- [ ] Read Why Choose Us + FAQ text

## 3. Deploy (Vercel, free)
1. Create a free account at vercel.com (use the doctor's / agency email).
2. In a terminal inside this folder:
   ```
   npx vercel        # first time: log in, accept defaults → gives a preview URL
   npx vercel --prod # publishes the live site
   ```
   Or drag this folder onto vercel.com/new.
3. Vercel → Project → Settings → Domains → add `yourdomain.in` and `www.yourdomain.in`.
4. Copy the A / CNAME records Vercel shows into the domain registrar's DNS panel. SSL is automatic.

## 4. After the domain is bought
1. Replace `https://dental-care-khagaria.vercel.app` with the new domain in: all 4 HTML files (canonical, og tags, JSON-LD),
   `sitemap.xml`, `robots.txt`, and `siteUrl` in `js/clinic-data.js`. One command from this folder:
   `sed -i 's#https://dental-care-khagaria.vercel.app#https://yourdomain.in#g' *.html sitemap.xml robots.txt js/clinic-data.js`
2. In Vercel → Settings → Domains, add the domain and set `dental-care-khagaria.vercel.app` to **redirect** to it —
   that keeps the QR codes already given to the client working.
3. Google Search Console → add the domain → submit `https://yourdomain.in/sitemap.xml`.
4. Put the website link on the Google Business Profile.

## 5. Local SEO — things only the clinic can do (biggest impact)
- [ ] **Google Business Profile**: add the website link, confirm hours match the site, add 99050 57644 as a phone
      (the listing currently shows 070912 38383 — Google compares phone numbers across the web).
- [ ] Choose primary category "Dentist", add services, upload fresh photos monthly.
- [ ] **Reviews**: only 8 today. Ask happy patients to review (a "Review us on Google" QR at the reception desk works well).
- [ ] List the clinic with the *exact same* name / address / phone on Justdial, Practo, Sulekha, Lybrate.
