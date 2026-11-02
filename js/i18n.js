/* ============================================
   I18N.JS — English / हिंदी switch
   Static text in the HTML carries data-i18n keys (English is written inline
   as the default). Data-driven text lives in clinic-data.js as { en, hi }.
     data-i18n="key"        → textContent
     data-i18n-html="key"   → innerHTML
     data-i18n-ph="key"     → placeholder
     data-i18n-aria="key"   → aria-label
   Long prose (legal pages) uses .lang-en / .lang-hi blocks instead.
   ============================================ */

const I18N = {
  // Brand & nav
  'brand.name': ['Dental Care', 'डेंटल केयर'],
  'brand.doctor': ['Dr. Manish Kumar', 'डॉ० मनीष कुमार'],
  'nav.home': ['Home', 'होम'],
  'nav.about': ['About Doctor', 'डॉक्टर परिचय'],
  'nav.services': ['Treatments', 'उपचार'],
  'nav.reviews': ['Reviews', 'समीक्षाएँ'],
  'nav.faq': ['FAQ', 'सवाल-जवाब'],
  'nav.contact': ['Contact', 'संपर्क'],
  'nav.photos': ['Clinic Photos', 'क्लिनिक की तस्वीरें'],
  'nav.menu': ['Open menu', 'मेन्यू खोलें'],
  'nav.close': ['Close menu', 'मेन्यू बंद करें'],
  'cta.book': ['Book Appointment', 'अपॉइंटमेंट लें'],
  'cta.call': ['Call', 'कॉल करें'],
  'cta.whatsapp': ['WhatsApp', 'व्हाट्सऐप'],
  'cta.chatWa': ['Chat on WhatsApp', 'व्हाट्सऐप पर बात करें'],
  'cta.explore': ['Explore Treatments', 'उपचार देखें'],
  'cta.contact': ['Contact Us', 'संपर्क करें'],
  'hours.summary': ['Mon–Sat: 10 AM–2:30 PM & 3:30–7 PM · Sun: 10 AM–4 PM', 'सोम–शनि: सुबह 10 – दोपहर 2:30 व 3:30 – शाम 7 · रवि: सुबह 10 – शाम 4'],

  // Hero
  'hero.title': ['Dentist in Khagaria: <span class="grad">Complete Dental Care</span> by Dr. Manish Kumar', 'खगड़िया में डेंटिस्ट: डॉ. मनीष कुमार द्वारा <span class="grad">संपूर्ण दंत चिकित्सा</span>'],
  'hero.lead': ['Dr. Manish Kumar, Oral & Dental Surgeon, certified in Orthodontics and Oral Implantology, with 12+ years of experience. RCT, dental implants, braces and more at Mill Rd, Khagaria.',
    'डॉ० मनीष कुमार — मुख एवं दंत शल्य चिकित्सक, ऑर्थोडॉन्टिक्स और ओरल इम्प्लांटोलॉजी में प्रमाणित, 12+ वर्षों का अनुभव। आरसीटी, डेंटल इम्प्लांट, ब्रेसिज़ एवं अन्य उपचार, मिल रोड, खगड़िया।'],
  'hero.card1': ['Oral Implantologist', 'ओरल इम्प्लांटोलॉजिस्ट'],
  'hero.card2': ['Open on Sundays', 'रविवार को भी खुला'],
  'hero.card2s': ['10 AM – 4 PM', 'सुबह 10 – शाम 4'],
  'hero.status': ['Open 7 days a week', 'सप्ताह के सातों दिन खुला'],
  'hero.bookTitle': ['Book Your Appointment', 'अपना अपॉइंटमेंट बुक करें'],
  'hero.bookSub': ['Personalized care for your perfect smile.', 'आपकी बेहतरीन मुस्कान के लिए व्यक्तिगत देखभाल।'],
  'hero.trustedTitle': ['Trusted by Khagaria patients', 'खगड़िया के मरीजों का भरोसा'],
  'hero.trustedSub': ['4.6★ Google Rating', '4.6★ गूगल रेटिंग'],

  // Services
  'svc.eyebrow': ['Our Treatments', 'हमारे उपचार'],
  'svc.title': ['Complete Dental Care Under One Roof', 'एक ही छत के नीचे दाँतों का संपूर्ण इलाज'],
  'svc.lead': ['All 13 treatments are done at the clinic by Dr. Manish Kumar — for you and your whole family.',
    'डॉ० मनीष कुमार द्वारा क्लिनिक में सभी 13 उपचार — आपके और आपके पूरे परिवार के लिए।'],
  'svc.ask': ['Ask about this', 'इसके बारे में पूछें'],
  'svc.learnMore': ['Learn More', 'और जानें'],
  'svc.ctaTitle': ['Not sure what you need?', 'समझ नहीं आ रहा कौन-सा इलाज चाहिए?'],
  'svc.ctaText': ['Send your problem on WhatsApp — the doctor will guide you.', 'अपनी समस्या व्हाट्सऐप पर भेजें — डॉक्टर आपको सही सलाह देंगे।'],
  'svc.waMsg': ['Hello Dental Care, I would like to know about', 'नमस्ते डेंटल केयर, मुझे इसके बारे में जानकारी चाहिए:'],
  'svc.viewAll': ['View All Treatments', 'सभी उपचार देखें'],

  // About
  'about.eyebrow': ['MEET YOUR DENTIST IN KHAGARIA', 'अपने डॉक्टर से मिलिए'],
  'about.title': ['Dr. Manish Kumar', 'डॉ० मनीष कुमार'],
  'about.role': ['Oral & Dental Surgeon', 'मुख एवं दंत शल्य चिकित्सक'],
  'about.text': ['Dr. Manish Kumar brings over 12 years of experience in oral and dental care. At Dental Care on Mill Road, Khagaria, he provides root canal treatment, dental implants, braces, dentures and general dental care with gentle, clear guidance and a patient-first approach.',
    'डॉ० मनीष कुमार मुख एवं दंत चिकित्सा में 12 से अधिक वर्षों का अनुभव रखते हैं। मिल रोड, खगड़िया स्थित डेंटल केयर में वे स्पष्ट मार्गदर्शन और मरीज़-प्रथम दृष्टिकोण के साथ कोमल एवं व्यापक उपचार प्रदान करते हैं।'],
  'about.quote': ['“I treat every patient with the same gentle care, honesty, and attention that I would want for my own family.”',
    '“मैं हर मरीज़ का इलाज उसी कोमल देखभाल, ईमानदारी और ध्यान के साथ करता हूँ जो मैं अपने परिवार के लिए चाहूँगा।”'],
  'about.attr': ['— Dr. Manish Kumar, Oral & Dental Surgeon',
    '— डॉ० मनीष कुमार, मुख एवं दंत शल्य चिकित्सक'],
  'about.f1': ['Certified in Orthodontics', 'ऑर्थोडॉन्टिक्स में प्रमाणित'],
  'about.f2': ['Dental Implant Treatment', 'ओरल इम्प्लांटोलॉजिस्ट'],
  'about.f3': ['Gentle Kids Dental Care', 'बच्चों का कोमल इलाज'],
  'about.f4': ['Open 7 Days, Including Sundays', 'रविवार को भी खुला'],
  'about.more': ['About Dr. Manish Kumar', 'डॉक्टर के बारे में और जानें'],
  'about.badge': ['Years of Experience', 'वर्षों का अनुभव'],
  'docStat.1': ['Experienced Dental Care', 'अनुभवी दंत चिकित्सा'],
  'docStat.2': ['Comprehensive Treatments', 'व्यापक उपचार'],
  'docStat.3': ['Gentle & Precise Care', 'कोमल एवं सटीक देखभाल'],

  // Journey
  'jr.eyebrow': ['YOUR VISIT IN KHAGARIA', 'आपकी विज़िट'],
  'jr.title': ['Simple Steps to a Healthy Smile', 'स्वस्थ मुस्कान के आसान कदम'],
  'jr.s1': ['Book a Visit', 'अपॉइंटमेंट लें'],
  'jr.s1d': ['Call, WhatsApp or fill the form — the clinic confirms your time.', 'कॉल, व्हाट्सऐप या फ़ॉर्म से — क्लिनिक आपका समय तय करेगा।'],
  'jr.s2': ['Check-up & Diagnosis', 'जाँच और निदान'],
  'jr.s2d': ['Dr. Manish Kumar examines you and explains the problem clearly.', 'डॉक्टर जाँच करके समस्या साफ़-साफ़ समझाते हैं।'],
  'jr.s3': ['Dental Treatment', 'इलाज'],
  'jr.s3d': ['Comfortable dental treatment with a clear plan and cost.', 'स्पष्ट योजना और खर्च के साथ आरामदायक इलाज।'],
  'jr.s4': ['Aftercare & Recall', 'देखभाल व दोबारा जाँच'],
  'jr.s4d': ['Simple aftercare tips and a recall visit after 5 days.', 'आसान देखभाल निर्देश और 5 दिन बाद दोबारा जाँच।'],

  // Video
  'vid.eyebrow': ['Inside Our Clinic', 'क्लिनिक की एक झलक'],

  // Awards
  'aw.eyebrow': ['CREDENTIALS & MEMBERSHIPS', 'पुरस्कार व उपलब्धियाँ'],
  'aw.title': ['Qualifications You Can Trust', 'भरोसेमंद योग्यताएँ'],
  'aw.lead': ['Degrees, certifications and professional memberships of Dr. Manish Kumar, Oral & Dental Surgeon.', 'डॉ० मनीष कुमार की डिग्रियाँ, प्रमाणपत्र और पेशेवर सदस्यताएँ।'],
  'docAw.eyebrow': ['AWARDS & ACHIEVEMENTS', 'पुरस्कार और उपलब्धियाँ'],
  'docAw.title': ['Awards & Recognition', 'पुरस्कार और सम्मान'],

  // Gallery
  'gal.eyebrow': ['CLINIC GALLERY', 'क्लिनिक की झलक'],
  'gal.title': ['Take a Look Inside', 'क्लिनिक को अंदर से देखें'],
  'gal.lead': ['Tap any photo to view it full screen.', 'बड़ा देखने के लिए किसी भी तस्वीर पर टैप करें।'],

  // Reviews
  'rv.eyebrow': ['Patient Reviews', 'मरीज़ों की राय'],
  'rv.title': ['What Our Patients in Khagaria Say', 'हमारे मरीज़ क्या कहते हैं'],
  'rv.based': ['Based on {n} Google reviews', '{n} गूगल समीक्षाओं के आधार पर'],
  'rv.view': ['View on Google Maps', 'गूगल पर देखें'],
  'rv.write': ['Write a Google Review', 'समीक्षा लिखें'],
  'rv.rated': ['Rated 5 stars on Google.', 'गूगल पर 5 स्टार रेटिंग दी।'],
  'rv.google': ['Google Review', 'गूगल समीक्षा'],

  // FAQ
  'faq.eyebrow': ['FAQ', 'सवाल-जवाब'],
  'faq.title': ['Frequently Asked Questions', 'अक्सर पूछे जाने वाले सवाल'],
  'faq.lead': ["Can't find your answer? Ask us directly — we're happy to help.", 'आपका जवाब नहीं मिला? सीधे हमसे पूछें — हमें मदद करके खुशी होगी।'],
  'faq.all': ['See all questions', 'सभी सवाल देखें'],

  // Appointment & contact
  'ap.eyebrow': ['Book an Appointment', 'अपॉइंटमेंट बुक करें'],
  'ap.title': ['Visit Dental Care, Mill Road', 'डेंटल केयर, मिल रोड पर आएँ'],
  'ap.lead': ['Fill the form — WhatsApp opens with your details ready to send to the clinic.', 'फ़ॉर्म भरें — व्हाट्सऐप आपकी जानकारी के साथ खुलेगा, बस क्लिनिक को भेज दें।'],
  'ap.formTitle': ['Request a Visit', 'विज़िट का अनुरोध करें'],
  'ap.formSub': ['The clinic will confirm your date and time.', 'क्लिनिक आपकी तारीख और समय की पुष्टि करेगा।'],
  'f.name': ['Full Name', 'पूरा नाम'],
  'f.namePh': ['e.g. Rahul Kumar', 'जैसे: राहुल कुमार'],
  'f.phone': ['Mobile Number', 'मोबाइल नंबर'],
  'f.phonePh': ['10-digit mobile number', '10 अंकों का मोबाइल नंबर'],
  'f.service': ['Treatment Needed', 'कौन-सा इलाज चाहिए'],
  'f.date': ['Preferred Date', 'पसंदीदा तारीख'],
  'f.msg': ['Problem / Message (optional)', 'समस्या / संदेश (वैकल्पिक)'],
  'f.msgPh': ['e.g. toothache for 2 days, evening time preferred', 'जैसे: 2 दिन से दाँत में दर्द, शाम का समय ठीक रहेगा'],
  'f.submit': ['Send Request on WhatsApp', 'व्हाट्सऐप पर अनुरोध भेजें'],
  'f.note': ['By submitting, you agree to our <a href="privacy-policy.html">Privacy Policy</a>. Your details go only to the clinic\'s WhatsApp.',
    'भेजकर आप हमारी <a href="privacy-policy.html">गोपनीयता नीति</a> से सहमत होते हैं। आपकी जानकारी केवल क्लिनिक के व्हाट्सऐप पर जाती है।'],
  'f.optGeneral': ['General Check-up', 'सामान्य जाँच'],
  'f.optPain': ['Toothache / Pain', 'दाँत में दर्द'],
  'f.optOther': ['Other', 'अन्य'],
  'f.errName': ['Please enter your name.', 'कृपया अपना नाम लिखें।'],
  'f.errPhone': ['Please enter a valid 10-digit mobile number.', 'कृपया सही 10 अंकों का मोबाइल नंबर लिखें।'],
  'f.okTitle': ['Appointment Request Received', 'अपॉइंटमेंट अनुरोध प्राप्त हुआ'],
  'f.okText': ['Your appointment request has been sent successfully.', 'आपका अपॉइंटमेंट अनुरोध सफलतापूर्वक भेज दिया गया है।'],
  'f.okBtn': ['View WhatsApp', 'व्हाट्सऐप देखें'],
  'f.again': ['Send another request', 'एक और अनुरोध भेजें'],
  'done.title': ['Appointment Request Received', 'अपॉइंटमेंट अनुरोध प्राप्त हुआ'],
  'done.sub': ['Thank you for contacting Dental Care. Your appointment request has been sent successfully.', 'डेंटल केयर से संपर्क करने के लिए धन्यवाद। आपका अपॉइंटमेंट अनुरोध सफलतापूर्वक भेज दिया गया है।'],
  'done.subClosed': ['Thank you for contacting Dental Care. Your appointment request has been sent successfully.', 'डेंटल केयर से संपर्क करने के लिए धन्यवाद। आपका अपॉइंटमेंट अनुरोध सफलतापूर्वक भेज दिया गया है।'],
  'done.slotDate': ['Preferred Date:', 'पसंदीदा तारीख:'],
  'done.slotTime': ['Preferred Time:', 'पसंदीदा समय:'],
  'done.msgOpen': ['Our clinic team will review your request and contact you on WhatsApp or call within 15 minutes to confirm your appointment slot.', 'हमारी क्लिनिक टीम आपका अनुरोध देखेगी और 15 मिनट के अंदर व्हाट्सऐप या कॉल पर आपसे संपर्क कर अपॉइंटमेंट स्लॉट की पुष्टि करेगी।'],
  'done.msgClosed': ['Our clinic is currently closed. Our team will review your request when the clinic reopens and contact you to confirm the appointment slot.', 'हमारी क्लिनिक अभी बंद है। हमारी टीम क्लिनिक खुलने पर आपका अनुरोध देखेगी और अपॉइंटमेंट स्लॉट की पुष्टि के लिए आपसे संपर्क करेगी।'],
  'done.clinicHours': ['Clinic Hours:', 'क्लिनिक का समय:'],
  'done.note': ['Your appointment is confirmed only after receiving confirmation from our clinic team.', 'आपकी अपॉइंटमेंट तभी पक्की मानी जाएगी जब हमारी क्लिनिक टीम आपको पुष्टि दे।'],
  'done.btnDone': ['Done', 'ठीक है'],
  'done.btnWa': ['View WhatsApp', 'व्हाट्सऐप देखें'],
  'wa.greet': ['Hello Dental Care, I would like to book an appointment.', 'नमस्ते डेंटल केयर, मैं अपॉइंटमेंट लेना चाहता/चाहती हूँ।'],
  'wa.name': ['Name', 'नाम'],
  'wa.phone': ['Phone', 'फ़ोन'],
  'wa.treatment': ['Treatment', 'इलाज'],
  'wa.date': ['Preferred Date', 'पसंदीदा तारीख'],
  'wa.msg': ['Message', 'संदेश'],
  'wa.earliest': ['Earliest available', 'जल्द से जल्द'],
  'info.hours': ['Chamber Hours', 'क्लिनिक का समय'],
  'info.address': ['Address', 'पता'],
  'info.phone': ['Appointments', 'अपॉइंटमेंट'],
  'info.directions': ['Get Directions', 'रास्ता देखें'],
  'info.maps': ['Open in Google Maps', 'गूगल मैप्स में खोलें'],
  'info.walkin': ['Walk-ins welcome during chamber hours. A fresh consultation fee applies after 25 days from your last visit.',
    'क्लिनिक के समय में बिना अपॉइंटमेंट भी आ सकते हैं। पिछली विज़िट के 25 दिन बाद दोबारा परामर्श शुल्क लगता है।'],
  'info.today': ['Today', 'आज'],
  'info.closed': ['Closed', 'बंद'],

  // Contact page
  'ct.eyebrow': ['Contact Us', 'संपर्क करें'],
  'ct.title': ['Contact Our Dental Clinic in <span class="grad">Khagaria</span>', 'खगड़िया में हमारे डेंटल क्लिनिक से <span class="grad">संपर्क करें</span>'],
  'ct.desc': ['Have questions about a dental treatment, facing acute tooth pain, or looking to schedule a routine checkup? <a href="doctor.html">Dr. Manish Kumar</a> and the caring team at Dental Care on Mill Road, Khagaria are here to help. Explore our <a href="services.html">dental treatments</a> or call our reception to book your visit.',
    'दाँतों के इलाज से जुड़े सवाल हों, दाँत में तेज़ दर्द हो, या नियमित जाँच करवानी हो — <a href="doctor.html">डॉ० मनीष कुमार</a> और मिल रोड, खगड़िया स्थित डेंटल केयर की टीम आपकी सहायता के लिए सदैव उपलब्ध है। हमारे <a href="services.html">दंत उपचार</a> देखें या अपनी अपॉइंटमेंट बुक करें।'],
  'ct.callClinic': ['Call the Clinic', 'क्लिनिक को कॉल करें'],
  'ct.findClinic': ['Find the Clinic', 'क्लिनिक का पता देखें'],
  'ct.openToday': ['Open Today', 'आज खुला है'],
  'ct.docTitle': ['Dr. Manish Kumar, B.D.S.', 'डॉ० मनीष कुमार, बी.डी.एस.'],
  'ct.docSub': ['Oral & Dental Surgeon · Mill Road Chamber', 'मुख एवं दंत शल्य चिकित्सक · मिल रोड क्लिनिक'],
  'ct.callUs': ['Call Us', 'हमें कॉल करें'],
  'ct.callNote': ['Direct consultation & emergency appointments', 'सीधा परामर्श एवं आपातकालीन अपॉइंटमेंट'],
  'ct.emailUs': ['Email Us', 'ईमेल करें'],
  'ct.emailVal': ['info@dentalcarekgg.com', 'info@dentalcarekgg.com'],
  'ct.emailNote': ['Treatment estimates & patient queries', 'इलाज की जानकारी व परामर्श'],
  'ct.address': ['Clinic Address', 'क्लिनिक का पता'],
  'ct.addrVal': ['Mill Road, Khagaria', 'मिल रोड, खगड़िया'],
  'ct.addrNote': ['In front of Bala Ji TELCOM, Bihar 851204', 'बाला जी टेलकॉम के सामने, बिहार 851204'],
  'ct.hours': ['Consultation Hours', 'परामर्श का समय'],
  'ct.hoursVal': ['Open 7 Days a Week', 'सप्ताह के सातों दिन खुला'],
  'ct.hoursNote': ['Mon–Sat: 10am–7pm · Sun: 10am–4pm', 'सोम–शनि: 10–7 बजे · रवि: 10–4 बजे'],
  'ct.bookTitle': ['Book Your Dental Visit', 'डेंटल विज़िट बुक करें'],
  'ct.bookHead': ['Book Your Dental Appointment in Khagaria', 'खगड़िया में अपनी डेंटल अपॉइंटमेंट बुक करें'],
  'ct.bookSub': ['One call or message is all it takes. Dr. Manish Kumar\'s front desk confirms a time that suits you at our Mill Road clinic, with minimal wait on the day of your visit.',
    'बस एक कॉल या संदेश की दूरी। डॉ० मनीष कुमार का मिल रोड क्लिनिक आपकी सुविधा अनुसार समय तय करता है ताकि विज़िट के दिन कम से कम प्रतीक्षा करनी पड़े।'],
  'ct.callNow': ['Call +91 70912 38383', 'कॉल करें +91 70912 38383'],
  'ct.waUs': ['WhatsApp Us', 'व्हाट्सऐप करें'],
  'ct.instantBook': ['Instant Booking', 'तुरंत बुक करें'],
  'ct.badge1Title': ['12+ Years Experience', '12+ वर्षों का अनुभव'],
  'ct.badge1Sub': ['Trusted by 10,000+ happy patients', '10,000+ संतुष्ट मरीज़ों का भरोसा'],
  'ct.badge2Title': ['Gentle & Comfortable Dentistry', 'सौम्य एवं आरामदायक इलाज'],
  'ct.badge2Sub': ['Modern equipment & sterile protocols', 'आधुनिक उपकरण व स्वच्छता का पूरा ध्यान'],
  'ct.badge3Title': ['Open on Sundays', 'रविवार को भी खुला'],
  'ct.badge3Sub': ['Morning & evening chambers available', 'सुबह और शाम दोनों समय क्लिनिक खुला'],
  'ct.visitEyebrow': ['VISIT THE CLINIC', 'क्लिनिक पर आएँ'],
  'ct.visitHead': ['Visit Dental Care on Mill Road, Khagaria', 'मिल रोड, खगड़िया में डेंटल केयर पर आएँ'],
  'ct.visitDesc': ['Conveniently located on Mill Road in Khagaria, in front of Bala Ji TELCOM. Easily accessible from Khagaria Railway Station and Main Market.',
    'खगड़िया के मिल रोड पर स्थित, बाला जी टेलकॉम के ठीक सामने। खगड़िया रेलवे स्टेशन और मुख्य बाज़ार से आसानी से पहुँचा जा सकता है।'],
  'ct.scheduleTitle': ['Chamber Timings', 'क्लिनिक का समय'],
  'ct.monSat': ['Monday to Saturday', 'सोमवार से शनिवार'],
  'ct.monSatHours': ['10:00 AM – 2:30 PM & 3:30 PM – 7:00 PM', 'सुबह 10:00 – दोपहर 2:30 व दोपहर 3:30 – शाम 7:00'],
  'ct.sun': ['Sunday (Special Chamber)', 'रविवार (विशेष सत्र)'],
  'ct.sunHours': ['10:00 AM – 4:00 PM (Continuous)', 'सुबह 10:00 – शाम 4:00 (निरंतर)'],
  'ct.directions': ['Get Directions', 'रास्ता देखें (गूगल मैप्स)'],
  'ct.emailClinic': ['Email the Clinic', 'क्लिनिक को ईमेल करें'],
  'ct.stayConnected': ['STAY CONNECTED', 'जुड़े रहें'],
  'ct.stayHead': ['Message Us on WhatsApp or Leave a Review', 'व्हाट्सऐप पर बात करें या समीक्षा दें'],
  'ct.stayDesc': ['Quick questions are easiest on WhatsApp. For smile queries or feedback about your visit, reach out anytime.',
    'तुरंत सवाल पूछने के लिए व्हाट्सऐप सबसे आसान माध्यम है। किसी भी जानकारी या अपनी विज़िट के अनुभव के लिए कभी भी संपर्क करें।'],
  'ct.writeReview': ['Write Google Review', 'गूगल रिव्यू लिखें'],

  // Footer
  'ft.about': ['Comprehensive oral & dental care by Dr. Manish Kumar on Mill Road, Khagaria.',
    'डॉ० मनीष कुमार द्वारा संपूर्ण मुख एवं दंत चिकित्सा — मिल रोड, खगड़िया।'],
  'ft.links': ['Quick Links', 'उपयोगी लिंक'],
  'ft.treat': ['Treatments', 'उपचार'],
  'ft.allTreatments': ['View All Treatments →', 'सभी उपचार देखें →'],
  'ft.contact': ['Contact', 'संपर्क'],
  'ft.rights': ['All rights reserved.', 'सर्वाधिकार सुरक्षित।'],
  'ft.wish': ['Wish you a healthy life.', 'आपका जीवन स्वस्थ रहे।'],
  'ft.privacy': ['Privacy Policy', 'गोपनीयता नीति'],
  'ft.terms': ['Terms of Use', 'उपयोग की शर्तें'],
  'ft.disclaimer': ['Information on this website is for general awareness only and is not a substitute for a clinical examination.',
    'इस वेबसाइट की जानकारी केवल सामान्य जागरूकता के लिए है; यह डॉक्टर की जाँच का विकल्प नहीं है।'],


  // Doctor page
  'doc.crumb': ['About the Doctor', 'डॉक्टर परिचय'],
  'doc.h1': ['About Dr. Manish Kumar', 'डॉ० मनीष कुमार के बारे में'],
  'doc.sub': ['Oral & Dental Surgeon · The Center for Dental Excellence, Mill Road, Khagaria', 'मुख एवं दंत शल्य चिकित्सक · दंत उत्कृष्टता का केंद्र, मिल रोड, खगड़िया'],
  'doc.role': ['Oral & Dental Surgeon · 12+ Years of Experience', 'मुख एवं दंत शल्य चिकित्सक · 12+ वर्षों का अनुभव'],
  'doc.p1': ['Dr. Manish Kumar brings over 12 years of experience in oral and dental care. At Dental Care on Mill Road, Khagaria, he provides comprehensive treatment with a focus on gentle care, clear guidance, and comfortable patient experiences.',
    'डॉ० मनीष कुमार मुख एवं दंत चिकित्सा में 12 से अधिक वर्षों का अनुभव रखते हैं। मिल रोड, खगड़िया स्थित डेंटल केयर में वे कोमल देखभाल, स्पष्ट मार्गदर्शन और आरामदायक इलाज के साथ व्यापक उपचार प्रदान करते हैं।'],
  'doc.p2': ["His expertise includes root canal treatment, restorative dentistry, dentures, crowns and bridges, dental implants, orthodontics, gum surgery, and children's dentistry.",
    'उनकी विशेषज्ञता में रूट कैनाल उपचार, रेस्टोरेटिव डेंटिस्ट्री (फिलिंग), डेन्चर, क्राउन एवं ब्रिज, डेंटल इम्प्लांट, ऑर्थोडॉन्टिक्स, मसूड़ों की सर्जरी और बच्चों की दंत चिकित्सा शामिल हैं।'],
  'doc.callDoc': ['Call Doctor', 'डॉक्टर को कॉल करें'],
  'doc.reg': ['Registration No.', 'पंजीकरण सं.'],
  'doc.clinic': ['Appointments', 'अपॉइंटमेंट'],
  'why.eyebrow': ['Why Choose Us', 'हमें क्यों चुनें'],
  'why.title': ['Why Patients Trust Dental Care', 'मरीज़ डेंटल केयर पर भरोसा क्यों करते हैं'],
  'care.eyebrow': ['After Your Treatment', 'इलाज के बाद'],
  'care.title': ['General Post-Operative Guidelines', 'इलाज के बाद के सामान्य निर्देश'],
  'care.notice': ['<strong>Please note:</strong> Do not consume paan, supari, zarda, gutkha, khaini, etc. Take only the medicine prescribed — do not substitute it. A fresh fee applies after 25 days.',
    '<strong>कृपया ध्यान दें:</strong> पान, सुपारी, जर्दा, गुटखा, खैनी इत्यादि का सेवन न करें। जो दवा लिखी गई है वही लें, बदले में न लें। 25 दिनों के बाद पुनः फ़ीस लगेगी।'],
  'cta.ready': ['Ready to Book Your Visit?', 'अपनी विज़िट बुक करें'],

  // Legal
  'legal.privacy': ['Privacy Policy', 'गोपनीयता नीति'],
  'legal.privacySub': ['How this website handles your information.', 'यह वेबसाइट आपकी जानकारी को कैसे संभालती है।'],
  'legal.terms': ['Terms of Use', 'उपयोग की शर्तें'],
  'legal.termsSub': ['Please read these terms before using this website.', 'इस वेबसाइट का उपयोग करने से पहले कृपया ये शर्तें पढ़ें।'],
  'legal.updated': ['Last updated: 22 September 2026', 'अंतिम अद्यतन: 22 सितंबर 2026'],

  // --- v2 additions ---
  'trust.1': ['Certified in Orthodontics', 'ऑर्थोडॉन्टिक्स में प्रमाणित'],
  'trust.2': ['Oral Implantologist', 'ओरल इम्प्लांटोलॉजिस्ट'],
  'trust.3': ['Gentle Care for Kids', 'बच्चों की कोमल देखभाल'],
  'trust.4': ['Open on Sundays', 'रविवार को भी खुला'],
  'svcp.crumb': ['Treatments', 'उपचार'],
  'svcp.heroEyebrow': ['Our Treatments', 'हमारे उपचार'],
  'svcp.h1': ['Complete <span class="grad">Dental Care</span> in Khagaria<br>Under One Roof', 'खगड़िया में एक ही छत के नीचे<br><span class="grad">संपूर्ण दंत चिकित्सा</span>'],
  'svcp.lead': ['At Dental Care on Mill Road, Khagaria, we provide 13 comprehensive dental treatments for the whole family — from routine check-ups and cleanings to advanced root canals, implants, and braces by Dr. Manish Kumar.', 'मिल रोड, खगड़िया स्थित डेंटल केयर में हम पूरे परिवार के लिए संपूर्ण दंत चिकित्सा प्रदान करते हैं — डॉ० मनीष कुमार द्वारा नियमित जाँच व सफाई से लेकर आधुनिक रूट कैनाल, इम्प्लांट और ब्रेसेस तक।'],
  'svcp.btnBook': ['Book Appointment', 'अपॉइंटमेंट बुक करें'],
  'svcp.btnCallDoc': ['Call Doctor', 'डॉक्टर को कॉल करें'],
  'svcp.btnExplore': ['Explore Treatments', 'उपचार देखें'],
  'svcp.statTreat': ['Treatments', 'उपचार'],
  'svcp.statExp': ['Years of Experience', 'वर्षों का अनुभव'],
  'svcp.statDays': ['Days Open', 'दिन खुला'],
  'svcp.badgeRoof': ['ALL UNDER ONE ROOF', 'सब एक ही छत के नीचे'],
  'svcp.badgeCount': ['13 dental treatments', 'दाँतों के 13 उपचार'],
  'svcp.card': ['All under one roof', 'सब एक ही जगह'],
  'svcp.cardT': ['13 dental treatments', 'दाँतों के 13 उपचार'],
  'svcp.eyebrow': ['What we treat', 'हम क्या इलाज करते हैं'],
  'svcp.title': ['Every treatment your smile needs', 'आपकी मुस्कान के लिए हर ज़रूरी इलाज'],
  'svcp.side': ['From a simple filling to implants and braces — all done at the clinic by Dr. Manish Kumar.', 'साधारण फिलिंग से लेकर इम्प्लांट और ब्रेसेस तक — सब क्लिनिक में डॉ० मनीष कुमार द्वारा।'],
  'svcp.ctaT': ['Not sure which treatment you need?', 'समझ नहीं आ रहा कौन-सा इलाज चाहिए?'],
  'svcp.ctaD': ['Book a check-up — the doctor will examine you and suggest the right treatment.', 'जाँच बुक करें — डॉक्टर जाँच करके सही इलाज बताएँगे।'],
  'hygiene.eyebrow': ['Safety & Hygiene', 'सुरक्षा एवं स्वच्छता'],
  'hygiene.title': ['Sterilized Instruments.<br><span class="grad">Safer Dental Care.</span>', 'जीवाणुरहित उपकरण।<br><span class="grad">सुरक्षित दंत चिकित्सा।</span>'],
  'hygiene.desc': ['Every instrument used at Dental Care is carefully cleaned, sterilized and prepared following strict clinical hygiene protocols to maintain a safe and hygienic environment for every patient.', 'डेंटल केयर में उपयोग किया जाने वाला प्रत्येक उपकरण सख्त क्लिनिकल स्वच्छता नियमों के तहत पूरी तरह साफ और स्टेरलाइज किया जाता है, ताकि हर मरीज को सुरक्षित वातावरण मिल सके।'],
  'hygiene.p1Title': ['Sterilized Instruments', 'जीवाणुरहित (स्टेरलाइज्ड) उपकरण'],
  'hygiene.p1Desc': ['Every instrument is properly cleaned and sterilized before use.', 'उपयोग से पहले हर उपकरण को अच्छी तरह साफ और स्टेरलाइज किया जाता है।'],
  'hygiene.p2Title': ['Strict Hygiene Protocols', 'सख्त स्वच्छता प्रोटोकॉल'],
  'hygiene.p2Desc': ['Careful hygiene practices are followed throughout patient care.', 'मरीज के इलाज के दौरान हर कदम पर सख्त स्वच्छता का पालन किया जाता है।'],
  'hygiene.p3Title': ['Clean Clinical Environment', 'स्वच्छ क्लिनिकल वातावरण'],
  'hygiene.p3Desc': ['A clean and organized environment designed with patient safety in mind.', 'मरीजों की सुरक्षा और सुविधा को ध्यान में रखकर तैयार किया गया स्वच्छ माहौल।'],
  'gal.hint': ['Tap any photo to view it full screen and zoom in.', 'बड़ा देखने और ज़ूम करने के लिए किसी भी तस्वीर पर टैप करें।'],
  'lb.hint': ['Double-tap or scroll to zoom · drag to move', 'ज़ूम के लिए डबल-टैप या स्क्रॉल करें · खिसकाने के लिए खींचें'],
  'faq.sub': ['The things patients ask us most — answered before you walk in.', 'मरीज़ जो सबसे ज़्यादा पूछते हैं — क्लिनिक आने से पहले ही जवाब।'],
  'faq.still': ['Still have a question?', 'अब भी कोई सवाल है?'],
  'faq.askWa': ['Ask us on WhatsApp', 'व्हाट्सऐप पर पूछें'],
  'ct.eyebrow': ['Visit Us', 'हमसे मिलें'],
  'ct.lead': ['Walk in during chamber hours, or book ahead to skip the wait.', 'क्लिनिक के समय में सीधे आएँ, या इंतज़ार से बचने के लिए पहले से बुक करें।'],
  'm.title': ['Quick Appointment Booking', 'जल्दी अपॉइंटमेंट बुक करें'],
  'm.sub': ['Fill 4 details — the clinic will confirm your slot on WhatsApp.', '4 जानकारी भरें — क्लिनिक व्हाट्सऐप पर आपका समय पक्का करेगा।'],
  'm.close': ['Close', 'बंद करें'],
  'm.note': ['This opens WhatsApp with your details filled in — just press send.', 'इससे व्हाट्सऐप आपकी जानकारी के साथ खुलेगा — बस "भेजें" दबाएँ।'],
  'f.name2': ['Patient Name', 'मरीज़ का नाम'],
  'f.day': ['Preferred Day', 'पसंदीदा दिन'],
  'f.time': ['Preferred Time', 'पसंदीदा समय'],
  'f.dateTime': ['Preferred Date & Time', 'पसंदीदा तारीख और समय'],
  'f.today': ['Today', 'आज'],
  'f.tomorrow': ['Tomorrow', 'कल'],
  'f.morning': ['Morning (10 AM – 2:30 PM)', 'सुबह (10 – दोपहर 2:30)'],
  'f.evening': ['Evening (3:30 – 7 PM)', 'शाम (3:30 – 7)'],
  'f.sunday': ['Sunday (10 AM – 4 PM)', 'रविवार (सुबह 10 – शाम 4)'],
  'f.anytime': ['Any time', 'कोई भी समय'],
  'f.sendWa': ['Send to WhatsApp', 'व्हाट्सऐप पर भेजें'],
  'f.slotTitle': ['Select Appointment Preference', 'अपॉइंटमेंट समय चुनें'],
  'f.selectDate': ['SELECT DATE', 'तारीख चुनें'],
  'f.timePref': ['TIME PREFERENCE', 'समय प्राथमिकता'],
  'f.prefNote': ['Preference only', 'केवल प्राथमिकता'],
  'f.confirmSlot': ['Confirm Preference', 'समय की पुष्टि करें'],
  'f.changeDate': ['Change Date', 'तारीख बदलें'],
  'f.selectedDate': ['Selected Date', 'चुनी गई तारीख'],
  'f.mornHours': ['Morning · 10:00 AM – 2:30 PM', 'सुबह · 10:00 – दोपहर 2:30'],
  'f.eveHours': ['Evening · 3:30 PM – 7:00 PM', 'शाम · 3:30 – शाम 7:00'],
  'f.sunHours': ['Sunday · 10:00 AM – 4:00 PM', 'रविवार · सुबह 10:00 – शाम 4:00'],
  'f.morningLabel': ['MORNING', 'सुबह'],
  'f.eveningLabel': ['EVENING', 'शाम'],
  'f.sunHoursBadge': ['Sundays Open · 10:00 AM – 4:00 PM', 'रविवार खुला · सुबह 10:00 – शाम 4:00'],
  'wa.time': ['Preferred Time', 'पसंदीदा समय'],
  'fab.call': ['Call the clinic', 'क्लिनिक को कॉल करें'],
  'fab.wa': ['Chat on WhatsApp', 'व्हाट्सऐप पर बात करें'],
  'stat.treat': ['Treatments', 'उपचार'],
  'stat.days': ['Days Open', 'दिन खुला'],
};

