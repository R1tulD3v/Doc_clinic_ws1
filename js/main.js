/* ============================================
   MAIN.JS — Dental Care
   Renders data-driven sections from CLINIC_CONFIG in the current language
   and re-renders them when the EN / हिंदी switch is used.
   ============================================ */

const CFG = window.CLINIC_CONFIG;
const { t, tr } = window.LANG;
const lang = () => window.LANG.get();
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const STARS = (n = 5) => `<div class="stars" aria-label="${n} / 5">${'<i></i>'.repeat(n)}</div>`;

document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  initReveal();
  initHeader();
  initMobileNav();
  initHeroSlides();
  initAboutSlides();
  initStatsCounter();
  initFaq();
  initServicesCarousel();
  initGallery();
  initAwardsGallery();
  initLightbox();
  initScrollSpy();
  initBooking();
  initHeroBooking();
  initStaticLinks();
  initOpeningStatus();
  document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

  document.addEventListener('langchange', () => {
    renderAll();
    revealNow();
    initServicesCarousel();
    initGallery();
    initAwardsGallery();
    updateOpeningStatus();
  });
});

function renderAll() {
  renderStats();
  renderServices();
  renderAllServices();
  renderAwards();
  renderAwardsGallery();
  renderGallery();
  renderHours();
  renderFaqs();
  renderReviews();
  renderWhy();
  renderAftercare();
  const based = document.getElementById('rv-based');
  if (based) based.textContent = t('rv.based', { n: CFG.googleBusiness.reviewCount });
}


/* ---------- Time (always India time) ---------- */
function indiaNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const get = (k) => parts.find(p => p.type === k).value;
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), minutes: (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10) };
}
function fmtTime(h, m) {
  const hh = ((h + 11) % 12) + 1, mm = String(m).padStart(2, '0');
  if (lang() === 'hi') {
    const part = h < 12 ? 'सुबह' : h < 16 ? 'दोपहर' : h < 20 ? 'शाम' : 'रात';
    return `${part} ${hh}:${mm}`;
  }
  return `${hh}:${mm} ${h >= 12 ? 'PM' : 'AM'}`;
}
const DAY_NAMES = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार']
};


/* ---------- Open / closed pill ---------- */
function updateOpeningStatus() {
  const pill = document.getElementById('open-status');
  if (!pill) return;
  const sched = CFG.hours.schedule;
  const { day, minutes } = indiaNow();
  const hi = lang() === 'hi';
  const current = (sched[day] || []).find(([oh, om, ch, cm]) => minutes >= oh * 60 + om && minutes < ch * 60 + cm);
  let text = t('hero.status');
  if (current) {
    text = hi ? `अभी खुला है · ${fmtTime(current[2], current[3])} तक` : `Open now · until ${fmtTime(current[2], current[3])}`;
  } else {
    let next = null;
    for (let off = 0; off < 8 && !next; off++) {
      const d = (day + off) % 7;
      for (const [oh, om] of (sched[d] || [])) if (off > 0 || oh * 60 + om > minutes) { next = { off, d, oh, om }; break; }
    }
    if (next) {
      const when = fmtTime(next.oh, next.om);
      if (next.off === 0) {
        const onBreak = (sched[day] || []).some(([oh, om]) => oh * 60 + om < minutes);
        text = hi ? (onBreak ? `ब्रेक · ${when} बजे फिर खुलेगा` : `आज ${when} बजे खुलेगा`) : (onBreak ? `On break · reopens ${when}` : `Opens today at ${when}`);
      } else {
        const dayName = next.off === 1 ? (hi ? 'कल' : 'tomorrow') : DAY_NAMES[lang()][next.d];
        text = hi ? `अभी बंद · ${dayName} ${when} बजे खुलेगा` : `Closed now · opens ${dayName} ${when}`;
      }
    }
  }
  const span = pill.querySelector('span');
  span.removeAttribute('data-i18n');
  span.textContent = text;
  pill.classList.toggle('is-open', !!current);
}
function initOpeningStatus() { updateOpeningStatus(); setInterval(updateOpeningStatus, 60000); }

/** Returns true if the clinic is currently open (uses India time + CFG.hours.schedule) */
function isClinicCurrentlyOpen() {
  const sched = CFG.hours.schedule;
  const { day, minutes } = indiaNow();
  return !!(sched[day] || []).find(([oh, om, ch, cm]) => minutes >= oh * 60 + om && minutes < ch * 60 + cm);
}
window.isClinicCurrentlyOpen = isClinicCurrentlyOpen;


/* ---------- Renderers ---------- */
function renderStats() {
  const el = document.getElementById('stats-container');
  if (!el) return;
  const { icon } = window.SITE;
  el.innerHTML = CFG.stats.map(s => {
    const suffixHtml = s.suffix === '★'
      ? '<span class="stat__star">★</span>'
      : esc(s.suffix);
    return `
    <div class="stat">
      <span class="stat__icon">${icon(s.icon)}</span>
      <div><b><span class="js-count" data-target="${s.value}" data-decimals="${s.decimals || 0}">${s.value}</span>${suffixHtml}</b><small>${esc(tr(s.label))}</small></div>
    </div>`;
  }).join('');
}

function initStatsCounter() {
  const nums = document.querySelectorAll('.js-count');
  if (!nums.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const run = (el) => {
    const target = parseFloat(el.dataset.target), dec = parseInt(el.dataset.decimals, 10) || 0, isComma = el.dataset.comma === 'true' || target >= 1000, start = performance.now();
    const fmt = (val) => {
      const fixed = val.toFixed(dec);
      if (isComma) {
        const parts = fixed.split('.');
        parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
        return parts.join('.');
      }
      return fixed;
    };
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1400);
      const cur = target * (1 - Math.pow(1 - p, 3));
      el.textContent = fmt(cur);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // Background tabs throttle rAF — make sure the final number always lands
    setTimeout(() => { el.textContent = fmt(target); }, 1600);
  };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: .3 });
  nums.forEach(n => io.observe(n));
}

// Home: the 5 featured treatments (links to dedicated treatment pages)
function renderServices() {
  const el = document.getElementById('services-container');
  if (!el) return;
  el.innerHTML = CFG.services.filter(s => s.featured).map((s, i) => `
    <a class="svc-card" href="${s.page || ('services.html#' + s.id)}" data-reveal data-d${i + 1}>
      <img class="svc-card__img" src="${s.image}" alt="${esc(tr(s.title))}" width="92" height="92" loading="lazy">
      <h3>${esc(tr(s.title))}</h3>
      <p>${esc(tr(s.description))}</p>
    </a>`).join('');
  initServicesCarousel();
}

