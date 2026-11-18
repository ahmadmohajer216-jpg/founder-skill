/* عطار بلد — storefront interactions: mobile menu, history timeline, language toggle. */
(function () {
  "use strict";

  /* 1 — mobile menu ------------------------------------------------------ */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("mainnav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "بستن منو" : "منو");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 2 — history timeline ------------------------------------------------- */
  var captions = {
    persepolis: "کتیبه‌های باروی تخت جمشید، گیاهان دارویی و سهم آن‌ها در انبارهای شاهی را ثبت کرده‌اند.",
    ecbatana: "هگمتانه، گذرگاه طب میان‌رودان و فلات ایران بود؛ دارو و ادویه از همین راه می‌گذشت.",
    sasanian: "دانشگاه گندیشاپور، طب ایرانی، هندی و یونانی را زیر یک سقف گرد آورد.",
    islamic: "ابن‌سینا در قانون، داروشناسی را به دستگاهی منظم تبدیل کرد و قرن‌ها مرجع ماند.",
    safavid: "عطاری‌های بازار صفوی، دارو، ادویه و روغن را کنار هم می‌فروختند.",
    modern: "دانشکده داروسازی تهران، طب سنتی ایران را به پژوهش دانشگاهی رساند."
  };

  var eras = document.querySelectorAll(".era");
  var caption = document.getElementById("eraCaption");

  Array.prototype.forEach.call(eras, function (era) {
    era.addEventListener("click", function () {
      Array.prototype.forEach.call(eras, function (other) {
        other.classList.remove("is-active");
        other.setAttribute("aria-selected", "false");
      });
      era.classList.add("is-active");
      era.setAttribute("aria-selected", "true");
      if (caption && captions[era.dataset.era]) {
        caption.textContent = captions[era.dataset.era];
      }
    });
  });

  /* 3 — language toggle (interface labels only) -------------------------- */
  var langButtons = document.querySelectorAll(".lang__btn");
  var search = document.getElementById("q");

  Array.prototype.forEach.call(langButtons, function (button) {
    button.addEventListener("click", function () {
      var lang = button.dataset.lang;

      Array.prototype.forEach.call(langButtons, function (other) {
        var on = other === button;
        other.classList.toggle("is-on", on);
        other.setAttribute("aria-pressed", String(on));
      });

      var i, el;
      var labelled = document.querySelectorAll("[data-fa][data-en]");
      for (i = 0; i < labelled.length; i++) {
        el = labelled[i];
        el.textContent = lang === "en" ? el.dataset.en : el.dataset.fa;
      }

      if (search) {
        search.placeholder = lang === "en" ? search.dataset.phEn : search.dataset.phFa;
      }
    });
  });
})();
