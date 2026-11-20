/* ── عطار بلد · Site chrome ─────────────────────────────────────────────── */

import { t, L, nf } from "../core/i18n.js";
import { icon } from "../ui/icons.js";
import { esc } from "../ui/ui.js";
import { categories } from "../data/catalog.js";
import { currentUser, isAdmin, cartCount, catalog } from "../core/store.js";
import { artUrl } from "../core/art.js";

const navItems = [
  { key: "nav.home", href: "#/", match: "/" },
  { key: "nav.shop", href: "#/shop", match: "/shop", mega: true },
  { key: "nav.about", href: "#/about", match: "/about" },
  { key: "nav.herbs", href: "#/shop?cat=herbal", match: "/shop" },
  { key: "nav.plants", href: "#/plants", match: "/plants" },
  { key: "nav.magazine", href: "#/magazine", match: "/magazine" },
  { key: "nav.contact", href: "#/contact", match: "/contact" },
];

function megaMenu() {
  const featured = ["p-saffron", "p-honey"];
  return `<div class="mega" role="menu" aria-label="${esc(t("nav.shop"))}">
    <div class="container mega__inner">
      <div class="mega__col">
        <h4>${esc(t("shop.category"))}</h4>
        <div class="mega__list">
          ${categories
            .map(
              (c) =>
                `<a role="menuitem" href="#/shop?cat=${esc(c.id)}">${esc(L(c.name))}</a>`
            )
            .join("")}
        </div>
      </div>
      <div class="mega__col">
        <h4>${esc(t("nav.plants"))}</h4>
        <div class="mega__list">
          <a href="#/plants">${esc(t("content.plantsTitle"))}</a>
          <a href="#/history">${esc(t("nav.history"))}</a>
          <a href="#/garden">${esc(t("nav.garden"))}</a>
          <a href="#/magazine">${esc(t("nav.magazine"))}</a>
          <a href="#/about">${esc(t("nav.about"))}</a>
          <a href="#/contact">${esc(t("nav.contact"))}</a>
        </div>
      </div>
      <div class="mega__col">
        <h4>${esc(t("home.bestTitle"))}</h4>
        <div class="stack" style="gap:10px">
          ${featured
            .map((p) => {
              const product = catalog().find((item) => item.id === p);
              if (!product) return "";
              return `<a class="mega__feature" href="#/product/${esc(product.slug)}">
                <img src="${artUrl(product.art)}" alt="" width="84" height="84" />
                <span><b style="display:block;font-size:var(--fs-sm)">${esc(L(product.name))}</b>
                <span class="tiny muted">${esc(t("common.sampleData"))}</span></span>
              </a>`;
            })
            .join("")}
        </div>
      </div>
    </div>
  </div>`;
}

