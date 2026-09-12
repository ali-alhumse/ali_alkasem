/* ============ script.js ============ */
/* =========================================================
   Ali Ahmad Alkasem — Portfolio
   ملاحظة مهمة: كل المحتوى يظهر حتى لو تعطّل الجافاسكربت،
   والحركات تُفعَّل فقط عند نجاح تحميل السكربت (class="js").
========================================================= */
'use strict';

/* 0) تفعيل الحركات فقط عندما يعمل JS (حماية من اختفاء الأقسام) */
document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* تخزين آمن (قد يكون محظورًا في بعض بيئات المعاينة) */
const storage = {
  get(key) { try { return window.localStorage.getItem(key); } catch (err) { return null; } },
  set(key, val) { try { window.localStorage.setItem(key, val); } catch (err) { /* تجاهل */ } }
};

/* ---------- 1) الوضع الليلي / النهاري ---------- */
const rootEl = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = storage.get('aa-theme');
if (savedTheme === 'light' || savedTheme === 'dark') rootEl.dataset.theme = savedTheme;

function syncThemeIcon() {
  if (!themeToggle) return;
  const dark = rootEl.dataset.theme === 'dark';
  const sun = themeToggle.querySelector('.icon-sun');
  const moon = themeToggle.querySelector('.icon-moon');
  if (sun) sun.style.display = dark ? 'block' : 'none';
  if (moon) moon.style.display = dark ? 'none' : 'block';
  themeToggle.setAttribute('aria-label', dark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي');
}
syncThemeIcon();
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    rootEl.dataset.theme = (rootEl.dataset.theme === 'dark') ? 'light' : 'dark';
    storage.set('aa-theme', rootEl.dataset.theme);
    syncThemeIcon();
  });
}

/* ---------- 2) قائمة الموبايل ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function closeMobileNav() {
  if (!navLinks || !navLinks.classList.contains('open')) return;
  navLinks.classList.remove('open');
  if (navToggle) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'فتح القائمة');
  }
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  /* إغلاق القائمة بسلاسة عند النقر خارجها */
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      closeMobileNav();
    }
  });

  /* إغلاق القائمة عند الضغط على Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMobileNav();
      navToggle.focus();
    }
  });
}

/* ---------- 3) ظل الشريط + زر العودة للأعلى ---------- */
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('backTop');
function onScroll() {
  const y = window.scrollY || window.pageYOffset || 0;
  if (navbar) navbar.classList.toggle('scrolled', y > 12);
  if (backTop) backTop.classList.toggle('show', y > 520);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

/* ---------- 4) تتبع القسم النشط (Scroll Spy) ---------- */
const spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
const spySections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
if (spyLinks.length && spySections.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        spyLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-42% 0px -53% 0px' });
  spySections.forEach(sec => spy.observe(sec));
}

/* ---------- 5) الكشف عند التمرير (مع شبكة أمان) ---------- */
const revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
function showAllReveals() { revealEls.forEach(el => el.classList.add('in')); }
if (revealEls.length) {
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
    /* شبكة أمان: لا يبقى أي قسم مخفيًا مهما حدث */
    window.addEventListener('load', () => { setTimeout(showAllReveals, 2500); });
  } else {
    showAllReveals();
  }
  /* إظهار كل شيء عند الطباعة (تحميل السيرة PDF) */
  window.addEventListener('beforeprint', showAllReveals);
}

/* ---------- 6) شريط التقنيات (نسخ المحتوى لحلقة سلسة) ---------- */
const marqueeTrack = document.getElementById('marqueeTrack');
if (marqueeTrack) marqueeTrack.innerHTML += marqueeTrack.innerHTML;