// Mobile: pair-based 2-card treatment carousel with dot indicators & auto-slide
function initServicesCarousel() {
  const cardsEl = document.getElementById('services-container');
  const dotsContainer = document.getElementById('services-dots');
  if (!cardsEl || !dotsContainer) return;
  const dots = dotsContainer.querySelectorAll('.svc-dot');
  if (!dots.length) return;

  const isMobile = () => window.innerWidth <= 760;
  const AUTO_DELAY = 4000;

  // Clear any existing timer from previous runs (e.g. langchange)
  if (cardsEl._autoSlideTimer) {
    clearInterval(cardsEl._autoSlideTimer);
    cardsEl._autoSlideTimer = null;
  }
  if (cardsEl._scrollResumeTimeout) {
    clearTimeout(cardsEl._scrollResumeTimeout);
    cardsEl._scrollResumeTimeout = null;
  }

  const getClosestSlide = () => {
    const cards = cardsEl.querySelectorAll('.svc-card');
    if (!cards.length) return 0;
    const scrollPos = cardsEl.scrollLeft;
    let closest = 0;
    let minDiff = Infinity;
    for (let i = 0; i < 3; i++) {
      const card = cards[i * 2];
      if (card) {
        const diff = Math.abs(card.offsetLeft - scrollPos);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      }
    }
    return closest;
  };

  const updateDots = (slideIndex) => {
    dots.forEach((d, idx) => {
      const isActive = idx === slideIndex;
      d.classList.toggle('is-active', isActive);
      d.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  const goToSlide = (slideIndex) => {
    const cards = cardsEl.querySelectorAll('.svc-card');
    const targetCard = cards[slideIndex * 2];
    if (targetCard) {
      cardsEl.scrollTo({
        left: targetCard.offsetLeft,
        behavior: 'smooth'
      });
      updateDots(slideIndex);
    }
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    if (!isMobile()) return;
    cardsEl._autoSlideTimer = setInterval(() => {
      if (cardsEl._isInteracting || !isMobile() || document.hidden) return;
      const current = getClosestSlide();
      const next = (current + 1) % 3;
      goToSlide(next);
    }, AUTO_DELAY);
  };

  const stopAutoSlide = () => {
    if (cardsEl._autoSlideTimer) {
      clearInterval(cardsEl._autoSlideTimer);
      cardsEl._autoSlideTimer = null;
    }
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  // Dot click navigation
  dots.forEach(dot => {
    if (dot._hasCarouselListener) return;
    dot._hasCarouselListener = true;
    dot.addEventListener('click', () => {
      const slide = parseInt(dot.dataset.slide, 10);
      goToSlide(slide);
      resetAutoSlide();
    });
  });

  // Touch and interaction listeners to pause & reset auto-sliding
  if (!cardsEl._hasCarouselTouchListeners) {
    cardsEl._hasCarouselTouchListeners = true;

    // When touching/dragging, immediately pause auto-slide
    cardsEl.addEventListener('touchstart', () => {
      cardsEl._isInteracting = true;
      stopAutoSlide();
    }, { passive: true });

    // When touch is released, resume after 4s idle
    const handleTouchEnd = () => {
      cardsEl._isInteracting = false;
      resetAutoSlide();
    };
    cardsEl.addEventListener('touchend', handleTouchEnd, { passive: true });
    cardsEl.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Scroll listener for manual swipe & updating dots
    cardsEl.addEventListener('scroll', () => {
      const closest = getClosestSlide();
      updateDots(closest);

      // If user is manually scrolling/swiping, reset the 4-second timer
      if (!cardsEl._isInteracting) {
        stopAutoSlide();
        clearTimeout(cardsEl._scrollResumeTimeout);
        cardsEl._scrollResumeTimeout = setTimeout(() => {
          resetAutoSlide();
        }, 200);
      }
    }, { passive: true });

    // Page visibility support (pause when backgrounded, resume when active)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoSlide();
      } else {
        resetAutoSlide();
      }
    });

    // Resize listener (activate on mobile, deactivate on desktop)
    window.addEventListener('resize', () => {
      if (isMobile()) {
        if (!cardsEl._autoSlideTimer) startAutoSlide();
      } else {
        stopAutoSlide();
      }
    });
  }

  // Start auto-slide if on mobile
  startAutoSlide();
}

// Treatments page: all 13 as photo cards linking to dedicated treatment pages
function renderAllServices() {
  const el = document.getElementById('all-services-grid');
  if (!el) return;
  const { icon } = window.SITE;
  el.innerHTML = CFG.services.map((s, i) => `
    <a class="pcard" id="${s.id}" href="${s.page || ('services.html#' + s.id)}" data-reveal data-d${(i % 3) + 1}>
      <div class="pcard__bg">
        <img class="pcard__photo" src="${s.image}" alt="${esc(tr(s.title))}" loading="lazy">
      </div>
      <span class="pcard__chip">${icon(s.icon)}</span>
      <div class="pcard__body">
        <h3>${esc(tr(s.title))}</h3>
        <p>${esc(tr(s.detail))}</p>
        <span class="pcard__go">${esc(t('svc.learnMore'))} ${icon('arrow')}</span>
      </div>
    </a>`).join('');
}

function renderAwards() {
  const el = document.getElementById('awards-container');
  if (!el) return;
  const { icon } = window.SITE;
  el.innerHTML = CFG.credentials.map((c, i) => `
    <div class="award" data-reveal data-d${(i % 3) + 1}>
      ${c.photo ? `<div class="award__photo"><img src="${esc(c.photo)}" alt="" loading="lazy"></div>` : `<span class="award__icon">${icon(c.icon)}</span>`}
      <div><h3>${esc(tr(c.title))}</h3><p>${esc(tr(c.subtitle))}</p></div>
    </div>`).join('');
}

function renderHours() {
  const el = document.getElementById('hours-table');
  if (!el) return;
  const today = indiaNow().day;
  const sched = CFG.hours.schedule;
  // Group consecutive days that share the same timings (e.g. Monday – Saturday)
  const groups = [];
  [1, 2, 3, 4, 5, 6, 0].forEach(d => {
    const key = JSON.stringify(sched[d] || []);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.days.push(d); else groups.push({ key, days: [d] });
  });
  const names = DAY_NAMES[lang()];
  el.innerHTML = groups.map(g => {
    const shifts = sched[g.days[0]] || [];
    const label = g.days.length > 1 ? `${names[g.days[0]]} – ${names[g.days[g.days.length - 1]]}` : names[g.days[0]];
    const time = shifts.length ? shifts.map(([a, b, c, e]) => `${fmtTime(a, b)} – ${fmtTime(c, e)}`).join('<br>') : t('info.closed');
    const isToday = g.days.includes(today);
    return `<div class="hours__row${isToday ? ' is-today' : ''}">
      <span class="hours__day">${label}${isToday ? `<span class="hours__badge">${t('info.today')}</span>` : ''}</span>
      <span class="hours__time">${time}</span></div>`;
  }).join('');
}

// Two-column FAQ, reference style
function renderFaqs() {
  const { icon } = window.SITE;
  document.querySelectorAll('.acc').forEach((el, n) => {
    const limit = parseInt(el.dataset.faqLimit, 10) || CFG.faqs.length;
    const items = CFG.faqs.slice(0, limit).map((f, i) => `
      <div class="acc__item">
        <button class="acc__q" aria-expanded="false" aria-controls="faq-${n}-${i}" id="faq-q-${n}-${i}">
          <span>${esc(tr(f.q))}</span><span class="acc__icon">${icon('plus')}</span>
        </button>
        <div class="acc__a" id="faq-${n}-${i}" role="region" aria-labelledby="faq-q-${n}-${i}"><div><p>${esc(tr(f.a))}</p></div></div>
      </div>`);
    if (el.classList.contains('acc--2col')) {
      const half = Math.ceil(items.length / 2);
      el.innerHTML = `<div class="acc__col">${items.slice(0, half).join('')}</div><div class="acc__col">${items.slice(half).join('')}</div>`;
    } else {
      el.innerHTML = items.join('');
    }
  });
}
function initFaq() {
  // Clear any legacy hidden attributes so CSS grid accordion controls visibility smoothly
  document.querySelectorAll('.tp-faq__a[hidden], .faq__a[hidden], .faq-a[hidden], .acc__a[hidden]').forEach(el => el.removeAttribute('hidden'));

  document.addEventListener('click', (e) => {
    const q = e.target.closest('.acc__q, .tp-faq__q, .faq__q, .faq-q, .faq-question');
    if (!q) return;
    const item = q.closest('.acc__item, .tp-faq-item, .faq__item, .faq-item');
    if (!item) return;
    const container = item.closest('.acc, .tp-faq-wrap, .faq__list, .faq-list') || item.parentElement;
    const open = !item.classList.contains('is-open');
    if (container) {
      container.querySelectorAll('.acc__item.is-open, .tp-faq-item.is-open, .faq__item.is-open, .faq-item.is-open').forEach(o => {
        if (o !== item) {
          o.classList.remove('is-open');
          const prevQ = o.querySelector('.acc__q, .tp-faq__q, .faq__q, .faq-q, .faq-question');
          if (prevQ) prevQ.setAttribute('aria-expanded', 'false');
        }
      });
    }
    item.classList.toggle('is-open', open);
    q.setAttribute('aria-expanded', String(open));
  });
}

function renderReviews() {
  const wrap = document.getElementById('reviews-marquee');
  if (!wrap) return;
  const track = wrap.querySelector('.marquee__track');
  const reviews = (CFG.googleBusiness.reviews || []).filter(r => r.author && r.rating >= 4);
  const avatarColors = ['#e11d48', '#475569', '#15803d', '#2563eb', '#0891b2', '#d97706', '#7c3aed'];
  const googleGIcon = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`;

  const card = (r, idx, hidden) => {
    const initials = r.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const bg = avatarColors[idx % avatarColors.length];
    return `<figure class="rcard"${hidden ? ' aria-hidden="true"' : ''}>
      <div class="rcard__head">
        <span class="rcard__avatar" style="background:${bg}" aria-hidden="true">${initials}</span>
        <div class="rcard__meta">
          <span class="rcard__name">${esc(r.author)}</span>
          <span class="rcard__src">${esc(t('rv.google'))}</span>
        </div>
        <span class="rcard__g-icon">${googleGIcon}</span>
      </div>
      <div class="rcard__rating">
        ${STARS(r.rating)}
      </div>
      <blockquote class="rcard__text${r.text ? '' : ' rcard__text--muted'}">${r.text ? esc(r.text) : esc(t('rv.rated'))}</blockquote>
    </figure>`;
  };
  // Doubled list so the -50% translate loops seamlessly
  track.innerHTML = reviews.map((r, i) => card(r, i)).join('') + reviews.map((r, i) => card(r, i, true)).join('');
  requestAnimationFrame(() => { track.style.animationDuration = `${Math.max(24, track.scrollWidth / 2 / 40)}s`; });
  if (!wrap.dataset.bound) {
    wrap.dataset.bound = '1';
    wrap.addEventListener('touchstart', () => wrap.classList.add('is-paused'), { passive: true });
    wrap.addEventListener('touchend', () => setTimeout(() => wrap.classList.remove('is-paused'), 1500), { passive: true });
  }
}

function renderWhy() {
  const el = document.getElementById('why-container');
  if (!el) return;
  el.innerHTML = CFG.whyChooseUs.map((w, i) => `
    <div class="why__card" data-reveal data-d${(i % 3) + 1}>
      <span class="why__num">${String(i + 1).padStart(2, '0')}</span>
      <h3>${esc(tr(w.title))}</h3><p>${esc(tr(w.text))}</p>
    </div>`).join('');
}
function renderAftercare() {
  const el = document.getElementById('aftercare-list');
  if (el) el.innerHTML = CFG.aftercare.map(a => `<li>${esc(tr(a))}</li>`).join('');
}

function initStaticLinks() {
  const c = CFG.contact;
  document.querySelectorAll('.js-maps').forEach(a => a.href = c.mapsPlaceUrl);
  document.querySelectorAll('.js-review').forEach(a => a.href = c.mapsWriteReviewUrl);
  document.querySelectorAll('.js-directions').forEach(a => a.href = c.mapsDirectionsUrl);
  const map = document.querySelector('iframe[data-src="map"]');
  if (map) {
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { map.src = c.mapsEmbedUrl; io.disconnect(); } }, { rootMargin: '400px' });
    io.observe(map);
  }
}


/* ---------- Gallery: 3-card carousel ---------- */
function renderGallery() {
  const track = document.getElementById('gal-track');
  if (!track) return;
  const { icon } = window.SITE;
  track.innerHTML = CFG.gallery.map((g, i) => `
    <figure class="gitem" data-i="${i}" tabindex="0" role="button" aria-label="${esc(tr(g.caption))}">
      <img src="${esc(g.src)}" alt="${esc(tr(g.alt || g.caption))}" width="${g.w}" height="${g.h}" loading="lazy" draggable="false">
      <figcaption><span>${esc(tr(g.caption))}</span><span class="gitem__zoom">${icon('search')}</span></figcaption>
    </figure>`).join('');
}

function initGallery() {
  const track = document.getElementById('gal-track');
  const prevBtn = document.getElementById('gal-prev');
  const nextBtn = document.getElementById('gal-next');
  const carousel = document.getElementById('gallery-container');
  if (!track || !carousel) return;

  // Wire up card clicks → lightbox
  track.querySelectorAll('.gitem').forEach(it => {
    const open = () => window.openLightbox(parseInt(it.dataset.i, 10), CFG.gallery);
    it.addEventListener('click', open);
    it.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  // Carousel state
  let current = 0;
  const total = CFG.gallery ? CFG.gallery.length : track.children.length;

  const visibleCount = () => {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 980) return 2;
    return 3;
  };

  const maxIndex = () => Math.max(0, total - visibleCount());

  const slide = (dir) => {
    const max = maxIndex();
    if (max === 0) {
      current = 0;
    } else if (dir > 0) {
      current = current >= max ? 0 : current + 1;
    } else if (dir < 0) {
      current = current <= 0 ? max : current - 1;
    } else {
      current = Math.max(0, Math.min(current, max));
    }

    const firstCard = track.children[0];
    const cardWidth = firstCard ? firstCard.offsetWidth : 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;

    if (prevBtn) prevBtn.disabled = max === 0;
    if (nextBtn) nextBtn.disabled = max === 0;
  };

  // Auto-slide: advance every 4.5 seconds, loop continuously
  const AUTO_DELAY = 4500;
  let autoTimer = null;

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      slide(1);
    }, AUTO_DELAY);
  };

  const stopAuto = () => {
    clearInterval(autoTimer);
    autoTimer = null;
  };

  const resetAuto = () => {
    stopAuto();
    startAuto();
  };

  // Navigation button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      slide(-1);
      resetAuto();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slide(1);
      resetAuto();
    });
  }

  // Reset position on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      slide(0);
    }, 150);
  });

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) {
      slide(dx > 0 ? 1 : -1);
    }
    setTimeout(startAuto, 2500);
  }, { passive: true });

  // Hover & focus pauses auto-slide, mouseleave resumes
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);

  const navContainer = document.querySelector('.gal-header__nav');
  if (navContainer) {
    navContainer.addEventListener('mouseenter', stopAuto);
    navContainer.addEventListener('mouseleave', startAuto);
  }

  // Initial render position & kick off auto-slide
  slide(0);
  startAuto();
}


/* ---------- Awards Gallery (About Doctor page) ---------- */
function renderAwardsGallery() {
  const track = document.getElementById('awards-track');
  if (!track || !CFG.awards) return;
  const { icon } = window.SITE;
  track.innerHTML = CFG.awards.map((g, i) => `
    <figure class="gitem gitem--award" data-i="${i}" tabindex="0" role="button" aria-label="${esc(tr(g.caption))}">
      <img src="${esc(g.src)}" alt="${esc(tr(g.alt || g.caption))}" width="${g.w}" height="${g.h}" loading="lazy" draggable="false">
      <figcaption><span>${esc(tr(g.caption))}</span><span class="gitem__zoom">${icon('search')}</span></figcaption>
    </figure>`).join('');
}

function initAwardsGallery() {
  const track = document.getElementById('awards-track');
  const prevBtn = document.getElementById('aw-prev');
  const nextBtn = document.getElementById('aw-next');
  const carousel = document.getElementById('awards-gallery-container');
  if (!track || !carousel || !CFG.awards) return;

  track.querySelectorAll('.gitem').forEach(it => {
    const open = () => window.openLightbox(parseInt(it.dataset.i, 10), CFG.awards);
    it.addEventListener('click', open);
    it.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  let current = 0;
  const total = CFG.awards.length;

  const visibleCount = () => {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 980) return 2;
    return 3;
  };

  const maxIndex = () => Math.max(0, total - visibleCount());

  const slide = (dir) => {
    const max = maxIndex();
    if (max === 0) {
      current = 0;
    } else if (dir > 0) {
      current = current >= max ? 0 : current + 1;
    } else if (dir < 0) {
      current = current <= 0 ? max : current - 1;
    } else {
      current = Math.max(0, Math.min(current, max));
    }

    const firstCard = track.children[0];
    const cardWidth = firstCard ? firstCard.offsetWidth : 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 22;
    track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;

    if (prevBtn) prevBtn.disabled = max === 0;
    if (nextBtn) nextBtn.disabled = max === 0;
  };

  const AUTO_DELAY = 4500;
  let autoTimer = null;

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => slide(1), AUTO_DELAY);
  };

  const stopAuto = () => {
    clearInterval(autoTimer);
    autoTimer = null;
  };

  const resetAuto = () => {
    stopAuto();
    startAuto();
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      slide(-1);
      resetAuto();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slide(1);
      resetAuto();
    });
  }

  window.addEventListener('resize', () => { slide(0); });
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) slide(dx > 0 ? 1 : -1);
    setTimeout(startAuto, 2500);
  }, { passive: true });

  slide(0);
  startAuto();
}


/* ---------- Lightbox with zoom (wheel, double-tap, pinch, drag) ---------- */
function initLightbox() {
  if (!document.getElementById('gallery-container') && !document.getElementById('awards-gallery-container')) return;
  const { icon } = window.SITE;
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `
    <button class="lightbox__btn lightbox__close" aria-label="Close">${icon('close')}</button>
    <button class="lightbox__btn lightbox__prev" aria-label="Previous">${icon('chevronL')}</button>
    <button class="lightbox__btn lightbox__next" aria-label="Next">${icon('chevron')}</button>
    <div class="lightbox__stage"><img class="lightbox__img" alt="" draggable="false"></div>
    <div class="lightbox__bar">
      <div class="lightbox__cap"><span></span><small></small></div>
      <div class="lightbox__zoom">
        <button class="lightbox__btn" data-z="out" aria-label="Zoom out">${icon('minus')}</button>
        <button class="lightbox__btn" data-z="in" aria-label="Zoom in">${icon('plus')}</button>
      </div>
    </div>`;
  document.body.appendChild(lb);

  const stage = lb.querySelector('.lightbox__stage');
  const img = lb.querySelector('.lightbox__img');
  let idx = 0, scale = 1, tx = 0, ty = 0;
  let activeList = CFG.gallery || [];
  const MAX = 4;

  const clamp = () => {
    const mx = Math.max(0, (img.clientWidth * scale - stage.clientWidth) / 2);
    const my = Math.max(0, (img.clientHeight * scale - stage.clientHeight) / 2);
    tx = Math.max(-mx, Math.min(mx, tx));
    ty = Math.max(-my, Math.min(my, ty));
  };
  const apply = () => {
    clamp();
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    stage.classList.toggle('is-zoomed', scale > 1);
  };
  // Zoom keeping the point (px, py) — relative to the stage centre — fixed
  const zoomTo = (next, px = 0, py = 0) => {
    next = Math.max(1, Math.min(MAX, next));
    tx = px - (px - tx) * (next / scale);
    ty = py - (py - ty) * (next / scale);
    scale = next;
    if (scale === 1) { tx = 0; ty = 0; }
    apply();
  };
  const fromCenter = (x, y) => { const r = stage.getBoundingClientRect(); return [x - r.left - r.width / 2, y - r.top - r.height / 2]; };

  const show = (n) => {
    const g = (activeList && activeList.length) ? activeList : (CFG.gallery || []);
    if (!g.length) return;
    idx = (n + g.length) % g.length;
    scale = 1; tx = 0; ty = 0; apply();
    img.src = g[idx].src;
    img.alt = tr(g[idx].alt || g[idx].caption);
    lb.querySelector('.lightbox__cap span').textContent = tr(g[idx].caption);
    lb.querySelector('.lightbox__cap small').textContent = `${idx + 1} / ${g.length} · ${t('lb.hint')}`;
  };
  const close = () => { lb.classList.remove('is-open'); document.body.classList.remove('no-scroll'); };
  window.openLightbox = (n, items) => {
    activeList = (items && items.length) ? items : (CFG.gallery || []);
    show(n);
    lb.classList.add('is-open');
    document.body.classList.add('no-scroll');
    lb.querySelector('.lightbox__close').focus();
  };

  lb.querySelector('.lightbox__close').addEventListener('click', close);
  lb.querySelector('.lightbox__prev').addEventListener('click', () => show(idx - 1));
  lb.querySelector('.lightbox__next').addEventListener('click', () => show(idx + 1));
  lb.querySelector('[data-z="in"]').addEventListener('click', () => zoomTo(scale * 1.6));
  lb.querySelector('[data-z="out"]').addEventListener('click', () => zoomTo(scale / 1.6));
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === '+' || e.key === '=') zoomTo(scale * 1.4);
    if (e.key === '-') zoomTo(scale / 1.4);
  });
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const [px, py] = fromCenter(e.clientX, e.clientY);
    zoomTo(scale * (e.deltaY < 0 ? 1.18 : 1 / 1.18), px, py);
  }, { passive: false });
  stage.addEventListener('dblclick', (e) => {
    const [px, py] = fromCenter(e.clientX, e.clientY);
    zoomTo(scale > 1 ? 1 : 2.5, px, py);
  });
  stage.addEventListener('click', (e) => { if (e.target === stage && scale === 1) close(); });

  // Pointer handling: one finger = pan (or swipe when not zoomed), two = pinch
  const pts = new Map();
  let startX = 0, startY = 0, baseTx = 0, baseTy = 0, pinchDist = 0, pinchScale = 1, lastTap = 0;
  stage.addEventListener('pointerdown', (e) => {
    stage.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 1) {
      startX = e.clientX; startY = e.clientY; baseTx = tx; baseTy = ty;
      stage.classList.add('is-dragging');
      // double-tap on touch
      const now = Date.now();
      if (e.pointerType === 'touch' && now - lastTap < 300) {
        const [px, py] = fromCenter(e.clientX, e.clientY);
        zoomTo(scale > 1 ? 1 : 2.5, px, py);
      }
      lastTap = now;
    } else if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      pinchDist = Math.hypot(a[0] - b[0], a[1] - b[1]);
      pinchScale = scale;
    }
  });
  stage.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const [px, py] = fromCenter((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      zoomTo(pinchScale * d / pinchDist, px, py);
    } else if (scale > 1) {
      tx = baseTx + (e.clientX - startX);
      ty = baseTy + (e.clientY - startY);
      apply();
    }
  });
  const end = (e) => {
    if (!pts.has(e.pointerId)) return;
    if (pts.size === 1 && scale === 1) {
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - startY)) show(idx + (dx < 0 ? 1 : -1));
    }
    pts.delete(e.pointerId);
    if (!pts.size) stage.classList.remove('is-dragging');
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
}


/* ---------- Reveal (fade-up) ---------- */
let revealIO = null;
function initReveal() {
  const pending = document.querySelectorAll('[data-reveal]:not(.in)');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    pending.forEach(el => el.classList.add('in')); return;
  }
  revealIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  pending.forEach(el => revealIO.observe(el));
}
// After a language switch: items already on/above screen show at once, the rest still animate in
function revealNow() {
  document.querySelectorAll('[data-reveal]:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight || !revealIO) el.classList.add('in');
    else revealIO.observe(el);
  });
}


/* ---------- Header / nav ---------- */
function initHeader() {
  const hdr = document.getElementById('header');
  const onScroll = () => { if (hdr) hdr.classList.toggle('is-scrolled', scrollY > 10); };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileNav() {
  const btn = document.getElementById('menu-toggle'), nav = document.getElementById('mobile-nav'), close = document.getElementById('mobile-nav-close');
  if (!btn || !nav) return;
  const set = (open) => {
    nav.classList.toggle('is-open', open);
    nav.setAttribute('aria-hidden', String(!open));
    btn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('is-open')));
  close.addEventListener('click', () => set(false));
  nav.addEventListener('click', (e) => { if (e.target === nav || e.target.closest('a, [data-book]')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}

function initScrollSpy() {
  const links = [...document.querySelectorAll('.nav__link[href^="#"]')];
  if (!links.length) return;
  const map = links.map(l => [l, document.querySelector(l.getAttribute('href'))]).filter(([, s]) => s);
  const onScroll = () => {
    const y = scrollY + 140;
    let active = null;
    map.forEach(([l, s]) => { if (s.offsetTop <= y) active = l; });
    links.forEach(l => l.classList.toggle('is-active', l === active));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initHeroSlides() {
  const slides = [...document.querySelectorAll('.hero__slide')];
  const dots = [...document.querySelectorAll('.hero__dots button')];
  if (slides.length < 2) return;
  let i = 0, timer;
  const go = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
  };
  const start = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 5500); };
  dots.forEach((d, k) => d.addEventListener('click', () => { go(k); start(); }));
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) start();
}

function initAboutSlides() {
  const slides = [...document.querySelectorAll('.about__slide')];
  if (slides.length < 2) return;
  let i = 0, timer;
  const go = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
  };
  const start = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 5500); };
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) start();
}


/* ---------- Booking pop-up → WhatsApp ---------- */
function initBooking() {
  const modal = document.getElementById('book-modal');
  if (!modal) return;
  const form = document.getElementById('book-form');
  const done = document.getElementById('book-done');
  const err = document.getElementById('bk-error');
  const selService = document.getElementById('bk-service');

  // --- Custom Date/Time Picker elements ---
  const trigger    = document.getElementById('bk-dt-trigger');
  const panel      = document.getElementById('bk-dt-panel');
  const step1      = document.getElementById('bk-dt-step-1');
  const step2      = document.getElementById('bk-dt-step-2');
  const step2Date  = document.getElementById('bk-dt-step2-date');
  const backBtn    = document.getElementById('bk-dt-back');
  const closeBtn2  = document.getElementById('bk-dt-close-2');
  const monthLabel = document.getElementById('bk-dt-cal-month-label');
  const calPrev    = document.getElementById('bk-dt-cal-prev');
  const calNext    = document.getElementById('bk-dt-cal-next');
  const weekdaysRow= document.getElementById('bk-dt-cal-weekdays');
  const calGrid    = document.getElementById('bk-dt-cal-grid');
  const slotsBox   = document.getElementById('bk-dt-slots-box');
  const dispDate   = document.getElementById('bk-dt-disp-date');
  const dispTime   = document.getElementById('bk-dt-disp-time');
  const hidDay     = document.getElementById('bk-day');
  const hidTime    = document.getElementById('bk-time');

  let lastFocus = null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let selectedDate   = new Date(today);
  let viewYear       = today.getFullYear();
  let viewMonth      = today.getMonth();
  let selectedTime   = '10:00 AM';
  let selectedPeriod = 'morning';

  // --- Service dropdown ---
  const fillServices = (preselect) => {
    const opts = [['general', t('f.optGeneral')], ['pain', t('f.optPain')], ...CFG.services.map(s => [s.id, tr(s.title)]), ['other', t('f.optOther')]];
    const keep = preselect || selService.value;
    selService.innerHTML = opts.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('');
    if (keep && opts.some(o => o[0] === keep)) selService.value = keep;
  };

  // --- Calendar renderer ---
  const renderCalendar = () => {
    if (!calGrid || !monthLabel) return;
    const isHi = lang() === 'hi';
    const locale = isHi ? 'hi-IN' : 'en-IN';

    const viewDateObj = new Date(viewYear, viewMonth, 1);
    monthLabel.textContent = viewDateObj.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

    if (calPrev) {
      const isPastOrCurrent = (viewYear < today.getFullYear()) ||
        (viewYear === today.getFullYear() && viewMonth <= today.getMonth());
      calPrev.disabled = isPastOrCurrent;
    }

    if (weekdaysRow) {
      const weekdays = isHi
        ? ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श']
        : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      weekdaysRow.innerHTML = weekdays.map(w => `<span>${w}</span>`).join('');
    }

    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

    let gridHtml = '';
    for (let i = 0; i < firstDayIndex; i++) {
      gridHtml += '<span class="bk-dt-cal-empty"></span>';
    }
    for (let day = 1; day <= totalDays; day++) {
      const thisDate = new Date(viewYear, viewMonth, day);
      thisDate.setHours(0, 0, 0, 0);
      const isPast     = thisDate < today;
      const isToday    = thisDate.getTime() === today.getTime();
      const isSelected = thisDate.getTime() === selectedDate.getTime();
      const isSunday   = thisDate.getDay() === 0;
      if (isPast) {
        gridHtml += `<button type="button" class="bk-dt-cal-day is-past" disabled aria-disabled="true">${day}</button>`;
      } else {
        const cls = ['bk-dt-cal-day', isSelected ? 'is-active' : '', isToday ? 'is-today' : '', isSunday ? 'is-sun' : ''].filter(Boolean).join(' ');
        gridHtml += `<button type="button" class="${cls}" data-year="${viewYear}" data-month="${viewMonth}" data-day="${day}" aria-pressed="${isSelected}">${day}</button>`;
      }
    }
    calGrid.innerHTML = gridHtml;
  };

  // --- Time slots renderer ---
  const renderSlots = () => {
    if (!slotsBox || !selectedDate) return;
    const isSunday = selectedDate.getDay() === 0;
    if (isSunday) {
      const sunSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];
      if (!sunSlots.includes(selectedTime)) { selectedTime = '10:00 AM'; selectedPeriod = 'sunday'; }
      slotsBox.innerHTML = `
        <div class="bk-dt-period">
          <div class="bk-dt-period-label">${t('f.sunHours')}</div>
          <div class="bk-dt-grid bk-dt-grid-3">
            ${sunSlots.map(s => `<button type="button" class="bk-dt-slot-btn ${selectedTime === s ? 'is-active' : ''}" data-time="${s}" data-period="sunday">${s}</button>`).join('')}
          </div>
        </div>`;
    } else {
      const mornSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'];
      const eveSlots  = ['3:30 PM', '4:30 PM', '5:30 PM', '6:30 PM'];
      const allSlots  = [...mornSlots, ...eveSlots];
      if (!allSlots.includes(selectedTime)) { selectedTime = '10:00 AM'; selectedPeriod = 'morning'; }
      slotsBox.innerHTML = `
        <div class="bk-dt-period">
          <div class="bk-dt-period-label">${t('f.morningLabel')}</div>
          <div class="bk-dt-grid bk-dt-grid-3">
            ${mornSlots.map(s => `<button type="button" class="bk-dt-slot-btn ${selectedTime === s ? 'is-active' : ''}" data-time="${s}" data-period="morning">${s}</button>`).join('')}
          </div>
        </div>
        <div class="bk-dt-period">
          <div class="bk-dt-period-label">${t('f.eveningLabel')}</div>
          <div class="bk-dt-grid bk-dt-grid-3">
            ${eveSlots.map(s => `<button type="button" class="bk-dt-slot-btn ${selectedTime === s ? 'is-active' : ''}" data-time="${s}" data-period="evening">${s}</button>`).join('')}
          </div>
        </div>`;
    }
  };

  // --- Date text formatter ---
  const getFormattedDateText = () => {
    if (!selectedDate) return '';
    const isHi = lang() === 'hi';
    const locale = isHi ? 'hi-IN' : 'en-IN';
    const selD = new Date(selectedDate); selD.setHours(0, 0, 0, 0);
    const diffDays = Math.round((selD - today) / (1000 * 60 * 60 * 24));
    const dayNum  = selectedDate.getDate();
    const monthShort  = selectedDate.toLocaleDateString(locale, { month: 'short' });
    const weekdayShort= selectedDate.toLocaleDateString(locale, { weekday: 'short' });
    const yearNum = selectedDate.getFullYear();
    if (diffDays === 0) return isHi ? `आज, ${dayNum} ${monthShort}` : `Today, ${dayNum} ${monthShort}`;
    if (diffDays === 1) return isHi ? `कल, ${dayNum} ${monthShort}` : `Tomorrow, ${dayNum} ${monthShort}`;
    if (yearNum === today.getFullYear()) return `${weekdayShort}, ${dayNum} ${monthShort}`;
    return `${weekdayShort}, ${dayNum} ${monthShort} ${yearNum}`;
  };

  // --- Update display trigger + hidden inputs ---
  const updateDisplay = () => {
    if (!selectedDate) return;
    const isHi = lang() === 'hi';
    const locale = isHi ? 'hi-IN' : 'en-IN';
    const dateText = getFormattedDateText();
    if (dispDate) dispDate.textContent = dateText;
    if (step2Date) step2Date.textContent = dateText;

    const isSunday = selectedDate.getDay() === 0;
    let periodPrefix = isSunday
      ? (isHi ? 'रविवार' : 'Sunday')
      : selectedPeriod === 'evening' ? (isHi ? 'शाम' : 'Evening') : (isHi ? 'सुबह' : 'Morning');
    if (dispTime) dispTime.textContent = `${periodPrefix} · ${selectedTime}`;

    const fullDateStr = selectedDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
    const prefSuffix  = isHi ? 'प्राथमिकता' : 'Preference';
    if (hidDay)  hidDay.value  = `${dateText} (${fullDateStr})`;
    if (hidTime) hidTime.value = `${periodPrefix}: ${selectedTime} (${prefSuffix})`;
  };

  // --- Intelligent positioning (prefer upward, flip downward only if upward space is insufficient) ---
  const updatePosition = () => {
    if (!panel || panel.hidden || !trigger) return;
    const triggerRect = trigger.getBoundingClientRect();
    const modalBox = modal.querySelector('.modal__box');
    const boxRect = modalBox ? modalBox.getBoundingClientRect() : null;
    const panelHeight = panel.offsetHeight || 265;

    // Available space above trigger
    const spaceAbove = boxRect ? (triggerRect.top - boxRect.top) : triggerRect.top;
    const spaceBelow = boxRect ? (boxRect.bottom - triggerRect.bottom) : (window.innerHeight - triggerRect.bottom);

    // Prefer upward (default). Only open downward if upward space is insufficient AND downward has more room
    if (spaceAbove < panelHeight + 10 && spaceBelow > spaceAbove) {
      panel.classList.add('opens-down');
    } else {
      panel.classList.remove('opens-down');
    }
  };

  // --- Step switcher ---
  const showStep = (stepNum) => {
    if (step1) step1.hidden = stepNum !== 1;
    if (step2) step2.hidden = stepNum !== 2;
    if (stepNum === 2 && step2Date) step2Date.textContent = getFormattedDateText();
    requestAnimationFrame(updatePosition);
  };

  // --- Panel open/close ---
  const openPanel = () => {
    if (!panel || !trigger) return;
    showStep(1);
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    modal.classList.add('has-dt-open');
    updatePosition();
  };
  const closePanel = () => {
    if (!panel || !trigger) return;
    panel.hidden = true;
    panel.classList.remove('opens-down');
    trigger.setAttribute('aria-expanded', 'false');
    modal.classList.remove('has-dt-open');
  };

  // --- Init ---
  const initPicker = () => {
    renderCalendar();
    renderSlots();
    updateDisplay();
  };
  initPicker();
  document.addEventListener('langchange', initPicker);

  // --- Trigger toggle ---
  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      panel && panel.hidden ? openPanel() : closePanel();
    });
  }

  // --- Close buttons ---
  if (closeBtn2) closeBtn2.addEventListener('click', (e) => { e.stopPropagation(); closePanel(); });
  if (backBtn)   backBtn.addEventListener('click',   (e) => { e.stopPropagation(); showStep(1); });

  // --- Month navigation ---
  if (calPrev) {
    calPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      if (viewYear < today.getFullYear() || (viewYear === today.getFullYear() && viewMonth <= today.getMonth())) return;
      viewMonth === 0 ? (viewMonth = 11, viewYear--) : viewMonth--;
      renderCalendar();
      requestAnimationFrame(updatePosition);
    });
  }
  if (calNext) {
    calNext.addEventListener('click', (e) => {
      e.stopPropagation();
      viewMonth === 11 ? (viewMonth = 0, viewYear++) : viewMonth++;
      renderCalendar();
      requestAnimationFrame(updatePosition);
    });
  }

  // --- Date selection → advance to Step 2 ---
  if (calGrid) {
    calGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.bk-dt-cal-day');
      if (!btn || btn.disabled || btn.classList.contains('is-past')) return;
      e.stopPropagation();
      const y = parseInt(btn.dataset.year, 10);
      const m = parseInt(btn.dataset.month, 10);
      const d = parseInt(btn.dataset.day, 10);
      if (isNaN(y) || isNaN(m) || isNaN(d)) return;
      selectedDate = new Date(y, m, d);
      selectedDate.setHours(0, 0, 0, 0);
      renderCalendar();
      renderSlots();
      updateDisplay();
      showStep(2);
    });
  }

  // --- Time slot selection → auto-close ---
  if (slotsBox) {
    slotsBox.addEventListener('click', (e) => {
      const btn = e.target.closest('.bk-dt-slot-btn');
      if (!btn) return;
      e.stopPropagation();
      selectedTime   = btn.dataset.time;
      selectedPeriod = btn.dataset.period || 'morning';
      slotsBox.querySelectorAll('.bk-dt-slot-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      updateDisplay();
      setTimeout(() => closePanel(), 120);
    });
  }

  // --- Click outside to close ---
  document.addEventListener('click', (e) => {
    if (panel && !panel.hidden) {
      const field = document.getElementById('bk-dt-trigger');
      if (!panel.contains(e.target) && e.target !== field && !field?.contains(e.target)) closePanel();
    }
  });

  // --- Keyboard navigation & Window resize ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel && !panel.hidden) {
      e.stopPropagation();
      closePanel();
      trigger.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (panel && !panel.hidden) updatePosition();
  }, { passive: true });

  // --- Modal open/close ---
  const open = (serviceId) => {
    lastFocus = document.activeElement;
    fillServices(serviceId);
    // Reset picker to today & close panel
    selectedDate   = new Date(today);
    viewYear       = today.getFullYear();
    viewMonth      = today.getMonth();
    selectedTime   = '10:00 AM';
    selectedPeriod = 'morning';
    initPicker();
    closePanel();
    form.hidden = false; done.hidden = true;
    if (err) err.hidden = true;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => document.getElementById('bk-name').focus(), 60);
  };
  const close = () => {
    closePanel();
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  };
  window.openBooking = open;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-book]');
    if (!trigger) return;
    e.preventDefault();
    open(trigger.dataset.book || '');
  });
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-close]')) close(); });
  document.addEventListener('langchange', () => {
    if (modal.classList.contains('is-open')) {
      fillServices();
      if (!done.hidden) {
        const checkOpen = (typeof window.isClinicCurrentlyOpen === 'function') ? window.isClinicCurrentlyOpen() : isClinicCurrentlyOpen();
        const doneSubEl = document.getElementById('done-sub');
        const doneMsgEl = document.getElementById('done-msg');
        if (doneSubEl) doneSubEl.textContent = t('done.sub');
        if (doneMsgEl) doneMsgEl.textContent = checkOpen ? t('done.msgOpen') : t('done.msgClosed');
      }
    }
  });

  // Phone sanitisation
  const phoneIn = document.getElementById('bk-phone');
  phoneIn.addEventListener('input', () => { phoneIn.value = phoneIn.value.replace(/[^\d ]/g, ''); });

  // Form submit → WhatsApp
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bk-name').value.trim();
    let phone  = phoneIn.value.replace(/\D/g, '');
    if (phone.length === 12 && phone.startsWith('91')) phone = phone.slice(2);
    if (phone.length === 11 && phone.startsWith('0'))  phone = phone.slice(1);
    const problems = [];
    if (name.length < 2)                     problems.push(t('f.errName'));
    if (!/^[6-9]\d{9}$/.test(phone))        problems.push(t('f.errPhone'));
    if (problems.length) { err.textContent = problems.join(' '); err.hidden = false; return; }
    err.hidden = true;

    const dayLabel  = hidDay  ? hidDay.value  : getFormattedDateText();
    const timeLabel = hidTime ? hidTime.value : `${selectedPeriod}: ${selectedTime}`;
    const text = `${t('wa.greet')}\n\n*${t('wa.name')}:* ${name}\n*${t('wa.phone')}:* +91 ${phone}\n*${t('wa.treatment')}:* ${selService.selectedOptions[0].textContent}\n*${t('wa.date')}:* ${dayLabel}\n*${t('wa.time')}:* ${timeLabel}\n`;
    const url  = `https://wa.me/${CFG.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;

    // --- Populate success screen ---
    const clinicOpen = (typeof window.isClinicCurrentlyOpen === 'function') ? window.isClinicCurrentlyOpen() : isClinicCurrentlyOpen();

    // Date / time slot
    const doneDateEl = document.getElementById('done-date');
    const doneTimeEl = document.getElementById('done-time');
    if (doneDateEl) doneDateEl.textContent = dayLabel;
    if (doneTimeEl) doneTimeEl.textContent = timeLabel;

    // Sub-heading
    const doneSubEl = document.getElementById('done-sub');
    if (doneSubEl) {
      doneSubEl.removeAttribute('data-i18n');
      doneSubEl.textContent = t('done.sub');
    }

    // Main message (15-min response vs reopens)
    const doneMsgEl = document.getElementById('done-msg');
    if (doneMsgEl) {
      doneMsgEl.textContent = clinicOpen ? t('done.msgOpen') : t('done.msgClosed');
    }

    // Clinic hours block (only shown when closed)
    const doneHoursEl = document.getElementById('done-hours');
    if (doneHoursEl) doneHoursEl.hidden = clinicOpen;

    // WhatsApp link on the "View WhatsApp" button
    const doneLinkEl = document.getElementById('book-done-link');
    if (doneLinkEl) doneLinkEl.href = url;

    // Switch to success screen
    form.hidden = true;
    done.hidden = false;
    LANG.apply(done); // re-apply i18n to freshly shown element

    // Open WhatsApp
    window.open(url, '_blank');
  });

  document.getElementById('book-again').addEventListener('click', () => {
    form.reset();
    selectedDate   = new Date(today);
    viewYear       = today.getFullYear();
    viewMonth      = today.getMonth();
    selectedTime   = '10:00 AM';
    selectedPeriod = 'morning';
    initPicker();
    closePanel();
    form.hidden = false; done.hidden = true;
  });
}

