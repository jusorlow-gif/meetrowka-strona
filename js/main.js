(function () {
  'use strict';

  // Tryb animacji ustawia skrypt w <head>: .anim = pełne efekty, .calm = „ogranicz ruch” w systemie
  // (tylko przenikanie), brak obu = bez animacji (?animacje=0).
  var root = document.documentElement;
  var anim = root.classList.contains('anim');
  var ruch = anim || root.classList.contains('calm');

  // Polska typografia: krótkie słowa (i, w, z, a, o, u, do, na…) nie zostają same na końcu linii
  var sierotki = function (el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return /^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var re = /(^|[\s („"])([aiouwzAIOUWZ]|[Dd]o|[Nn]a|[Oo]d|[Pp]o|[Zz]a|[Zz]e|[Ww]e|[Żż]e|[Kk]u|[Cc]o|[Bb]y) (?=\S)/g;
    for (var n = walker.nextNode(); n; n = walker.nextNode()) {
      var t = n.nodeValue;
      if (t.indexOf(' ') < 0) continue;
      var u = t.replace(re, '$1$2 ').replace(re, '$1$2 ');
      if (u !== t) n.nodeValue = u;
    }
  };
  sierotki(document.body);

  // W tytułach i podtytułach ostatnia linia nigdy nie ma jednego słowa (dwa ostatnie słowa razem)
  document.querySelectorAll('h1, h2, h3, h4, .subtitle, .accent, .answer, .big, .lead').forEach(function (el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), ost = null;
    for (var n = w.nextNode(); n; n = w.nextNode()) { if (/\S/.test(n.nodeValue)) ost = n; }
    if (!ost) return;
    var t = ost.nodeValue.replace(/\s+$/, '');
    var i = t.lastIndexOf(' ');
    if (i > 0 && t.length - i < 16) ost.nodeValue = t.slice(0, i) + ' ' + t.slice(i + 1) + ost.nodeValue.slice(t.length);
  });

  // Menu na telefonie
  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');
  if (header && burger) {
    var setOpen = function (open) {
      header.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    };
    burger.addEventListener('click', function () {
      setOpen(!header.classList.contains('is-open'));
    });
    header.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    // Telefon i tablet (menu z hamburgerem): przy przewijaniu w dół pasek się chowa,
    // przy przewijaniu w górę od razu się wysuwa; przy otwartym menu i na samej górze strony zawsze widoczny.
    var waski = window.matchMedia('(max-width: 1279px)');
    var ostatni = window.pageYOffset;
    var naScroll = function () {
      var y = Math.max(0, window.pageYOffset);
      var roznica = y - ostatni;
      if (!waski.matches || header.classList.contains('is-open') || y < header.offsetHeight) {
        header.classList.remove('is-hidden');
      } else if (roznica > 6) {
        header.classList.add('is-hidden');
      } else if (roznica < -6) {
        header.classList.remove('is-hidden');
      }
      header.classList.toggle('is-stuck', waski.matches && y > 0);
      if (Math.abs(roznica) > 6 || y < header.offsetHeight) ostatni = y;
    };
    window.addEventListener('scroll', naScroll, { passive: true });
    naScroll();
  }

  // Baner główny: zdjęcia zmieniają się same co 2 s (przenikanie + Ken Burns w CSS), kropki do przełączania
  var slider = document.querySelector('[data-slider]');
  if (slider) {
    var slides = slider.querySelectorAll('.slide');
    var dots = slider.querySelectorAll('.dot');
    var current = 0;
    var show = function (i) {
      if (i === current) return;
      var poprzedni = current;
      current = i;
      slides.forEach(function (s, n) {
        s.classList.toggle('is-prev', n === poprzedni);
        s.classList.toggle('is-active', n === i);
      });
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === i);
        d.setAttribute('aria-pressed', n === i ? 'true' : 'false');
      });
    };
    var timer = null;
    var start = function () {
      clearInterval(timer);
      if (ruch) timer = setInterval(function () { show((current + 1) % slides.length); }, 2000);
    };
    dots.forEach(function (d, n) {
      d.addEventListener('click', function () { show(n); start(); });
    });
    start();
  }

  // Zespół: „Czytaj więcej” rozwija pełny opis
  document.querySelectorAll('.member__toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var karta = b.closest('.member');
      var open = !karta.classList.contains('is-open');
      karta.classList.toggle('is-open', open);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      b.textContent = open ? 'Zwiń' : 'Czytaj więcej';
      karta.querySelector('.member__more').setAttribute('aria-hidden', open ? 'false' : 'true');
    });
  });

  // Opinie: strzałki przewijają 5 opinii w kółko
  var reviews = document.querySelector('[data-reviews]');
  if (reviews) {
    var prev = document.querySelector('[data-reviews-prev]');
    var next = document.querySelector('[data-reviews-next]');
    if (next) next.addEventListener('click', function () {
      reviews.appendChild(reviews.firstElementChild);
    });
    if (prev) prev.addEventListener('click', function () {
      reviews.insertBefore(reviews.lastElementChild, reviews.firstElementChild);
    });
  }

  // Portfolio: kliknięcie okładki otwiera galerię projektu (dane w galerie.js)
  var galerie = window.GALERIE || {};
  var okladki = document.querySelectorAll('[data-galeria]');
  if (okladki.length) {
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galeria zdjęć projektu');
    lb.innerHTML =
      '<div class="lb__top"><div class="lb__titles"><p class="lb__title"></p><p class="lb__cap"></p></div>' +
      '<span class="lb__count"></span><a class="lb__more" href="#"></a>' +
      '<button class="lb__btn lb__zoom" type="button" aria-label="Powiększ zdjęcie" aria-pressed="false">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M16.5 16.5 21 21M11 8v6M8 11h6"></path></svg></button>' +
      '<button class="lb__btn lb__close" type="button" aria-label="Zamknij galerię">✕</button></div>' +
      '<div class="lb__stage"><img class="lb__img" alt="">' +
      '<button class="lb__btn lb__prev" type="button" aria-label="Poprzednie zdjęcie">‹</button>' +
      '<button class="lb__btn lb__next" type="button" aria-label="Następne zdjęcie">›</button></div>' +
      '<div class="lb__thumbs"></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('.lb__img');
    var lbTitle = lb.querySelector('.lb__title');
    var lbCap = lb.querySelector('.lb__cap');
    var lbCount = lb.querySelector('.lb__count');
    var lbMore = lb.querySelector('.lb__more');
    var lbZoom = lb.querySelector('.lb__zoom');
    var lbClose = lb.querySelector('.lb__close');
    var lbThumbs = lb.querySelector('.lb__thumbs');
    var album = null, nr = 0, powrot = null, zoom = false;
    // zdjęcia w galerii w formacie WebP, jeśli przeglądarka go obsługuje (pliki .jpg zostają jako zapas)
    var ext = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0 ? '.webp' : '.jpg';
    var plik = function (src, dop) { return src.replace(/\.jpg$/, (dop || '') + ext); };

    // powiększenie: kliknięcie zdjęcia albo lupy; kursor/palec przesuwa powiększony fragment
    var przesun = function (e) {
      var r = lbImg.getBoundingClientRect();
      var x = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100));
      var y = Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100));
      lbImg.style.transformOrigin = x + '% ' + y + '%';
    };
    var ustawZoom = function (on, e) {
      zoom = on;
      lb.classList.toggle('is-zoom', on);
      lbZoom.setAttribute('aria-pressed', on ? 'true' : 'false');
      lbZoom.setAttribute('aria-label', on ? 'Pomniejsz zdjęcie' : 'Powiększ zdjęcie');
      if (on && e && e.clientX !== undefined) przesun(e);
      if (!on) lbImg.style.transformOrigin = '';
    };
    lbImg.addEventListener('click', function (e) { ustawZoom(!zoom, e); });
    lbImg.addEventListener('pointermove', function (e) { if (zoom) przesun(e); });
    lbZoom.addEventListener('click', function () { ustawZoom(!zoom); });

    // kier: 1 = następne (wlatuje z prawej), -1 = poprzednie (z lewej), 0 = otwarcie galerii
    var pokaz = function (i, kier) {
      var n = album.zdjecia.length;
      nr = (i + n) % n;
      ustawZoom(false);
      lbImg.classList.remove('is-ready');
      lbImg.style.setProperty('--dx', (kier || 0) * 60 + 'px');
      lbImg.style.setProperty('--s', kier ? '1' : '0.96');
      lbImg.removeAttribute('src');
      lbImg.src = plik(album.zdjecia[nr]);
      lbImg.alt = album.alt + (n > 1 ? ' (zdjęcie ' + (nr + 1) + ' z ' + n + ')' : '');
      lbCount.textContent = n > 1 ? (nr + 1) + ' / ' + n : '';
      Array.prototype.forEach.call(lbThumbs.children, function (b, k) {
        b.classList.toggle('is-active', k === nr);
        if (k === nr && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center' });
      });
      if (n > 1) { new Image().src = plik(album.zdjecia[(nr + 1) % n]); }
    };
    lbImg.addEventListener('load', function () { lbImg.classList.add('is-ready'); });

    var otworz = function (klucz, el) {
      album = galerie[klucz];
      if (!album) return false;
      powrot = el;
      lbTitle.textContent = album.tytul;
      lbCap.textContent = album.podpis;
      sierotki(lbCap);
      var wiecej = el.getAttribute('data-wiecej');
      lbMore.hidden = !wiecej;
      if (wiecej) { lbMore.href = wiecej; lbMore.textContent = 'Zobacz więcej projektów →'; }
      lb.classList.toggle('lb--one', album.zdjecia.length < 2);
      // miniatury (pliki z końcówką -m.jpg) wlatują jedna po drugiej
      lbThumbs.innerHTML = '';
      album.zdjecia.forEach(function (src, k) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'lb__thumb';
        b.style.setProperty('--i', k);
        b.setAttribute('aria-label', 'Zdjęcie ' + (k + 1));
        var im = document.createElement('img');
        im.src = plik(src, '-m');
        im.alt = '';
        b.appendChild(im);
        b.addEventListener('click', function () { pokaz(k, k > nr ? 1 : -1); });
        lbThumbs.appendChild(b);
      });
      lb.classList.add('is-open');
      root.style.overflow = 'hidden';
      pokaz(0, 0);
      lbClose.focus();
      return true;
    };
    var zamknij = function () {
      lb.classList.remove('is-open');
      ustawZoom(false);
      root.style.overflow = '';
      lbImg.removeAttribute('src');
      if (powrot) powrot.focus();
    };

    okladki.forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (otworz(el.getAttribute('data-galeria'), el)) e.preventDefault();
      });
    });
    lbClose.addEventListener('click', zamknij);
    lbMore.addEventListener('click', function () { zamknij(); });
    lb.querySelector('.lb__prev').addEventListener('click', function () { pokaz(nr - 1, -1); });
    lb.querySelector('.lb__next').addEventListener('click', function () { pokaz(nr + 1, 1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb__stage')) zamknij();
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') { if (zoom) ustawZoom(false); else zamknij(); }
      else if (e.key === 'ArrowLeft') pokaz(nr - 1, -1);
      else if (e.key === 'ArrowRight') pokaz(nr + 1, 1);
      else if (e.key === '+' || e.key === '=') ustawZoom(true);
      else if (e.key === '-') ustawZoom(false);
      else if (e.key === 'Tab') {
        // fokus zostaje w galerii
        var el = Array.prototype.filter.call(lb.querySelectorAll('button, a[href]'), function (b) { return b.offsetParent !== null && !b.hidden; });
        if (!el.length) return;
        var first = el[0], last = el[el.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // przesunięcie palcem na telefonie (gdy zdjęcie nie jest powiększone)
    var startX = null;
    lb.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (startX === null || zoom || !album || album.zdjecia.length < 2) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) pokaz(nr + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      startX = null;
    });
  }

  // Zdjęcia (z klasą .reveal w HTML) płynnie pojawiają się przy przewijaniu; teksty stoją w miejscu.
  // Okładki i zdjęcia w rzędach (portfolio, kroki, zespół) pojawiają się po kolei.
  if (ruch && 'IntersectionObserver' in window) {
    document.querySelectorAll('.pf-stagger, .pf-pair, .pf-home, .steps, .team').forEach(function (rzad) {
      rzad.querySelectorAll('.reveal').forEach(function (el, k) {
        el.style.setProperty('--d', (k % 4) * 0.12 + 's');
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }
})();
