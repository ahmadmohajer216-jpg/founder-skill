/* ── عطار بلد · App bootstrap ─────────────────────────────────────────────
   مسیریابی هش‌محور، پوسته‌ی ثابت (هدر/فوتر)، جست‌وجوی زنده، سبد خرید،
   منوی موبایل و دستیار محلی. */

import { t, setLang, getLang, L, nf } from "./core/i18n.js";
import { defineRoute, startRouter, navigate, resolve, parseHash } from "./core/router.js";
import { mountCartDrawer, openCartDrawer, syncCartBadge } from "./ui/cart-ui.js";
import { headerHTML, footerHTML, mobileNavHTML } from "./ui/layout.js";
import { esc, toast, emptyState } from "./ui/ui.js";
import { artUrl, tilePatternUrl } from "./core/art.js";
import { mountChat } from "./ui/chat.js";
import {
  addToCart,
  toggleWishlist,
  inWishlist,
  catalog,
  currentUser,
  myOrders,
} from "./core/store.js";
import { home } from "./views/home.js";
import { shop } from "./views/shop.js";
import { product } from "./views/product.js";
import { cart, checkout, order } from "./views/commerce.js";
import { account } from "./views/account.js";
import { admin } from "./views/admin.js";
import {
  magazine,
  article,
  plantsPage,
  plantPage,
  historyPage,
  gardenPage,
  aboutPage,
  contactPage,
  notFound,
} from "./views/editorial.js";

const views = {
  home,
  shop,
  product,
  cart,
  checkout,
  order,
  account,
  accountOrder,
  admin,
  magazine,
  article,
  plantsPage,
  plantPage,
  historyPage,
  gardenPage,
  aboutPage,
  contactPage,
  notfound: notFound,
};

/* Order detail inside the account area: only the owner may see it. */
function accountOrder(params) {
  const user = currentUser();
  const mine = myOrders().find((o) => o.code === params.code);
  if (!user || !mine) {
    return {
      title: t("order.notFound"),
      description: t("account.loginRequired"),
      html: `<section class="section"><div class="container">${emptyState({
        title: t("order.notFound"),
        text: t("account.loginRequired"),
        iconName: "package",
        action: `<a class="btn btn--gold btn--sm" href="#/account">${esc(t("account.login"))}</a>`,
      })}</div></section>`,
    };
  }
  return order(params);
}

defineRoute("/account/orders/:code", accountOrder);
defineRoute("/account/:tab", account);
defineRoute("/account", account);
defineRoute("/admin/:tab", admin);
defineRoute("/admin", admin);
defineRoute("/magazine/:slug", article);
defineRoute("/magazine", magazine);
defineRoute("/plants/:slug", plantPage);
defineRoute("/plants", plantsPage);
defineRoute("/product/:slug", product);
defineRoute("/shop", shop);
defineRoute("/cart", cart);
defineRoute("/checkout", checkout);
defineRoute("/order/:code", order);
defineRoute("/history", historyPage);
defineRoute("/garden", gardenPage);
defineRoute("/about", aboutPage);
defineRoute("/contact", contactPage);
defineRoute("/", home);

const app = document.getElementById("app");
let currentPath = "/";
let revealObserver = null;

function setHeaderHeight() {
  const header = document.getElementById("site-header");
  if (header) {
    document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
  }
}

function initReveal() {
  if (revealObserver) revealObserver.disconnect();
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  items.forEach((el) => revealObserver.observe(el));
}

/* ── Header interactions ──────────────────────────────────────────────── */
function bindShell() {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang === getLang()) return;
      setLang(btn.dataset.lang);
      try {
        localStorage.setItem("attar-balad:lang", btn.dataset.lang);
      } catch {
        /* ignore */
      }
      resolve();
    });
  });

  const searchToggle = document.querySelector("[data-search-toggle]");
  const searchPanel = document.querySelector("[data-search-panel]");
  const searchInput = document.querySelector("[data-search-input]");
  const searchResults = document.querySelector("[data-search-results]");

  const closeSearch = () => {
    if (!searchPanel) return;
    searchPanel.hidden = true;
    searchToggle?.setAttribute("aria-expanded", "false");
  };

  const renderHits = (value) => {
    const q = String(value || "").trim().toLowerCase();
    if (!searchResults) return;
    if (!q) {
      searchResults.innerHTML = `<p class="tiny muted" style="padding:8px">${esc(t("action.searchPlaceholder"))}</p>`;
      return;
    }
    const hits = catalog()
      .filter((p) =>
        [L(p.name), p.name.en, p.sci].join(" ").toLowerCase().includes(q)
      )
      .slice(0, 5);
    searchResults.innerHTML = hits.length
      ? hits
          .map(
            (p) => `<a class="search-hit" href="#/product/${esc(p.slug)}" data-search-hit>
              <img src="${artUrl(p.art)}" alt="" width="42" height="42" />
              <span><strong>${esc(L(p.name))}</strong><span dir="ltr">${esc(p.sci)}</span></span>
            </a>`
          )
          .join("")
      : `<p class="tiny muted" style="padding:8px">${esc(t("shop.noResults"))}</p>`;
  };

  searchToggle?.addEventListener("click", () => {
    const isOpen = searchPanel.hidden;
    searchPanel.hidden = !isOpen;
    searchToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      renderHits(searchInput.value);
      searchInput.focus();
    }
  });

  searchInput?.addEventListener("input", () => renderHits(searchInput.value));
  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = searchInput.value.trim();
      closeSearch();
      navigate(value ? `/shop?q=${encodeURIComponent(value)}` : "/shop");
    }
    if (event.key === "Escape") closeSearch();
  });

  searchResults?.addEventListener("click", (event) => {
    if (event.target.closest("[data-search-hit]")) closeSearch();
  });

  document.querySelectorAll("[data-cart-open]").forEach((btn) => {
    btn.addEventListener("click", openCartDrawer);
  });
}