/* ---------- 7) آلة الكتابة للعنوان ---------- */
const twEl = document.getElementById('typewriter');
const roles = ['مطوّر واجهات أمامية', 'مطوّر React و Tailwind CSS', 'مطوّر تطبيقات React Native', 'طالب هندسة برمجيات', 'بانٍ لواجهات الويب'];
if (twEl) {
  if (reduceMotion) {
    twEl.textContent = roles[0];
  } else {
    let roleIdx = 0, charIdx = 0, deleting = false;
    const tick = () => {
      const word = roles[roleIdx];
      if (!deleting) {
        charIdx++;
        twEl.textContent = word.slice(0, charIdx);
        if (charIdx === word.length) { deleting = true; setTimeout(tick, 1700); return; }
      } else {
        charIdx--;
        twEl.textContent = word.slice(0, charIdx);
        if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
      }
      setTimeout(tick, deleting ? 45 : 85);
    };
    tick();
  }
}

/* ---------- 8) الطرفية التفاعلية ---------- */
const termBody = document.getElementById('termBody');
const termData = [
  { cmd: 'whoami', out: ['Ali Ahmad Alkasem'] },
  { cmd: 'cat role.txt', out: ['Front-end & Mobile Developer - React & React Native'] },
  { cmd: 'cat education.txt', out: ['B.Sc. Software Engineering | 3rd year | GPA 3.25/4.0'] },
  { cmd: 'ls skills/', out: ['html/  css/  javascript/  react/  react-native/  tailwind/', 'supabase/  postgresql/  cpp/  python/'] },
  { cmd: './status.sh', out: ['[OK] Ready for work opportunities'] }
];
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
async function typeInto(el, text, speed) {
  for (let i = 0; i < text.length; i++) { el.textContent += text.charAt(i); await sleep(speed); }
}
async function runTerminal() {
  if (!termBody) return;
  if (reduceMotion) {
    termData.forEach(line => {
      const c = document.createElement('div'); c.className = 't-line';
      const p = document.createElement('span'); p.className = 't-prompt'; p.textContent = '$ ';
      const cm = document.createElement('span'); cm.className = 't-cmd'; cm.textContent = line.cmd;
      c.appendChild(p); c.appendChild(cm); termBody.appendChild(c);
      line.out.forEach(o => { const d = document.createElement('div'); d.className = 't-line t-out'; d.textContent = o; termBody.appendChild(d); });
    });
    return;
  }
  for (const line of termData) {
    const c = document.createElement('div'); c.className = 't-line';
    const p = document.createElement('span'); p.className = 't-prompt'; p.textContent = '$ ';
    const cm = document.createElement('span'); cm.className = 't-cmd';
    c.appendChild(p); c.appendChild(cm); termBody.appendChild(c);
    await typeInto(cm, line.cmd, 32);
    await sleep(140);
    for (const o of line.out) {
      const d = document.createElement('div'); d.className = 't-line t-out'; d.textContent = o; termBody.appendChild(d);
    }
    await sleep(320);
  }
  const cur = document.createElement('div'); cur.className = 't-line';
  const cp = document.createElement('span'); cp.className = 't-prompt'; cp.textContent = '$ ';
  const cc = document.createElement('span'); cc.className = 't-caret';
  cur.appendChild(cp); cur.appendChild(cc); termBody.appendChild(cur);
}
setTimeout(runTerminal, 650);

