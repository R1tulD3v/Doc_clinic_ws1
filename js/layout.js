/* ============================================
   LAYOUT.JS — Shared header, mobile menu, footer, floating buttons,
   help chat and the booking pop-up.
   Loaded synchronously at the end of <body> (after clinic-data.js and i18n.js)
   so the page paints once, already in the chosen language.
   ============================================ */

(function () {
  const C = window.CLINIC_CONFIG;
  const page = document.body.dataset.page || 'home';
  const isHome = page === 'home';
  const isSubdir = document.body.dataset.subdir === 'true' || window.location.pathname.includes('/treatments/');
  const R = isSubdir ? '../' : '';
  const L = (hash) => (isHome ? hash : R + 'index.html' + hash);
  const wa = (msg) => `https://wa.me/${C.contact.whatsappNumber}?text=${encodeURIComponent(msg || LANG.tr(C.contact.whatsappDefaultMessage))}`;

  /* ---- Icons ---- */
  const TOOTH = 'M12 2C8.5 2 6 4 6 7c0 2 .5 3.5 1 5 .8 2.5 1 4 1 6 0 1.5 1 3 2 3s2-1.5 2-3v-2c0-.5.5-1 1-1s1 .5 1 1v2c0 1.5 1 3 2 3s2-1.5 2-3c0-2 .2-3.5 1-6 .5-1.5 1-3 1-5 0-3-2.5-5-6-5z';
  const ICONS = {
    tooth: `<path d="${TOOTH}"/>`,
    braces: `<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 8v8M12 8v8M17 8v8M3 12h18"/>`,
    implant: `<path d="M8 3h8l-1 5H9z"/><path d="M9 11h6M9.5 14h5M10 17h4M11 20h2"/>`,
    sparkle: `<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>`,
    denture: `<path d="M3 9c0-2 2-3 4-3h10c2 0 4 1 4 3v2c0 5-4 8-9 8s-9-3-9-8z"/><path d="M7 6v4M10 6v4M14 6v4M17 6v4"/>`,
    crown: `<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>`,
    drop: `<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>`,
    degree: `<path d="M22 10L12 5 2 10l10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>`,
    award: `<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5"/>`,
    shield: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>`,
    check: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>`,
    phone: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`,
    pin: `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,
    clock: `<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>`,
    calendar: `<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>`,
    star: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>`,
    close: `<path d="M18 6L6 18M6 6l12 12"/>`,
    arrow: `<path d="M5 12h14M13 6l6 6-6 6"/>`,
    arrowUR: `<path d="M7 17L17 7M8 7h9v9"/>`,
    chevron: `<path d="M9 18l6-6-6-6"/>`,
    chevronL: `<path d="M15 18l-6-6 6-6"/>`,
    plus: `<path d="M12 5v14M5 12h14"/>`,
    minus: `<path d="M5 12h14"/>`,
    search: `<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>`,
    smile: `<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>`,
    heart: `<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>`,
    stethoscope: `<path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M10 14v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>`,
    user: `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>`
  };
  const icon = (name, cls = '') =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.tooth}</svg>`;
  const WA = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.761.455 3.414 1.252 4.856L2.05 21.95l5.242-1.213C8.683 21.498 10.292 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 1.818c4.519 0 8.182 3.663 8.182 8.182 0 4.519-3.663 8.182-8.182 8.182-1.472 0-2.853-.39-4.05-1.071l-.29-.165-3.08.713.725-3.003-.179-.297A8.14 8.14 0 0 1 3.818 12c0-4.519 3.663-8.182 8.182-8.182z"/><path d="M15.485 13.062c-.22-.11-1.302-.642-1.503-.715-.202-.073-.349-.11-.496.11-.147.22-.569.715-.697.862-.128.147-.257.165-.477.055-.22-.11-.93-.343-1.771-1.093-.655-.584-1.097-1.306-1.226-1.526-.128-.22-.014-.339.096-.448.099-.098.22-.257.33-.385.11-.128.147-.22.22-.367.073-.147.037-.275-.018-.385-.055-.11-.496-1.194-.679-1.636-.178-.43-.36-.372-.496-.379-.128-.007-.275-.008-.422-.008-.147 0-.385.055-.587.275-.202.22-.771.753-.771 1.836 0 1.083.789 2.13 1 2.276.037.055 1.524 2.33 3.693 3.266 1.848.798 2.224.639 2.628.602.404-.037 1.302-.532 1.486-1.046.184-.514.184-.954.129-1.046-.055-.092-.202-.147-.422-.257z"/></svg>`;
  window.SITE = { icon, ICONS, wa, WA, L, R };

  const langToggle = `
    <div class="lang" role="group" aria-label="Language / भाषा">
      <button type="button" data-lang="en" aria-pressed="true">EN</button>
      <button type="button" data-lang="hi" aria-pressed="false">हिंदी</button>
    </div>`;

  const header = `
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header class="hdr" id="header">
    <div class="container hdr__in">
      <a href="${L('#top')}" class="brand" aria-label="Dental Care - Dr. Manish Kumar">
        <img class="brand__logo" src="${R}assets/images/logo/dental-logo.png" alt="Dental Care - Dr. Manish Kumar" width="195" height="52">
      </a>
      <nav class="nav" aria-label="Main">
        <a href="${L('#top')}" class="nav__link${page === 'home' && !isHome ? ' is-active' : ''}" data-i18n="nav.home"></a>
        <a href="${R}doctor.html" class="nav__link${page === 'doctor' && !isHome ? ' is-active' : ''}" data-i18n="nav.about"></a>
        <div class="nav__item nav__item--dropdown" id="nav-treatments-item">
          <a href="${R}services.html" class="nav__link nav__link--dropdown${(page === 'services' || page === 'treatment-detail') && !isHome ? ' is-active' : ''}" id="nav-treatments-link" aria-expanded="false" aria-haspopup="true">
            <span data-i18n="nav.services">Treatments</span>
            <svg class="nav__chevron" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <div class="nav__dropdown" id="nav-treatments-menu" role="menu" aria-label="Treatments">
            <div class="nav__dropdown-list" id="nav-treatments-list"></div>
          </div>
        </div>
        <a href="${L('#reviews')}" class="nav__link" data-i18n="nav.reviews"></a>
        <a href="${L('#faq')}" class="nav__link" data-i18n="nav.faq"></a>
        <a href="${R}contact.html" class="nav__link${page === 'contact' ? ' is-active' : ''}" data-i18n="nav.contact"></a>
      </nav>
      <div class="hdr__actions">
        ${langToggle}
        <a href="tel:+917091238383" class="hdr__phone-ref" aria-label="Call +91 70912 38383">
          <svg class="hdr__phone-ref-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span class="hdr__phone-ref-num">+91 70912 38383</span>
        </a>
        <button class="burger" id="menu-toggle" aria-expanded="false" aria-controls="mobile-nav" data-i18n-aria="nav.menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="mnav" id="mobile-nav" aria-hidden="true">
    <div class="mnav__panel">
      <div class="mnav__top">
        <a href="${L('#top')}" class="mnav__brand" aria-label="Dental Care - Dr. Manish Kumar">
          <img src="${R}assets/images/logo/dental-logo.png" alt="Dental Care - Dr. Manish Kumar" class="mnav__logo" width="165" height="44">
        </a>
        <button class="mnav__close" id="mobile-nav-close" aria-label="Close menu" data-i18n-aria="nav.close">${icon('close')}</button>
      </div>
      <nav class="mnav__links" aria-label="Mobile Navigation">
        <a href="${L('#top')}" class="mnav__link${isHome ? ' is-active' : ''}"><span data-i18n="nav.home"></span><span class="mnav__chev">${icon('chevron')}</span></a>
        <a href="${R}doctor.html" class="mnav__link${page === 'doctor' ? ' is-active' : ''}"><span data-i18n="nav.about"></span><span class="mnav__chev">${icon('chevron')}</span></a>
        <div class="mnav__item mnav__item--dropdown${(page === 'services' || page === 'treatment-detail') ? ' is-active' : ''}">
          <div class="mnav__link-row">
            <a href="${R}services.html" class="mnav__link${(page === 'services' || page === 'treatment-detail') ? ' is-active' : ''}"><span data-i18n="nav.services"></span></a>
            <button type="button" class="mnav__sub-toggle" id="mnav-treatments-toggle" aria-expanded="false" aria-label="Toggle treatments list">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="mnav__submenu" id="mnav-treatments-list"></div>
        </div>
        <a href="${L('#reviews')}" class="mnav__link"><span data-i18n="nav.reviews"></span><span class="mnav__chev">${icon('chevron')}</span></a>
        <a href="${L('#faq')}" class="mnav__link"><span data-i18n="nav.faq"></span><span class="mnav__chev">${icon('chevron')}</span></a>
        <a href="${R}contact.html" class="mnav__link${page === 'contact' ? ' is-active' : ''}"><span data-i18n="nav.contact"></span><span class="mnav__chev">${icon('chevron')}</span></a>
      </nav>
      <div class="mnav__lang-wrap">
        ${langToggle}
      </div>
      <div class="mnav__spacer"></div>
      <div class="mnav__bottom">
        <div class="mnav__cta">
          <button type="button" class="btn btn--cta btn--pill btn--block mnav__btn-book" data-book>
            <span data-i18n="cta.book">Book Appointment</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <a href="${wa()}" target="_blank" rel="noopener noreferrer" class="btn btn--wa btn--pill btn--block js-wa mnav__btn-wa">
            ${WA}<span data-i18n="cta.chatWa">Chat on WhatsApp</span>
          </a>
        </div>
        <div class="mnav__contact">
          <div class="mnav__contact-item">
            ${icon('phone', 'mnav__contact-icon')}
            <div class="mnav__contact-text">
              <span class="mnav__contact-label js-clinic-lbl">${LANG.tr({ en: 'Clinic:', hi: 'क्लिनिक:' })}</span>
              <a href="tel:${C.contact.altPhoneTel}" class="mnav__contact-link">${C.contact.altPhoneDisplay}</a>
            </div>
          </div>
          <div class="mnav__contact-item">
            ${icon('phone', 'mnav__contact-icon')}
            <div class="mnav__contact-text">
              <span class="mnav__contact-label js-appts-lbl">${LANG.tr({ en: 'Appointments:', hi: 'अपॉइंटमेंट:' })}</span>
              <a href="tel:${C.contact.phoneTel}" class="mnav__contact-link">${C.contact.phoneDisplay}</a>
            </div>
          </div>
          <div class="mnav__contact-item">
            ${icon('clock', 'mnav__contact-icon')}
            <div class="mnav__contact-text mnav__contact-hours">
              <span data-i18n="hours.summary"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  const footer = `
  <footer class="ft" role="contentinfo" aria-label="Site footer">
    <div class="container">
      <div class="ft__grid">
        <div class="ft__brand">
          <a href="${L('#top')}" class="brand brand--light" aria-label="Dental Care – Dr. Manish Kumar, Khagaria">
            <img class="brand__logo" src="${R}assets/images/logo/dental-logo.png" alt="Dental Care - Dr. Manish Kumar" width="160" height="40">
          </a>
          <p class="ft__desc" data-i18n="ft.about"></p>
          <p class="ft__creds">${C.doctor.degrees} · Reg. No. ${C.doctor.registrationNo}</p>
        </div>
        <nav aria-label="Footer quick links">
          <h4 data-i18n="ft.links">Quick Links</h4>
          <ul class="ft__list">
            ${[['nav.home', L('#top')], ['nav.about', R + 'doctor.html'], ['nav.services', R + 'services.html'], ['nav.reviews', L('#reviews')], ['nav.faq', L('#faq')], ['nav.contact', R + 'contact.html']]
      .map(([k, h]) => `<li><a href="${h}" data-i18n="${k}"></a></li>`).join('')}
          </ul>
        </nav>
        <nav aria-label="Footer treatments">
          <h4 data-i18n="ft.treat">Treatments</h4>
          <ul class="ft__list" id="ft-treatments">
            ${C.services.filter(s => s.featured).map(s => `<li><a href="${R}${s.page || ('services.html#' + s.id)}">${LANG.tr(s.title)}</a></li>`).join('')}
            <li><a href="${R}services.html">${LANG.t('ft.allTreatments')}</a></li>
          </ul>
        </nav>
        <div>
          <h4 data-i18n="ft.contact">Contact</h4>
          <address class="ft__contact-address">
            <ul class="ft__contact">
              <li>${icon('pin')}<a href="${C.contact.mapsPlaceUrl}" target="_blank" rel="noopener noreferrer" class="js-maps js-address" aria-label="Open Dental Care clinic location on Google Maps">${LANG.tr(C.contact.address)}</a></li>
              <li>${icon('phone')}<a href="tel:+917091238383" aria-label="Call clinic at +91 70912 38383">${LANG.tr({ en: 'Clinic:', hi: 'क्लिनिक:' })} +91 70912 38383</a></li>
              <li>${icon('phone')}<a href="tel:${C.contact.phoneTel}" aria-label="Call for appointments at 99050 57644">${LANG.tr({ en: 'Appointments:', hi: 'अपॉइंटमेंट:' })} ${C.contact.phoneDisplay}</a></li>
              <li>${icon('clock')}<span data-i18n="hours.summary"></span></li>
            </ul>
          </address>
        </div>
      </div>
      <div class="ft__bottom">
        <p>&copy; <span class="js-year">2026</span> <span data-i18n="brand.name">Dental Care</span>, Khagaria. <span data-i18n="ft.rights"></span> <em data-i18n="ft.wish"></em></p>
        <nav class="ft__legal" aria-label="Legal links"><a href="${R}privacy-policy.html" data-i18n="ft.privacy"></a><span class="ft__sep" aria-hidden="true">|</span><a href="${R}terms.html" data-i18n="ft.terms"></a></nav>
      </div>
      <p class="ft__disclaimer" data-i18n="ft.disclaimer"></p>
      <p class="ft__credit">Designed &amp; Developed by <a href="https://vizoqa.com" target="_blank" rel="noopener noreferrer">Vizoqa</a></p>
    </div>
  </footer>

  <!-- Floating buttons: call, WhatsApp -->
  <div class="fabs" id="fabs">
    <a class="fab fab--call" href="tel:${C.contact.phoneTel}" data-i18n-aria="fab.call">${icon('phone')}<span class="fab__tip" data-i18n="fab.call">Call the clinic</span></a>
    <a class="fab fab--wa js-wa" href="${wa()}" target="_blank" rel="noopener noreferrer" data-i18n-aria="fab.wa">${WA}<span class="fab__tip" data-i18n="fab.wa">Chat on WhatsApp</span></a>
  </div>

  <!-- Booking pop-up -->
  <div class="modal" id="book-modal" aria-hidden="true">
    <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="book-title">
      <header class="modal__head">
        <div>
          <h2 id="book-title" data-i18n="m.title">Quick Appointment Booking</h2>
          <p data-i18n="m.sub">Fill 4 details — the clinic will confirm your slot on WhatsApp.</p>
        </div>
        <button type="button" class="modal__x" data-close data-i18n-aria="m.close">${icon('close')}</button>
      </header>
      <form class="modal__body" id="book-form" novalidate>
        <div class="field">
          <label for="bk-name"><span data-i18n="f.name2">Patient Name</span> <i>*</i></label>
          <input id="bk-name" type="text" autocomplete="name" data-i18n-ph="f.namePh" placeholder="e.g. Rahul Kumar" required>
        </div>
        <div class="field">
          <label for="bk-phone"><span data-i18n="f.phone">Mobile Number</span> <i>*</i></label>
          <div class="field__phone"><span>+91</span><input id="bk-phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="14" data-i18n-ph="f.phonePh" placeholder="10-digit mobile number" required></div>
        </div>
        <div class="field">
          <label for="bk-service" data-i18n="f.service">Treatment Needed</label>
          <select id="bk-service"></select>
        </div>
        <!-- Custom Preferred Date & Time Picker -->
        <div class="field bk-dt-field">
          <label data-i18n="f.dateTime">Preferred Date &amp; Time</label>
          <button type="button" class="bk-dt-trigger" id="bk-dt-trigger" aria-haspopup="dialog" aria-expanded="false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <div class="bk-dt-preview">
              <span class="bk-dt-preview-date" id="bk-dt-disp-date">Today</span>
              <span class="bk-dt-preview-time" id="bk-dt-disp-time">Morning · 10:00 AM</span>
            </div>
            <svg class="bk-dt-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <!-- Floating Date/Time Popover (Opens Upward) -->
          <div class="bk-dt-panel" id="bk-dt-panel" hidden role="dialog" aria-modal="false" aria-label="Select appointment date and time">

            <!-- STEP 1: Select Date -->
            <div class="bk-dt-step" id="bk-dt-step-1">
              <div class="bk-dt-cal-head">
                <button type="button" class="bk-dt-arrow" id="bk-dt-cal-prev" aria-label="Previous month">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span class="bk-dt-month-label" id="bk-dt-cal-month-label">October 2026</span>
                <button type="button" class="bk-dt-arrow" id="bk-dt-cal-next" aria-label="Next month">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>

              <div class="bk-dt-cal-weekdays" id="bk-dt-cal-weekdays">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>

              <div class="bk-dt-cal-grid" id="bk-dt-cal-grid" role="grid" aria-label="Calendar days"></div>

              <div class="bk-dt-cal-note">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                <span data-i18n="f.sunHoursBadge">Sundays Open · 10:00 AM – 4:00 PM</span>
              </div>
            </div>

            <!-- STEP 2: Select Time -->
            <div class="bk-dt-step" id="bk-dt-step-2" hidden>
              <div class="bk-dt-step2-head">
                <button type="button" class="bk-dt-arrow" id="bk-dt-back" aria-label="Back to date selection">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span class="bk-dt-step2-title" id="bk-dt-step2-date">Mon, 5 Oct</span>
                <button type="button" class="bk-dt-step2-close" id="bk-dt-close-2" aria-label="Close selector">✕</button>
              </div>
              <div class="bk-dt-slots-box" id="bk-dt-slots-box"></div>
            </div>
          </div>

          <!-- Hidden inputs for form submission -->
          <input type="hidden" id="bk-day" name="bk-day" value="">
          <input type="hidden" id="bk-time" name="bk-time" value="">
        </div>
        <p class="form-error" id="bk-error" role="alert" hidden></p>
        <button type="submit" class="btn btn--wa btn--block btn--lg">${WA}<span data-i18n="f.sendWa">Send to WhatsApp</span></button>
        <p class="modal__note" data-i18n="m.note">This opens WhatsApp with your details filled in — just press send.</p>
      </form>
      <div class="modal__done" id="book-done" hidden>
        <div class="modal__done-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h3 id="done-title" data-i18n="done.title">Appointment Request Received</h3>
        <p id="done-sub" data-i18n="done.sub">Thank you for contacting Dental Care. Your appointment request has been sent successfully.</p>
        <div class="modal__done-slot" id="done-slot">
          <div class="modal__done-slot-row">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <span data-i18n="done.slotDate">Preferred Date:</span>
            <strong id="done-date">—</strong>
          </div>
          <div class="modal__done-slot-row">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span data-i18n="done.slotTime">Preferred Time:</span>
            <strong id="done-time">—</strong>
          </div>
        </div>
        <p class="modal__done-msg" id="done-msg"></p>
        <div class="modal__done-hours" id="done-hours" hidden>
          <p class="modal__done-hours-label" data-i18n="done.clinicHours">Clinic Hours:</p>
          <p class="modal__done-hours-val" data-i18n="hours.summary"></p>
        </div>
        <p class="modal__done-note" data-i18n="done.note">Your appointment is confirmed only after receiving confirmation from our clinic team.</p>
        <div class="modal__done-actions">
          <button type="button" class="btn btn--cta btn--block" id="book-done-close" data-close data-i18n="done.btnDone">Done</button>
          <a href="#" target="_blank" rel="noopener noreferrer" class="modal__done-wa-link js-wa" id="book-done-link" data-i18n="done.btnWa">View WhatsApp</a>
        </div>
        <button type="button" class="link-btn modal__done-again" id="book-again" data-i18n="f.again">Send another request</button>
      </div>
    </div>
  </div>`;

  document.getElementById('site-header').outerHTML = header;
  document.getElementById('site-footer').outerHTML = footer;

  // Dropdown toggle and click outside handling
  const treatItem = document.getElementById('nav-treatments-item');
  const treatToggle = document.getElementById('nav-treatments-link');
  const mnavToggle = document.getElementById('mnav-treatments-toggle');
  const mnavSubmenu = document.getElementById('mnav-treatments-list');

  if (treatToggle && treatItem) {
    treatToggle.addEventListener('click', (e) => {
      // If clicking the chevron or on touch screen, toggle dropdown instead of navigating
      if (e.target.closest('.nav__chevron') || window.matchMedia('(hover: none)').matches) {
        e.preventDefault();
        const isOpen = treatItem.classList.toggle('is-open');
        treatToggle.setAttribute('aria-expanded', String(isOpen));
      }
    });
  }

  if (mnavToggle && mnavSubmenu) {
    mnavToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const open = mnavSubmenu.classList.toggle('is-open');
      mnavToggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (b) LANG.set(b.dataset.lang);

    // Close desktop dropdown on outside click
    if (treatItem && !treatItem.contains(e.target)) {
      treatItem.classList.remove('is-open');
      if (treatToggle) treatToggle.setAttribute('aria-expanded', 'false');
    }
    // Close dropdown on selecting a treatment item
    if (e.target.closest('.nav__dropdown-item')) {
      if (treatItem) treatItem.classList.remove('is-open');
      if (treatToggle) treatToggle.setAttribute('aria-expanded', 'false');
    }
    // Close mobile nav drawer when clicking a mobile treatment submenu item
    if (e.target.closest('.mnav__sub-item')) {
      const mnav = document.getElementById('mobile-nav');
      if (mnav) mnav.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }
  });

  function refreshLayout() {
    document.querySelectorAll('.js-address').forEach(el => el.textContent = LANG.tr(C.contact.address));
    document.querySelectorAll('.js-wa').forEach(a => a.href = wa());
    document.querySelectorAll('.js-clinic-lbl').forEach(el => el.textContent = LANG.tr({ en: 'Clinic:', hi: 'क्लिनिक:' }));
    document.querySelectorAll('.js-appts-lbl').forEach(el => el.textContent = LANG.tr({ en: 'Appointments:', hi: 'अपॉइंटमेंट:' }));
    const ftList = document.getElementById('ft-treatments');
    if (ftList) {
      const items = C.services.filter(s => s.featured).map(s => `<li><a href="${R}${s.page || ('services.html#' + s.id)}">${LANG.tr(s.title)}</a></li>`);
      items.push(`<li><a href="${R}services.html">${LANG.t('ft.allTreatments')}</a></li>`);
      ftList.innerHTML = items.join('');
    }

    // Determine current page/slug for dynamic active treatment highlighting
    const currentPath = (window.location.pathname || '').replace(/\/$/, '');
    const currentFile = currentPath.split('/').pop().toLowerCase();
    const currentSlug = currentFile.replace(/\.html$/i, '');

    function isTreatmentActive(s) {
      if (!s || !s.page) return false;
      const targetFile = s.page.split('/').pop().toLowerCase();
      const targetSlug = targetFile.replace(/\.html$/i, '');
      return Boolean(targetSlug && (currentSlug === targetSlug || currentFile === targetFile));
    }

    // Desktop Treatments Dropdown (Clean vertical list matching reference)
    const navTreatList = document.getElementById('nav-treatments-list');
    if (navTreatList) {
      navTreatList.innerHTML = C.services.map(s => {
        const isActive = isTreatmentActive(s);
        return `
        <a href="${R}${s.page || ('services.html#' + s.id)}" class="nav__dropdown-item${isActive ? ' is-active' : ''}" role="menuitem"${isActive ? ' aria-current="page"' : ''}>
          ${LANG.tr(s.title)}
        </a>`;
      }).join('');
    }

    // Mobile Treatments Submenu
    const mnavTreatList = document.getElementById('mnav-treatments-list');
    if (mnavTreatList) {
      mnavTreatList.innerHTML = C.services.map(s => {
        const isActive = isTreatmentActive(s);
        return `
        <a href="${R}${s.page || ('services.html#' + s.id)}" class="mnav__sub-item${isActive ? ' is-active' : ''}"${isActive ? ' aria-current="page"' : ''}>
          ${LANG.tr(s.title)}
        </a>`;
      }).join('');
    }
  }
  refreshLayout();
  document.addEventListener('langchange', refreshLayout);
  LANG.apply();
})();
