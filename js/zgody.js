/* Zgody na cookies: Google Analytics 4 + Piksel Meta ładowane dopiero po akceptacji */
(function () {
  var GA_ID = 'G-1ST4D3NLBM';
  var PIXEL_ID = '1513718716664759';
  var KEY = 'meetrowka-zgoda';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });

  function czytaj() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function zapisz(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var zaladowane = false;
  function uruchom() {
    if (zaladowane) return;
    zaladowane = true;
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
    !function (f, b, e, v, n, t, x) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; x = b.getElementsByTagName(e)[0]; x.parentNode.insertBefore(t, x); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  function baner() {
    if (document.getElementById('zgoda')) return;
    var d = document.createElement('div');
    d.id = 'zgoda';
    d.className = 'zgoda';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Zgoda na pliki cookies');
    d.innerHTML = '<p class="zgoda__txt">Używamy plików cookies, żeby sprawdzać, ile osób odwiedza stronę i skąd do nas trafia (Google Analytics, Piksel Meta). Szczegóły w <a href="polityka-prywatnosci.html">polityce prywatności</a>.</p>' +
      '<div class="zgoda__btns"><button type="button" class="btn btn--line zgoda__nie">Tylko niezbędne</button><button type="button" class="btn zgoda__tak">Akceptuję</button></div>';
    document.body.appendChild(d);
    d.querySelector('.zgoda__tak').addEventListener('click', function () { zapisz('tak'); d.remove(); uruchom(); });
    d.querySelector('.zgoda__nie').addEventListener('click', function () { zapisz('nie'); d.remove(); });
  }

  if (czytaj() === 'tak') uruchom();

  document.addEventListener('DOMContentLoaded', function () {
    if (!czytaj()) baner();
    document.querySelectorAll('[data-cookies]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); baner(); });
    });
  });

  // Kliknięcie „Umów termin bezpłatnej kawy” = zdarzenie w GA4 i Pikselu (tylko po zgodzie)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="calendar.app.google"]');
    if (!a || !zaladowane) return;
    var miejsce = a.closest('footer') ? 'stopka' : 'strona';
    gtag('event', 'umow_kawe', { strona: location.pathname, miejsce: miejsce, transport_type: 'beacon' });
    if (window.fbq) fbq('track', 'Schedule');
  });
})();
