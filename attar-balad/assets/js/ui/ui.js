/* ── عطار بلد · UI helpers ──────────────────────────────────────────────── */

import { t, L, money, nf } from "../core/i18n.js";
import { icon } from "./icons.js";
import { artUrl } from "../core/art.js";
import { inWishlist, reviewAverage, addToCart } from "../core/store.js";

export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function stars(rating, count) {
  const full = Math.round(Number(rating) || 0);
  const icons = Array.from({ length: 5 }, (_, i) => icon("star")).join("");
  return `<span class="rating" title="${esc(nf(rating))} / ۵">
    <span aria-hidden="true" style="display:inline-flex;gap:2px;opacity:${full ? 1 : 0.35}">${icons}</span>
    <span>${esc(nf(rating))}${count !== undefined ? ` (${esc(nf(count))})` : ""}</span>
  </span>`;
}

export function priceHTML(product, variant) {
  const v = variant || product.variants[0];
  const compare = product.compareAt && product.compareAt > v.price ? product.compareAt : 0;
  return `<div class="price">
    <span class="price__now">${esc(money(v.price))}</span>
    ${compare ? `<span class="price__was">${esc(money(compare))}</span>` : ""}
  </div>`;
}

export function stockHTML(product) {
  const stock = product.stock;
  if (stock <= 0) return `<span class="stock-note stock-note--out">${esc(t("common.outOfStock"))}</span>`;
  if (stock <= 10) return `<span class="stock-note stock-note--low">${esc(t("common.lowStock", { n: nf(stock) }))}</span>`;
  return `<span class="stock-note">${esc(t("common.inStock"))}</span>`;
}

export function badgesHTML(product) {
  const items = [];
  if (product.new) items.push(`<span class="badge badge--new">${esc(t("common.new"))}</span>`);
  if (product.badges?.includes("bestseller")) items.push(`<span class="badge badge--gold">${esc(t("common.bestseller"))}</span>`);
  if (product.compareAt && product.compareAt > product.price) {
    const pct = Math.round(((product.compareAt - product.price) / product.compareAt) * 100);
    items.push(`<span class="badge badge--sale">${esc(t("common.sale"))} ${esc(nf(pct))}٪</span>`);
  }
  return items.join("");
}

export function productCard(product, { compact = false } = {}) {
  const rating = reviewAverage(product.id);
  const variant = product.variants[0];
  const soldOut = product.stock <= 0;
  const wished = inWishlist(product.id);
  return `<article class="product-card" data-pid="${esc(product.id)}">
    <div class="product-card__media">
      <a href="#/product/${esc(product.slug)}" aria-label="${esc(L(product.name))}">
        <img src="${artUrl(product.art)}" alt="${esc(L(product.name))} — ${esc(t("brand.name"))}" loading="lazy" width="800" height="1000" />
      </a>
      <div class="product-card__badges">${badgesHTML(product)}</div>
      <button class="product-card__wish${wished ? " is-active" : ""}" data-wish="${esc(product.id)}"
        aria-pressed="${wished}" aria-label="${esc(t("action.wishlist"))}" title="${esc(t("action.wishlist"))}">
        ${icon("heart")}
      </button>
      <div class="product-card__quick">
        <button class="btn btn--gold btn--sm btn--block" data-add="${esc(product.id)}" data-vid="${esc(variant.id)}"
          ${soldOut ? 'aria-disabled="true"' : ""}>
          ${icon("cart")}<span>${esc(soldOut ? t("common.outOfStock") : t("action.addToCart"))}</span>
        </button>
      </div>
    </div>
    <div class="product-card__body">
      <h3 class="product-card__title"><a href="#/product/${esc(product.slug)}">${esc(L(product.name))}</a></h3>
      ${compact ? "" : `<span class="product-card__sci" dir="ltr">${esc(product.sci)}</span>`}
      ${stars(rating.avg, rating.count)}
      <div class="product-card__meta">
        ${priceHTML(product, variant)}
        <span class="badge badge--sample">${esc(t("common.sample"))}</span>
      </div>
      ${stockHTML(product)}
    </div>
  </article>`;
}

export function categoryCard(category) {
  return `<a class="cat-card" href="#/shop?cat=${esc(category.id)}">
    <div class="cat-card__media">
      <img src="${artUrl(category.art)}" alt="${esc(L(category.name))}" loading="lazy" width="800" height="600" />
    </div>
    <div class="cat-card__body">
      <div>
        <b>${esc(L(category.name))}</b>
        <span>${esc(L(category.desc))}</span>
      </div>
      <span class="cat-card__arrow">${icon("chevronLeft")}</span>
    </div>
  </a>`;
}