/* ---------- 9) عدّادات الإنجازات ---------- */
function animateCount(el) {
  const target = parseFloat(el.getAttribute('data-target')) || 0;
  const dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
  if (reduceMotion) { el.textContent = target.toFixed(dec); return; }
  const dur = 1500;
  const t0 = performance.now();
  function step(t) {
    const prog = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - prog, 3);
    el.textContent = (target * eased).toFixed(dec);
    if (prog < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statsSection = document.getElementById('achievements');
if (statsSection && 'IntersectionObserver' in window) {
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.num').forEach(animateCount);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  statObserver.observe(statsSection);
} else if (statsSection) {
  statsSection.querySelectorAll('.num').forEach(animateCount);
}

/* ---------- 10) شبكة الجسيمات على Canvas ---------- */
(function initParticles() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas || typeof canvas.getContext !== 'function') return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let W = 0, H = 0, parts = [], raf = null;
  const palette = ['45,212,191', '251,191,36', '56,189,248'];
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const n = Math.min(Math.floor((W * H) / 17000), 90);
    parts = [];
    for (let i = 0; i < n; i++) {
      parts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.7 + 0.6,
        c: palette[Math.floor(Math.random() * palette.length)]
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const pt of parts) {
      pt.x += pt.vx; pt.y += pt.vy;
      if (pt.x < 0) pt.x = W; if (pt.x > W) pt.x = 0;
      if (pt.y < 0) pt.y = H; if (pt.y > H) pt.y = 0;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + pt.c + ',.55)'; ctx.fill();
    }
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i], b = parts[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(56,189,248,' + ((1 - Math.sqrt(d2) / 120) * 0.12).toFixed(3) + ')';
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }
  function start() { if (!raf && !reduceMotion) draw(); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); } else { start(); } });
  if (reduceMotion) { draw(); stop(); } else { start(); }
})();

/* ---------- 11) نموذج التواصل (mailto) ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const nameEl = document.getElementById('cf-name');
    const emailEl = document.getElementById('cf-email');
    const msgEl = document.getElementById('cf-msg');
    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const msg = msgEl ? msgEl.value.trim() : '';
    if (!name || !email || !msg) {
      [nameEl, emailEl, msgEl].forEach(f => { if (f && !f.value.trim()) f.focus(); });
      return;
    }
    const subject = encodeURIComponent('رسالة من البورتفوليو - ' + name);
    const body = encodeURIComponent('الاسم: ' + name + '\nالبريد: ' + email + '\n\n' + msg);
    window.location.href = 'mailto:alialhumse820@gmail.com?subject=' + subject + '&body=' + body;
  });
}

/* ---------- 12) تحميل السيرة الذاتية (طباعة / حفظ PDF) ---------- */
const downloadCv = document.getElementById('downloadCv');
if (downloadCv) downloadCv.addEventListener('click', () => window.print());

