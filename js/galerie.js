/* Galerie portfolio. Klucz = wartość data-galeria na okładce.
   Kolejność zdjęć = kolejność w galerii (pierwsze to okładka).
   Nazwy, podpisy i autorzy: WYŁĄCZNIE z nazw plików i folderów w folderze „zdjęcia na stronę”. */
(function () {
  'use strict';

  var P = 'img/portfolio/';
  function seria(nazwa, numery) {
    return numery.map(function (n) { return P + nazwa + '-' + n + '.jpg'; });
  }

  var th = seria('tiny-house-zewnatrz', [1, 2, 3, 4])
    .concat(seria('tiny-house-wewnatrz', [1, 2, 3, 4, 5, 6]))
    .concat(seria('tiny-house-dodatkowe', [0, 2, 3, 6, 8, 9]));
  var cieply = {
    tytul: 'Ciepły Minimalizm',
    podpis: 'Realizacja 2023. Projekt powstał we współpracy z Orego Studio. Zdjęcia: Pietruszka Fotografia',
    alt: 'Ciepły Minimalizm – projekt wnętrz domu, realizacja 2023'
  };

  window.GALERIE = {
    /* ---- wnętrza prywatne ---- */
    'cieply-minimalizm-album': {
      tytul: cieply.tytul, podpis: cieply.podpis, alt: cieply.alt,
      zdjecia: ['img/okladka-cieply-minimalizm-stol.jpg'].concat(seria('cieply-minimalizm', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]))
    },
    'cieply-minimalizm': {
      tytul: cieply.tytul, podpis: cieply.podpis, alt: cieply.alt,
      zdjecia: seria('cieply-minimalizm', [10, 1, 5, 6, 7, 8, 9, 11])
    },
    'wnetrze-tiny-house': {
      tytul: 'Wnętrze Tiny House',
      podpis: 'Realizacja 2026',
      alt: 'Wnętrze Tiny House – projekt wnętrza małego domku, realizacja 2026',
      zdjecia: [P + 'wnetrze-tiny-house-okladka.jpg'].concat(seria('wnetrze-tiny-house', [11, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
    },
    'taupe-vibe': {
      tytul: 'Ciepła szarość',
      podpis: 'Realizacja 2023',
      alt: 'Ciepła szarość – projekt wnętrz, realizacja 2023',
      zdjecia: seria('taupe-vibe', [0, 1])
    },
    'nuta-koloru': {
      tytul: 'Nuta Koloru',
      podpis: 'Realizacja 2023',
      alt: 'Nuta Koloru – projekt wnętrz, realizacja 2023',
      zdjecia: seria('nuta-koloru', [2, 3, 4, 5, 6, 7])
    },
    'mokka-mood': {
      tytul: 'Kawowy nastrój',
      podpis: 'Projekt 2022',
      alt: 'Kawowy nastrój – projekt wnętrz, wizualizacja',
      zdjecia: seria('mokka-mood', [1, 2, 3, 4, 5])
    },
    'modern-classic': {
      tytul: 'Nowoczesna klasyka',
      podpis: 'Strefa dzienna. Projekt 2020',
      alt: 'Nowoczesna klasyka – projekt strefy dziennej, wizualizacja',
      zdjecia: seria('modern-classic', [2, 1, 3])
    },

    /* ---- aktualnie w trakcie realizacji ---- */
    'mieszkanie-w-kamienicy': {
      tytul: 'Mieszkanie w kamienicy',
      podpis: 'W trakcie realizacji. Projekt 2026',
      alt: 'Mieszkanie w kamienicy – projekt wnętrz, wizualizacja',
      zdjecia: seria('mieszkanie-w-kamienicy', [3, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    },
    'dom-nad-morzem': {
      tytul: 'Dom nad morzem',
      podpis: 'W trakcie realizacji. Projekt 2026',
      alt: 'Dom nad morzem – projekt wnętrz, wizualizacja',
      zdjecia: seria('dom-nad-morzem', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
    },

    /* ---- małe domki (Tiny House) ---- */
    'tiny-house-album': {
      tytul: 'Tiny House',
      podpis: 'Realizacja 2026',
      alt: 'Tiny House – mały domek, realizacja 2026',
      zdjecia: ['img/okladka-tiny-house.jpg'].concat(th)
    },
    'tiny-house-pion': {
      tytul: 'Tiny House',
      podpis: 'Realizacja 2026',
      alt: 'Tiny House – mały domek, realizacja 2026',
      zdjecia: seria('tiny-house-zewnatrz', [4, 1, 2, 3])
        .concat(seria('tiny-house-wewnatrz', [1, 2, 3, 4, 5, 6]))
        .concat(seria('tiny-house-dodatkowe', [0, 2, 3, 6, 8, 9]))
    },
    'domek-na-modulach': {
      tytul: 'Domek na modułach',
      podpis: 'Projekt 2025. Wizualizacje we współpracy z arch. Piotrem Pawlakiem',
      alt: 'Domek na modułach – projekt Tiny House, wizualizacja',
      zdjecia: seria('domek-na-modulach', [1, 2, 3, 4, 5, 6])
    }
  };
})();