export function headerHTML(path) {
  const user = currentUser();
  const transparent = path === "/";
  return `<header class="site-header ${transparent ? "is-transparent" : "is-solid"}" id="site-header">
    <div class="topbar">
      <div class="container topbar__inner">
        <span class="topbar__note">${icon("leaf")} ${esc(t("topbar.note"))}</span>
        <div class="topbar__links">
          <span class="topbar__note topbar__note--hide">${icon("clock")} ${esc(t("topbar.support"))}</span>
          <span class="badge badge--gold">${esc(t("topbar.demo"))}</span>
          <div class="lang-switch" role="group" aria-label="${esc(t("common.language"))}">
            <button type="button" data-lang="fa" aria-pressed="${document.documentElement.lang !== "en"}">فا</button>
            <button type="button" data-lang="en" aria-pressed="${document.documentElement.lang === "en"}">EN</button>
          </div>
        </div>
      </div>
    </div>
    <div class="container header-main">
      <a class="brand" href="#/" aria-label="${esc(t("brand.name"))}">
        <span class="brand__mark"><img src="assets/img/logo.svg" alt="" width="44" height="44" /></span>
        <span class="brand__name"><b>${esc(t("brand.name"))}</b><span>${esc(t("brand.latin"))}</span></span>
      </a>
      <nav class="nav" aria-label="${esc(t("nav.home"))}">
        ${navItems
          .map(
            (item) => `<div class="nav__item${item.mega ? " nav__item--mega" : ""}">
              <a class="nav__link" href="${item.href}" ${path === item.match ? 'aria-current="page"' : ""}>
                ${esc(t(item.key))}${item.mega ? icon("chevronDown") : ""}
              </a>
              ${item.mega ? megaMenu() : ""}
            </div>`
          )
          .join("")}
      </nav>
      <div class="header-actions">
        <div class="header-search">
          <button class="icon-btn" type="button" data-search-toggle aria-expanded="false" aria-label="${esc(t("action.search"))}">${icon("search")}</button>
          <div class="search-panel" data-search-panel hidden>
            <div class="search-panel__field">
              <input class="input" type="search" data-search-input placeholder="${esc(t("action.searchPlaceholder"))}" aria-label="${esc(t("action.search"))}" />
            </div>
            <div class="search-panel__results" data-search-results></div>
          </div>
        </div>
        ${
          isAdmin()
            ? `<a class="icon-btn" href="#/admin" aria-label="${esc(t("nav.admin"))}" title="${esc(t("nav.admin"))}">${icon("dashboard")}</a>`
            : ""
        }
        <a class="icon-btn" href="${user ? "#/account/profile" : "#/account"}" aria-label="${esc(t("action.account"))}" title="${user ? esc(user.name) : esc(t("action.login"))}">${icon("user")}</a>
        <button class="icon-btn" type="button" data-cart-open aria-label="${esc(t("action.cart"))}">
          ${icon("cart")}<span class="cart-count" data-cart-count ${cartCount() === 0 ? "hidden" : ""}>${esc(nf(cartCount()))}</span>
        </button>
        <button class="icon-btn mobile-toggle" type="button" data-mobile-toggle aria-label="${esc(t("nav.home"))}" aria-expanded="false">${icon("menu")}</button>
      </div>
    </div>
  </header>`;
}