/* ---------- 13) السنة الحالية في التذييل ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------- 14) معرض الصور الاحترافي ثلاثي الأبعاد (3D Perspective Gallery) ---------- */
(function init3DGallery() {
  const modalEl = document.getElementById('galleryModal');
  if (!modalEl) return;

  const trackEl = document.getElementById('galleryTrack');
  const stageEl = document.getElementById('galleryStage');
  const thumbsEl = document.getElementById('galleryThumbs');
  const thumbsWrapEl = thumbsEl ? thumbsEl.closest('.gallery-thumbs-wrap') : null;
  const titleEl = document.getElementById('galleryModalTitle');
  const currentIdxEl = document.getElementById('galleryCurrentIdx');
  const totalCountEl = document.getElementById('galleryTotalCount');
  const slideTitleEl = document.getElementById('gallerySlideTitle');
  const slideDescEl = document.getElementById('gallerySlideDesc');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');
  const closeBtn = document.getElementById('galleryCloseBtn');

  let items = [];
  let currentIndex = 0;
  let isOpen = false;
  let previousActiveElement = null;
  let pointerMoved = false;

  // عناصر الخلفية التي يتم تعطيل التفاعل معها لأغراض إمكانية الوصول (A11y inert)
  function getBackgroundElements() {
    return [
      document.getElementById('navbar'),
      document.getElementById('main'),
      document.querySelector('footer'),
      document.getElementById('backTop')
    ].filter(Boolean);
  }

  function isRTL() {
    return (document.documentElement.getAttribute('dir') || document.body.getAttribute('dir') || 'rtl') === 'rtl';
  }

  function update3DStage() {
    if (!isOpen || !items.length || !trackEl) return;
    const isMotionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const w = window.innerWidth;
    const isSmallMobile = w < 440;
    const isMobile = w < 640;
    const isTablet = w < 1024;

    const xStep = isSmallMobile ? Math.min(160, Math.floor(w * 0.4)) : (isMobile ? 190 : (isTablet ? 240 : 290));
    const zStep = isMobile ? 105 : 145;
    const rotAngle = isMobile ? 24 : 32;
    const rtl = isRTL();

    const slides = trackEl.querySelectorAll('.gallery-slide');
    slides.forEach((slide, idx) => {
      let offset = idx - currentIndex;
      // حساب الإزاحة الأقصر هندسياً للمسار الدائري عندما يزيد عدد الشرائح عن 2
      if (items.length > 2) {
        const half = items.length / 2;
        if (offset > half) offset -= items.length;
        else if (offset < -half) offset += items.length;
      }

      const absOffset = Math.abs(offset);
      // في RTL: الشريحة التالية (+offset) تقع على اليسار (-X)، والشريحة السابقة (-offset) على اليمين (+X)
      // في LTR: الشريحة التالية (+offset) تقع على اليمين (+X)، والشريحة السابقة (-offset) على اليسار (-X)
      const dirFactor = rtl ? -1 : 1;
      const sign = offset === 0 ? 0 : (offset > 0 ? dirFactor : -dirFactor);

      slide.classList.toggle('active', offset === 0);
      slide.setAttribute('aria-hidden', offset === 0 ? 'false' : 'true');
      slide.tabIndex = offset === 0 ? 0 : -1;

      if (isMotionReduced) {
        if (offset === 0) {
          slide.style.transform = 'translate(-50%, -50%) scale(1)';
          slide.style.opacity = '1';
          slide.style.filter = 'none';
          slide.style.zIndex = '25';
          slide.style.visibility = 'visible';
        } else {
          slide.style.transform = 'translate(-50%, -50%) scale(0.9)';
          slide.style.opacity = '0';
          slide.style.zIndex = '0';
          slide.style.visibility = 'hidden';
        }
        return;
      }

      if (absOffset === 0) {
        slide.style.transform = 'translate(-50%, -50%) translate3d(0, 0, 0) rotateY(0deg) scale(1)';
        slide.style.opacity = '1';
        slide.style.filter = 'none';
        slide.style.zIndex = '25';
        slide.style.visibility = 'visible';
      } else if (absOffset <= 3) {
        const tx = sign * (xStep * Math.pow(absOffset, 0.88));
        const tz = -zStep * absOffset;
        // دوران نحو المركز (Inward): إذا كانت الشريحة على اليسار (tx < 0) تدور بزاوية موجبة نحو اليمين
        // وإذا كانت على اليمين (tx > 0) تدور بزاوية سالبة نحو اليسار
        const ry = tx < 0 ? rotAngle : (tx > 0 ? -rotAngle : 0);
        const scale = Math.max(0.66, 1 - absOffset * 0.12);
        const opacity = Math.max(0.2, 1 - absOffset * 0.26);
        const blur = Math.min(absOffset * 1.5, 4);

        slide.style.transform = `translate(-50%, -50%) translate3d(${tx.toFixed(1)}px, 0, ${tz.toFixed(1)}px) rotateY(${ry.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        slide.style.opacity = opacity.toFixed(2);
        slide.style.filter = `brightness(${(0.78 - absOffset * 0.1).toFixed(2)}) blur(${blur.toFixed(1)}px)`;
        slide.style.zIndex = String(20 - Math.min(absOffset, 15));
        slide.style.visibility = 'visible';
      } else {
        const tx = sign * (xStep * 3.6);
        const tz = -zStep * 3.6;
        const ry = tx < 0 ? rotAngle : (tx > 0 ? -rotAngle : 0);
        slide.style.transform = `translate(-50%, -50%) translate3d(${tx.toFixed(1)}px, 0, ${tz.toFixed(1)}px) rotateY(${ry.toFixed(1)}deg) scale(0.6)`;
        slide.style.opacity = '0';
        slide.style.filter = 'brightness(0.3) blur(6px)';
        slide.style.zIndex = '0';
        slide.style.visibility = 'hidden';
      }
    });

    if (currentIdxEl) currentIdxEl.textContent = String(currentIndex + 1);
    if (totalCountEl) totalCountEl.textContent = String(items.length);

    const current = items[currentIndex] || {};
    if (slideTitleEl) slideTitleEl.textContent = current.title || '';
    if (slideDescEl) slideDescEl.textContent = current.caption || current.desc || '';

    // إدارة عناصر التنقل عندما تكون هناك صورة واحدة فقط
    const hasMultiple = items.length > 1;
    if (prevBtn) {
      prevBtn.style.display = hasMultiple ? '' : 'none';
      prevBtn.disabled = !hasMultiple;
    }
    if (nextBtn) {
      nextBtn.style.display = hasMultiple ? '' : 'none';
      nextBtn.disabled = !hasMultiple;
    }
    if (thumbsWrapEl) {
      thumbsWrapEl.style.display = hasMultiple ? '' : 'none';
    }

    // تحديث شريط المصغرات وتمريره بأمان دون تحريك النافذة الرئيسية
    if (thumbsEl && hasMultiple) {
      const thumbs = thumbsEl.querySelectorAll('.gallery-thumb');
      thumbs.forEach((th, idx) => {
        const isAct = idx === currentIndex;
        th.classList.toggle('active', isAct);
        th.setAttribute('aria-selected', isAct ? 'true' : 'false');
        if (isAct && thumbsWrapEl) {
          const thLeft = th.offsetLeft;
          const thWidth = th.offsetWidth;
          const wWidth = thumbsWrapEl.offsetWidth;
          thumbsWrapEl.scrollTo({
            left: thLeft - (wWidth / 2) + (thWidth / 2),
            behavior: 'smooth'
          });
        }
      });
    }
  }

  function goTo(index) {
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    update3DStage();
  }

  function next() {
    if (items.length <= 1) return;
    goTo(currentIndex + 1);
  }

  function prev() {
    if (items.length <= 1) return;
    goTo(currentIndex - 1);
  }

  function normalizeItems(rawItems) {
    if (!Array.isArray(rawItems)) return [];
    return rawItems.map((item, idx) => {
      if (typeof item === 'string') {
        return {
          src: item.trim(),
          title: `صورة ${idx + 1}`,
          caption: '',
          badge: ''
        };
      }
      if (item && typeof item === 'object') {
        return {
          src: item.src || item.url || item.image || '',
          title: item.title || `صورة ${idx + 1}`,
          caption: item.caption || item.desc || item.description || '',
          badge: item.badge || ''
        };
      }
      return null;
    }).filter(it => it && Boolean(it.src));
  }

  function open(galleryItems, initialIndex = 0, projectTitle = '') {
    const validItems = normalizeItems(galleryItems);
    if (!validItems.length) return;

    items = validItems;
    currentIndex = Math.max(0, Math.min(initialIndex, items.length - 1));
    previousActiveElement = document.activeElement;

    if (titleEl) {
      titleEl.textContent = projectTitle || 'استعراض صور المشروع';
    }

    // بناء الشرائح في الـ DOM
    if (trackEl) {
      trackEl.classList.add('no-transition');
      trackEl.innerHTML = '';

      items.forEach((item, idx) => {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        slide.id = `gallerySlide_${idx}`;
        slide.dataset.index = String(idx);
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'شريحة');
        slide.setAttribute('aria-label', item.title || `صورة ${idx + 1}`);

        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.tabIndex = -1;

        if (item.badge) {
          const badge = document.createElement('span');
          badge.className = 'gallery-card-badge mono';
          badge.textContent = item.badge;
          card.appendChild(badge);
        }

        const imgWrap = document.createElement('div');
        imgWrap.className = 'gallery-card-img-wrap';

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.title || '';
        img.loading = idx === currentIndex ? 'eager' : 'lazy';

        imgWrap.appendChild(img);
        card.appendChild(imgWrap);
        slide.appendChild(card);
        trackEl.appendChild(slide);

        // النقر على الشريحة الجانبية ينقل التركيز إليها
        card.addEventListener('click', (e) => {
          if (pointerMoved) return;
          if (idx !== currentIndex) {
            e.stopPropagation();
            goTo(idx);
          }
        });
      });
    }

    // بناء شريط المصغرات
    if (thumbsEl) {
      thumbsEl.innerHTML = '';
      if (items.length > 1) {
        items.forEach((item, idx) => {
          const thumb = document.createElement('button');
          thumb.type = 'button';
          thumb.className = 'gallery-thumb';
          thumb.dataset.thumbIndex = String(idx);
          thumb.setAttribute('role', 'tab');
          thumb.setAttribute('aria-controls', `gallerySlide_${idx}`);
          thumb.setAttribute('aria-label', `عرض ${item.title || ('صورة ' + (idx + 1))}`);

          const tImg = document.createElement('img');
          tImg.src = item.src;
          tImg.alt = '';
          tImg.loading = 'lazy';

          thumb.appendChild(tImg);
          thumb.addEventListener('click', () => goTo(idx));
          thumbsEl.appendChild(thumb);
        });
      }
    }

    // قفل تمرير الصفحة ومنع قفزة شريط التمرير
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingInlineEnd = `${scrollbarWidth}px`;
    }
    document.body.classList.add('gallery-open');

    // تعيين inert لعناصر الخلفية لضمان إمكانية الوصول
    getBackgroundElements().forEach(el => el.setAttribute('inert', ''));

    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
    isOpen = true;

    update3DStage();

    // إزالة تعطيل الحركات بعد التموضع الأولي
    if (trackEl) {
      void trackEl.offsetHeight;
      requestAnimationFrame(() => {
        trackEl.classList.remove('no-transition');
      });
    }

    // توجيه التركيز لداخل المودال
    setTimeout(() => {
      if (stageEl) stageEl.focus();
      else if (closeBtn) closeBtn.focus();
    }, 50);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-open');
    document.body.style.paddingInlineEnd = '';

    // إزالة inert واسترجاع التركيز
    getBackgroundElements().forEach(el => el.removeAttribute('inert'));

    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  }

  // أحداث التنقل والإغلاق
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // إغلاق عند النقر على الخلفية المعتمة
  modalEl.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-gallery-close') || e.target === modalEl) {
      close();
    }
  });

  // التنقل عبر لوحة المفاتيح واحتجاز التركيز (Focus Trap)
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      // في RTL السهم الأيمن يرجع للسابق، وفي LTR يتقدم للتالي
      if (isRTL()) prev();
      else next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      // في RTL السهم الأيسر يتقدم للتالي، وفي LTR يرجع للسابق
      if (isRTL()) next();
      else prev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(items.length - 1);
    } else if (e.key === 'Tab') {
      // احتجاز التركيز A11y Focus Trap
      const focusables = Array.from(modalEl.querySelectorAll(
        'button:not([disabled]), [tabindex="0"]:not([disabled]), a[href]'
      )).filter(el => {
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
      });

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!focusables.includes(document.activeElement)) {
        e.preventDefault();
        first.focus();
        return;
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // دعم السحب والإيماءات الموحدة عبر Pointer Events دون تكرار أحداث اللمس
  if (stageEl) {
    let pointerStartX = 0;
    let pointerStartY = 0;
    let isPointerDown = false;

    stageEl.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      isPointerDown = true;
      pointerMoved = false;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      try {
        stageEl.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    stageEl.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;
      const dx = e.clientX - pointerStartX;
      const dy = e.clientY - pointerStartY;
      if (Math.abs(dx) > 12 || Math.abs(dy) > 12) {
        pointerMoved = true;
      }
    });

    const onPointerEnd = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      try {
        if (stageEl.hasPointerCapture(e.pointerId)) {
          stageEl.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}

      if (pointerMoved) {
        const diffX = e.clientX - pointerStartX;
        const diffY = e.clientY - pointerStartY;
        // التحقق من أن السحب كان أفقياً في الأساس
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          const rtl = isRTL();
          if (diffX < 0) {
            // السحب لليسار: في RTL يعني التالي، وفي LTR يعني التالي أيضاً
            if (rtl) next();
            else next();
          } else {
            // السحب لليمين: في RTL يعني السابق، وفي LTR يعني السابق أيضاً
            if (rtl) prev();
            else prev();
          }
        }
        setTimeout(() => { pointerMoved = false; }, 80);
      }
    };

    stageEl.addEventListener('pointerup', onPointerEnd);
    stageEl.addEventListener('pointercancel', () => {
      isPointerDown = false;
      setTimeout(() => { pointerMoved = false; }, 80);
    });
  }

  // إعادة حساب المواضع عند تغيير حجم الشاشة
  window.addEventListener('resize', () => {
    if (isOpen) update3DStage();
  }, { passive: true });

  // دالة مساعدة لاستخراج البيانات من السمات
  function parseGalleryData(raw) {
    if (!raw) return null;
    raw = raw.trim();
    try {
      return JSON.parse(raw);
    } catch (err) {
      if (raw.includes(',')) {
        return raw.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (raw.startsWith('http') || raw.includes('/') || raw.includes('.')) {
        return [raw];
      }
      return null;
    }
  }

  // تفويض الأحداث لفتح المعرض من أي زر أو عنصر في أي مشروع
  document.addEventListener('click', (e) => {
    // 1) الضغط على زر أو عنصر يحمل سمة المعرض
    const trigger = e.target.closest('.open-gallery-btn, [data-gallery], [data-gallery-images]');
    if (trigger) {
      e.preventDefault();
      const rawData = trigger.getAttribute('data-gallery') || trigger.getAttribute('data-gallery-images');
      const projectTitle = trigger.getAttribute('data-gallery-title') || '';
      const startIndex = parseInt(trigger.getAttribute('data-gallery-index') || '0', 10);
      const parsed = parseGalleryData(rawData);
      if (parsed) {
        open(parsed, isNaN(startIndex) ? 0 : startIndex, projectTitle);
      }
      return;
    }

    // 2) الضغط على وسائط المشروع التفاعلية (.gallery-clickable)
    const clickableMedia = e.target.closest('.project-media.gallery-clickable, [data-gallery-clickable]');
    if (clickableMedia) {
      const projectCard = clickableMedia.closest('.project') || clickableMedia.parentElement;
      const targetBtn = projectCard ? projectCard.querySelector('.open-gallery-btn, [data-gallery], [data-gallery-images]') : null;
      if (targetBtn) {
        e.preventDefault();
        targetBtn.click();
      }
    }
  });

  // دعم مفتاحي Enter و المسافة على العناصر التفاعلية
  document.addEventListener('keydown', (e) => {
    if (isOpen) return;
    if (e.key === 'Enter' || e.key === ' ') {
      const media = document.activeElement;
      if (media && (media.classList.contains('gallery-clickable') || media.hasAttribute('data-gallery-clickable'))) {
        e.preventDefault();
        const projectCard = media.closest('.project') || media.parentElement;
        const targetBtn = projectCard ? projectCard.querySelector('.open-gallery-btn, [data-gallery], [data-gallery-images]') : null;
        if (targetBtn) targetBtn.click();
      }
    }
  });

  // تصدير واجهة برمجية عامة ومستقلة للاستخدام في أي مشروع أو سكربت خارجي
  window.App3DGallery = {
    open,
    close,
    next,
    prev,
    goTo,
    getItems: () => [...items],
    getCurrentIndex: () => currentIndex,
    isOpen: () => isOpen
  };

  window.openGallery = (galleryItems, initialIndex, projectTitle) => {
    open(galleryItems, initialIndex, projectTitle);
  };
})();