(function () {
  const KEY = 'dc-lang';
  const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const write = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ } };

  const fromUrl = new URLSearchParams(location.search).get('lang');
  let lang = (fromUrl === 'hi' || fromUrl === 'en') ? fromUrl : (read() === 'hi' ? 'hi' : 'en');
  document.documentElement.lang = lang;

  const idx = () => (lang === 'hi' ? 1 : 0);

  window.LANG = {
    get: () => lang,
    /** Translate a dictionary key (with optional {n} style vars) */
    t(key, vars) {
      const row = I18N[key];
      let s = row ? row[idx()] : key;
      if (vars) Object.keys(vars).forEach(k => { s = s.replace(`{${k}}`, vars[k]); });
      return s;
    },
    /** Pick the right language from a { en, hi } value (plain strings pass through) */
    tr(v) {
      if (v && typeof v === 'object') return v[lang] ?? v.en;
      return v ?? '';
    },
    apply(root = document) {
      root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = LANG.t(el.dataset.i18n); });
      root.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = LANG.t(el.dataset.i18nHtml); });
      root.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = LANG.t(el.dataset.i18nPh); });
      root.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', LANG.t(el.dataset.i18nAria)); });
      document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    },
    set(next) {
      if (next === lang) return;
      lang = next;
      document.documentElement.lang = lang;
      write(lang);
      LANG.apply();
      document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
    }
  };
})();
