const fs = require('fs');
const path = require('path');

const treatmentSpecs = {
  'root-canal-treatment.html': {
    slug: 'root-canal-treatment',
    title: 'Root Canal Treatment (RCT) in Khagaria | Dental Care',
    desc: 'Gentle root canal treatment (RCT) in Khagaria by Dr. Manish Kumar at Dental Care. Relieve severe toothache, clean infected pulp, and save your natural tooth.',
    h1En: 'Root Canal Treatment in <span class="grad">Khagaria</span>',
    h1Hi: 'स्वस्थ और दर्द-मुक्त मुस्कान के लिए <span class="grad">रूट कैनाल उपचार</span>',
    crumbEn: 'Root Canal Treatment',
    crumbHi: 'रूट कैनाल उपचार',
    ogImg: 'assets/images/services/root-canal-treatment-hero.jpg',
    related: [
      { page: 'ceramic-crown-and-bridge.html', titleEn: 'Ceramic Crown & Bridge', titleHi: 'सिरेमिक कैप एवं ब्रिज', descEn: 'Protective ceramic crown to strengthen the tooth after root canal.' },
      { page: 'filling-of-decayed-teeth.html', titleEn: 'Filling of Decayed Teeth', titleHi: 'सड़े दाँतों की फिलिंग', descEn: 'Tooth-coloured fillings that stop cavity decay before it reaches the nerve.' },
      { page: 'dental-implants.html', titleEn: 'Dental Implants', titleHi: 'डेंटल इम्प्लांट', descEn: 'Permanent fixed replacement for teeth that cannot be preserved.' }
    ]
  },
  'dental-implants.html': {
    slug: 'dental-implants',
    title: 'Dental Implants in Khagaria | Permanent Fixed Teeth | Dental Care',
    desc: 'Permanent dental implants in Khagaria by Dr. Manish Kumar, Oral Implantologist. Replace missing teeth with natural-looking, durable implants at Dental Care.',
    h1En: 'Dental Implants in <span class="grad">Khagaria</span> for a Natural, Permanent Smile',
    h1Hi: 'खोए दाँतों का स्थायी और फिक्स समाधान — <span class="grad">डेंटल इम्प्लांट</span>',
    crumbEn: 'Dental Implants',
    crumbHi: 'डेंटल इम्प्लांट',
    ogImg: 'assets/images/services/dental-implants-hero.jpg',
    related: [
      { page: 'complete-denture.html', titleEn: 'Complete Denture', titleHi: 'पूरी बत्तीसी', descEn: 'Full mouth teeth restoration options for complete tooth loss.' },
      { page: 'ceramic-crown-and-bridge.html', titleEn: 'Ceramic Crown & Bridge', titleHi: 'सिरेमिक कैप एवं ब्रिज', descEn: 'Custom aesthetic crowns mounted on permanent titanium implants.' },
      { page: 'cast-partial-denture.html', titleEn: 'Cast Partial Denture', titleHi: 'कास्ट पार्शियल डेन्चर', descEn: 'Precision metal-framed partial dentures for missing teeth.' }
    ]
  },
  'orthodontics.html': {
    slug: 'orthodontics',
    title: 'Braces & Orthodontics in Khagaria | Teeth Alignment | Dental Care',
    desc: 'Orthodontic braces treatment in Khagaria by Dr. Manish Kumar, certified in Orthodontics. Straighten crooked teeth, close gaps, and align your bite at Dental Care.',
    h1En: 'Braces & Orthodontic Treatment in <span class="grad">Khagaria</span>',
    h1Hi: 'टेढ़े और आगे निकले दाँतों को सीधा करें — <span class="grad">प्रमाणित ऑर्थोडॉन्टिक इलाज</span>',
    crumbEn: 'Braces & Orthodontics',
    crumbHi: 'ब्रेसेस (ऑर्थोडॉन्टिक्स)',
    ogImg: 'assets/images/services/orthodontics-hero.jpg',
    related: [
      { page: 'teeth-cleaning-scaling.html', titleEn: 'Ultrasonic Scaling', titleHi: 'दाँतों की सफ़ाई (स्केलिंग)', descEn: 'Maintain pristine oral hygiene and plaque-free braces throughout treatment.' },
      { page: 'teeth-whitening.html', titleEn: 'Teeth Whitening', titleHi: 'दाँतों को सफ़ेद करना', descEn: 'Brighten and polish your newly aligned smile after braces removal.' },
      { page: 'childrens-dentistry.html', titleEn: "Children's Dentistry", titleHi: 'बच्चों के दाँतों का इलाज', descEn: 'Early orthodontic check-ups and preventive growth guidance for kids.' }
    ]
  },
  'teeth-cleaning-scaling.html': {
    slug: 'teeth-cleaning-scaling',
    title: 'Teeth Cleaning & Scaling in Khagaria | Dental Care',
    desc: 'Ultrasonic teeth cleaning and scaling in Khagaria at Dental Care. Remove tartar, eliminate bad breath, and stop bleeding gums safely with Dr. Manish Kumar.',
    h1En: 'Ultrasonic Teeth Cleaning & Scaling in <span class="grad">Khagaria</span>',
    h1Hi: 'मसूड़ों की मजबूती और ताज़ी साँस के लिए <span class="grad">अल्ट्रासोनिक स्केलिंग</span>',
    crumbEn: 'Teeth Cleaning & Scaling',
    crumbHi: 'दाँतों की सफ़ाई (स्केलिंग)',
    ogImg: 'assets/images/services/scaling-hero.jpg',
    related: [
      { page: 'periodontal-flap-surgery.html', titleEn: 'Gum (Periodontal) Surgery', titleHi: 'मसूड़ों की सर्जरी', descEn: 'Specialized periodontal therapy for deep gum infection and loose teeth.' },
      { page: 'teeth-whitening.html', titleEn: 'Teeth Whitening', titleHi: 'दाँतों को सफ़ेद करना', descEn: 'Professional stain removal to brighten your smile after deep cleaning.' },
      { page: 'filling-of-decayed-teeth.html', titleEn: 'Filling of Decayed Teeth', titleHi: 'सड़े दाँतों की फिलिंग', descEn: 'Early cavity detection and tooth-coloured fillings during routine check-ups.' }
    ]
  },
  'teeth-whitening.html': {
    slug: 'teeth-whitening',
    title: 'Teeth Whitening in Khagaria | Clinic Bleaching | Dental Care',
    desc: 'Professional teeth whitening in Khagaria by Dr. Manish Kumar at Dental Care. Safely lift deep tea, coffee, paan, and tobacco stains for a radiant, whiter smile.',
    h1En: 'Professional Teeth Whitening in <span class="grad">Khagaria</span>',
    h1Hi: 'चमकदार और आत्मविश्वासी मुस्कान के लिए <span class="grad">प्रोफेशनल टीथ व्हाइटनिंग</span>',
    crumbEn: 'Teeth Whitening',
    crumbHi: 'दाँतों को सफ़ेद करना',
    ogImg: 'assets/images/services/teeth-whitening-hero.jpg',
    related: [
      { page: 'teeth-cleaning-scaling.html', titleEn: 'Ultrasonic Scaling', titleHi: 'दाँतों की सफ़ाई (स्केलिंग)', descEn: 'Essential preliminary ultrasonic cleaning before professional whitening.' },
      { page: 'ceramic-crown-and-bridge.html', titleEn: 'Ceramic Crown & Bridge', titleHi: 'सिरेमिक कैप एवं ब्रिज', descEn: 'Aesthetic shade matching for natural crowns, bridges, and veneers.' },
      { page: 'filling-of-decayed-teeth.html', titleEn: 'Filling of Decayed Teeth', titleHi: 'सड़े दाँतों की फिलिंग', descEn: 'Seamless composite restorations that match your brightened tooth shade.' }
    ]
  },
  'filling-of-decayed-teeth.html': {
    slug: 'filling-of-decayed-teeth',
    title: 'Tooth Filling in Khagaria | Cavity Treatment | Dental Care',
    desc: 'Tooth-coloured dental fillings in Khagaria by Dr. Manish Kumar at Dental Care. Stop cavity decay early, restore tooth strength, and protect natural aesthetics.',
    h1En: 'Tooth-Coloured Dental Fillings in <span class="grad">Khagaria</span>',
    h1Hi: 'दाँतों की मजबूती और प्राकृतिक रूप के लिए <span class="grad">कंपोजिट फिलिंग</span>',
    crumbEn: 'Filling of Decayed Teeth',
    crumbHi: 'सड़े दाँतों की फिलिंग',
    ogImg: 'assets/images/services/tooth-filling-hero.jpg',
    related: [
      { page: 'root-canal-treatment.html', titleEn: 'Root Canal Treatment', titleHi: 'रूट कैनाल उपचार', descEn: 'Advanced endodontic care when tooth decay reaches the inner nerve pulp.' },
      { page: 'childrens-dentistry.html', titleEn: "Children's Dentistry", titleHi: 'बच्चों के दाँतों का इलाज', descEn: 'Gentle milk tooth fillings and preventive fluoride care for children.' },
      { page: 'ceramic-crown-and-bridge.html', titleEn: 'Ceramic Crown & Bridge', titleHi: 'सिरेमिक कैप एवं ब्रिज', descEn: 'Durable ceramic crowns to protect teeth with extensive filling restorations.' }
    ]
  },
  'complete-denture.html': {
    slug: 'complete-denture',
    title: 'Complete Dentures in Khagaria | Full Denture Clinic | Dental Care',
    desc: 'Custom complete dentures in Khagaria by Dr. Manish Kumar at Dental Care. Comfortable, natural-looking full dentures to restore chewing, speech, and confident smiles.',
    h1En: 'Complete Dentures in <span class="grad">Khagaria</span> for a Confident Smile',
    h1Hi: 'आरामदायक और प्राकृतिक दिखने वाली <span class="grad">पूरी बत्तीसी (कम्प्लीट डेन्चर)</span>',
    crumbEn: 'Complete Denture',
    crumbHi: 'पूरी बत्तीसी (कम्प्लीट डेन्चर)',
    ogImg: 'assets/images/services/dentures-hero.jpg',
    related: [
      { page: 'dental-implants.html', titleEn: 'Dental Implants', titleHi: 'डेंटल इम्प्लांट', descEn: 'Permanent fixed implant options for superior stability without adhesives.' },
      { page: 'removable-partial-denture.html', titleEn: 'Removable Partial Denture', titleHi: 'रिमूवेबल पार्शियल डेन्चर', descEn: 'Lightweight partial dentures when some healthy natural teeth remain.' },
      { page: 'cast-partial-denture.html', titleEn: 'Cast Partial Denture', titleHi: 'कास्ट पार्शियल डेन्चर', descEn: 'Precision cast metal partials offering thin, high-strength durability.' }
    ]
  },
  'removable-partial-denture.html': {
    slug: 'removable-partial-denture',
    title: 'Removable Partial Dentures in Khagaria | Dental Care',
    desc: 'Affordable removable partial dentures in Khagaria by Dr. Manish Kumar at Dental Care. Replace one or more missing teeth with custom, easy-to-clean partial dentures.',
    h1En: 'Removable Partial Dentures in <span class="grad">Khagaria</span>',
    h1Hi: 'खोए दाँतों की जगह आसान और किफायती <span class="grad">आंशिक डेन्चर</span>',
    crumbEn: 'Removable Partial Denture',
    crumbHi: 'रिमूवेबल पार्शियल डेन्चर',
    ogImg: 'assets/images/services/dentures-hero.jpg',
    related: [
      { page: 'cast-partial-denture.html', titleEn: 'Cast Partial Denture', titleHi: 'कास्ट पार्शियल डेन्चर', descEn: 'Upgraded metal-framework partial dentures for improved grip and comfort.' },
      { page: 'complete-denture.html', titleEn: 'Complete Denture', titleHi: 'पूरी बत्तीसी', descEn: 'Full denture prosthetics for patients experiencing complete tooth loss.' },
      { page: 'dental-implants.html', titleEn: 'Dental Implants', titleHi: 'डेंटल इम्प्लांट', descEn: 'Permanent fixed replacement teeth that look and chew like natural teeth.' }
    ]
  },
  'cast-partial-denture.html': {
    slug: 'cast-partial-denture',
    title: 'Cast Partial Denture (CPD) in Khagaria | Metal Dentures | Dental Care',
    desc: 'Strong cast partial dentures (CPD) in Khagaria by Dr. Manish Kumar at Dental Care. Precision thin metal-framed dentures offering superior grip, stability, and fit.',
    h1En: 'Cast Partial Dentures (CPD) in <span class="grad">Khagaria</span>',
    h1Hi: 'मजबूत और पतले मेटल फ्रेम वाला <span class="grad">कास्ट पार्शियल डेन्चर</span>',
    crumbEn: 'Cast Partial Denture',
    crumbHi: 'कास्ट पार्शियल डेन्चर',
    ogImg: 'assets/images/services/dentures-hero.jpg',
    related: [
      { page: 'removable-partial-denture.html', titleEn: 'Removable Partial Denture', titleHi: 'रिमूवेबल पार्शियल डेन्चर', descEn: 'Classic lightweight acrylic partial dentures for missing teeth replacement.' },
      { page: 'ceramic-crown-and-bridge.html', titleEn: 'Ceramic Crown & Bridge', titleHi: 'सिरेमिक कैप एवं ब्रिज', descEn: 'Fixed non-removable dental bridges anchored to adjacent natural teeth.' },
      { page: 'dental-implants.html', titleEn: 'Dental Implants', titleHi: 'डेंटल इम्प्लांट', descEn: 'Permanent implant-supported individual teeth without clasping natural teeth.' }
    ]
  },
  'ceramic-crown-and-bridge.html': {
    slug: 'ceramic-crown-and-bridge',
    title: 'Ceramic Crown & Bridge in Khagaria | Dental Caps | Dental Care',
    desc: 'Ceramic crowns and fixed dental bridges in Khagaria by Dr. Manish Kumar at Dental Care. Protect weak treated teeth and replace missing teeth with natural ceramic.',
    h1En: 'Ceramic Crowns & Fixed Bridges in <span class="grad">Khagaria</span>',
    h1Hi: 'कमज़ोर दाँतों की सुरक्षा और खाली जगह के लिए — <span class="grad">सिरेमिक कैप एवं ब्रिज</span>',
    crumbEn: 'Ceramic Crown & Bridge',
    crumbHi: 'सिरेमिक कैप एवं ब्रिज',
    ogImg: 'assets/images/services/crown-bridge-hero.jpg',
    related: [
      { page: 'root-canal-treatment.html', titleEn: 'Root Canal Treatment', titleHi: 'रूट कैनाल उपचार', descEn: 'Endodontic treatment to eliminate root infection before crown placement.' },
      { page: 'dental-implants.html', titleEn: 'Dental Implants', titleHi: 'डेंटल इम्प्लांट', descEn: 'Permanent implant posts supporting single crowns or multi-unit bridges.' },
      { page: 'filling-of-decayed-teeth.html', titleEn: 'Filling of Decayed Teeth', titleHi: 'सड़े दाँतों की फिलिंग', descEn: 'Conservative core build-up fillings to prepare damaged teeth for crowns.' }
    ]
  },
  'childrens-dentistry.html': {
    slug: 'childrens-dentistry',
    title: "Children's Dentistry in Khagaria | Pediatric Dental Care | Dental Care",
    desc: "Gentle pediatric dental care in Khagaria by Dr. Manish Kumar at Dental Care. Milk tooth fillings, preventive check-ups, habit counseling, and friendly kid care.",
    h1En: "Gentle Children's Dentistry in <span class=\"grad\">Khagaria</span>",
    h1Hi: 'बच्चों की स्वस्थ मुस्कान के लिए <span class="grad">कोमल व सुरक्षित दंत चिकित्सा</span>',
    crumbEn: "Children's Dentistry",
    crumbHi: 'बच्चों के दाँतों का इलाज',
    ogImg: 'assets/images/services/childrens-dentistry-hero.jpg',
    related: [
      { page: 'filling-of-decayed-teeth.html', titleEn: 'Filling of Decayed Teeth', titleHi: 'सड़े दाँतों की फिलिंग', descEn: 'Gentle, tooth-coloured cavity fillings specially formulated for children.' },
      { page: 'orthodontics.html', titleEn: 'Braces & Orthodontics', titleHi: 'ब्रेसेस (ऑर्थोडॉन्टिक्स)', descEn: 'Early interceptive orthodontic evaluation and growth monitoring for kids.' },
      { page: 'teeth-cleaning-scaling.html', titleEn: 'Ultrasonic Scaling', titleHi: 'दाँतों की सफ़ाई (स्केलिंग)', descEn: 'Safe pediatric dental cleaning to prevent early tartar and gum problems.' }
    ]
  },
  'periodontal-flap-surgery.html': {
    slug: 'periodontal-flap-surgery',
    title: 'Gum Disease & Periodontal Surgery in Khagaria | Dental Care',
    desc: 'Advanced gum disease treatment and periodontal flap surgery in Khagaria at Dental Care. Treat bleeding gums, deep pockets, and loose teeth with Dr. Manish Kumar.',
    h1En: 'Gum Disease Treatment & Periodontal Surgery in <span class="grad">Khagaria</span>',
    h1Hi: 'मसूड़ों की बीमारी और हिलते दाँतों का आधुनिक इलाज — <span class="grad">गम सर्जरी</span>',
    crumbEn: 'Gum (Periodontal) Surgery',
    crumbHi: 'मसूड़ों की सर्जरी',
    ogImg: 'assets/images/services/scaling-hero.jpg',
    related: [
      { page: 'teeth-cleaning-scaling.html', titleEn: 'Ultrasonic Scaling', titleHi: 'दाँतों की सफ़ाई (स्केलिंग)', descEn: 'Routine deep scaling and root planing to prevent advanced gum disease.' },
      { page: 'dental-implants.html', titleEn: 'Dental Implants', titleHi: 'डेंटल इम्प्लांट', descEn: 'Tooth replacement options once gum health is restored and stabilized.' },
      { page: 'root-canal-treatment.html', titleEn: 'Root Canal Treatment', titleHi: 'रूट कैनाल उपचार', descEn: 'Treating combined endo-perio infections affecting root and gum tissue.' }
    ]
  },
  'oral-lesions-diagnosis.html': {
    slug: 'oral-lesions-diagnosis',
    title: 'Oral Lesion & Mouth Ulcer Diagnosis in Khagaria | Dental Care',
    desc: 'Clinical diagnosis of mouth ulcers, white patches & oral lesions in Khagaria by Dr. Manish Kumar at Dental Care. Early detection and compassionate mucosal care.',
    h1En: 'Diagnosis of Oral Lesions & Mouth Ulcers in <span class="grad">Khagaria</span>',
    h1Hi: 'मुँह के छाले, सफ़ेद दाग़ व घावों की समय पर जाँच — <span class="grad">सुरक्षित स्वास्थ्य</span>',
    crumbEn: 'Diagnosis of Oral Lesions',
    crumbHi: 'मुँह के घाव व छालों की जाँच',
    ogImg: 'assets/images/services/root-canal-detail.jpg',
    related: [
      { page: 'teeth-cleaning-scaling.html', titleEn: 'Ultrasonic Scaling', titleHi: 'दाँतों की सफ़ाई (स्केलिंग)', descEn: 'Professional cleaning to reduce intra-oral bacterial load and irritants.' },
      { page: 'periodontal-flap-surgery.html', titleEn: 'Gum (Periodontal) Surgery', titleHi: 'मसूड़ों की सर्जरी', descEn: 'Expert surgical management for gingival overgrowth and soft-tissue lesions.' },
      { page: 'root-canal-treatment.html', titleEn: 'Root Canal Treatment', titleHi: 'रूट कैनाल उपचार', descEn: 'Treating painful dental abscesses and sinus tract lesions near roots.' }
    ]
  }
};