function initHeroBooking() {
  const form = document.getElementById('hero-book-form');
  if (!form) return;
  const nameIn = document.getElementById('hero-bk-name');
  const phoneIn = document.getElementById('hero-bk-phone');
  const err = document.getElementById('hero-bk-error');
  const trigger = document.getElementById('hero-dt-trigger');
  const popover = document.getElementById('hero-dt-popover');
  const step1 = document.getElementById('hero-dt-step-1');
  const step2 = document.getElementById('hero-dt-step-2');
  const step2Date = document.getElementById('hero-dt-step2-date');
  const backBtn = document.getElementById('hero-dt-back');
  const closeBtn1 = document.getElementById('hero-dt-close-1');
  const closeBtn2 = document.getElementById('hero-dt-close-2');
  const calMonthLabel = document.getElementById('hero-dt-cal-month-label');
  const calPrevBtn = document.getElementById('hero-dt-cal-prev');
  const calNextBtn = document.getElementById('hero-dt-cal-next');
  const calWeekdaysRow = document.getElementById('hero-dt-cal-weekdays');
  const calGrid = document.getElementById('hero-dt-cal-grid');
  const slotsBox = document.getElementById('hero-dt-slots-box');
  const dispDate = document.getElementById('hero-dt-disp-date');
  const dispTime = document.getElementById('hero-dt-disp-time');
  const hidDay = document.getElementById('hero-bk-day');
  const hidTime = document.getElementById('hero-bk-time');
  let updateCardPauseState = () => {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Selected date object (defaults to today)
  let selectedDate = new Date(today);
  // View month & year for browsing
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  let selectedTime = '10:00 AM';
  let selectedPeriod = 'morning';

  const showStep = (stepNum) => {
    if (stepNum === 1) {
      if (step1) step1.hidden = false;
      if (step2) step2.hidden = true;
    } else {
      if (step1) step1.hidden = true;
      if (step2) step2.hidden = false;
      if (step2Date) step2Date.textContent = getFormattedDateText();
    }
    updatePopoverPosition();
  };

  const renderCalendar = () => {
    if (!calGrid || !calMonthLabel) return;
    const isHi = lang() === 'hi';
    const locale = isHi ? 'hi-IN' : 'en-IN';

    // 1. Month label e.g. "October 2026"
    const viewDateObj = new Date(viewYear, viewMonth, 1);
    calMonthLabel.textContent = viewDateObj.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

    // 2. Disable prev button if viewing current month of current year or earlier
    if (calPrevBtn) {
      const isPastOrCurrent = (viewYear < today.getFullYear()) ||
        (viewYear === today.getFullYear() && viewMonth <= today.getMonth());
      calPrevBtn.disabled = isPastOrCurrent;
    }

    // 3. Weekday row
    if (calWeekdaysRow) {
      const weekdays = isHi
        ? ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श']
        : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      calWeekdaysRow.innerHTML = weekdays.map(w => `<span>${w}</span>`).join('');
    }

    // 4. Grid calculation
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

    let gridHtml = '';
    for (let i = 0; i < firstDayIndex; i++) {
      gridHtml += '<span class="dd2-dt-cal-empty"></span>';
    }

    for (let day = 1; day <= totalDays; day++) {
      const thisDate = new Date(viewYear, viewMonth, day);
      thisDate.setHours(0, 0, 0, 0);

      const isPast = thisDate < today;
      const isToday = thisDate.getTime() === today.getTime();
      const isSelected = thisDate.getTime() === selectedDate.getTime();
      const isSunday = thisDate.getDay() === 0;

      if (isPast) {
        gridHtml += `<button type="button" class="dd2-dt-cal-day is-past" disabled aria-disabled="true">${day}</button>`;
      } else {
        const cls = [
          'dd2-dt-cal-day',
          isSelected ? 'is-active' : '',
          isToday ? 'is-today' : '',
          isSunday ? 'is-sun' : ''
        ].filter(Boolean).join(' ');
        gridHtml += `<button type="button" class="${cls}" data-year="${viewYear}" data-month="${viewMonth}" data-day="${day}" aria-pressed="${isSelected}">${day}</button>`;
      }
    }

    calGrid.innerHTML = gridHtml;
  };

  const renderSlots = () => {
    if (!slotsBox || !selectedDate) return;
    const isSunday = selectedDate.getDay() === 0;

    if (isSunday) {
      const sunSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];
      if (!sunSlots.includes(selectedTime)) {
        selectedTime = '10:00 AM';
        selectedPeriod = 'sunday';
      }
      slotsBox.innerHTML = `
        <div class="dd2-dt-period">
          <div class="dd2-dt-period-label">${t('f.sunHours')}</div>
          <div class="dd2-dt-grid dd2-dt-grid-3">
            ${sunSlots.map(s => `
              <button type="button" class="dd2-dt-slot-btn ${selectedTime === s ? 'is-active' : ''}" data-time="${s}" data-period="sunday">
                ${s}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      const mornSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'];
      const eveSlots = ['3:30 PM', '4:30 PM', '5:30 PM', '6:30 PM'];
      const allSlots = [...mornSlots, ...eveSlots];
      if (!allSlots.includes(selectedTime)) {
        selectedTime = '10:00 AM';
        selectedPeriod = 'morning';
      }
      slotsBox.innerHTML = `
        <div class="dd2-dt-period">
          <div class="dd2-dt-period-label">${t('f.morningLabel')}</div>
          <div class="dd2-dt-grid dd2-dt-grid-3">
            ${mornSlots.map(s => `
              <button type="button" class="dd2-dt-slot-btn ${selectedTime === s ? 'is-active' : ''}" data-time="${s}" data-period="morning">
                ${s}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="dd2-dt-period">
          <div class="dd2-dt-period-label">${t('f.eveningLabel')}</div>
          <div class="dd2-dt-grid dd2-dt-grid-3">
            ${eveSlots.map(s => `
              <button type="button" class="dd2-dt-slot-btn ${selectedTime === s ? 'is-active' : ''}" data-time="${s}" data-period="evening">
                ${s}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }
  };

  const getFormattedDateText = () => {
    if (!selectedDate) return '';
    const isHi = lang() === 'hi';
    const locale = isHi ? 'hi-IN' : 'en-IN';

    const selTime = new Date(selectedDate);
    selTime.setHours(0, 0, 0, 0);

    const diffDays = Math.round((selTime - today) / (1000 * 60 * 60 * 24));
    const dayNum = selectedDate.getDate();
    const monthShort = selectedDate.toLocaleDateString(locale, { month: 'short' });
    const weekdayShort = selectedDate.toLocaleDateString(locale, { weekday: 'short' });
    const yearNum = selectedDate.getFullYear();

    if (diffDays === 0) {
      return isHi ? `आज, ${dayNum} ${monthShort}` : `Today, ${dayNum} ${monthShort}`;
    } else if (diffDays === 1) {
      return isHi ? `कल, ${dayNum} ${monthShort}` : `Tomorrow, ${dayNum} ${monthShort}`;
    } else if (yearNum === today.getFullYear()) {
      return `${weekdayShort}, ${dayNum} ${monthShort}`;
    } else {
      return `${weekdayShort}, ${dayNum} ${monthShort} ${yearNum}`;
    }
  };

  const updateDisplay = () => {
    if (!selectedDate) return;
    const isHi = lang() === 'hi';
    const locale = isHi ? 'hi-IN' : 'en-IN';

    const dateText = getFormattedDateText();
    if (dispDate) dispDate.textContent = dateText;
    if (step2Date) step2Date.textContent = dateText;

    const isSunday = selectedDate.getDay() === 0;
    let periodPrefix = '';
    if (isSunday) {
      periodPrefix = isHi ? 'रविवार' : 'Sunday';
    } else if (selectedPeriod === 'evening') {
      periodPrefix = isHi ? 'शाम' : 'Evening';
    } else {
      periodPrefix = isHi ? 'सुबह' : 'Morning';
    }

    if (dispTime) {
      dispTime.textContent = `${periodPrefix} · ${selectedTime}`;
    }

    const fullDateStr = selectedDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
    const prefSuffix = isHi ? 'प्राथमिकता' : 'Preference';
    if (hidDay) hidDay.value = `${dateText} (${fullDateStr})`;
    if (hidTime) hidTime.value = `${periodPrefix}: ${selectedTime} (${prefSuffix})`;
  };

  const initUI = () => {
    renderCalendar();
    renderSlots();
    updateDisplay();
  };

  initUI();
  document.addEventListener('langchange', initUI);

  const bookWrap = document.getElementById('hero-book-wrap');

  const updatePopoverPosition = () => {
    if (!popover || !trigger) return;
    const rect = trigger.getBoundingClientRect();
    if (rect.top < 340) {
      popover.classList.add('opens-down');
    } else {
      popover.classList.remove('opens-down');
    }
  };

  // Popover toggle
  const openPopover = () => {
    if (!popover || !trigger) return;
    // Always start at Step 1: Select Date
    showStep(1);
    popover.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    if (bookWrap) bookWrap.classList.add('has-dt-open');
    updatePopoverPosition();
    updateCardPauseState();
  };

  const closePopover = () => {
    if (!popover || !trigger) return;
    popover.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (bookWrap) bookWrap.classList.remove('has-dt-open');
    setTimeout(updateCardPauseState, 50);
  };

  window.addEventListener('resize', () => { if (popover && !popover.hidden) updatePopoverPosition(); });
  window.addEventListener('scroll', () => { if (popover && !popover.hidden) updatePopoverPosition(); }, { passive: true });

  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (popover && popover.hidden) {
        openPopover();
      } else {
        closePopover();
      }
    });
  }

  if (closeBtn1) closeBtn1.addEventListener('click', (e) => { e.stopPropagation(); closePopover(); });
  if (closeBtn2) closeBtn2.addEventListener('click', (e) => { e.stopPropagation(); closePopover(); });

  // Back button in Step 2: return to Step 1 (Calendar)
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showStep(1);
    });
  }

  // Month navigation: previous
  if (calPrevBtn) {
    calPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (viewYear < today.getFullYear() || (viewYear === today.getFullYear() && viewMonth <= today.getMonth())) {
        return;
      }
      if (viewMonth === 0) {
        viewMonth = 11;
        viewYear--;
      } else {
        viewMonth--;
      }
      renderCalendar();
    });
  }

  // Month navigation: next
  if (calNextBtn) {
    calNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (viewMonth === 11) {
        viewMonth = 0;
        viewYear++;
      } else {
        viewMonth++;
      }
      renderCalendar();
    });
  }

  // Date selection in Step 1 calendar -> advance to Step 2
  if (calGrid) {
    calGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.dd2-dt-cal-day');
      if (!btn || btn.disabled || btn.classList.contains('is-past')) return;
      e.stopPropagation();
      const y = parseInt(btn.dataset.year, 10);
      const m = parseInt(btn.dataset.month, 10);
      const d = parseInt(btn.dataset.day, 10);
      if (isNaN(y) || isNaN(m) || isNaN(d)) return;

      selectedDate = new Date(y, m, d);
      selectedDate.setHours(0, 0, 0, 0);

      renderCalendar();
      renderSlots();
      updateDisplay();

      // Proceed to Step 2: Time Preference
      showStep(2);
    });
  }

  // Time slot selection in Step 2: Immediate selection, automatic summary update, no extra confirm step
  if (slotsBox) {
    slotsBox.addEventListener('click', (e) => {
      const btn = e.target.closest('.dd2-dt-slot-btn');
      if (!btn) return;
      e.stopPropagation();
      selectedTime = btn.dataset.time;
      selectedPeriod = btn.dataset.period || 'morning';
      slotsBox.querySelectorAll('.dd2-dt-slot-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      updateDisplay();

      // Immediately select time, update summary, and return to compact appointment card
      setTimeout(() => {
        closePopover();
      }, 120);
    });
  }

  // Click outside to close popover
  document.addEventListener('click', (e) => {
    if (popover && !popover.hidden) {
      if (!popover.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
        closePopover();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popover && !popover.hidden) {
      closePopover();
      if (trigger) trigger.focus();
    }
  });

  if (phoneIn) {
    phoneIn.addEventListener('input', () => {
      phoneIn.value = phoneIn.value.replace(/[^\d ]/g, '');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameIn ? nameIn.value.trim() : '';
    let phone = phoneIn ? phoneIn.value.replace(/\D/g, '') : '';
    if (phone.length === 12 && phone.startsWith('91')) phone = phone.slice(2);
    if (phone.length === 11 && phone.startsWith('0')) phone = phone.slice(1);

    const problems = [];
    if (name.length < 2) problems.push(t('f.errName'));
    if (!/^[6-9]\d{9}$/.test(phone)) problems.push(t('f.errPhone'));

    if (problems.length) {
      if (err) {
        err.textContent = problems.join(' ');
        err.hidden = false;
      }
      return;
    }
    if (err) err.hidden = true;

    const fullDateStr = selectedDate.toLocaleDateString(lang() === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      weekday: 'short'
    });
    const dayLabel = dispDate ? `${dispDate.textContent} (${fullDateStr})` : fullDateStr;
    const timeLabel = dispTime ? dispTime.textContent : selectedTime;

    const text = `${t('wa.greet')}\n\n*${t('wa.name')}:* ${name}\n*${t('wa.phone')}:* +91 ${phone}\n*${t('wa.treatment')}:* ${t('f.optGeneral')}\n*${t('wa.date')}:* ${dayLabel}\n*${t('wa.time')}:* ${timeLabel}\n`;
    const url = `https://wa.me/${CFG.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });

  // --- Hero Appointment Card: Subtle Attention Wobble After Entrance ---
  const heroCard = form.closest('.dd2-form-card') || form;

  if (heroCard) {
    // Respect user's reduced-motion preference immediately
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      const startAttentionMovement = (e) => {
        if (e && e.animationName && e.animationName !== 'heroCardEntrance') return;
        heroCard.classList.add('has-attention-movement');
      };

      // Transition smoothly after entrance animation finishes
      heroCard.addEventListener('animationend', startAttentionMovement, { once: true });

      // Fallback timer (1.4s) to ensure attention wobble initiates after entrance
      setTimeout(() => {
        if (!heroCard.classList.contains('has-attention-movement')) {
          heroCard.classList.add('has-attention-movement');
        }
      }, 1400);

      // Pause on interaction, automatically resume when leaving the form
      let isHovered = false;
      let isTouching = false;

      updateCardPauseState = () => {
        const isFocused = heroCard.contains(document.activeElement);
        const isPopoverOpen = Boolean(bookWrap && bookWrap.classList.contains('has-dt-open'));
        const shouldPause = isHovered || isTouching || isFocused || isPopoverOpen;

        if (shouldPause) {
          heroCard.classList.add('is-paused');
        } else {
          heroCard.classList.remove('is-paused');
        }
      };

      // Mouse / pointer hover events
      heroCard.addEventListener('pointerenter', () => { isHovered = true; updateCardPauseState(); });
      heroCard.addEventListener('pointerleave', () => { isHovered = false; updateCardPauseState(); });
      heroCard.addEventListener('mouseenter', () => { isHovered = true; updateCardPauseState(); });
      heroCard.addEventListener('mouseleave', () => { isHovered = false; updateCardPauseState(); });

      // Focus / blur events
      heroCard.addEventListener('focusin', () => { updateCardPauseState(); });
      heroCard.addEventListener('focusout', () => {
        setTimeout(updateCardPauseState, 40);
      });

      // Touch events
      heroCard.addEventListener('touchstart', () => {
        isTouching = true;
        updateCardPauseState();
      }, { passive: true });

      document.addEventListener('touchend', (e) => {
        if (!heroCard.contains(e.target)) {
          isTouching = false;
          isHovered = false;
          updateCardPauseState();
        } else {
          setTimeout(() => {
            isTouching = false;
            updateCardPauseState();
          }, 150);
        }
      }, { passive: true });

      // Typing / input events
      heroCard.addEventListener('input', () => { updateCardPauseState(); });

      // Document clicks (e.g. clicking outside the form)
      document.addEventListener('click', (e) => {
        if (!heroCard.contains(e.target)) {
          isHovered = false;
          isTouching = false;
        }
        setTimeout(updateCardPauseState, 50);
      });
    }
  }
}