export function articleCard(article) {
  return `<article class="article-card">
    <a class="article-card__media" href="#/magazine/${esc(article.slug)}" aria-label="${esc(L(article.title))}">
      <img src="${artUrl(article.art)}" alt="${esc(L(article.title))}" loading="lazy" width="800" height="500" />
    </a>
    <div class="article-card__body">
      <div class="article-card__meta">
        <span>${esc(t("content.readTime", { n: nf(article.read) }))}</span>
        <span aria-hidden="true">·</span>
        <time datetime="${esc(article.date)}">${esc(new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long" }).format(new Date(article.date)))}</time>
      </div>
      <h3><a href="#/magazine/${esc(article.slug)}">${esc(L(article.title))}</a></h3>
      <p>${esc(L(article.excerpt))}</p>
      <a class="article-card__more" href="#/magazine/${esc(article.slug)}">${esc(t("action.readMore"))} ←</a>
    </div>
  </article>`;
}

export function breadcrumb(items) {
  return `<nav class="breadcrumb" aria-label="breadcrumb">${items
    .map((item, i) => {
      if (i === items.length - 1) return `<span aria-current="page">${esc(item.label)}</span>`;
      return `<a href="${esc(item.href)}">${esc(item.label)}</a><span aria-hidden="true">/</span>`;
    })
    .join("")}</nav>`;
}

export function emptyState({ title, text, iconName = "package", action }) {
  return `<div class="empty">
    ${icon(iconName)}
    <h3>${esc(title)}</h3>
    <p>${esc(text)}</p>
    ${action ? `<div class="mt-4">${action}</div>` : ""}
  </div>`;
}

/* ── Toasts ───────────────────────────────────────────────────────────── */
function toastHost() {
  let host = document.querySelector(".toasts");
  if (!host) {
    host = document.createElement("div");
    host.className = "toasts";
    host.setAttribute("role", "status");
    host.setAttribute("aria-live", "polite");
    document.body.appendChild(host);
  }
  return host;
}

export function announce(message) {
  const region = document.getElementById("live-region");
  if (region) region.textContent = message;
}

export function toast(message, type = "success") {
  const host = toastHost();
  const el = document.createElement("div");
  el.className = `toast${type === "error" ? " toast--error" : ""}`;
  el.innerHTML = `${icon(type === "error" ? "alert" : "check")}<span>${esc(message)}</span>`;
  host.appendChild(el);
  announce(message);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

/* ── Modal ────────────────────────────────────────────────────────────── */
let lastFocused = null;

export function openModal(html, { label = "", onMount } = {}) {
  closeModal();
  lastFocused = document.activeElement;
  const wrap = document.createElement("div");
  wrap.className = "modal";
  wrap.innerHTML = `<div class="modal__backdrop" data-modal-close></div>
    <div class="modal__panel" role="dialog" aria-modal="true" aria-label="${esc(label)}">
      <button class="icon-btn modal__close" data-modal-close aria-label="${esc(t("action.close"))}">${icon("close")}</button>
      ${html}
    </div>`;
  document.getElementById("overlays")?.appendChild(wrap);
  document.body.style.overflow = "hidden";
  wrap.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-close]")) closeModal();
  });
  wrap.querySelectorAll("[data-modal-close]").forEach((btn) => {
    if (btn.classList.contains("modal__close")) btn.focus();
  });
  onMount?.(wrap);
}

export function closeModal() {
  const modal = document.querySelector(".modal");
  if (!modal) return;
  modal.remove();
  document.body.style.overflow = "";
  if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
  lastFocused = null;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

export function quickView(product) {
  const rating = reviewAverage(product.id);
  const variant = product.variants[0];
  const soldOut = product.stock <= 0;
  openModal(
    `<div class="quick-view">
      <img src="${artUrl(product.art)}" alt="${esc(L(product.name))}" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:14px;margin-bottom:1rem" />
      <p class="eyebrow">${esc(t("common.sampleData"))}</p>
      <h2 style="font-family:var(--font-display);font-size:var(--fs-xl)">${esc(L(product.name))}</h2>
      <p class="product-card__sci" dir="ltr">${esc(product.sci)}</p>
      <div class="mt-2">${stars(rating.avg, rating.count)}</div>
      <p class="mt-3">${esc(L(product.short))}</p>
      <div class="cluster mt-4">
        ${priceHTML(product, variant)}
        ${stockHTML(product)}
      </div>
      <div class="cluster mt-5">
        <button class="btn btn--gold" data-add="${esc(product.id)}" data-vid="${esc(variant.id)}" ${soldOut ? 'aria-disabled="true"' : ""}>
          ${icon("cart")}<span>${esc(soldOut ? t("common.outOfStock") : t("action.addToCart"))}</span>
        </button>
        <a class="btn btn--outline" href="#/product/${esc(product.slug)}" data-modal-close>${esc(t("action.details"))}</a>
      </div>
    </div>`,
    { label: L(product.name) }
  );
}

export function quickViewHandler(product) {
  const add = document.querySelector(`[data-add="${product.id}"]`);
  if (add) add.addEventListener("click", () => addToCart(product.id, product.variants[0].id, 1));
}
