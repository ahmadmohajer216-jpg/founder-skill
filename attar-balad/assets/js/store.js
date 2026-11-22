/* عطار بلد — لایهٔ فروشگاه (فاز ۳)
   سبد، علاقه‌مندی، سفارش و کارت محصول؛ همه روی localStorage و بدون وابستگی بیرونی. */
(function () {
  "use strict";

  var D = window.AB_DATA || { products: [], categories: [], articles: [] };
  var FA = "۰۱۲۳۴۵۶۷۸۹";
  var CART_KEY = "ab_cart_v1";
  var WISH_KEY = "ab_wish_v1";
  var ORDER_KEY = "ab_orders_v1";
  var USER_KEY = "ab_user_v1";
  var COUPON_KEY = "ab_coupon_v1";

  var COUPONS = {
    ATTAR10: { type: "percent", value: 10, label: "۱۰٪ تخفیف" },
    NOWRUZ: { type: "amount", value: 100000, label: "۱۰۰٬۰۰۰ تومان تخفیف" }
  };

  function faNum(value) {
    return String(value).replace(/[0-9]/g, function (d) { return FA[+d]; });
  }
  function money(n) {
    return faNum(Number(n || 0).toLocaleString("en-US")).replace(/,/g, "٬");
  }
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function read(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function product(id) {
    for (var i = 0; i < D.products.length; i++) if (D.products[i].id === id) return D.products[i];
    return null;
  }
  function category(id) {
    for (var i = 0; i < D.categories.length; i++) if (D.categories[i].id === id) return D.categories[i];
    return { id: id, name: "", icon: "i-leaf" };
  }
  function sizeOf(p, label) {
    if (!p) return null;
    for (var i = 0; i < p.sizes.length; i++) if (p.sizes[i].label === label) return p.sizes[i];
    return p.sizes[0];
  }
  function priceOf(id, label) {
    var p = product(id); var s = p && sizeOf(p, label); return s ? s.price : 0;
  }

  /* ── سبد ────────────────────────────────────────────────────────────── */
  function cart() { return read(CART_KEY, []); }
  function cartSave(items) { write(CART_KEY, items); document.dispatchEvent(new CustomEvent("ab:cart")); }
  function cartAdd(id, size, qty) {
    var p = product(id);
    if (!p || p.stock <= 0) return false;
    qty = Math.max(1, qty || 1);
    var items = cart();
    var label = size || p.sizes[0].label;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id && items[i].size === label) {
        items[i].qty = Math.min(p.stock, items[i].qty + qty);
        cartSave(items); return true;
      }
    }
    items.push({ id: id, size: label, qty: Math.min(p.stock, qty) });
    cartSave(items); return true;
  }
  function cartQty(index, qty) {
    var items = cart();
    if (!items[index]) return;
    var p = product(items[index].id);
    items[index].qty = Math.max(1, Math.min(p ? p.stock : 99, qty));
    cartSave(items);
  }
  function cartRemove(index) {
    var items = cart(); items.splice(index, 1); cartSave(items);
  }
  function cartClear() { cartSave([]); }
  function cartCount() {
    return cart().reduce(function (sum, item) { return sum + item.qty; }, 0);
  }
  function cartLines() {
    return cart().map(function (item) {
      var p = product(item.id);
      var s = p && sizeOf(p, item.size);
      return {
        id: item.id, size: item.size, qty: item.qty,
        name: p ? p.fa : item.id, img: p ? p.img : null,
        price: s ? s.price : 0, line: (s ? s.price : 0) * item.qty
      };
    });
  }
  function subtotal() {
    return cartLines().reduce(function (sum, line) { return sum + line.line; }, 0);
  }
  function coupon() { return read(COUPON_KEY, null); }
  function setCoupon(code) {
    code = String(code || "").trim().toUpperCase();
    if (!COUPONS[code]) return { ok: false, message: "این کد تخفیف معتبر نیست." };
    write(COUPON_KEY, { code: code, type: COUPONS[code].type, value: COUPONS[code].value, label: COUPONS[code].label });
    document.dispatchEvent(new CustomEvent("ab:cart"));
    return { ok: true, message: "کد تخفیف «" + code + "» اعمال شد." };
  }
  function clearCoupon() { write(COUPON_KEY, null); document.dispatchEvent(new CustomEvent("ab:cart")); }
  function discount() {
    var c = coupon(); if (!c) return 0;
    var sub = subtotal();
    return c.type === "percent" ? Math.round(sub * c.value / 100) : Math.min(sub, c.value);
  }
  var FREE_SHIPPING = 500000;
  function shippingFee(price) {
    var sub = subtotal();
    if (sub === 0 || sub >= FREE_SHIPPING) return 0;
    return price || 49000;
  }
  function total(shipping) {
    return Math.max(0, subtotal() - discount()) + shippingFee(shipping);
  }

  /* ── علاقه‌مندی ─────────────────────────────────────────────────────── */
  function wishlist() { return read(WISH_KEY, []); }
  function wishHas(id) { return wishlist().indexOf(id) !== -1; }
  function wishToggle(id) {
    var list = wishlist();
    var on = list.indexOf(id) === -1;
    if (on) list.push(id); else list.splice(list.indexOf(id), 1);
    write(WISH_KEY, list);
    document.dispatchEvent(new CustomEvent("ab:wish"));
    return on;
  }

  /* ── سفارش و کاربر ──────────────────────────────────────────────────── */
  function orders() { return read(ORDER_KEY, []); }
  function orderSave(order) {
    var list = orders(); list.unshift(order); write(ORDER_KEY, list); return order;
  }
  function orderFind(code) {
    code = String(code || "").trim().toUpperCase();
    var list = orders();
    for (var i = 0; i < list.length; i++) if (String(list[i].code).toUpperCase() === code) return list[i];
    return null;
  }
  function user() { return read(USER_KEY, null); }
  function userSave(u) { write(USER_KEY, u); document.dispatchEvent(new CustomEvent("ab:user")); }
  function userClear() { write(USER_KEY, null); document.dispatchEvent(new CustomEvent("ab:user")); }
  function points(u) {
    var list = orders();
    var sum = 0;
    for (var i = 0; i < list.length; i++) {
      if (!u || list[i].phone === u.phone) sum += Math.floor(list[i].total / 10000);
    }
    return sum;
  }
  function tier(pts) {
    if (pts >= 5000) return { name: "VIP", fa: "الماس", next: 0 };
    if (pts >= 2000) return { name: "Gold", fa: "طلایی", next: 5000 };
    if (pts >= 500) return { name: "Silver", fa: "نقره‌ای", next: 2000 };
    return { name: "Bronze", fa: "برنزی", next: 500 };
  }

  /* ── کارت محصول ─────────────────────────────────────────────────────── */
  function rating(p) {
    return '<span class="ab-rating" title="' + p.rating + ' از ۵">' +
      '<svg aria-hidden="true"><use href="#i-star"/></svg>' +
      faNum(p.rating.toFixed(1)) + ' <span class="ab-xs">(' + faNum(p.reviews) + ')</span></span>';
  }
  function plate(p, large) {
    return '<div class="ab-plate' + (large ? " ab-plate--lg" : "") + '" aria-hidden="true">' +
      '<svg class="ab-plate__icon"><use href="#' + (category(p.cat).icon || "i-leaf") + '"/></svg>' +
      '<span class="ab-plate__bot">' + esc(p.botanical) + "</span></div>";
  }
  function card(p) {
    var cat = category(p.cat);
    var badges = "";
    if (p.soon) badges += '<span class="ab-badge ab-badge--muted">تصویر موقت</span>';
    if (p.stock === 0) badges += '<span class="ab-badge ab-badge--out">ناموجود</span>';
    if (p.tags.indexOf("ویژه") !== -1) badges += '<span class="ab-badge ab-badge--sale">ویژه</span>';
    if (p.tags.indexOf("پرفروش") !== -1) badges += '<span class="ab-badge ab-badge--new">پرفروش</span>';
    var addBtn = p.stock === 0
      ? '<button class="ab-btn ab-btn--sm ab-btn--outline" type="button" disabled aria-disabled="true">ناموجود</button>'
      : '<button class="ab-btn ab-btn--sm" type="button" data-add="' + p.id + '">افزودن</button>';
    return '<article class="ab-card ab-card--product" data-product="' + p.id + '">' +
      '<div class="ab-card__media">' +
        '<a href="product.html?id=' + encodeURIComponent(p.id) + '" aria-label="' + esc(p.fa) + '">' +
          (p.img ? '<img src="' + p.img + '" alt="' + esc(p.fa) + '" width="400" height="400" loading="lazy">' : plate(p, false)) +
        "</a>" +
        '<div class="ab-card__badges">' + badges + "</div>" +
        '<button class="ab-card__fav' + (wishHas(p.id) ? " is-on" : "") + '" type="button" data-wish="' + p.id + '" aria-label="افزودن ' + esc(p.fa) + ' به علاقه‌مندی‌ها" aria-pressed="' + (wishHas(p.id) ? "true" : "false") + '">' +
          '<svg aria-hidden="true"><use href="#i-heart"/></svg></button>' +
      "</div>" +
      '<div class="ab-card__body">' +
        '<span class="ab-card__cat">' + esc(cat.name) + "</span>" +
        '<a class="ab-card__title" href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.fa) + "</a>" +
        '<span class="ab-card__meta">' + esc(p.sizes[0].label) + " · " + rating(p) + "</span>" +
        '<div class="ab-card__foot">' +
          '<span class="ab-price"><span class="ab-price__now">' + money(p.sizes[0].price) + '</span><span class="ab-price__unit">تومان</span></span>' +
          addBtn +
        "</div>" +
      "</div></article>";
  }
  function grid(list) {
    return list.map(card).join("");
  }

  /* ── توست ───────────────────────────────────────────────────────────── */
  function toast(message, kind) {
    var wrap = document.querySelector(".ab-toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "ab-toast-wrap";
      wrap.setAttribute("role", "status");
      wrap.setAttribute("aria-live", "polite");
      document.body.appendChild(wrap);
    }
    var node = document.createElement("div");
    node.className = "ab-toast" + (kind === "error" ? " ab-toast--error" : "");
    node.innerHTML = '<svg aria-hidden="true"><use href="#' + (kind === "error" ? "i-x" : "i-check") + '"/></svg><span>' + esc(message) + "</span>";
    wrap.appendChild(node);
    setTimeout(function () { node.remove(); }, 3200);
  }

  window.AB = {
    data: D, faNum: faNum, money: money, esc: esc, product: product, category: category,
    sizeOf: sizeOf, priceOf: priceOf,
    cart: cart, cartAdd: cartAdd, cartQty: cartQty, cartRemove: cartRemove, cartClear: cartClear,
    cartCount: cartCount, cartLines: cartLines, subtotal: subtotal, coupon: coupon,
    setCoupon: setCoupon, clearCoupon: clearCoupon, discount: discount,
    shippingFee: shippingFee, total: total, FREE_SHIPPING: FREE_SHIPPING,
    wishlist: wishlist, wishHas: wishHas, wishToggle: wishToggle,
    orders: orders, orderSave: orderSave, orderFind: orderFind,
    user: user, userSave: userSave, userClear: userClear, points: points, tier: tier,
    card: card, grid: grid, plate: plate, rating: rating, toast: toast
  };

  /* افزودن و علاقه‌مندی از هر جای صفحه */
  document.addEventListener("click", function (event) {
    var add = event.target.closest("[data-add]");
    if (add) {
      var p = product(add.getAttribute("data-add"));
      if (p && cartAdd(p.id, p.sizes[0].label, 1)) {
        toast("«" + p.fa + "» به سبد اضافه شد.");
        if (window.AB_OPEN_CART) window.AB_OPEN_CART();
      }
      return;
    }
    var wish = event.target.closest("[data-wish]");
    if (wish) {
      var on = wishToggle(wish.getAttribute("data-wish"));
      wish.classList.toggle("is-on", on);
      wish.setAttribute("aria-pressed", on ? "true" : "false");
      toast(on ? "به علاقه‌مندی‌ها اضافه شد." : "از علاقه‌مندی‌ها حذف شد.");
    }
  });
})();
