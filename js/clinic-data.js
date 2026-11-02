/**
 * ============================================================================
 * CLINIC DATA — DENTAL CARE, KHAGARIA  (English + Hindi)
 * ============================================================================
 * Single source of truth for everything on the site. Any text that appears in
 * both languages is written as { en: "...", hi: "..." }.
 *
 * SERVICE IMAGES: each service has an `image` path. Replace the SVG with a
 * .jpg/.png of the same name (and update the path) any time.
 * ============================================================================
 */

const CLINIC_CONFIG = {
  name: { en: "Dental Care", hi: "डेंटल केयर" },
  tagline: { en: "The Center for Dental Excellence", hi: "दंत उत्कृष्टता का केंद्र" },
  siteUrl: "https://drmanishdentalcare.in",

  doctor: {
    name: { en: "Dr. Manish Kumar", hi: "डॉ० मनीष कुमार" },
    designation: { en: "Oral & Dental Surgeon", hi: "मुख एवं दंत शल्य चिकित्सक" },
    degrees: "B.D.S. (V.B.U.), M.I.D.A., Cert. Orthodontics",
    specializations: "Oral Implantologist, Memb. ICOI, F.A.G.E. (Manipal)",
    registrationNo: "4122/A",
    experienceYears: 12,
    photo: "assets/images/team/dr-manish-kumar.jpg"
  },

  contact: {
    phoneDisplay: "99050 57644",
    phoneTel: "+919905057644",
    whatsappNumber: "919905057644",
    altPhoneDisplay: "70912 38383",
    altPhoneTel: "+917091238383",
    whatsappDefaultMessage: {
      en: "Hello Dental Care, I would like to book an appointment.",
      hi: "नमस्ते डेंटल केयर, मैं अपॉइंटमेंट लेना चाहता/चाहती हूँ।"
    },
    address: {
      en: "In front of Bala Ji TELCOM, Mill Road, Khagaria, Bihar 851204",
      hi: "बाला जी टेलकॉम के सामने, मिल रोड, खगड़िया, बिहार 851204"
    },
    mapsPlaceUrl: "https://www.google.com/maps/place/Dental+Care/@25.5049884,86.4616952,17z/data=!4m15!1m8!3m7!1s0x39f1e46702498047:0xac456d65511cf319!2sDental+Care!8m2!3d25.5049884!4d86.4664588!10e1!16s%2Fg%2F11c6rrqqtv!3m5!1s0x39f1e46702498047:0xac456d65511cf319!8m2!3d25.5049884!4d86.4664588!16s%2Fg%2F11c6rrqqtv",
    mapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=25.5049884,86.4664588",
    mapsWriteReviewUrl: "https://www.google.com/maps/place//data=!4m3!3m2!1s0x39f1e46702498047:0xac456d65511cf319!12e1",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.5910609657067!2d86.46388387611598!3d25.50498837751147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f1e46702498047%3A0xac456d65511cf319!2sDental%20Care!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
  },

  // Chamber hours from the prescription pad. [openH, openM, closeH, closeM], 24-hr.
  // 0 = Sunday ... 6 = Saturday.  TODO: confirm Mon–Sat two shifts with doctor.
  hours: {
    schedule: {
      0: [[10, 0, 16, 0]],
      1: [[10, 0, 14, 30], [15, 30, 19, 0]],
      2: [[10, 0, 14, 30], [15, 30, 19, 0]],
      3: [[10, 0, 14, 30], [15, 30, 19, 0]],
      4: [[10, 0, 14, 30], [15, 30, 19, 0]],
      5: [[10, 0, 14, 30], [15, 30, 19, 0]],
      6: [[10, 0, 14, 30], [15, 30, 19, 0]]
    }
  },

  // Hero stats. Add "Happy Patients" only once the doctor gives a real number.
  stats: [
    { value: 12, suffix: "+", icon: "award", label: { en: "Years of Experience", hi: "वर्षों का अनुभव" } },
    { value: 13, suffix: "", icon: "tooth", label: { en: "Treatments Available", hi: "उपलब्ध उपचार" } },
    { value: 7, suffix: "", icon: "calendar", label: { en: "Days Open", hi: "दिन खुला" } },
    { value: 4.6, suffix: "★", icon: "star", decimals: 1, label: { en: "Google Rating", hi: "गूगल रेटिंग" } }
  ],

  googleBusiness: {
    rating: 4.6,
    reviewCount: 9,
    // Genuine reviews from the Google Maps listing (shown as written).
    // TODO: get the doctor's OK before launch.
    reviews: [
      { author: "Eisha", rating: 5, date: "a week ago", text: "Excellent teeth whitening experience at Dental Care. Dr. Manish Kumar was very professional, explained everything clearly, and the results were exactly what I expected — much whiter teeth without any pain or sensitivity. Staff behaviour was good, clinic was clean, and getting an appointment was easy and quick. Highly recommend." },
      { author: "Aashu Raj", rating: 5, text: "Thanks to their precise treatment plan and attentive follow-up care, my condition has significantly improved. I felt completely safe in their hands." },
      { author: "Rahul", rating: 5, text: "Doctor is experienced and takes good care. Staffs are supportive." },
      { author: "Vivek Prince", rating: 5, text: "Superb experience .... Very friendly behaviour... 10/10" },
      { author: "Pritam Singh", rating: 5, text: "Too Gud Work at This Dental care" },
      { author: "Saurabh Kumar", rating: 5, text: "" },
      { author: "Priyanka Anand Piro", rating: 5, text: "" },
      { author: "Avinash Kumar", rating: 5, text: "" }
    ]
  },

  // 13 services exactly as on the prescription pad
  services: [
    { id: "root-canal", icon: "tooth", featured: true,
      page: "treatments/root-canal-treatment.html",
      image: "assets/images/services/root-canal-hero.jpg",
      detail: { en: "Removes infection from inside the tooth, relieves severe toothache and saves your natural tooth — done comfortably under local anaesthesia.", hi: "दाँत के अंदर का संक्रमण साफ़ करके तेज़ दर्द से राहत देता है और आपके असली दाँत को बचाता है — सुन्न करके आराम से किया जाता है।" },
      title: { en: "Root Canal Treatment", hi: "रूट कैनाल उपचार" },
      description: { en: "Saves an infected tooth and ends the toothache.", hi: "संक्रमित दाँत को बचाता है और दर्द से राहत देता है।" } },
    { id: "children-dentistry", icon: "smile", featured: false,
      page: "treatments/childrens-dentistry.html",
      image: "assets/images/services/childrens-dentistry-hero.jpg",
      detail: { en: "Gentle check-ups, fillings and treatment of milk teeth — so your child grows up without fear of the dentist.", hi: "बच्चों की कोमल जाँच, फिलिंग और दूध के दाँतों का इलाज — ताकि बच्चा डेंटिस्ट से डरे नहीं।" },
      title: { en: "Children's Dentistry", hi: "बच्चों के दाँतों का इलाज" },
      description: { en: "Gentle, patient care for your child's teeth.", hi: "बच्चों के दाँतों की कोमल और धैर्यपूर्ण देखभाल।" } },
    { id: "tooth-filling", icon: "tooth", featured: false,
      page: "treatments/filling-of-decayed-teeth.html",
      image: "assets/images/services/tooth-filling-hero.jpg",
      detail: { en: "Tooth-coloured fillings that stop decay early, restore the tooth's shape and blend in with your smile.", hi: "दाँत के रंग की फिलिंग जो सड़न को शुरू में ही रोकती है और दाँत का आकार वापस लाती है।" },
      title: { en: "Filling of Decayed Teeth", hi: "सड़े दाँतों की फिलिंग" },
      description: { en: "Tooth-coloured fillings that stop decay early.", hi: "दाँत के रंग की फिलिंग, जो सड़न को शुरू में ही रोके।" } },
    { id: "teeth-whitening", icon: "sparkle", featured: true,
      page: "treatments/teeth-whitening.html",
      image: "assets/images/services/teeth-whitening-hero.jpg",
      detail: { en: "Professional whitening that safely lifts stains from tea, paan and tobacco for a visibly brighter smile.", hi: "चाय, पान और तंबाकू के दाग़ सुरक्षित रूप से हटाकर मुस्कान को चमकदार बनाने वाली पेशेवर सफ़ेदी।" },
      title: { en: "Teeth Whitening", hi: "दाँतों को सफ़ेद करना" },
      description: { en: "Brighter, whiter, more confident smile.", hi: "चमकदार, सफ़ेद और आत्मविश्वास भरी मुस्कान।" } },
    { id: "complete-denture", icon: "denture", featured: true,
      page: "treatments/complete-denture.html",
      image: "assets/images/services/dentures-hero.jpg",
      detail: { en: "Comfortable, natural-looking full dentures for people who have lost all their teeth — eat and speak with confidence again.", hi: "सभी दाँत खो चुके लोगों के लिए आरामदायक और प्राकृतिक दिखने वाली पूरी बत्तीसी — फिर से आत्मविश्वास से खाएँ और बोलें।" },
      title: { en: "Complete Denture", hi: "पूरी बत्तीसी (कम्प्लीट डेन्चर)" },
      description: { en: "Full set of comfortable, natural-looking teeth.", hi: "आरामदायक और प्राकृतिक दिखने वाले पूरे दाँत।" } },
    { id: "removable-partial-denture", icon: "denture", featured: false,
      page: "treatments/removable-partial-denture.html",
      image: "assets/images/services/dentures-hero.jpg",
      detail: { en: "Replace a few missing teeth with a light denture you can take out and clean at home.", hi: "कुछ खोए दाँतों की जगह हल्का डेन्चर, जिसे घर पर निकालकर साफ़ किया जा सकता है।" },
      title: { en: "Removable Partial Denture", hi: "निकालने योग्य आंशिक डेन्चर" },
      description: { en: "Replace a few missing teeth, easy to clean.", hi: "कुछ खोए दाँतों की जगह, साफ़ करना आसान।" } },
    { id: "cast-partial-denture", icon: "denture", featured: false,
      page: "treatments/cast-partial-denture.html",
      image: "assets/images/services/dentures-hero.jpg",
      detail: { en: "A thin, metal-framed partial denture that is stronger, more comfortable and fits more securely.", hi: "पतले धातु फ्रेम वाला आंशिक डेन्चर — ज़्यादा मज़बूत, आरामदायक और अच्छी पकड़ वाला।" },
      title: { en: "Cast Partial Denture", hi: "कास्ट पार्शियल डेन्चर" },
      description: { en: "Thin metal frame for a firm, lasting fit.", hi: "पतले धातु फ्रेम वाला मज़बूत और टिकाऊ डेन्चर।" } },
    { id: "crown-bridge", icon: "crown", featured: false,
      page: "treatments/ceramic-crown-and-bridge.html",
      image: "assets/images/services/crown-bridge-hero.jpg",
      detail: { en: "Natural-looking ceramic caps to protect weak or root-canal-treated teeth, and fixed bridges to fill gaps.", hi: "कमज़ोर या रूट कैनाल हुए दाँतों को बचाने के लिए प्राकृतिक दिखने वाली सिरेमिक कैप, और खाली जगह भरने के लिए फिक्स ब्रिज।" },
      title: { en: "Ceramic Crown & Bridge", hi: "सिरेमिक कैप एवं ब्रिज" },
      description: { en: "Natural-looking caps and fixed bridges.", hi: "प्राकृतिक दिखने वाली कैप और फिक्स ब्रिज।" } },
    { id: "ultrasonic-scaling", icon: "drop", featured: false,
      page: "treatments/teeth-cleaning-scaling.html",
      image: "assets/images/services/scaling-hero.jpg",
      detail: { en: "Ultrasonic deep cleaning that removes tartar and stains, stops bleeding gums and keeps breath fresh.", hi: "अल्ट्रासोनिक गहरी सफ़ाई जो टार्टर और दाग़ हटाती है, मसूड़ों से खून आना रोकती है और साँस ताज़ी रखती है।" },
      title: { en: "Ultrasonic Scaling", hi: "अल्ट्रासोनिक स्केलिंग (सफ़ाई)" },
      description: { en: "Deep cleaning for healthy gums and fresh breath.", hi: "स्वस्थ मसूड़ों और ताज़ी साँस के लिए गहरी सफ़ाई।" } },
    { id: "dental-implants", icon: "implant", featured: true,
      page: "treatments/dental-implants.html",
      image: "assets/images/services/dental-implants-hero.jpg",
      detail: { en: "A permanent, fixed replacement for missing teeth — looks, feels and works like a natural tooth.", hi: "खोए दाँतों का स्थायी और फिक्स विकल्प — दिखने, महसूस करने और चबाने में असली दाँत जैसा।" },
      title: { en: "Dental Implants", hi: "डेंटल इम्प्लांट" },
      description: { en: "Permanent, fixed solution for missing teeth.", hi: "खोए दाँतों का स्थायी और फिक्स समाधान।" } },
    { id: "orthodontic-treatment", icon: "braces", featured: true,
      page: "treatments/orthodontics.html",
      image: "assets/images/services/orthodontics-hero.jpg",
      detail: { en: "Braces that straighten crooked, crowded or gapped teeth and correct your bite — by a doctor certified in orthodontics.", hi: "टेढ़े, आगे निकले या खाली जगह वाले दाँतों को सीधा करने वाले ब्रेसेस — ऑर्थोडॉन्टिक्स में प्रमाणित डॉक्टर द्वारा।" },
      title: { en: "Braces (Orthodontics)", hi: "ब्रेसेस (टेढ़े दाँतों का इलाज)" },
      description: { en: "Straighten crooked or gapped teeth.", hi: "टेढ़े या खाली जगह वाले दाँतों को सीधा करें।" } },
    { id: "periodontal-surgery", icon: "shield", featured: false,
      page: "treatments/periodontal-flap-surgery.html",
      image: "assets/images/services/scaling-hero.jpg",
      detail: { en: "Treatment for gum disease, bleeding gums and loose teeth — to keep your natural teeth for longer.", hi: "मसूड़ों की बीमारी, खून आने और हिलते दाँतों का इलाज — ताकि आपके असली दाँत लंबे समय तक बचे रहें।" },
      title: { en: "Gum (Periodontal) Surgery", hi: "मसूड़ों की सर्जरी" },
      description: { en: "Treats gum disease, bleeding and loose teeth.", hi: "मसूड़ों की बीमारी, खून आना और हिलते दाँतों का इलाज।" } },
    { id: "oral-lesions", icon: "search", featured: false,
      page: "treatments/oral-lesions-diagnosis.html",
      image: "assets/images/services/root-canal-detail.jpg",
      detail: { en: "Careful examination of mouth ulcers, white or red patches and lumps for early diagnosis and safe treatment.", hi: "मुँह के छालों, सफ़ेद या लाल दाग़ और गाँठों की सावधानी से जाँच — समय पर पहचान और सुरक्षित इलाज के लिए।" },
      title: { en: "Diagnosis of Oral Lesions", hi: "मुँह के घाव व छालों की जाँच" },
      description: { en: "Early check of ulcers, patches and lesions.", hi: "छालों, दाग़ और घावों की समय पर जाँच।" } }
  ],

  // Awards & achievements (credentials). Add `photo` to show a certificate image.
  credentials: [
    { icon: "degree", title: { en: "B.D.S. (Bachelor of Dental Surgery)", hi: "बी.डी.एस." },
      subtitle: { en: "Vinoba Bhave University (V.B.U.)", hi: "विनोबा भावे विश्वविद्यालय (V.B.U.)" }, photo: "" },
    { icon: "braces", title: { en: "Certificate in Orthodontics", hi: "ऑर्थोडॉन्टिक्स में प्रमाणपत्र" },
      subtitle: { en: "Braces & teeth alignment", hi: "ब्रेसेस व दाँतों को सीधा करना" }, photo: "" },
    { icon: "implant", title: { en: "Oral Implantologist", hi: "ओरल इम्प्लांटोलॉजिस्ट" },
      subtitle: { en: "Member, ICOI (International Congress of Oral Implantologists)", hi: "सदस्य, ICOI (इंटरनेशनल कांग्रेस ऑफ़ ओरल इम्प्लांटोलॉजिस्ट्स)" }, photo: "" },
    { icon: "award", title: { en: "F.A.G.E. (Manipal)", hi: "F.A.G.E. (मणिपाल)" },
      subtitle: { en: "Fellowship, Manipal", hi: "फ़ेलोशिप, मणिपाल" }, photo: "" },
    { icon: "shield", title: { en: "M.I.D.A.", hi: "M.I.D.A." },
      subtitle: { en: "Member, Indian Dental Association", hi: "सदस्य, इंडियन डेंटल एसोसिएशन" }, photo: "" },
    { icon: "check", title: { en: "Registered Practitioner", hi: "पंजीकृत चिकित्सक" },
      subtitle: { en: "Reg. No. 4122/A", hi: "पंजीकरण सं. 4122/A" }, photo: "" }
  ],

  // Awards & Achievements gallery images (About Doctor page)
  awards: [
    { src: "assets/images/awards/award-1.jpg", w: 682, h: 1024, caption: { en: "Doctor Engineer Artist Award — Dr. Manish Kumar", hi: "डॉक्टर इंजीनियर आर्टिस्ट सम्मान — डॉ० मनीष कुमार" },
      alt: { en: "Doctor Engineer Artist Award plaque presented to Dr. Manish Kumar", hi: "डॉक्टर इंजीनियर आर्टिस्ट सम्मान — डॉ० मनीष कुमार" } },
    { src: "assets/images/awards/award-2.jpg", w: 576, h: 1024, caption: { en: "Pillars of IDA Khagaria — 13th State Dental Conference 2024", hi: "पिलर्स ऑफ आई.डी.ए. खगड़िया — 13वां राज्य दंत सम्मेलन 2024" },
      alt: { en: "Pillars of IDA Khagaria memento from the 13th State Dental Conference 2024", hi: "पिलर्स ऑफ आई.डी.ए. खगड़िया — 13वां राज्य दंत सम्मेलन 2024" } },
    { src: "assets/images/awards/award-3.jpg", w: 682, h: 1024, caption: { en: "Bihar Kesari Dr. Sri Krishna Singh Lokseva Smriti Samman", hi: "बिहार केसरी डॉ. श्री कृष्ण सिंह लोकसेवा स्मृति सम्मान" },
      alt: { en: "Bihar Kesari Dr. Sri Krishna Singh Lokseva Smriti Samman award memento", hi: "बिहार केसरी डॉ. श्री कृष्ण सिंह लोकसेवा स्मृति सम्मान" } },
    { src: "assets/images/awards/award-4.jpg", w: 682, h: 1024, caption: { en: "14th IDA Bihar State Dental Conference — BSDCON 2025", hi: "14वां आई.डी.ए. बिहार राज्य दंत सम्मेलन — बी.एस.डी.कॉन 2025" },
      alt: { en: "14th IDA Bihar State Dental Conference BSDCON 2025 award plaque", hi: "14वां आई.डी.ए. बिहार राज्य दंत सम्मेलन — बी.एस.डी.कॉन 2025" } },
    { src: "assets/images/awards/award-5.jpg", w: 682, h: 1024, caption: { en: "Best Local Branch Khagaria — Dental Expo Patna 2025", hi: "सर्वश्रेष्ठ स्थानीय शाखा खगड़िया — डेंटल एक्सपो पटना 2025" },
      alt: { en: "Best Local Branch Khagaria award plaque, Dental Expo Patna 2025", hi: "सर्वश्रेष्ठ स्थानीय शाखा खगड़िया — डेंटल एक्सपो पटना 2025" } },
    { src: "assets/images/awards/award-6.jpg", w: 682, h: 1024, caption: { en: "13th State Dental Conference 2024 — IDA Khagaria", hi: "13वां राज्य दंत सम्मेलन 2024 — आई.डी.ए. खगड़िया" },
      alt: { en: "13th State Dental Conference 2024 memento, IDA Khagaria", hi: "13वां राज्य दंत सम्मेलन 2024 — आई.डी.ए. खगड़िया" } },
    { src: "assets/images/awards/award-7.jpg", w: 985, h: 1024, caption: { en: "Guest of Honour — Humanity Blood Donors Trust & Youth Club", hi: "अतिथि सम्मान — ह्यूमैनिटी ब्लड डोनर्स ट्रस्ट व यूथ क्लब" },
      alt: { en: "Guest of Honour memento from Humanity Blood Donors Trust & Youth Club", hi: "अतिथि सम्मान — ह्यूमैनिटी ब्लड डोनर्स ट्रस्ट व यूथ क्लब" } },
    { src: "assets/images/awards/award-8.jpg", w: 682, h: 1024, caption: { en: "Certificate of Gratitude — Humanity Blood Donors' Trust", hi: "कृतज्ञता सम्मान — ह्यूमैनिटी ब्लड डोनर्स ट्रस्ट, खगड़िया" },
      alt: { en: "Certificate of Gratitude framed memento from Humanity Blood Donors Trust", hi: "कृतज्ञता सम्मान — ह्यूमैनिटी ब्लड डोनर्स ट्रस्ट, खगड़िया" } },
    { src: "assets/images/awards/award-9.jpg", w: 682, h: 1024, caption: { en: "SBI Life Certificate of Appreciation — Dr. Manish Kumar", hi: "एसबीआई लाइफ सम्मान पत्र — डॉ० मनीष कुमार" },
      alt: { en: "SBI Life Certificate of Appreciation framed award for Dr. Manish Kumar", hi: "एसबीआई लाइफ सम्मान पत्र — डॉ० मनीष कुमार" } },
    { src: "assets/images/awards/award-10.jpg", w: 682, h: 1024, caption: { en: "Tooth Anatomy Clinical Art Presentation", hi: "दंत संरचना क्लिनिकल कला प्रस्तुति" },
      alt: { en: "Tooth Anatomy Clinical Art Presentation certificate and memento", hi: "दंत संरचना क्लिनिकल कला प्रस्तुति" } }
  ],

  whyChooseUs: [
    { title: { en: "12+ Years of Experience", hi: "12+ वर्षों का अनुभव" },
      text: { en: "More than a decade of hands-on clinical practice in Khagaria.", hi: "खगड़िया में एक दशक से अधिक का क्लिनिकल अनुभव।" } },
    { title: { en: "Specialised Training", hi: "विशेष प्रशिक्षण" },
      text: { en: "Certified in Orthodontics, Oral Implantologist, ICOI member and F.A.G.E. (Manipal).", hi: "ऑर्थोडॉन्टिक्स में प्रमाणित, ओरल इम्प्लांटोलॉजिस्ट, ICOI सदस्य और F.A.G.E. (मणिपाल)।" } },
    { title: { en: "Complete Care Under One Roof", hi: "एक ही जगह पूरा इलाज" },
      text: { en: "From root canals and fillings to implants, crowns, dentures and braces.", hi: "रूट कैनाल और फिलिंग से लेकर इम्प्लांट, कैप, डेन्चर और ब्रेसेस तक।" } },
    { title: { en: "Care for the Whole Family", hi: "पूरे परिवार की देखभाल" },
      text: { en: "Including dedicated, gentle treatment of children's teeth.", hi: "बच्चों के दाँतों का भी कोमलता से विशेष इलाज।" } },
    { title: { en: "Convenient Timings", hi: "सुविधाजनक समय" },
      text: { en: "Morning and evening chamber hours — and open on Sundays too.", hi: "सुबह और शाम दोनों समय — रविवार को भी खुला।" } },
    { title: { en: "Clear Aftercare Guidance", hi: "इलाज के बाद स्पष्ट मार्गदर्शन" },
      text: { en: "Simple post-treatment instructions and a recall visit for every patient.", hi: "हर मरीज़ को आसान निर्देश और दोबारा जाँच की सुविधा।" } }
  ],

  aftercare: [
    { en: "Maintain good oral hygiene", hi: "मुँह की अच्छी साफ़-सफ़ाई रखें" },
    { en: "Keep the pressure pack for 1 hour", hi: "प्रेशर पैक 1 घंटे तक रखें" },
    { en: "Have only cold, soft food for 24 hours", hi: "24 घंटे तक केवल ठंडा और नरम भोजन लें" },
    { en: "Come for the recall visit after 5 days", hi: "5 दिन बाद दोबारा दिखाने आएँ" }
  ],

  // First 5 on the home page; all 10 on the doctor page
  faqs: [
    { q: { en: "What are the clinic timings?", hi: "क्लिनिक का समय क्या है?" },
      a: { en: "Monday to Saturday: 10:00 AM – 2:30 PM and 3:30 PM – 7:00 PM. Sunday: 10:00 AM – 4:00 PM.",
           hi: "सोमवार से शनिवार: सुबह 10:00 – दोपहर 2:30 और दोपहर 3:30 – शाम 7:00। रविवार: सुबह 10:00 – शाम 4:00।" } },
    { q: { en: "Where is the dental clinic located in Khagaria?", hi: "क्लिनिक कहाँ है?" },
      a: { en: "In front of Bala Ji TELCOM, Mill Road, Khagaria, Bihar 851204. Tap \"Get Directions\" to open it in Google Maps.",
           hi: "बाला जी टेलकॉम के सामने, मिल रोड, खगड़िया, बिहार 851204। गूगल मैप्स में खोलने के लिए \"रास्ता देखें\" दबाएँ।" } },
    { q: { en: "Which dental treatments are available?", hi: "कौन-कौन से इलाज उपलब्ध हैं?" },
      a: { en: "Root canal, fillings, scaling, teeth whitening, dentures, crowns & bridges, implants, braces, gum surgery, children's dentistry and diagnosis of oral lesions.",
           hi: "रूट कैनाल, फिलिंग, स्केलिंग, दाँत सफ़ेद करना, डेन्चर, कैप व ब्रिज, इम्प्लांट, ब्रेसेस, मसूड़ों की सर्जरी, बच्चों के दाँतों का इलाज और मुँह के घावों की जाँच।" } },
    { q: { en: "How do I book an appointment?", hi: "अपॉइंटमेंट कैसे लें?" },
      a: { en: "Call 99050 57644, message us on WhatsApp, or fill in the appointment form on this website — it sends your request straight to the clinic on WhatsApp.",
           hi: "99050 57644 पर कॉल करें, व्हाट्सऐप पर संदेश भेजें, या इस वेबसाइट पर अपॉइंटमेंट फ़ॉर्म भरें — आपका अनुरोध सीधे क्लिनिक के व्हाट्सऐप पर पहुँचेगा।" } },
    { q: { en: "Do you treat children?", hi: "क्या बच्चों का इलाज होता है?" },
      a: { en: "Yes. Treatment of children's teeth is available, done gently and patiently.",
           hi: "हाँ। बच्चों के दाँतों का इलाज कोमलता और धैर्य के साथ किया जाता है।" } },
    { q: { en: "Is a fee charged again for a follow-up visit?", hi: "क्या दोबारा दिखाने पर फ़ीस लगती है?" },
      a: { en: "A fresh consultation fee applies after 25 days from your last visit.",
           hi: "पिछली विज़िट के 25 दिन बाद दोबारा परामर्श शुल्क लगता है।" } },
    { q: { en: "What care should I take after a procedure?", hi: "इलाज के बाद क्या सावधानी रखें?" },
      a: { en: "Maintain oral hygiene, keep the pressure pack on for 1 hour, have only cold, soft food for 24 hours, and come for the recall visit after 5 days. Always follow the doctor's specific advice.",
           hi: "मुँह की सफ़ाई रखें, प्रेशर पैक 1 घंटे तक रखें, 24 घंटे तक केवल ठंडा व नरम भोजन लें और 5 दिन बाद दोबारा दिखाएँ। डॉक्टर की सलाह का हमेशा पालन करें।" } },
    { q: { en: "Is root canal treatment (RCT) painful?", hi: "क्या रूट कैनाल में दर्द होता है?" },
      a: { en: "It is done under local anaesthesia, so it is generally comfortable. Mild soreness for a few days can be normal; the doctor will guide you.",
           hi: "यह सुन्न करने वाली दवा (लोकल एनेस्थीसिया) देकर किया जाता है, इसलिए आमतौर पर आरामदायक होता है। कुछ दिन हल्का दर्द सामान्य है; डॉक्टर आपको मार्गदर्शन देंगे।" } },
    { q: { en: "Are dental implants right for me?", hi: "क्या डेंटल इम्प्लांट मेरे लिए सही है?" },
      a: { en: "It depends on your gum and jaw-bone health. Dr. Manish Kumar will examine you and advise the best option.",
           hi: "यह आपके मसूड़ों और जबड़े की हड्डी की सेहत पर निर्भर करता है। डॉ० मनीष कुमार जाँच करके सबसे अच्छा विकल्प बताएँगे।" } },
    { q: { en: "Is it okay to use paan, supari, zarda, gutkha or khaini?", hi: "क्या पान, सुपारी, जर्दा, गुटखा या खैनी खाना ठीक है?" },
      a: { en: "No. Please avoid them — they harm teeth and gums and can lead to serious oral problems, including oral cancer.",
           hi: "नहीं। कृपया इनका सेवन न करें — ये दाँतों और मसूड़ों को नुकसान पहुँचाते हैं और मुँह के कैंसर जैसी गंभीर बीमारी का कारण बन सकते हैं।" } }
  ],

  // Button-based help chat — no AI, no API, no typing
  chatbot: {
    greeting: { en: "Namaste! 🙏 I'm the Dental Care help assistant. Tap a question below:",
                hi: "नमस्ते! 🙏 मैं डेंटल केयर का सहायक हूँ। नीचे से अपना सवाल चुनें:" },
    more: { en: "Anything else? 👇", hi: "कुछ और पूछना है? 👇" },
    fallback: { en: "Don't see your question? Ask the doctor directly on WhatsApp.",
                hi: "आपका सवाल यहाँ नहीं है? सीधे डॉक्टर से व्हाट्सऐप पर पूछें।" },
    questions: [
      { label: { en: "⏰ What are the timings?", hi: "⏰ क्लिनिक का समय क्या है?" },
        answer: { en: "<b>Mon–Sat:</b> 10:00 AM – 2:30 PM and 3:30 PM – 7:00 PM<br><b>Sunday:</b> 10:00 AM – 4:00 PM",
                  hi: "<b>सोम–शनि:</b> सुबह 10:00 – दोपहर 2:30 और दोपहर 3:30 – शाम 7:00<br><b>रविवार:</b> सुबह 10:00 – शाम 4:00" } },
      { label: { en: "💰 What are the fees?", hi: "💰 फ़ीस कितनी है?" },
        answer: { en: "The doctor tells you the treatment cost after the check-up, because every case is different. After one consultation, <b>no fresh fee is charged for 25 days</b>. Call or WhatsApp for exact fees.",
                  hi: "इलाज का खर्च जाँच के बाद डॉक्टर बताते हैं, क्योंकि हर मरीज़ का इलाज अलग होता है। एक बार परामर्श के बाद <b>25 दिन तक दोबारा फ़ीस नहीं लगती</b>। सटीक फ़ीस के लिए कॉल या व्हाट्सऐप करें।" } },
      { label: { en: "📍 Where is the clinic?", hi: "📍 क्लिनिक कहाँ है?" },
        answer: { en: "<b>Dental Care</b><br>In front of Bala Ji TELCOM, Mill Road, Khagaria, Bihar 851204.",
                  hi: "<b>डेंटल केयर</b><br>बाला जी टेलकॉम के सामने, मिल रोड, खगड़िया, बिहार 851204।" },
        link: { href: "mapsDirectionsUrl", text: { en: "Open in Google Maps ↗", hi: "गूगल मैप्स में देखें ↗" } } },
      { label: { en: "🦷 Which treatments are done?", hi: "🦷 कौन-से इलाज होते हैं?" },
        answer: { en: "Root canal, fillings, scaling, teeth whitening, dentures, crowns & bridges, implants, braces, gum surgery, children's dentistry and oral lesion check-ups — all at the clinic.",
                  hi: "रूट कैनाल, फिलिंग, स्केलिंग, दाँत सफ़ेद करना, डेन्चर, कैप व ब्रिज, इम्प्लांट, ब्रेसेस, मसूड़ों की सर्जरी, बच्चों के दाँतों का इलाज और मुँह के घावों की जाँच — सब क्लिनिक में।" } },
      { label: { en: "📅 How do I book?", hi: "📅 अपॉइंटमेंट कैसे लें?" },
        answer: { en: "Three easy ways:<br>1. Tap <b>WhatsApp</b> below<br>2. <b>Call</b> 99050 57644<br>3. Fill the appointment form on this website",
                  hi: "तीन आसान तरीके:<br>1. नीचे <b>व्हाट्सऐप</b> दबाएँ<br>2. 99050 57644 पर <b>कॉल</b> करें<br>3. वेबसाइट पर अपॉइंटमेंट फ़ॉर्म भरें" },
        link: { href: "book", text: { en: "Book an appointment", hi: "अपॉइंटमेंट बुक करें" } } },
      { label: { en: "👶 Do you treat children?", hi: "👶 क्या बच्चों का इलाज होता है?" },
        answer: { en: "Yes! Children's teeth are treated with care and patience.",
                  hi: "हाँ! बच्चों के दाँतों का इलाज प्यार और धैर्य के साथ किया जाता है।" } },
      { label: { en: "📆 Open on Sunday?", hi: "📆 क्या रविवार को खुला है?" },
        answer: { en: "Yes, the clinic is open on Sunday from <b>10:00 AM to 4:00 PM</b>.",
                  hi: "हाँ, रविवार को भी क्लिनिक <b>सुबह 10:00 से शाम 4:00</b> तक खुला रहता है।" } },
      { label: { en: "🩹 Care after treatment?", hi: "🩹 इलाज के बाद क्या करें?" },
        answer: { en: "• Keep your mouth clean<br>• Keep the pressure pack for 1 hour<br>• Only cold, soft food for 24 hours<br>• Come back after 5 days<br>Always follow the doctor's advice.",
                  hi: "• मुँह साफ़ रखें<br>• प्रेशर पैक 1 घंटा रखें<br>• 24 घंटे केवल ठंडा व नरम भोजन<br>• 5 दिन बाद दोबारा दिखाएँ<br>डॉक्टर की सलाह हमेशा मानें।" } }
    ]
  },

  gallery: [
    { src: "assets/images/clinic/clinic-1.jpeg", w: 1024, h: 576, caption: { en: "Treatment Room", hi: "उपचार कक्ष" },
      alt: { en: "Dental treatment room and patient chair setup at Dental Care clinic, Khagaria", hi: "उपचार कक्ष" } },
    { src: "assets/images/clinic/clinic-2.jpeg", w: 1024, h: 769, caption: { en: "Sterilization & Equipment", hi: "स्टरलाइज़ेशन व उपकरण" },
      alt: { en: "Sterilized dental tools and operatory equipment at Dental Care clinic, Khagaria", hi: "स्टरलाइज़ेशन व उपकरण" } },
    { src: "assets/images/clinic/clinic-3.jpeg", w: 1024, h: 576, caption: { en: "Operatory Setup", hi: "ऑपरेटरी सेटअप" },
      alt: { en: "Modern dental operatory room with treatment console at Dental Care clinic, Khagaria", hi: "ऑपरेटरी सेटअप" } },
    { src: "assets/images/clinic/clinic-4.jpeg", w: 576, h: 1024, caption: { en: "Patient Examination", hi: "मरीज़ की जाँच" },
      alt: { en: "Doctor conducting oral examination of patient at Dental Care clinic, Khagaria", hi: "मरीज़ की जाँच" } },
    { src: "assets/images/clinic/clinic-5.jpeg", w: 576, h: 1024, caption: { en: "Orthodontic Procedure", hi: "ऑर्थोडॉन्टिक उपचार" },
      alt: { en: "Orthodontic braces procedure in progress at Dental Care clinic, Khagaria", hi: "ऑर्थोडॉन्टिक उपचार" } },
    { src: "assets/images/clinic/clinic-6.jpeg", w: 1024, h: 576, caption: { en: "Reception & X-Ray Unit", hi: "रिसेप्शन और एक्स-रे यूनिट" },
      alt: { en: "Reception area with digital dental X-ray setup at Dental Care clinic, Khagaria", hi: "रिसेप्शन और एक्स-रे यूनिट" } },
    { src: "assets/images/clinic/clinic-7.jpeg", w: 1024, h: 576, caption: { en: "Instruments Cabinet", hi: "उपकरण कैबिनेट" },
      alt: { en: "Organized dental instrument storage cabinet at Dental Care clinic, Khagaria", hi: "उपकरण कैबिनेट" } },
    { src: "assets/images/clinic/clinic-8.jpeg", w: 1024, h: 576, caption: { en: "AC & Medicine Cabinet", hi: "एसी और दवाई कैबिनेट" },
      alt: { en: "Air-conditioned chamber with organized medicine cabinet at Dental Care clinic, Khagaria", hi: "एसी और दवाई कैबिनेट" } },
    { src: "assets/images/clinic/clinic-9.jpeg", w: 1024, h: 576, caption: { en: "Doctor's Consultation Desk", hi: "डॉक्टर की परामर्श मेज़" },
      alt: { en: "Doctor's consultation desk and discussion area at Dental Care clinic, Khagaria", hi: "डॉक्टर की परामर्श मेज़" } },
    { src: "assets/images/clinic/clinic-10.jpeg", w: 1024, h: 576, caption: { en: "Consultation Room", hi: "परामर्श कक्ष" },
      alt: { en: "Private patient consultation room at Dental Care clinic, Khagaria", hi: "परामर्श कक्ष" } },
    { src: "assets/images/clinic/clinic-11.jpeg", w: 576, h: 1024, caption: { en: "UV Sterilization Chamber", hi: "यूवी स्टरलाइज़ेशन चैंबर" },
      alt: { en: "UV light sterilization chamber cabinet at Dental Care clinic, Khagaria", hi: "यूवी स्टरलाइज़ेशन चैंबर" } },
    { src: "assets/images/clinic/clinic-12.jpeg", w: 1024, h: 576, caption: { en: "Patient Waiting Area", hi: "मरीज़ प्रतीक्षा कक्ष" },
      alt: { en: "Comfortable patient reception and waiting area at Dental Care clinic, Khagaria", hi: "मरीज़ प्रतीक्षा कक्ष" } },
    { src: "assets/images/clinic/clinic-13.jpeg", w: 1024, h: 576, caption: { en: "Clinic Entrance", hi: "क्लिनिक प्रवेश" },
      alt: { en: "Main entrance of Dental Care clinic, Khagaria", hi: "क्लिनिक प्रवेश" } },
    { src: "assets/images/clinic/clinic-14.jpeg", w: 1024, h: 576, caption: { en: "Autoclave Sterilizer", hi: "ऑटोक्लेव स्टरलाइज़र" },
      alt: { en: "Autoclave sterilizer for dental instruments at Dental Care clinic, Khagaria", hi: "ऑटोक्लेव स्टरलाइज़र" } },
    { src: "assets/images/clinic/clinic-15.jpeg", w: 576, h: 1024, caption: { en: "UV Disinfection Unit", hi: "यूवी डिसइन्फेक्शन यूनिट" },
      alt: { en: "UV disinfection chamber for dental instruments at Dental Care clinic, Khagaria", hi: "यूवी डिसइन्फेक्शन यूनिट" } },
    { src: "assets/images/clinic/clinic-16.jpeg", w: 460, h: 1024, caption: { en: "Dental Consultation & Checkup", hi: "दंत परामर्श व जाँच" },
      alt: { en: "Dentist examining a patient during a dental checkup at Dental Care, Khagaria", hi: "दंत परामर्श व जाँच" } },
    { src: "assets/images/clinic/clinic-17.jpeg", w: 460, h: 1024, caption: { en: "Orthodontic & Braces Care", hi: "ऑर्थोडॉन्टिक व ब्रेसेस उपचार" },
      alt: { en: "Dental chair prepared for orthodontic braces treatment at Dental Care clinic, Khagaria", hi: "ऑर्थोडॉन्टिक व ब्रेसेस उपचार" } }
  ]
};

// image = glossy illustration (home cards); photo = picture for the Treatments page.
// Drop a photo at assets/images/services/photos/<id>.jpg and it is picked up automatically.
CLINIC_CONFIG.services.forEach(s => {
  s.image = `assets/images/services/${s.id}.svg`;
  s.photo = `assets/images/services/photos/${s.id}.jpg`;
});

if (typeof module !== 'undefined' && module.exports) module.exports = CLINIC_CONFIG;
else window.CLINIC_CONFIG = CLINIC_CONFIG;
