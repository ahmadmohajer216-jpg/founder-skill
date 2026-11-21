/* عطار بلد — پوستهٔ سایت: هدر، منوی موبایل، سبد کشویی، فوتر (فاز ۳) */
(function () {
  "use strict";

  var SPRITE =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
    '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.4"/><path d="m16 16 4 4"/></symbol>' +
    '<symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8.2" r="3.6"/><path d="M5.2 20c0-3.5 3-5.6 6.8-5.6s6.8 2.1 6.8 5.6"/></symbol>' +
    '<symbol id="i-cart" viewBox="0 0 24 24"><path d="M3.6 4.6h2.2l2.3 9.6h9.5l2.1-7.2H6.6"/><circle cx="9.6" cy="18.6" r="1.4"/><circle cx="17" cy="18.6" r="1.4"/></symbol>' +
    '<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20.2S3.8 15.4 3.8 9.6A4.4 4.4 0 0 1 12 7.1a4.4 4.4 0 0 1 8.2 2.5c0 5.8-8.2 10.6-8.2 10.6z"/></symbol>' +
    '<symbol id="i-home" viewBox="0 0 24 24"><path d="M4 10.4 12 4l8 6.4V20h-5.6v-5.4h-4.8V20H4z"/></symbol>' +
    '<symbol id="i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="6.6" height="6.6" rx="1.4"/><rect x="13.4" y="4" width="6.6" height="6.6" rx="1.4"/><rect x="4" y="13.4" width="6.6" height="6.6" rx="1.4"/><rect x="13.4" y="13.4" width="6.6" height="6.6" rx="1.4"/></symbol>' +
    '<symbol id="i-leaf" viewBox="0 0 24 24"><path d="M20 4c.4 9.4-5.2 13.4-11 13.4H4.6C4.2 8.9 9.8 4 20 4z"/><path d="M4.8 19.6c2.8-4.8 6-7.8 10.4-10"/></symbol>' +
    '<symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.6 4.4 4.4L19 7.4"/></symbol>' +
    '<symbol id="i-x" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol>' +
    '<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>' +
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M19.5 12H5"/><path d="m11 6-6 6 6 6"/></symbol>' +
    '<symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5.4c0-.9.7-1.6 1.6-1.6H11v15.4H5.6c-.9 0-1.6.7-1.6 1.6z"/><path d="M20 5.4c0-.9-.7-1.6-1.6-1.6H13v15.4h5.4c.9 0 1.6.7 1.6 1.6z"/></symbol>' +
    '<symbol id="i-jar" viewBox="0 0 24 24"><path d="M10 3.4h4v1.9l1.6 1.6V20H8.4V6.9L10 5.3z"/><path d="M8.6 12.4h6.8"/></symbol>' +
    '<symbol id="i-mortar" viewBox="0 0 24 24"><path d="M4 10.4h16l-1.8 8.2H5.8z"/><path d="M12 10.4V4.6"/><path d="M9.2 4.6h5.6"/></symbol>' +
    '<symbol id="i-cup" viewBox="0 0 24 24"><path d="M5.4 8.4h11v4.4a5.5 5.5 0 0 1-5.5 5.5 5.5 5.5 0 0 1-5.5-5.5z"/><path d="M16.4 9.6h1.8a2.2 2.2 0 0 1 0 4.4h-1.8"/><path d="M4 20.6h14"/></symbol>' +
    '<symbol id="i-star" viewBox="0 0 24 24"><path d="m12 3.6 2.4 5.4 5.7.6-4.3 4 1.2 5.7L12 16.4l-5 2.9 1.2-5.7-4.3-4 5.7-.6z"/></symbol>' +
    '<symbol id="i-flask" viewBox="0 0 24 24"><path d="M9.4 3.4h5.2v3.9l4 10.1a2 2 0 0 1-1.9 2.7H7.3a2 2 0 0 1-1.9-2.7l4-10.1z"/><path d="M9.4 7.3h5.2"/></symbol>' +
    '<symbol id="i-instagram" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.1" cy="6.9" r="1"/></symbol>' +
    '<symbol id="i-card" viewBox="0 0 24 24"><rect x="3" y="5.6" width="18" height="12.8" rx="2.4"/><path d="M3 10.2h18"/><path d="M6.6 14.6h3.2"/></symbol>' +
    '<symbol id="i-truck" viewBox="0 0 24 24"><path d="M3 6.6h10.4v9.6H3z"/><path d="M13.4 9.6h3.9l3.1 3.2v3.4h-7z"/><circle cx="7" cy="18" r="1.7"/><circle cx="17" cy="18" r="1.7"/></symbol>' +
    '<symbol id="i-chat" viewBox="0 0 24 24"><path d="M3.8 5.6h16.4v10.6h-9.9L3.8 20z"/><path d="M8 10.4h8"/></symbol>' +
    '<symbol id="i-sparkle" viewBox="0 0 24 24"><path d="m12 3.4 1.9 5.4 5.4 1.9-5.4 1.9L12 18l-1.9-5.4L4.7 10.7l5.4-1.9z"/><path d="M18.4 16.6l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z"/></symbol>' +
    '<symbol id="i-cube" viewBox="0 0 24 24"><path d="m12 3 8 4.4v9.2L12 21l-8-4.4V7.4z"/><path d="m4 7.4 8 4.4 8-4.4"/><path d="M12 11.8V21"/></symbol>' +
    '<symbol id="i-garden" viewBox="0 0 24 24"><path d="M12 20.6V12"/><path d="M12 13.4c-4.2 0-6.4-2.6-6.4-6.4 4.2 0 6.4 2.6 6.4 6.4z"/><path d="M12 13.4c4.2 0 6.4-2.6 6.4-6.4-4.2 0-6.4 2.6-6.4 6.4z"/><path d="M7 20.6h10"/></symbol>' +
    '<symbol id="i-article" viewBox="0 0 24 24"><path d="M6 3.6h9.2L19 7.4v13H6z"/><path d="M15 3.6v4h4"/><path d="M9 12h7M9 15.4h7"/></symbol>' +
    '<symbol id="i-expert" viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.4"/><path d="M5.4 20.4c0-3.5 2.9-5.6 6.6-5.6s6.6 2.1 6.6 5.6"/><path d="M18.6 4.2v3M17.1 5.7h3"/></symbol>' +
    '<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s6.4-6.1 6.4-11a6.4 6.4 0 1 0-12.8 0C5.6 14.9 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/></symbol>' +
    '<symbol id="i-phone" viewBox="0 0 24 24"><path d="M6.4 3.8h3l1.4 3.6-2 1.4a11 11 0 0 0 5.4 5.4l1.4-2 3.6 1.4v3a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 4.4 6a2 2 0 0 1 2-2.2z"/></symbol>' +
    '<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3.4" y="5.6" width="17.2" height="12.8" rx="2"/><path d="m4.4 7.2 7.6 5.4 7.6-5.4"/></symbol>' +
    '<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7.6V12l3 2"/></symbol>' +
    '<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3.4 19 6v6c0 4.4-3 7.2-7 8.6-4-1.4-7-4.2-7-8.6V6z"/><path d="m9 12 2.2 2.2L15.4 10"/></symbol>' +
    '<symbol id="i-box" viewBox="0 0 24 24"><path d="M4 7.6 12 4l8 3.6v8.8L12 20l-8-3.6z"/><path d="M4 7.6 12 11l8-3.4"/><path d="M12 11v9"/></symbol>' +
    '<symbol id="i-refresh" viewBox="0 0 24 24"><path d="M19.6 12a7.6 7.6 0 1 1-2.4-5.5"/><path d="M19.6 4.6V9h-4.4"/></symbol>' +
    '<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>' +
    "</svg>";

  var PAGE = document.body.getAttribute("data-page") || "";
  var NAV = [
    ["home", "خانه", "index.html"],
    ["shop", "فروشگاه", "shop.html"],
    ["medicinal", "گیاهان دارویی", "shop.html?cat=medicinal"],
    ["teas", "دمنوش‌ها", "shop.html?cat=teas"],
    ["mag", "مجله", "mag.html"],
    ["about", "درباره ما", "about.html"],
    ["contact", "تماس با ما", "contact.html"]
  ];

  function navHtml(active) {
    return NAV.map(function (item) {
      var on = item[0] === active || (item[0] === "shop" && ["shop", "product", "cart", "checkout", "order"].indexOf(active) !== -1);
      return '<a href="' + item[2] + '"' + (on ? ' class="is-active" aria-current="page"' : "") + ">" + item[1] + "</a>";
    }).join("");
  }

  function logo(size) {
    return '<a class="ab-logo" href="index.html" aria-label="عطار بلد — خانه">' +
      '<span class="ab-logo__seal" aria-hidden="true"><svg><use href="#i-leaf"/></svg></span>' +
      '<span class="ab-logo__text"><span class="ab-logo__name">عطار بلد</span>' +
      '<span class="ab-logo__sub">ATTAR BALAD · عطاری اصیل</span></span></a>';
  }

  var header =
    '<div class="ab-announce"><div class="ab-container ab-announce__inner">' +
      '<span><svg aria-hidden="true"><use href="#i-truck"/></svg> ارسال رایگان برای سفارش‌های بالای ۵۰۰٬۰۰۰ تومان</span>' +
      '<span class="ab-announce__sep" aria-hidden="true"></span>' +
      '<span><svg aria-hidden="true"><use href="#i-shield"/></svg> پرداخت امن زرین‌پال · ضمانت اصالت کالا</span>' +
    "</div></div>" +
    '<header class="ab-header ab-site-header"><div class="ab-container ab-header__inner">' +
      '<button class="ab-icon-btn ab-menu-btn" type="button" id="abMenuBtn" aria-label="منو" aria-expanded="false" aria-controls="abMobileMenu"><svg width="22" height="22"><use href="#i-menu"/></svg></button>' +
      logo() +
      '<nav class="ab-nav ab-nav--main" aria-label="منوی اصلی">' + navHtml(PAGE) + "</nav>" +
      '<form class="ab-search ab-search--form" action="shop.html" role="search">' +
        '<label class="ab-sr" for="abHeaderSearch">جست‌وجوی محصولات</label>' +
        '<input id="abHeaderSearch" type="search" name="q" placeholder="جست‌وجوی گیاه، ادویه، دمنوش…" autocomplete="off">' +
        '<button type="submit" aria-label="جست‌وجو"><svg width="19" height="19"><use href="#i-search"/></svg></button>' +
      "</form>" +
      '<div class="ab-header__actions">' +
        '<a class="ab-icon-btn" href="account.html" aria-label="حساب کاربری"><svg width="22" height="22"><use href="#i-user"/></svg></a>' +
        '<a class="ab-icon-btn" href="account.html#wishlist" aria-label="علاقه‌مندی‌ها"><svg width="22" height="22"><use href="#i-heart"/></svg><span class="ab-icon-btn__count ab-wish-count" data-wish-count hidden>۰</span></a>' +
        '<button class="ab-icon-btn" type="button" data-cart-open aria-label="سبد خرید"><svg width="22" height="22"><use href="#i-cart"/></svg><span class="ab-icon-btn__count" data-cart-count>۰</span></button>' +
      "</div>" +
    "</div></header>";

  var mobileMenu =
    '<div class="ab-mobilemenu" id="abMobileMenu" hidden>' +
      '<div class="ab-mobilemenu__head">' + logo() +
        '<button class="ab-icon-btn" type="button" data-menu-close aria-label="بستن منو"><svg width="22" height="22"><use href="#i-x"/></svg></button>' +
      "</div>" +
      '<form class="ab-search ab-search--form" action="shop.html" role="search" style="max-width:none">' +
        '<label class="ab-sr" for="abMobileSearch">جست‌وجوی محصولات</label>' +
        '<input id="abMobileSearch" type="search" name="q" placeholder="جست‌وجوی گیاه، ادویه، دمنوش…">' +
        '<button type="submit" aria-label="جست‌وجو"><svg width="19" height="19"><use href="#i-search"/></svg></button>' +
      "</form>" +
      '<nav aria-label="منوی موبایل">' + navHtml(PAGE) +
        '<a href="club.html">باشگاه مشتریان</a><a href="track.html">پیگیری سفارش</a>' +
      "</nav>" +
      '<div><p class="ab-eyebrow" style="margin-bottom:8px">دسته‌بندی‌ها</p><div class="ab-mobilemenu__cats" id="abMobileCats"></div></div>' +
    "</div>";

  var overlay = '<div class="ab-overlay" id="abOverlay" hidden></div>';

  var drawer =
    '<aside class="ab-drawer ab-cartdrawer" id="abCartDrawer" role="dialog" aria-modal="true" aria-label="سبد خرید" hidden>' +
      '<div class="ab-drawer__head"><strong style="font-family:var(--ab-font-head);font-size:17px">سبد خرید (<span data-cart-count>۰</span>)</strong>' +
        '<button class="ab-icon-btn" type="button" data-cart-close aria-label="بستن سبد"><svg width="20" height="20"><use href="#i-x"/></svg></button></div>' +
      '<div class="ab-drawer__body ab-cartdrawer__body" id="abDrawerBody"></div>' +
      '<div class="ab-drawer__foot" id="abDrawerFoot"></div>' +
    "</aside>";

  var bottomnav =
    '<nav class="ab-bottomnav ab-bottomnav--fixed" aria-label="ناوبری پایین">' +
      '<a href="index.html"' + (PAGE === "home" ? ' class="is-active"' : "") + '><svg><use href="#i-home"/></svg>خانه</a>' +
      '<a href="shop.html"' + (PAGE === "shop" ? ' class="is-active"' : "") + '><svg><use href="#i-grid"/></svg>فروشگاه</a>' +
      '<a href="shop.html?cat=medicinal"><svg><use href="#i-leaf"/></svg>گیاهان</a>' +
      '<a href="account.html#wishlist"><svg><use href="#i-heart"/></svg>علاقه‌مندی</a>' +
      '<a href="account.html"' + (PAGE === "account" ? ' class="is-active"' : "") + '><svg><use href="#i-user"/></svg>حساب</a>' +
    "</nav>";

  var footer =
    '<footer class="ab-footer"><div class="ab-container">' +
      '<div class="ab-footer__grid">' +
        '<div class="ab-footer__brand">' +
          '<span class="ab-logo__text"><span class="ab-logo__name">عطار بلد</span><span class="ab-logo__sub">ATTAR BALAD</span></span>' +
          '<p>طبیعت در خدمت سلامتی. گیاهان خشک، ادویه و عرقیات اصیل ایرانی، با تصویر و منبع تأییدشده.</p>' +
          '<a class="ab-row ab-sm" href="#" aria-label="اینستاگرام عطار بلد"><svg width="18" height="18"><use href="#i-instagram"/></svg> @attarbalad</a>' +
        "</div>" +
        '<div><h3>دسترسی سریع</h3><nav class="ab-footer__links" aria-label="دسترسی سریع">' +
          '<a href="shop.html">همهٔ محصولات</a><a href="shop.html?cat=medicinal">گیاهان دارویی</a>' +
          '<a href="shop.html?cat=teas">دمنوش‌ها</a><a href="shop.html?cat=spices">ادویه‌جات</a>' +
          '<a href="mag.html">مجلهٔ عطار بلد</a><a href="club.html">باشگاه مشتریان</a>' +
        "</nav></div>" +
        '<div><h3>پشتیبانی</h3><nav class="ab-footer__links" aria-label="پشتیبانی">' +
          '<a href="contact.html">تماس با ما</a><a href="faq.html">سؤالات متداول</a>' +
          '<a href="track.html">پیگیری سفارش</a><a href="shipping.html">شرایط ارسال</a>' +
          '<a href="returns.html">بازگشت کالا</a>' +
        "</nav></div>" +
        '<div><h3>قوانین</h3><nav class="ab-footer__links" aria-label="قوانین">' +
          '<a href="terms.html">قوانین و مقررات</a><a href="privacy.html">حریم خصوصی</a>' +
          '<a href="about.html">دربارهٔ ما</a><a href="design-system.html">دیزاین سیستم</a>' +
        "</nav></div>" +
      "</div>" +
      '<div class="ab-footer__trust" aria-label="نمادهای اعتماد">' +
        '<span><svg><use href="#i-shield"/></svg> نماد اعتماد الکترونیکی</span>' +
        '<span><svg><use href="#i-card"/></svg> پرداخت امن زرین‌پال</span>' +
        '<span><svg><use href="#i-truck"/></svg> پست پیشتاز و تیپاکس</span>' +
        '<span><svg><use href="#i-leaf"/></svg> ضمانت اصالت گیاه</span>' +
      "</div>" +
      '<div class="ab-footer__legal"><span>© ۱۴۰۴ عطار بلد — تمام حقوق محفوظ است.</span>' +
        '<span>نسخهٔ نمایشی فاز ۳ · داده‌های این نسخه نمونه است.</span></div>' +
    "</div></footer>";

  /* ── ساخت صفحه ──────────────────────────────────────────────────────── */
  var headerSlot = document.getElementById("abHeader");
  var footerSlot = document.getElementById("abFooter");
  if (headerSlot) headerSlot.innerHTML = header;
  if (footerSlot) footerSlot.innerHTML = footer;
  document.body.insertAdjacentHTML("afterbegin", SPRITE + overlay + mobileMenu + drawer + bottomnav);

  var catsSlot = document.getElementById("abMobileCats");
  if (catsSlot && window.AB) {
    catsSlot.innerHTML = AB.data.categories.map(function (c) {
      return '<a class="ab-chip" href="shop.html?cat=' + c.id + '">' + c.name + "</a>";
    }).join("");
  }

  var menu = document.getElementById("abMobileMenu");
  var overlayEl = document.getElementById("abOverlay");
  var cartDrawer = document.getElementById("abCartDrawer");
  var menuBtn = document.getElementById("abMenuBtn");

  function lockScroll() {
    var any = (menu && !menu.hidden) || (cartDrawer && !cartDrawer.hidden);
    document.body.style.overflow = any ? "hidden" : "";
  }
  function openMenu() {
    menu.hidden = false;
    overlayEl.hidden = false;
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    lockScroll();
  }
  function closeMenu() {
    menu.hidden = true;
    overlayEl.hidden = cartDrawer.hidden;
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    lockScroll();
  }
  function openCart() {
    renderCart();
    cartDrawer.hidden = false;
    overlayEl.hidden = false;
    lockScroll();
    var closeBtn = cartDrawer.querySelector("[data-cart-close]");
    if (closeBtn) closeBtn.focus();
  }
  function closeCart() {
    cartDrawer.hidden = true;
    overlayEl.hidden = !menu || menu.hidden;
    lockScroll();
  }
  window.AB_OPEN_CART = openCart;

  if (menuBtn) menuBtn.addEventListener("click", function () { menu.hidden ? openMenu() : closeMenu(); });
  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-menu-close]")) { closeMenu(); return; }
    if (event.target.closest("[data-cart-open]")) { openCart(); return; }
    if (event.target.closest("[data-cart-close]")) { closeCart(); return; }
    if (event.target === overlayEl) { closeMenu(); closeCart(); return; }
    if (menu && !menu.hidden && event.target.closest("#abMobileMenu a")) closeMenu();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") { closeMenu(); closeCart(); }
  });

  /* ── سبد کشویی ──────────────────────────────────────────────────────── */
  function renderCart() {
    var body = document.getElementById("abDrawerBody");
    var foot = document.getElementById("abDrawerFoot");
    if (!body || !foot || !window.AB) return;
    var lines = AB.cartLines();
    if (!lines.length) {
      body.innerHTML = '<div class="ab-cartdrawer__empty">' +
        '<svg width="40" height="40" aria-hidden="true"><use href="#i-cart"/></svg>' +
        "<strong>سبد خرید خالی است</strong>" +
        '<p class="ab-sm">گیاهان و ادویه‌های تازه‌آسیاب منتظر شماست.</p>' +
        '<a class="ab-btn ab-btn--sm" href="shop.html">رفتن به فروشگاه</a></div>';
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = lines.map(function (line, index) {
      return '<div class="ab-drawer__item">' +
        (line.img
          ? '<img src="' + line.img + '" alt="" width="64" height="64" loading="lazy">'
          : AB.plate(AB.product(line.id), false)) +
        '<div class="ab-line-item__info"><a class="ab-line-item__name" href="product.html?id=' + line.id + '">' + AB.esc(line.name) + "</a>" +
          '<span class="ab-line-item__meta">' + AB.esc(line.size) + "</span>" +
          '<div class="ab-drawer__qty"><button type="button" data-dqty="-1" data-index="' + index + '" aria-label="کاهش تعداد">−</button>' +
            "<span>" + AB.faNum(line.qty) + "</span>" +
            '<button type="button" data-dqty="1" data-index="' + index + '" aria-label="افزایش تعداد">+</button>' +
            '<button type="button" class="ab-drawer__remove" data-dremove="' + index + '">حذف</button></div></div>' +
        '<span class="ab-sm" style="font-weight:600">' + AB.money(line.line) + "</span>" +
      "</div>";
    }).join("");
    foot.innerHTML =
      '<div class="ab-total"><span class="ab-sm ab-muted">جمع سبد</span><strong>' + AB.money(AB.subtotal()) + " تومان</strong></div>" +
      '<a class="ab-btn ab-btn--block" href="cart.html">مشاهدهٔ سبد و تسویه</a>' +
      '<button class="ab-btn ab-btn--ghost ab-btn--sm ab-btn--block" type="button" data-cart-close>ادامهٔ خرید</button>';
  }

  cartDrawer.addEventListener("click", function (event) {
    var qtyBtn = event.target.closest("[data-dqty]");
    if (qtyBtn) {
      var index = +qtyBtn.getAttribute("data-index");
      var line = AB.cartLines()[index];
      if (line) AB.cartQty(index, line.qty + (+qtyBtn.getAttribute("data-dqty")));
      return;
    }
    var remove = event.target.closest("[data-dremove]");
    if (remove) { AB.cartRemove(+remove.getAttribute("data-dremove")); }
  });

  /* ── شمارنده‌ها ─────────────────────────────────────────────────────── */
  function syncCounts() {
    if (!window.AB) return;
    var count = AB.cartCount();
    Array.prototype.forEach.call(document.querySelectorAll("[data-cart-count]"), function (node) {
      node.textContent = AB.faNum(count);
    });
    var cartBtns = document.querySelectorAll("[data-cart-open]");
    Array.prototype.forEach.call(cartBtns, function (btn) {
      btn.setAttribute("aria-label", "سبد خرید، " + AB.faNum(count) + " کالا");
    });
    var wish = AB.wishlist().length;
    Array.prototype.forEach.call(document.querySelectorAll("[data-wish-count]"), function (node) {
      node.textContent = AB.faNum(wish);
      node.hidden = wish === 0;
    });
    if (!cartDrawer.hidden) renderCart();
  }

  document.addEventListener("ab:cart", syncCounts);
  document.addEventListener("ab:wish", syncCounts);
  syncCounts();
  renderCart();

  document.addEventListener("ab:cart", function () {
    var badge = document.querySelector("[data-cart-count]");
    if (badge && window.AB && AB.cartCount() > 0) badge.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" }],
      { duration: 260, easing: "ease-out" }
    );
  });
})();