export function footerHTML() {
  const year = new Intl.DateTimeFormat(document.documentElement.lang === "en" ? "en-GB" : "fa-IR", { year: "numeric" }).format(new Date());
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="#/" aria-label="${esc(t("brand.name"))}">
            <span class="brand__mark"><img src="assets/img/logo.svg" alt="" width="44" height="44" /></span>
            <span class="brand__name"><b style="color:var(--c-cream)">${esc(t("brand.name"))}</b><span style="color:rgba(247,243,232,.6)">${esc(t("brand.latin"))}</span></span>
          </a>
          <p>${esc(t("footer.about"))}</p>
          <div class="cluster mt-4">
            <a class="icon-btn" href="#/contact" aria-label="Instagram" style="border-color:rgba(247,243,232,.25)">${icon("instagram")}</a>
            <a class="icon-btn" href="#/contact" aria-label="Chat" style="border-color:rgba(247,243,232,.25)">${icon("chat")}</a>
            <a class="icon-btn" href="#/contact" aria-label="Email" style="border-color:rgba(247,243,232,.25)">${icon("mail")}</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>${esc(t("footer.shop"))}</h4>
          ${categories
            .slice(0, 6)
            .map((c) => `<a href="#/shop?cat=${esc(c.id)}">${esc(L(c.name))}</a>`)
            .join("")}
        </div>
        <div class="footer-col">
          <h4>${esc(t("footer.guide"))}</h4>
          <a href="#/plants">${esc(t("footer.plants"))}</a>
          <a href="#/magazine">${esc(t("footer.magazine"))}</a>
          <a href="#/garden">${esc(t("footer.garden"))}</a>
          <a href="#/history">${esc(t("footer.history"))}</a>
          <a href="#/contact#faq">${esc(t("footer.faq"))}</a>
        </div>
        <div class="footer-col">
          <h4>${esc(t("footer.contact"))}</h4>
          <a href="#/about">${esc(t("footer.aboutUs"))}</a>
          <a href="#/contact">${esc(t("footer.shipping"))}</a>
          <a href="#/contact">${esc(t("footer.returns"))}</a>
          <a href="#/contact">${esc(t("footer.privacy"))}</a>
          <a href="#/contact">${esc(t("footer.terms"))}</a>
        </div>
      </div>
      <div class="footer-badges" aria-label="${esc(t("footer.trust"))}">
        <span class="footer-badge">${icon("shield")} ${esc(t("footer.trustNote"))}</span>
        <span class="footer-badge">${icon("creditCard")} ${esc(t("checkout.payDemo"))}</span>
        <span class="footer-badge">${icon("truck")} ${esc(t("checkout.shipPost"))} · ${esc(t("checkout.shipTipax"))}</span>
        <span class="footer-badge">${icon("instagram")} Instagram</span>
      </div>
      <div class="footer-wordmark" aria-hidden="true">${esc(t("brand.name"))}</div>
      <div class="footer-bottom">
        <span>${esc(t("footer.rights")).replace("۲۰۲۶", year).replace("2026", year)}</span>
        <span>${esc(t("footer.built"))}</span>
      </div>
    </div>
  </footer>`;
}

export function mobileNavHTML() {
  const user = currentUser();
  return `<div class="mobile-nav" id="mobile-nav" aria-hidden="true">
    <div class="mobile-nav__panel">
      <div class="mobile-nav__head">
        <span class="brand">
          <span class="brand__mark"><img src="assets/img/logo.svg" alt="" width="38" height="38" /></span>
          <span class="brand__name"><b>${esc(t("brand.name"))}</b></span>
        </span>
        <button class="icon-btn" data-mobile-close aria-label="${esc(t("action.close"))}">${icon("close")}</button>
      </div>
      <a class="mobile-nav__link" href="#/">${esc(t("nav.home"))}</a>
      <details class="mobile-nav__group">
        <summary>${esc(t("nav.shop"))} ${icon("chevronDown")}</summary>
        <a href="#/shop">${esc(t("shop.allCategories"))}</a>
        ${categories
          .map((c) => `<a href="#/shop?cat=${esc(c.id)}">${esc(L(c.name))}</a>`)
          .join("")}
      </details>
      <a class="mobile-nav__link" href="#/about">${esc(t("nav.about"))}</a>
      <a class="mobile-nav__link" href="#/plants">${esc(t("nav.plants"))}</a>
      <a class="mobile-nav__link" href="#/magazine">${esc(t("nav.magazine"))}</a>
      <a class="mobile-nav__link" href="#/history">${esc(t("nav.history"))}</a>
      <a class="mobile-nav__link" href="#/garden">${esc(t("nav.garden"))}</a>
      <a class="mobile-nav__link" href="#/contact">${esc(t("nav.contact"))}</a>
      <a class="mobile-nav__link" href="${user ? "#/account/profile" : "#/account"}">
        ${esc(user ? t("nav.account") : t("action.login"))}
      </a>
      ${user ? `<a class="mobile-nav__link" href="#/account/orders">${esc(t("account.orders"))}</a>` : ""}
      ${isAdmin() ? `<a class="mobile-nav__link" href="#/admin">${esc(t("nav.admin"))}</a>` : ""}
      <div class="mt-5">
        <div class="lang-switch">
          <button type="button" data-lang="fa" aria-pressed="${document.documentElement.lang !== "en"}">فارسی</button>
          <button type="button" data-lang="en" aria-pressed="${document.documentElement.lang === "en"}">English</button>
        </div>
      </div>
    </div>
    <div class="mobile-nav__scrim" data-mobile-close></div>
  </div>`;
}
