/* عطار بلد — رفتار صفحه‌ها (فاز ۳) */
(function () {
  "use strict";
  var PAGE = document.body.getAttribute("data-page") || "";
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function param(name) { return new URLSearchParams(location.search).get(name); }
  function esc(v) { return AB.esc(v); }
  var ERAS = {
    persepolis: "کتیبه‌های باروی تخت جمشید، گیاهان دارویی و سهم آن‌ها در انبارهای شاهی را ثبت کرده‌اند.",
    ecbatana: "هگمتانه، گذرگاه طب میان‌رودان و فلات ایران بود؛ دارو و ادویه از همین راه می‌گذشت.",
    sasanian: "دانشگاه گندیشاپور، طب ایرانی، هندی و یونانی را زیر یک سقف گرد آورد.",
    islamic: "ابن‌سینا در قانون، داروشناسی را به دستگاهی منظم تبدیل کرد و قرن‌ها مرجع ماند.",
    safavid: "عطاری‌های بازار صفوی، دارو، ادویه و روغن را کنار هم می‌فروختند.",
    modern: "دانشکده داروسازی تهران، طب سنتی ایران را به پژوهش دانشگاهی رساند."
  };

  /* ── خانه ───────────────────────────────────────────────────────────── */
  function initHome() {
    var catGrid = $("#catGrid");
    if (catGrid) {
      catGrid.innerHTML = AB.data.categories.map(function (c) {
        return '<a class="ab-cat" href="shop.html?cat=' + c.id + '">' +
          '<span class="ab-cat__arch"><svg aria-hidden="true"><use href="#' + c.icon + '"/></svg></span>' +
          '<span class="ab-cat__name">' + esc(c.name) + "</span>" +
          '<span class="ab-cat__count">' + AB.faNum(c.count) + " قلم</span></a>";
      }).join("");
    }
    var grid = $("#featuredGrid");
    if (grid) {
      var featured = AB.data.products.filter(function (p) { return p.tags.indexOf("ویژه") !== -1 || p.img; }).slice(0, 8);
      grid.innerHTML = AB.grid(featured);
    }
    var eras = $all(".ab-era");
    var caption = $("#eraCaption");
    eras.forEach(function (era) {
      era.addEventListener("click", function () {
        eras.forEach(function (other) { other.classList.remove("is-active"); other.setAttribute("aria-selected", "false"); });
        era.classList.add("is-active");
        era.setAttribute("aria-selected", "true");
        if (caption) caption.textContent = ERAS[era.getAttribute("data-era")] || "";
      });
    });
    initNews();
  }

  function initNews() {
    var news = $("#newsForm");
    if (!news || news.dataset.bound) return;
    news.dataset.bound = "1";
    news.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = $("#newsEmail");
      if (!email.value || email.value.indexOf("@") === -1) { AB.toast("ایمیل معتبر وارد کنید.", "error"); email.focus(); return; }
      AB.toast("ثبت شد؛ از این پس خبرها را برایتان می‌فرستیم.");
      news.reset();
    });
  }

  /* ── فروشگاه ────────────────────────────────────────────────────────── */
  var shopState = { cat: "", q: "", sort: "featured", price: "", stock: false, shown: 12 };

  function shopInitState() {
    shopState.cat = param("cat") || "";
    shopState.q = param("q") || "";
    shopState.sort = param("sort") || "featured";
    shopState.price = param("price") || "";
    shopState.stock = param("stock") === "1";
    if (!AB.data.categories.some(function (c) { return c.id === shopState.cat; })) shopState.cat = "";
  }

  function shopFiltered() {
    var list = AB.data.products.slice();
    if (shopState.cat) list = list.filter(function (p) { return p.cat === shopState.cat; });
    if (shopState.q) {
      var q = shopState.q.trim().toLowerCase();
      list = list.filter(function (p) {
        return (p.fa + " " + p.en + " " + p.botanical + " " + AB.category(p.cat).name).toLowerCase().indexOf(q) !== -1;
      });
    }
    if (shopState.stock) list = list.filter(function (p) { return p.stock > 0 && !p.soon; });
    if (shopState.price) {
      var range = shopState.price.split("-");
      var min = +range[0], max = range[1] === "up" ? Infinity : +range[1];
      list = list.filter(function (p) { return p.sizes[0].price >= min && p.sizes[0].price <= max; });
    }
    if (shopState.sort === "cheap") list.sort(function (a, b) { return a.sizes[0].price - b.sizes[0].price; });
    else if (shopState.sort === "expensive") list.sort(function (a, b) { return b.sizes[0].price - a.sizes[0].price; });
    else if (shopState.sort === "name") list.sort(function (a, b) { return a.fa.localeCompare(b.fa, "fa"); });
    else if (shopState.sort === "rating") list.sort(function (a, b) { return b.rating - a.rating; });
    else list.sort(function (a, b) { return (b.img ? 1 : 0) - (a.img ? 1 : 0) || b.reviews - a.reviews; });
    return list;
  }

  function shopSyncUrl() {
    var params = new URLSearchParams();
    if (shopState.cat) params.set("cat", shopState.cat);
    if (shopState.q) params.set("q", shopState.q);
    if (shopState.sort !== "featured") params.set("sort", shopState.sort);
    if (shopState.price) params.set("price", shopState.price);
    if (shopState.stock) params.set("stock", "1");
    var url = "shop.html" + (params.toString() ? "?" + params.toString() : "");
    history.replaceState(null, "", url);
  }

  function shopRender() {
    var list = shopFiltered();
    var grid = $("#shopGrid");
    var count = $("#shopCount");
    var chips = $("#shopChips");
    var more = $("#shopMore");
    if (count) count.textContent = AB.faNum(list.length) + " محصول";
    if (!list.length) {
      grid.innerHTML = '<div class="ab-empty" style="grid-column:1/-1"><svg width="36" height="36"><use href="#i-search"/></svg>' +
        "<strong>محصولی با این فیلترها پیدا نشد</strong><p class=\"ab-sm\">فیلترها را ساده‌تر کنید یا همهٔ محصولات را ببینید.</p>" +
        '<button class="ab-btn ab-btn--sm" type="button" id="shopReset">حذف فیلترها</button></div>';
      if (more) more.hidden = true;
      var reset = $("#shopReset");
      if (reset) reset.addEventListener("click", function () { shopState = { cat: "", q: "", sort: "featured", price: "", stock: false, shown: 12 }; shopSyncUrl(); shopRender(); });
      return;
    }
    grid.innerHTML = AB.grid(list.slice(0, shopState.shown));
    if (more) {
      more.hidden = list.length <= shopState.shown;
      more.textContent = "نمایش بیشتر (" + AB.faNum(Math.max(0, list.length - shopState.shown)) + ")";
    }
    if (chips) {
      var parts = [];
      if (shopState.cat) parts.push('<button class="ab-chip is-active" type="button" data-clear="cat">' + esc(AB.category(shopState.cat).name) + " ×</button>");
      if (shopState.q) parts.push('<button class="ab-chip is-active" type="button" data-clear="q">جست‌وجو: ' + esc(shopState.q) + " ×</button>");
      if (shopState.price) parts.push('<button class="ab-chip is-active" type="button" data-clear="price">' + priceLabel(shopState.price) + " ×</button>");
      if (shopState.stock) parts.push('<button class="ab-chip is-active" type="button" data-clear="stock">فقط موجود</button>');
      chips.innerHTML = parts.join("");
    }
    $all("[data-clear]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-clear");
        shopState[key] = key === "stock" ? false : "";
        shopState.shown = 12;
        shopSyncUrl(); shopRender(); shopSyncControls();
      });
    });
  }

  function priceLabel(value) {
    var r = value.split("-");
    return r[1] === "up" ? "بالای ۵۰۰ هزار" : "بین " + AB.money(+r[0]) + " و " + AB.money(+r[1]);
  }

  function shopSyncControls() {
    var catBox = $("#filterCats");
    if (catBox) {
      catBox.innerHTML = AB.data.categories.map(function (c) {
        return '<label class="ab-choice"><input type="radio" name="cat" value="' + c.id + '"' + (shopState.cat === c.id ? " checked" : "") + ">" +
          "<span>" + esc(c.name) + '</span><span class="ab-filters__count">' + AB.faNum(c.count) + "</span></label>";
      }).join("");
      var all = '<label class="ab-choice"><input type="radio" name="cat" value=""' + (!shopState.cat ? " checked" : "") + ">" +
        '<span>همهٔ محصولات</span><span class="ab-filters__count">' + AB.faNum(AB.data.products.length) + "</span></label>";
      catBox.innerHTML = all + catBox.innerHTML;
      $all('input[name="cat"]', catBox).forEach(function (input) {
        input.addEventListener("change", function () { shopState.cat = input.value; shopState.shown = 12; shopSyncUrl(); shopRender(); });
      });
    }
    var priceSel = $("#filterPrice");
    if (priceSel) {
      priceSel.value = shopState.price;
      priceSel.onchange = function () { shopState.price = priceSel.value; shopState.shown = 12; shopSyncUrl(); shopRender(); };
    }
    var stock = $("#filterStock");
    if (stock) {
      stock.checked = shopState.stock;
      stock.onchange = function () { shopState.stock = stock.checked; shopState.shown = 12; shopSyncUrl(); shopRender(); };
    }
    var sort = $("#shopSort");
    if (sort) {
      sort.value = shopState.sort;
      sort.onchange = function () { shopState.sort = sort.value; shopSyncUrl(); shopRender(); };
    }
  }

  function initShop() {
    shopInitState();
    var catName = shopState.cat ? AB.category(shopState.cat).name : "";
    var title = $("#shopTitle");
    var lead = $("#shopLead");
    var crumb = $("#shopCrumb");
    if (shopState.q) {
      if (title) title.textContent = "نتایج جست‌وجو";
      if (lead) lead.textContent = "برای «" + shopState.q + "» این محصولات پیدا شد.";
    } else if (catName) {
      if (title) title.textContent = catName;
      if (lead) lead.textContent = AB.category(shopState.cat).blurb;
      if (crumb) crumb.textContent = catName;
    }
    if (title && catName) document.title = catName + " — عطار بلد";
    shopSyncControls();
    shopRender();
    var more = $("#shopMore");
    if (more) more.addEventListener("click", function () { shopState.shown += 12; shopRender(); });
  }

  /* ── صفحه محصول ─────────────────────────────────────────────────────── */
  function initProduct() {
    var root = $("#pdp");
    if (!root) return;
    var p = AB.product(param("id")) || AB.data.products.filter(function (x) { return x.img; })[0];
    if (!p) { root.innerHTML = '<div class="ab-empty"><strong>محصول پیدا نشد</strong><a class="ab-btn ab-btn--sm" href="shop.html">فروشگاه</a></div>'; return; }
    document.title = p.fa + " — عطار بلد";
    var cat = AB.category(p.cat);
    var crumb = $("#crumbProduct");
    if (crumb) crumb.textContent = p.fa;
    var crumbCat = $("#crumbCat");
    if (crumbCat) { crumbCat.textContent = cat.name; crumbCat.href = "shop.html?cat=" + cat.id; }

    var badges = "";
    if (p.tags.indexOf("ویژه") !== -1) badges += '<span class="ab-badge ab-badge--sale">ویژه</span>';
    if (p.tags.indexOf("پرفروش") !== -1) badges += '<span class="ab-badge ab-badge--new">پرفروش</span>';
    if (p.soon) badges += '<span class="ab-badge ab-badge--muted">تصویر موقت</span>';
    if (p.stock === 0) badges += '<span class="ab-badge ab-badge--out">ناموجود</span>';

    var buy = p.soon
      ? '<div class="ab-alert ab-alert--info">تصویر تأییدشدهٔ این محصول در راه است؛ تصویر فعلی موقت است و پیش از راه‌اندازی با عکس نهایی جایگزین می‌شود.</div>'
      : "";
    if (p.stock === 0) {
      buy += '<div class="ab-alert ab-alert--error">این محصول فعلاً موجود نیست.</div>' +
        '<form class="ab-stack" id="notifyForm"><label class="ab-field"><span class="ab-label">اطلاع از موجودی</span>' +
        '<input class="ab-input" type="tel" id="notifyPhone" placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷" required></label>' +
        '<button class="ab-btn" type="submit">به من خبر بده</button></form>';
    } else {
      buy += '<div class="ab-stack"><div class="ab-sizes" role="group" aria-label="اندازهٔ بسته">' +
        p.sizes.map(function (s, i) {
          return '<button class="ab-size" type="button" data-size="' + esc(s.label) + '" data-price="' + s.price + '" aria-pressed="' + (i === 0 ? "true" : "false") + '">' + esc(s.label) + "</button>";
        }).join("") + "</div>" +
        '<div class="ab-row" style="align-items:flex-end;gap:16px">' +
          '<div class="ab-qty" style="width:132px"><button type="button" data-pdp-qty="-1" aria-label="کاهش">−</button>' +
            '<input id="pdpQty" type="text" value="۱" readonly aria-label="تعداد"><button type="button" data-pdp-qty="1" aria-label="افزایش">+</button></div>' +
          '<span class="ab-sm ab-muted">' + (p.stock > 5 ? "موجود در انبار" : "تنها " + AB.faNum(p.stock) + " بسته باقی مانده") + "</span>" +
        "</div>" +
        '<div class="ab-pdp__actions"><button class="ab-btn ab-btn--lg" type="button" id="pdpAdd">افزودن به سبد</button>' +
        '<button class="ab-btn ab-btn--lg ab-btn--outline" type="button" id="pdpWish"><svg width="18" height="18"><use href="#i-heart"/></svg> علاقه‌مندی</button></div></div>';
    }

    root.innerHTML =
      '<div class="ab-pdp__media">' + (p.img
        ? '<img src="' + p.img + '" alt="' + esc(p.fa) + '" width="800" height="800">'
        : AB.plate(p, true)) + badges + "</div>" +
      '<div class="ab-pdp__buy">' +
        '<span class="ab-pdp__cat">' + esc(cat.name) + "</span>" +
        "<h1>" + esc(p.fa) + "</h1>" +
        '<span class="ab-pdp__bot">' + esc(p.botanical) + "</span>" +
        '<div class="ab-row">' + AB.rating(p) + '<span class="ab-xs ab-muted">' + AB.faNum(p.reviews) + " دیدگاه</span>" +
          '<span class="ab-badge ab-badge--organic">۱۰۰٪ طبیعی</span></div>' +
        '<p class="ab-sm" style="color:var(--ab-ink-muted)">' + esc(p.short) + "</p>" +
        '<div class="ab-pdp__price"><strong id="pdpPrice">' + AB.money(p.sizes[0].price) + "</strong>" +
          '<span class="ab-sm ab-muted">تومان</span><span class="ab-xs ab-muted" id="pdpUnit">/ ' + esc(p.sizes[0].label) + "</span></div>" +
        buy +
        '<ul class="ab-trust">' +
          '<li><svg><use href="#i-truck"/></svg> ارسال از ۲۴ ساعت آینده · رایگان بالای ۵۰۰ هزار تومان</li>' +
          '<li><svg><use href="#i-shield"/></svg> ضمانت اصالت و بازگشت ۷ روزه</li>' +
          '<li><svg><use href="#i-leaf"/></svg> بسته‌بندی در همان روز سفارش، در شیشهٔ دربسته</li>' +
        "</ul>" +
      "</div>";

    var selected = p.sizes[0];
    var qtyInput = $("#pdpQty");
    var priceEl = $("#pdpPrice");
    var unitEl = $("#pdpUnit");
    $all("[data-size]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $all("[data-size]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        selected = { label: btn.getAttribute("data-size"), price: +btn.getAttribute("data-price") };
        priceEl.textContent = AB.money(selected.price);
        unitEl.textContent = "/ " + selected.label;
      });
    });
    $all("[data-pdp-qty]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var v = parseInt(qtyInput.value.replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); }), 10) || 1;
        v = Math.max(1, Math.min(p.stock || 1, v + (+btn.getAttribute("data-pdp-qty"))));
        qtyInput.value = AB.faNum(v);
      });
    });
    var add = $("#pdpAdd");
    if (add) add.addEventListener("click", function () {
      var v = parseInt(qtyInput.value.replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); }), 10) || 1;
      if (AB.cartAdd(p.id, selected.label, v)) { AB.toast("«" + p.fa + "» به سبد اضافه شد."); if (window.AB_OPEN_CART) window.AB_OPEN_CART(); }
    });
    var wish = $("#pdpWish");
    if (wish) {
      if (AB.wishHas(p.id)) wish.classList.add("is-on");
      wish.addEventListener("click", function () {
        var on = AB.wishToggle(p.id);
        wish.classList.toggle("is-on", on);
        AB.toast(on ? "به علاقه‌مندی‌ها اضافه شد." : "از علاقه‌مندی‌ها حذف شد.");
      });
    }
    var notify = $("#notifyForm");
    if (notify) notify.addEventListener("submit", function (e) {
      e.preventDefault();
      AB.toast("ثبت شد؛ به‌محض ورود این محصول خبر می‌دهیم.");
      notify.reset();
    });

    /* تب‌ها */
    var tabs = $all(".ab-tabs__btn");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); t.tabIndex = -1; });
        tab.setAttribute("aria-selected", "true"); tab.tabIndex = 0;
        $all(".ab-tabs__panel").forEach(function (panel) { panel.hidden = panel.id !== tab.getAttribute("aria-controls"); });
      });
    });

    /* مشخصات */
    var spec = $("#pdpSpec");
    if (spec) {
      var rows = [
        ["نام علمی", p.botanical], ["خاستگاه", p.origin], ["بخش مصرفی", p.part],
        ["بسته‌بندی", p.sizes.map(function (s) { return s.label; }).join(" / ")],
        ["شمارهٔ دسته", "AB-" + p.id.toUpperCase().slice(0, 6)], ["شرایط نگهداری", "خشک و دور از نور"]
      ];
      spec.innerHTML = rows.map(function (r) { return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("");
    }
    var desc = $("#pdpDesc");
    if (desc) desc.innerHTML = "<p>" + esc(p.desc) + "</p>";
    var use = $("#pdpUse");
    if (use) use.innerHTML = "<p>" + esc(p.usage) + "</p>";
    var keep = $("#pdpKeep");
    if (keep) keep.innerHTML = "<p>" + esc(p.storage) + "</p><p class=\"ab-mt-2\" style=\"color:var(--ab-danger)\">" + esc(p.warn) + "</p>";

    /* محصولات مرتبط */
    var related = $("#pdpRelated");
    if (related) {
      var list = AB.data.products.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).slice(0, 4);
      related.innerHTML = AB.grid(list);
    }

    /* داده ساختاریافته */
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Product", name: p.fa, alternateName: p.en,
      description: p.short, image: p.img || "", brand: { "@type": "Brand", name: "عطار بلد" },
      offers: { "@type": "Offer", priceCurrency: "IRR", price: p.sizes[0].price, availability: p.soon || p.stock === 0 ? "https://schema.org/PreOrder" : "https://schema.org/InStock" }
    });
    document.head.appendChild(ld);
  }

  /* ── سبد خرید ───────────────────────────────────────────────────────── */
  function summaryHtml(shipping) {
    var sub = AB.subtotal();
    var disc = AB.discount();
    var ship = AB.shippingFee(shipping);
    var coupon = AB.coupon();
    return '<div class="ab-summary__rows">' +
      '<div class="ab-summary__row"><span>جمع سبد</span><span>' + AB.money(sub) + " تومان</span></div>" +
      (disc ? '<div class="ab-summary__row" style="color:var(--ab-green)"><span>تخفیف (' + esc(coupon.label) + ")</span><span>−" + AB.money(disc) + " تومان</span></div>" : "") +
      '<div class="ab-summary__row"><span>هزینهٔ ارسال</span><span>' + (ship === 0 ? "رایگان" : AB.money(ship) + " تومان") + "</span></div>" +
      '<div class="ab-summary__row ab-summary__row--total"><span>مبلغ قابل پرداخت</span><span>' + AB.money(Math.max(0, sub - disc) + ship) + " تومان</span></div></div>";
  }

  function renderCartPage() {
    var list = $("#cartList");
    var summary = $("#cartSummary");
    var empty = $("#cartEmpty");
    if (!list) return;
    var lines = AB.cartLines();
    var has = lines.length > 0;
    if (empty) empty.hidden = has;
    list.hidden = !has;
    if (summary) summary.hidden = !has;
    if (!has) { list.innerHTML = ""; if (summary) summary.innerHTML = ""; return; }
    list.innerHTML = lines.map(function (line, i) {
      var p = AB.product(line.id);
      return '<div class="ab-cart-row">' +
        (line.img ? '<img src="' + line.img + '" alt="' + esc(line.name) + '" width="92" height="92">' : AB.plate(p, false)) +
        '<div class="ab-cart-row__info"><a class="ab-cart-row__name" href="product.html?id=' + line.id + '">' + esc(line.name) + "</a>" +
          '<span class="ab-cart-row__meta">' + esc(line.size) + " · " + AB.money(line.price) + " تومان</span>" +
          '<div class="ab-qty" style="max-width:132px"><button type="button" data-cqty="-1" data-index="' + i + '" aria-label="کاهش">−</button>' +
            '<input type="text" value="' + AB.faNum(line.qty) + '" readonly aria-label="تعداد"><button type="button" data-cqty="1" data-index="' + i + '" aria-label="افزایش">+</button></div></div>' +
        '<div class="ab-cart-row__side"><span class="ab-cart-row__price">' + AB.money(line.line) + " تومان</span>" +
          '<button class="ab-drawer__remove" type="button" data-cremove="' + i + '">حذف</button></div></div>';
    }).join("");
    var coupon = AB.coupon();
    summary.innerHTML =
      '<h2 style="font-size:18px">خلاصهٔ سفارش</h2>' + summaryHtml() +
      '<form class="ab-coupon" id="couponForm"><label class="ab-sr" for="couponInput">کد تخفیف</label>' +
        '<input class="ab-input" id="couponInput" placeholder="کد تخفیف" value="' + (coupon ? coupon.code : "") + '" autocomplete="off">' +
        '<button class="ab-btn ab-btn--outline ab-btn--sm" type="submit">اعمال</button></form>' +
      (coupon ? '<button class="ab-drawer__remove" type="button" id="couponClear">حذف کد «' + esc(coupon.code) + "»</button>" : '<p class="ab-xs ab-muted">کد نمایشی: ATTAR10 یا NOWRUZ</p>') +
      '<a class="ab-btn ab-btn--block" href="checkout.html">ادامهٔ تسویه‌حساب</a>' +
      '<a class="ab-btn ab-btn--ghost ab-btn--sm ab-btn--block" href="shop.html">ادامهٔ خرید</a>';
    $all("[data-cqty]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = +btn.getAttribute("data-index");
        AB.cartQty(i, AB.cartLines()[i].qty + (+btn.getAttribute("data-cqty")));
      });
    });
    $all("[data-cremove]").forEach(function (btn) {
      btn.addEventListener("click", function () { AB.cartRemove(+btn.getAttribute("data-cremove")); });
    });
    var form = $("#couponForm");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var res = AB.setCoupon($("#couponInput").value);
      AB.toast(res.message, res.ok ? "" : "error");
      if (res.ok) renderCartPage();
    });
    var clear = $("#couponClear");
    if (clear) clear.addEventListener("click", function () { AB.clearCoupon(); renderCartPage(); });
  }

  /* ── تسویه ──────────────────────────────────────────────────────────── */
  var SHIP = { post: 49000, tipax: 69000, courier: 99000 };
  var SHIP_LABEL = { post: "پست پیشتاز", tipax: "تیپاکس", courier: "پیک شهری تهران" };

  function initCheckout() {
    var body = $("#checkoutBody");
    var empty = $("#checkoutEmpty");
    if (!body) return;
    var lines = AB.cartLines();
    if (!lines.length) {
      if (empty) empty.hidden = false;
      body.hidden = true;
      return;
    }
    if (empty) empty.hidden = true;
    var user = AB.user() || {};
    var ship = "post";
    var payment = "zarinpal";
    var summary;

    function paintSummary() {
      summary = summary || $("#checkoutSummary");
      if (!summary) return;
      var sub = AB.subtotal(), disc = AB.discount(), fee = AB.shippingFee(SHIP[ship]);
      summary.innerHTML = '<h2 style="font-size:18px">سفارش شما</h2>' +
        '<div class="ab-stack" style="gap:10px">' + lines.map(function (l) {
          return '<div class="ab-row ab-row--between ab-sm"><span>' + esc(l.name) + " <span class=\"ab-muted\">× " + AB.faNum(l.qty) + " (" + esc(l.size) + ")</span></span><span>" + AB.money(l.line) + "</span></div>";
        }).join("") + "</div>" +
        '<div class="ab-summary__rows" style="border-top:1px solid var(--ab-line);padding-top:12px">' +
          '<div class="ab-summary__row"><span>جمع سبد</span><span>' + AB.money(sub) + " تومان</span></div>" +
          (disc ? '<div class="ab-summary__row" style="color:var(--ab-green)"><span>تخفیف</span><span>−' + AB.money(disc) + " تومان</span></div>" : "") +
          '<div class="ab-summary__row"><span>ارسال (' + SHIP_LABEL[ship] + ")</span><span>" + (fee === 0 ? "رایگان" : AB.money(fee) + " تومان") + "</span></div>" +
          '<div class="ab-summary__row ab-summary__row--total"><span>پرداخت</span><span>' + AB.money(Math.max(0, sub - disc) + fee) + " تومان</span></div></div>" +
        '<p class="ab-xs ab-muted">این نسخهٔ نمایشی است؛ پرداخت واقعی انجام نمی‌شود و سفارش فقط در همین مرورگر ذخیره می‌شود.</p>';
    }

    body.innerHTML =
      '<form class="ab-stack" id="checkoutForm" novalidate>' +
        '<section class="ab-panel"><h2>۱. اطلاعات تحویل</h2><div class="ab-form-grid">' +
          '<label class="ab-field ab-field--full"><span class="ab-label">نام و نام خانوادگی</span><input class="ab-input" name="name" required value="' + esc(user.name || "") + '" autocomplete="name"></label>' +
          '<label class="ab-field"><span class="ab-label">شمارهٔ موبایل</span><input class="ab-input" name="phone" inputmode="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" required value="' + esc(user.phone || "") + '" autocomplete="tel"></label>' +
          '<label class="ab-field"><span class="ab-label">کد پستی <span>(اختیاری)</span></span><input class="ab-input" name="postal" inputmode="numeric" autocomplete="postal-code"></label>' +
          '<label class="ab-field"><span class="ab-label">استان</span><input class="ab-input" name="province" required autocomplete="address-level1"></label>' +
          '<label class="ab-field"><span class="ab-label">شهر</span><input class="ab-input" name="city" required autocomplete="address-level2"></label>' +
          '<label class="ab-field ab-field--full"><span class="ab-label">نشانی کامل</span><textarea class="ab-textarea" name="line" required autocomplete="street-address" placeholder="خیابان، کوچه، پلاک، واحد"></textarea></label>' +
        "</div></section>" +
        '<section class="ab-panel"><h2>۲. روش ارسال</h2><div class="ab-ship-opt">' +
          '<label class="ab-choice"><input type="radio" name="ship" value="post" checked><span>پست پیشتاز</span><span>۲ تا ۴ روز کاری · ۴۹٬۰۰۰ تومان</span></label>' +
          '<label class="ab-choice"><input type="radio" name="ship" value="tipax"><span>تیپاکس</span><span>۱ تا ۳ روز کاری · ۶۹٬۰۰۰ تومان</span></label>' +
          '<label class="ab-choice"><input type="radio" name="ship" value="courier"><span>پیک شهری تهران</span><span>همان روز · ۹۹٬۰۰۰ تومان</span></label>' +
        "</div></section>" +
        '<section class="ab-panel"><h2>۳. پرداخت</h2><div class="ab-ship-opt">' +
          '<label class="ab-choice"><input type="radio" name="pay" value="zarinpal" checked><span>درگاه زرین‌پال</span><span>کارت‌های شتاب</span></label>' +
          '<label class="ab-choice"><input type="radio" name="pay" value="cod"><span>پرداخت در محل</span><span>فقط تهران</span></label>' +
        "</div><label class=\"ab-choice\" style=\"margin-top:8px\"><input type=\"checkbox\" id=\"terms\" required><span>قوانین و شرایط خرید را می‌پذیرم.</span></label></section>" +
        '<button class="ab-btn ab-btn--lg ab-btn--block" type="submit" id="placeOrder">ثبت سفارش</button>' +
      "</form>" +
      '<aside class="ab-summary" id="checkoutSummary" aria-label="خلاصهٔ سفارش"></aside>';

    paintSummary();

    $all('input[name="ship"]').forEach(function (input) {
      input.addEventListener("change", function () { ship = input.value; paintSummary(); });
    });
    $all('input[name="pay"]').forEach(function (input) {
      input.addEventListener("change", function () { payment = input.value; });
    });

    var form = $("#checkoutForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var phone = String(data.get("phone") || "").replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); }).replace(/\s|-/g, "");
      var province = String(data.get("province") || "").trim();
      var city = String(data.get("city") || "").trim();
      var line = String(data.get("line") || "").trim();
      var postal = String(data.get("postal") || "").trim();
      var errors = [];
      if (name.length < 3) errors.push("نام و نام خانوادگی را کامل بنویسید.");
      if (!/^09\d{9}$/.test(phone)) errors.push("شمارهٔ موبایل باید ۱۱ رقم و با ۰۹ شروع شود.");
      if (!province) errors.push("استان را وارد کنید.");
      if (!city) errors.push("شهر را وارد کنید.");
      if (line.length < 10) errors.push("نشانی کامل را وارد کنید.");
      if (!$("#terms").checked) errors.push("پذیرش قوانین الزامی است.");
      if (errors.length) { AB.toast(errors[0], "error"); return; }

      var sub = AB.subtotal(), disc = AB.discount(), fee = AB.shippingFee(SHIP[ship]);
      var order = {
        code: "AB-" + String(Math.floor(10000 + Math.random() * 89999)),
        date: new Date().toISOString(),
        name: name, phone: phone,
        address: { province: province, city: city, line: line, postal: postal },
        items: lines, subtotal: sub, discount: disc, shipping: fee, shippingMethod: SHIP_LABEL[ship],
        total: Math.max(0, sub - disc) + fee,
        payment: payment === "cod" ? "پرداخت در محل" : "زرین‌پال",
        status: 1
      };
      AB.orderSave(order);
      var u = AB.user() || {};
      u.name = u.name || name; u.phone = u.phone || phone;
      AB.userSave(u);
      AB.cartClear();
      AB.clearCoupon();
      window.location.href = "order-received.html?code=" + encodeURIComponent(order.code);
    });
  }

  /* ── تأیید سفارش ────────────────────────────────────────────────────── */
  function orderSteps(status) {
    var steps = ["ثبت سفارش", "پرداخت تأیید شد", "آماده‌سازی", "تحویل به پست", "تحویل به مشتری"];
    return steps.map(function (label, i) {
      var cls = i < status ? "is-done" : (i === status ? "is-current" : "");
      return '<div class="ab-timeline__step ' + cls + '"><span class="ab-timeline__dot">' + (i < status ? "✓" : AB.faNum(i + 1)) + "</span>" +
        "<div><b>" + label + "</b><span>" + (i === status ? "در حال انجام" : (i < status ? "انجام شد" : "در انتظار")) + "</span></div></div>";
    }).join("");
  }
  function orderDate(order) {
    try { return new Date(order.date).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" }); }
    catch (e) { return ""; }
  }

  function initOrder() {
    var root = $("#orderBody");
    if (!root) return;
    var order = AB.orderFind(param("code"));
    if (!order) {
      root.innerHTML = '<div class="ab-empty"><svg width="36" height="36"><use href="#i-box"/></svg><strong>سفارشی با این کد پیدا نشد</strong>' +
        '<p class="ab-sm">کد سفارش را بررسی کنید یا از صفحهٔ پیگیری استفاده کنید.</p>' +
        '<a class="ab-btn ab-btn--sm" href="track.html">پیگیری سفارش</a></div>';
      return;
    }
    root.innerHTML =
      '<div class="ab-receipt__head"><span class="ab-receipt__mark"><svg><use href="#i-check"/></svg></span>' +
        "<h1>سفارش شما ثبت شد</h1><p class=\"ab-sm ab-muted\">" + esc(order.name) + " عزیز، سفارش شما در صف آماده‌سازی است.</p>" +
        '<span class="ab-receipt__code" dir="ltr">' + esc(order.code) + "</span>" +
        '<span class="ab-xs ab-muted">' + orderDate(order) + " · " + esc(order.payment) + "</span></div>" +
      '<section class="ab-panel"><h2 style="font-size:16px">وضعیت سفارش</h2><div class="ab-timeline">' + orderSteps(order.status) + "</div></section>" +
      '<section class="ab-panel"><h2 style="font-size:16px">اقلام سفارش</h2><div class="ab-stack" style="gap:10px">' +
        order.items.map(function (l) {
          return '<div class="ab-row ab-row--between ab-sm"><span>' + esc(l.name) + ' <span class="ab-muted">× ' + AB.faNum(l.qty) + " (" + esc(l.size) + ")</span></span><span>" + AB.money(l.line) + " تومان</span></div>";
        }).join("") +
        '<div class="ab-summary__rows" style="border-top:1px solid var(--ab-line);padding-top:12px">' +
          '<div class="ab-summary__row"><span>جمع</span><span>' + AB.money(order.subtotal) + " تومان</span></div>" +
          (order.discount ? '<div class="ab-summary__row"><span>تخفیف</span><span>−' + AB.money(order.discount) + " تومان</span></div>" : "") +
          '<div class="ab-summary__row"><span>ارسال</span><span>' + (order.shipping ? AB.money(order.shipping) + " تومان" : "رایگان") + "</span></div>" +
          '<div class="ab-summary__row ab-summary__row--total"><span>پرداخت‌شده</span><span>' + AB.money(order.total) + " تومان</span></div></div></section>" +
      '<section class="ab-panel"><h2 style="font-size:16px">نشانی تحویل</h2>' +
        '<p class="ab-sm">' + esc(order.name) + " · " + esc(order.phone) + "<br>" + esc(order.address.province) + "، " + esc(order.address.city) + "، " + esc(order.address.line) +
        (order.address.postal ? " · کد پستی " + esc(order.address.postal) : "") + "</p>" +
        '<p class="ab-xs ab-muted">روش ارسال: ' + esc(order.shippingMethod) + "</p></section>" +
      '<div class="ab-row" style="justify-content:center"><a class="ab-btn ab-btn--outline" href="track.html?code=' + encodeURIComponent(order.code) + '">پیگیری سفارش</a>' +
        '<a class="ab-btn ab-btn--ghost" href="shop.html">ادامهٔ خرید</a></div>';
  }

  /* ── پیگیری سفارش ───────────────────────────────────────────────────── */
  function initTrack() {
    var form = $("#trackForm");
    if (!form) return;
    var result = $("#trackResult");
    var code = param("code");
    if (code) $("#trackCode").value = code;
    function lookup(e) {
      if (e) e.preventDefault();
      var c = $("#trackCode").value.trim();
      var phone = $("#trackPhone").value.replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); }).replace(/\s|-/g, "");
      var order = AB.orderFind(c);
      if (!order) { AB.toast("سفارشی با این کد پیدا نشد.", "error"); return; }
      if (phone && phone !== order.phone) { AB.toast("شمارهٔ موبایل با این سفارش هم‌خوانی ندارد.", "error"); return; }
      result.hidden = false;
      result.innerHTML = '<section class="ab-panel"><div class="ab-row ab-row--between"><div><b>' + esc(order.code) + "</b><p class=\"ab-xs ab-muted\">" + orderDate(order) + "</p></div>" +
        '<span class="ab-badge ab-badge--organic">' + (order.status >= 3 ? "در مسیر" : "در حال آماده‌سازی") + "</span></div>" +
        '<div class="ab-timeline">' + orderSteps(order.status) + "</div>" +
        '<p class="ab-sm">' + esc(order.name) + " · " + esc(order.address.city) + " · " + esc(order.shippingMethod) + "</p>" +
        '<a class="ab-btn ab-btn--outline ab-btn--sm" href="order-received.html?code=' + encodeURIComponent(order.code) + '">جزئیات سفارش</a></section>';
    }
    form.addEventListener("submit", lookup);
    if (code) lookup();
  }

  /* ── حساب کاربری ────────────────────────────────────────────────────── */
  function accountPanel(user) {
    var root = $("#accountBody");
    var pts = AB.points(user);
    var t = AB.tier(pts);
    var myOrders = AB.orders().filter(function (o) { return !user.phone || o.phone === user.phone; });
    var wish = AB.wishlist().map(AB.product).filter(Boolean);

    function panel(id, active, html) {
      return '<section class="ab-account__panel" id="panel-' + id + '"' + (active ? "" : " hidden") + ">" + html + "</section>";
    }

    root.innerHTML =
      '<aside class="ab-account__nav" aria-label="بخش‌های حساب">' +
        '<button type="button" data-panel="dashboard" class="is-active"><svg><use href="#i-home"/></svg>داشبورد</button>' +
        '<button type="button" data-panel="orders"><svg><use href="#i-box"/></svg>سفارش‌ها</button>' +
        '<button type="button" data-panel="wishlist"><svg><use href="#i-heart"/></svg>علاقه‌مندی‌ها</button>' +
        '<button type="button" data-panel="addresses"><svg><use href="#i-pin"/></svg>آدرس‌ها</button>' +
        '<button type="button" data-panel="club"><svg><use href="#i-sparkle"/></svg>باشگاه</button>' +
        '<button type="button" data-panel="logout"><svg><use href="#i-x"/></svg>خروج</button>' +
      "</aside>" +
      '<div class="ab-account__panel" style="padding:0">' +
        panel("dashboard", true,
          "<h2 style=\"font-size:24px\">سلام، " + esc(user.name || "همراه عطار بلد") + "</h2>" +
          '<p class="ab-sm ab-muted">' + esc(user.phone) + "</p>" +
          '<div class="ab-stat-grid ab-mt-4"><div class="ab-stat"><strong>' + AB.faNum(myOrders.length) + "</strong><span>سفارش</span></div>" +
          '<div class="ab-stat"><strong>' + AB.faNum(pts) + "</strong><span>امتیاز باشگاه</span></div>" +
          '<div class="ab-stat"><strong>' + AB.faNum(wish.length) + "</strong><span>علاقه‌مندی</span></div></div>" +
          (myOrders.length
            ? '<div class="ab-panel ab-mt-4"><h2 style="font-size:16px">آخرین سفارش</h2><div class="ab-row ab-row--between"><div><b>' + esc(myOrders[0].code) + "</b><p class=\"ab-xs ab-muted\">" + orderDate(myOrders[0]) + "</p></div>" +
              '<a class="ab-btn ab-btn--sm ab-btn--outline" href="track.html?code=' + encodeURIComponent(myOrders[0].code) + '">پیگیری</a></div></div>'
            : '<div class="ab-empty ab-mt-4"><strong>هنوز سفارشی ثبت نکرده‌اید</strong><a class="ab-btn ab-btn--sm" href="shop.html">شروع خرید</a></div>')) +
        panel("orders", false,
          '<h2 style="font-size:20px">سفارش‌های من</h2>' +
          (myOrders.length
            ? '<div class="ab-stack">' + myOrders.map(function (o) {
                return '<div class="ab-panel" style="padding:16px"><div class="ab-row ab-row--between"><div><b>' + esc(o.code) + '</b><p class="ab-xs ab-muted">' + orderDate(o) + " · " + o.items.length + " قلم</p></div>" +
                  '<div class="ab-row"><span class="ab-sm">' + AB.money(o.total) + " تومان</span>" +
                  '<a class="ab-btn ab-btn--sm ab-btn--ghost" href="track.html?code=' + encodeURIComponent(o.code) + '">پیگیری</a></div></div></div>';
              }).join("") + "</div>"
            : '<div class="ab-empty"><strong>سفارشی نیست</strong><a class="ab-btn ab-btn--sm" href="shop.html">فروشگاه</a></div>')) +
        panel("wishlist", false,
          '<h2 style="font-size:20px">علاقه‌مندی‌ها</h2>' +
          (wish.length ? '<div class="ab-products" id="wishGrid">' + AB.grid(wish) + "</div>"
            : '<div class="ab-empty"><strong>لیست علاقه‌مندی خالی است</strong><p class="ab-sm">با زدن قلب روی هر محصول، آن را اینجا نگه دارید.</p><a class="ab-btn ab-btn--sm" href="shop.html">دیدن محصولات</a></div>')) +
        panel("addresses", false,
          '<h2 style="font-size:20px">آدرس‌های من</h2>' +
          '<div class="ab-stack" id="addressList">' + ((user.addresses || []).length
            ? user.addresses.map(function (a) {
                return '<div class="ab-address"><b>' + esc(a.province) + "، " + esc(a.city) + "</b><span>" + esc(a.line) + "</span>" +
                  '<span class="ab-xs ab-muted">' + esc(a.phone) + (a.postal ? " · " + esc(a.postal) : "") + "</span></div>";
              }).join("")
            : '<p class="ab-sm ab-muted">هنوز آدرسی ذخیره نکرده‌اید.</p>') + "</div>" +
          '<form class="ab-panel" id="addressForm"><h3 style="font-size:15px">افزودن آدرس</h3><div class="ab-form-grid">' +
            '<label class="ab-field"><span class="ab-label">استان</span><input class="ab-input" name="province" required></label>' +
            '<label class="ab-field"><span class="ab-label">شهر</span><input class="ab-input" name="city" required></label>' +
            '<label class="ab-field ab-field--full"><span class="ab-label">نشانی</span><input class="ab-input" name="line" required></label>' +
            '<label class="ab-field"><span class="ab-label">کد پستی</span><input class="ab-input" name="postal"></label>' +
            '<label class="ab-field"><span class="ab-label">تلفن</span><input class="ab-input" name="phone" inputmode="tel" value="' + esc(user.phone) + '"></label>' +
          "</div><button class=\"ab-btn\" type=\"submit\">ذخیرهٔ آدرس</button></form>") +
        panel("club", false,
          '<h2 style="font-size:20px">باشگاه مشتریان</h2>' +
          '<div class="ab-tier"><div class="ab-tier__top"><div><div class="ab-tier__brand">عطار بلد</div><div class="ab-tier__name">کارت عضویت</div></div>' +
            '<span class="ab-tier__rank">' + t.fa + " · " + t.name + "</span></div>" +
            '<div class="ab-tier__points"><strong>' + AB.money(pts) + "</strong><span>امتیاز</span></div>" +
            '<div class="ab-tier__num" dir="ltr">' + esc(user.phone) + "</div></div>" +
          (t.next ? '<p class="ab-sm ab-muted ab-mt-4">' + AB.faNum(t.next - pts) + " امتیاز تا سطح بعدی.</p>" : "") +
          '<p class="ab-sm ab-muted">هر ۱۰٬۰۰۰ تومان خرید = ۱ امتیاز. <a href="club.html" style="color:var(--ab-green)">قواعد باشگاه</a></p>') +
        panel("logout", false,
          '<div class="ab-empty"><strong>از حساب خارج شوید؟</strong><p class="ab-sm">با خروج، سبد خرید شما پاک نمی‌شود.</p>' +
          '<button class="ab-btn ab-btn--outline" type="button" id="logoutBtn">خروج از حساب</button></div>') +
      "</div>";

    var nav = $(".ab-account__nav", root);
    function showPanel(name) {
      $all("[data-panel]", nav).forEach(function (b) { b.classList.toggle("is-active", b.getAttribute("data-panel") === name); });
      $all(".ab-account__panel[id^=panel-]", root).forEach(function (p) { p.hidden = p.id !== "panel-" + name; });
      if (location.hash.replace("#", "") !== name) history.replaceState(null, "", "#" + name);
    }
    $all("[data-panel]", nav).forEach(function (btn) {
      btn.addEventListener("click", function () { showPanel(btn.getAttribute("data-panel")); });
    });
    var start = (location.hash || "#dashboard").replace("#", "");
    if (!$("#panel-" + start)) start = "dashboard";
    showPanel(start);

    var logout = $("#logoutBtn");
    if (logout) logout.addEventListener("click", function () {
      AB.userClear();
      AB.toast("از حساب خارج شدید.");
      renderAccount();
    });

    var form = $("#addressForm");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var u = AB.user();
      u.addresses = u.addresses || [];
      u.addresses.push({
        province: String(data.get("province") || "").trim(),
        city: String(data.get("city") || "").trim(),
        line: String(data.get("line") || "").trim(),
        postal: String(data.get("postal") || "").trim(),
        phone: String(data.get("phone") || "").trim()
      });
      AB.userSave(u);
      AB.toast("آدرس ذخیره شد.");
      accountPanel(u);
      showPanel("addresses");
    });

    if (!window.AB_WISH_BOUND) {
      window.AB_WISH_BOUND = true;
      document.addEventListener("ab:wish", function () {
        if (PAGE !== "account") return;
        var panel = $("#panel-wishlist");
        if (!panel || panel.hidden) return;
        var w = AB.wishlist().map(AB.product).filter(Boolean);
        var g = $("#wishGrid");
        if (g) g.innerHTML = AB.grid(w);
        if (!w.length) accountPanel(AB.user());
      });
    }
  }

  function renderAccount() {
    var root = $("#accountBody");
    if (!root) return;
    var user = AB.user();
    if (!user) {
      root.innerHTML = '<div class="ab-login"><div class="ab-login__card">' +
        '<div><span class="ab-eyebrow">حساب کاربری</span><h2 style="font-size:24px;margin-top:8px">ورود به عطار بلد</h2>' +
        '<p class="ab-sm ab-muted">با شمارهٔ موبایل وارد شوید. این نسخهٔ نمایشی است؛ کد تأیید ۱۲۳۴ است.</p></div>' +
        '<form class="ab-stack" id="loginForm">' +
          '<label class="ab-field"><span class="ab-label">نام (اختیاری)</span><input class="ab-input" name="name" autocomplete="name"></label>' +
          '<label class="ab-field"><span class="ab-label">شمارهٔ موبایل</span><input class="ab-input" name="phone" inputmode="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" required autocomplete="tel"></label>' +
          '<label class="ab-field"><span class="ab-label">کد تأیید</span><input class="ab-input" name="code" inputmode="numeric" placeholder="۱۲۳۴" required></label>' +
          '<button class="ab-btn ab-btn--block" type="submit">ورود / ثبت‌نام</button>' +
        "</form>" +
        '<p class="ab-xs ab-muted">با ورود، <a href="terms.html" style="color:var(--ab-green)">قوانین</a> و <a href="privacy.html" style="color:var(--ab-green)">حریم خصوصی</a> را می‌پذیرید.</p>' +
      "</div></div>";
      $("#loginForm").addEventListener("submit", function (e) {
        e.preventDefault();
        var data = new FormData(e.target);
        var phone = String(data.get("phone") || "").replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); }).replace(/\s|-/g, "");
        var code = String(data.get("code") || "").replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); });
        if (!/^09\d{9}$/.test(phone)) { AB.toast("شمارهٔ موبایل باید ۱۱ رقم و با ۰۹ شروع شود.", "error"); return; }
        if (code !== "1234") { AB.toast("کد تأیید نمایشی ۱۲۳۴ است.", "error"); return; }
        AB.userSave({ name: String(data.get("name") || "").trim() || "همراه عطار بلد", phone: phone, addresses: [] });
        AB.toast("خوش آمدید.");
        renderAccount();
      });
      return;
    }
    accountPanel(user);
  }

  /* ── باشگاه ─────────────────────────────────────────────────────────── */
  function initClub() {
    var slot = $("#clubCard");
    if (!slot) return;
    var user = AB.user();
    if (!user) {
      slot.innerHTML = '<div class="ab-panel"><h2 style="font-size:18px">کارت عضویت شما</h2>' +
        '<p class="ab-sm ab-muted">برای دیدن امتیاز و سطح خود وارد شوید.</p>' +
        '<a class="ab-btn ab-btn--sm" href="account.html">ورود / ثبت‌نام</a></div>';
      return;
    }
    var pts = AB.points(user);
    var t = AB.tier(pts);
    slot.innerHTML = '<div class="ab-tier"><div class="ab-tier__top"><div><div class="ab-tier__brand">عطار بلد</div><div class="ab-tier__name">کارت عضویت</div></div>' +
      '<span class="ab-tier__rank">' + t.fa + " · " + t.name + "</span></div>" +
      '<div class="ab-tier__points"><strong>' + AB.money(pts) + "</strong><span>امتیاز</span></div>" +
      '<div class="ab-tier__num" dir="ltr">' + esc(user.phone) + "</div></div>" +
      (t.next ? '<p class="ab-sm ab-muted ab-mt-4">' + AB.faNum(t.next - pts) + " امتیاز تا سطح بعدی.</p>" : '<p class="ab-sm ab-muted ab-mt-4">شما در بالاترین سطح باشگاه هستید.</p>');
  }

  /* ── مجله ───────────────────────────────────────────────────────────── */
  function initMag() {
    initNews();
    var grid = $("#magGrid");
    if (!grid) return;
    var list = AB.data.articles;
    var feat = $("#magFeatured");
    var a = list[0];
    if (feat) {
      feat.innerHTML = '<a class="ab-feature-article" href="article.html?id=' + a.id + '">' +
        '<div class="ab-feature-article__media"><img src="assets/img/atelier.webp" alt="' + esc(a.title) + '" loading="lazy"></div>' +
        '<div class="ab-feature-article__body"><span class="ab-eyebrow">مقالهٔ ویژه · ' + esc(a.cat) + "</span>" +
        "<h2>" + esc(a.title) + "</h2><p class=\"ab-sm ab-muted\">" + esc(a.excerpt) + "</p>" +
        '<span class="ab-xs ab-muted">' + esc(a.date) + " · " + AB.faNum(a.read) + " دقیقه مطالعه</span></div></a>";
    }
    grid.innerHTML = list.slice(1).map(function (a) {
      return '<a class="ab-article-card" href="article.html?id=' + a.id + '">' +
        '<div class="ab-article-card__media"><img src="assets/img/atelier.webp" alt="" loading="lazy"></div>' +
        '<div class="ab-article-card__body"><span class="ab-xs ab-muted">' + esc(a.cat) + "</span>" +
        "<h3>" + esc(a.title) + "</h3><p>" + esc(a.excerpt) + "</p>" +
        '<span class="ab-article-card__meta"><span>' + esc(a.date) + "</span><span>" + AB.faNum(a.read) + " دقیقه</span></span></div></a>";
    }).join("");
  }

  function initArticle() {
    var root = $("#articleBody");
    if (!root) return;
    var id = param("id");
    var a = AB.data.articles.filter(function (x) { return x.id === id; })[0] || AB.data.articles[0];
    document.title = a.title + " — مجلهٔ عطار بلد";
    root.innerHTML = '<div class="ab-article-head"><span class="ab-eyebrow">' + esc(a.cat) + "</span>" +
      "<h1>" + esc(a.title) + "</h1><p class=\"ab-muted\">" + esc(a.excerpt) + "</p>" +
      '<div class="ab-article-head__meta"><span>' + esc(a.date) + "</span><span>" + AB.faNum(a.read) + " دقیقه مطالعه</span><span>تحریریهٔ عطار بلد</span></div></div>" +
      '<article class="ab-prose">' + a.body.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      '<p class="ab-prose__source">' + esc(a.source) + "</p></article>";
    var related = $("#articleRelated");
    if (related) {
      related.innerHTML = AB.data.articles.filter(function (x) { return x.id !== a.id; }).slice(0, 3).map(function (x) {
        return '<a class="ab-article-card" href="article.html?id=' + x.id + '"><div class="ab-article-card__body">' +
          '<span class="ab-xs ab-muted">' + esc(x.cat) + "</span><h3>" + esc(x.title) + "</h3>" +
          '<span class="ab-article-card__meta"><span>' + esc(x.date) + "</span><span>" + AB.faNum(x.read) + " دقیقه</span></span></div></a>";
      }).join("");
    }
  }

  /* ── تماس ───────────────────────────────────────────────────────────── */
  function initContact() {
    var form = $("#contactForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var msg = String(data.get("message") || "").trim();
      if (name.length < 3) { AB.toast("نام را کامل بنویسید.", "error"); return; }
      if (phone.length < 10) { AB.toast("شمارهٔ تماس را وارد کنید.", "error"); return; }
      if (msg.length < 10) { AB.toast("متن پیام کوتاه است.", "error"); return; }
      AB.toast("پیام شما ثبت شد؛ تا یک روز کاری پاسخ می‌دهیم.");
      form.reset();
    });
  }

  /* ── راه‌اندازی ─────────────────────────────────────────────────────── */
  var init = {
    home: initHome, shop: initShop, product: initProduct,
    cart: renderCartPage, checkout: initCheckout, order: initOrder,
    track: initTrack, account: renderAccount, club: initClub,
    mag: initMag, article: initArticle, contact: initContact
  };
  if (init[PAGE]) init[PAGE]();
  if (PAGE === "cart") document.addEventListener("ab:cart", renderCartPage);
})();