function buildRelatedSection(relatedItems) {
  const cardsHtml = relatedItems.map(item => `
          <a class="tp-related__card" href="${item.page}">
            <div>
              <h3><span class="lang-en">${item.titleEn}</span><span class="lang-hi">${item.titleHi}</span></h3>
              <p>${item.descEn}</p>
            </div>
            <span class="tp-related__link">
              <span class="lang-en">Learn More</span><span class="lang-hi">और जानें</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
          </a>`).join('');

  return `
    <!-- Section: Related Treatments (Internal Linking & Context) -->
    <section class="sec sec--tint tp-related">
      <div class="container">
        <div class="sec-head text-center" data-reveal>
          <span class="kicker"><span class="lang-en">Explore More</span><span class="lang-hi">और जानें</span></span>
          <h2 class="sec-title">
            <span class="lang-en">Related Dental Treatments in Khagaria</span>
            <span class="lang-hi">खगड़िया में संबंधित दंत चिकित्सा उपचार</span>
          </h2>
          <p class="sec-lead">
            <span class="lang-en">Comprehensive oral and dental healthcare under one roof at Dental Care, Mill Road, Khagaria.</span>
            <span class="lang-hi">डेंटल केयर, मिल रोड, खगड़िया पर एक ही छत के नीचे संपूर्ण दंत चिकित्सा सुविधा।</span>
          </p>
        </div>
        <div class="tp-related__grid">${cardsHtml}
        </div>
        <div class="text-center" style="margin-top: 32px;">
          <a href="../services.html" class="btn btn--ghost btn--pill">
            <span class="lang-en">View All 13 Treatments</span><span class="lang-hi">सभी 13 उपचार देखें</span>
          </a>
        </div>
      </div>
    </section>
`;
}