function mountMobileNav() {
  const old = document.getElementById("mobile-nav");
  old?.remove();
  document.getElementById("overlays").insertAdjacentHTML("beforeend", mobileNavHTML());
  const nav = document.getElementById("mobile-nav");
  const toggle = document.querySelector("[data-mobile-toggle]");

  const open = () => {
    nav.classList.add("is-open");
    nav.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    toggle?.setAttribute("aria-expanded", "true");
  };
  const close = () => {
    nav.classList.remove("is-open");
    nav.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    toggle?.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", open);
  nav.addEventListener("click", (event) => {
    if (event.target.closest("[data-mobile-close]")) close();
    if (event.target.closest("a")) close();
  });
}

/* One-time document listeners (bound once, they look elements up live). */
document.addEventListener("click", (event) => {
  const panel = document.querySelector("[data-search-panel]");
  if (!panel || panel.hidden) return;
  if (event.target.closest(".header-search")) return;
  panel.hidden = true;
  document.querySelector("[data-search-toggle]")?.setAttribute("aria-expanded", "false");
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const nav = document.getElementById("mobile-nav");
  if (nav?.classList.contains("is-open")) {
    nav.classList.remove("is-open");
    nav.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.querySelector("[data-mobile-toggle]")?.setAttribute("aria-expanded", "false");
  }
});

/* ── Global actions (add to cart / wishlist) ──────────────────────────── */
document.addEventListener("click", (event) => {
  const addBtn = event.target.closest("[data-add]");
  if (addBtn) {
    event.preventDefault();
    if (addBtn.getAttribute("aria-disabled") === "true") {
      toast(t("common.outOfStock"), "error");
      return;
    }
    const qtyEl = addBtn.dataset.qtyFrom ? document.querySelector(addBtn.dataset.qtyFrom) : null;
    const qty = qtyEl ? Number(qtyEl.dataset.qtyValue || qtyEl.value || 1) : 1;
    const ok = addToCart(addBtn.dataset.add, addBtn.dataset.vid, qty);
    if (!ok) {
      toast(t("common.outOfStock"), "error");
      return;
    }
    toast(t("cart.addedTitle"));
    openCartDrawer();
    return;
  }

  const wishBtn = event.target.closest("[data-wish]");
  if (wishBtn) {
    event.preventDefault();
    const active = toggleWishlist(wishBtn.dataset.wish);
    wishBtn.classList.toggle("is-active", active);
    wishBtn.setAttribute("aria-pressed", String(active));
    toast(active ? t("account.addedToWishlist") : t("account.removedFromWishlist"));
  }
});

/* ── Render loop ──────────────────────────────────────────────────────── */
async function render(name, params, query, path) {
  currentPath = path;
  const view = typeof name === "function" ? name : views[name] || notFound;
  let result;
  try {
    result = await view(params, query);
  } catch (error) {
    console.error(error);
    result = {
      title: t("notfound.title"),
      description: t("notfound.text"),
      html: `<section class="section"><div class="container notfound"><b aria-hidden="true">!</b><h1>${esc(
        t("notfound.title")
      )}</h1><p class="muted mt-3">${esc(String(error.message || ""))}</p><div class="cluster mt-5" style="justify-content:center"><a class="btn btn--gold" href="#/">${esc(
        t("notfound.cta")
      )}</a></div></div></section>`,
    };
  }

  document.title = result.title;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.content = result.description || "";

  app.innerHTML = `${headerHTML(path)}
    <main id="main" class="page-main${path === "/" ? "" : " page-offset"}">${result.html}</main>
    ${footerHTML()}`;

  setHeaderHeight();
  bindShell();
  mountMobileNav();
  result.after?.(document.getElementById("main"));
  syncCartBadge();
  initReveal();
  window.scrollTo(0, 0);
}

window.addEventListener(
  "scroll",
  () => {
    const header = document.getElementById("site-header");
    if (!header) return;
    const solid = currentPath !== "/" || window.scrollY > 40;
    header.classList.toggle("is-solid", solid);
    header.classList.toggle("is-transparent", !solid);
  },
  { passive: true }
);

window.addEventListener("resize", setHeaderHeight);

function boot() {
  try {
    const stored = localStorage.getItem("attar-balad:lang");
    setLang(stored === "en" ? "en" : "fa");
  } catch {
    setLang("fa");
  }
  document.documentElement.style.setProperty("--pattern-tile", `url("${tilePatternUrl()}")`);
  mountCartDrawer();
  mountChat();
  startRouter(render);
}

boot();