function cleanAndOptimize(fileName, spec) {
  const filePath = path.join('treatments', fileName);
  let content = fs.readFileSync(filePath, 'utf8');

  // Split into HEAD and BODY to safely apply replacements
  const headEndIdx = content.indexOf('</head>');
  if (headEndIdx === -1) return;

  let head = content.slice(0, headEndIdx);
  let body = content.slice(headEndIdx);

  // 1. In HEAD: Clean out any mangled description tag
  head = head.replace(/<meta\s+name=["']description["'][\s\S]*?>/i, `<meta name="description" content="${spec.desc}">`);

  // 2. In HEAD: Update title tag
  head = head.replace(/<title>[\s\S]*?<\/title>/i, `<title>${spec.title}</title>`);

  // 3. In HEAD: Ensure clean canonical tag
  head = head.replace(/<link\s+rel=["']canonical["'][\s\S]*?>/i, `<link rel="canonical" href="https://dental-care-khagaria.vercel.app/treatments/${spec.slug}">`);

  // 4. In HEAD: Replace/Insert Open Graph & Twitter meta tags
  const ogTags = `  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Dental Care">
  <meta property="og:url" content="https://dental-care-khagaria.vercel.app/treatments/${spec.slug}">
  <meta property="og:title" content="${spec.title}">
  <meta property="og:description" content="${spec.desc}">
  <meta property="og:image" content="https://dental-care-khagaria.vercel.app/${spec.ogImg}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${spec.title}">
  <meta name="twitter:description" content="${spec.desc}">
  <meta name="twitter:image" content="https://dental-care-khagaria.vercel.app/${spec.ogImg}">`;

  // Remove existing OG if present to avoid duplicates
  head = head.replace(/<meta\s+property=["']og:[\s\S]*?>\n?/gi, '');
  head = head.replace(/<meta\s+name=["']twitter:[\s\S]*?>\n?/gi, '');

  head = head.replace(/(<link\s+rel=["']canonical["'][^>]*>)/i, `$1\n${ogTags}`);

  // 5. In HEAD: Clean and update Schema JSON-LD
  head = head.replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '');

  const fullSchema = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": "${spec.crumbEn}",
    "procedureType": "Dental Procedure",
    "description": "${spec.desc.replace(/"/g, '\\"')}",
    "url": "https://dental-care-khagaria.vercel.app/treatments/${spec.slug}",
    "provider": {
      "@type": "Dentist",
      "name": "Dental Care - Dr. Manish Kumar",
      "telephone": "+917091238383",
      "url": "https://dental-care-khagaria.vercel.app",
      "image": "https://dental-care-khagaria.vercel.app/assets/images/clinic/clinic-1.jpeg",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "In front of Bala Ji TELCOM, Mill Road",
        "addressLocality": "Khagaria",
        "addressRegion": "Bihar",
        "postalCode": "851204",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.5049884,
        "longitude": 86.4664588
      }
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://dental-care-khagaria.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Treatments",
        "item": "https://dental-care-khagaria.vercel.app/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "${spec.crumbEn}",
        "item": "https://dental-care-khagaria.vercel.app/treatments/${spec.slug}"
      }
    ]
  }
  </script>`;

  head = head + fullSchema + '\n';

  // 6. In BODY: Ensure breadcrumb is present and clean
  body = body.replace(/<p\s+class=["']tp-hero__crumb["']>[\s\S]*?<\/p>\s*/i, '');
  const crumbHtml = `<p class="tp-hero__crumb">
            <a href="../index.html"><span class="lang-en">Home</span><span class="lang-hi">होम</span></a> / 
            <a href="../services.html"><span class="lang-en">Treatments</span><span class="lang-hi">उपचार</span></a> / 
            <span><span class="lang-en">${spec.crumbEn}</span><span class="lang-hi">${spec.crumbHi}</span></span>
          </p>\n          `;
  body = body.replace(/(<div\s+class=["']tp-hero__copy["'][^>]*>\s*)(<span\s+class=["']eyebrow["']>)/i, `$1${crumbHtml}$2`);

  // 7. In BODY: Update H1
  const h1Pattern = /<h1\s+class=["']tp-hero__title["']>[\s\S]*?<\/h1>/i;
  const newH1 = `<h1 class="tp-hero__title">
            <span class="lang-en">${spec.h1En}</span>
            <span class="lang-hi">${spec.h1Hi}</span>
          </h1>`;
  body = body.replace(h1Pattern, newH1);

  // 8. In BODY: Related Treatments section
  body = body.replace(/<!--\s*Section:\s*Related\s+Treatments[\s\S]*?<\/section>\s*/gi, '');
  const relatedSection = buildRelatedSection(spec.related);
  const ctaMatch = body.match(/<!--\s*Section[^>]*:\s*(?:Final\s+)?CTA[\s\S]*?<section\s+class=["']sec\s+sec--tint["']>/i)
    || body.match(/<section\s+class=["']sec\s+sec--tint["']>\s*<div\s+class=["']container["']>\s*<div\s+class=["']cta-card["']/i);
  if (ctaMatch) {
    const idx = body.indexOf(ctaMatch[0]);
    body = body.slice(0, idx) + relatedSection + body.slice(idx);
  }

  // 9. In BODY: Contextual links to Doctor and Contact where appropriate
  // Only replace first occurrence in text paragraphs
  if (!body.includes('href="../doctor.html"')) {
    body = body.replace(/(<p[^>]*>[\s\S]*?)Dr\.\s*Manish Kumar([\s\S]*?<\/p>)/i, '$1<a href="../doctor.html">Dr. Manish Kumar</a>$2');
  }
  if (!body.includes('href="../contact.html"')) {
    body = body.replace(/(<p[^>]*>[\s\S]*?)Mill Road([\s\S]*?<\/p>)/i, '$1<a href="../contact.html">Mill Road</a>$2');
  }

  // Reassemble file
  content = head + body;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Cleaned and optimized:', fileName);
}

Object.entries(treatmentSpecs).forEach(([file, spec]) => {
  cleanAndOptimize(file, spec);
});

console.log('All 13 dedicated treatment pages cleanly optimized!');
