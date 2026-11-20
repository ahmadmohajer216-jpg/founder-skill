/* ── عطار بلد · Cart drawer ───────────────────────────────────────────────
   کشوی سبد خرید در همه‌ی صفحات سوار می‌شود و با هر تغییر در store
   دوباره رندر می‌شود تا شمارنده و مبالغ همیشه هم‌زمان به‌روز باشند. */

import { t, L, money, nf } from "../core/i18n.js";
import { cartLines, cartTotals, setCartQty, removeFromCart, subscribe } from "../core/store.js";
import { artUrl } from "../core/art.js";
import { icon } from "./icons.js";
import { esc, toast } from "./ui.js";

let mounted = false;

export function mountCartDrawer() {
  if (mounted) return;
  mounted = true;
  const host = document.getElementById("overlays");
  if (!host) return;
  host.insertAdjacentHTML(
    "beforeend",
    `<div class="overlay" id="cart-scrim" data-cart-close hidden></div>
     <aside class="drawer" id="cart-drawer" aria-hidden="true" aria-label="${esc(t("cart.title"))}">
       <div class="drawer__head">
         <h2>${esc(t("cart.title"))}</h2>
         <button class="icon-btn" data-cart-close aria-label="${esc(t("action.close"))}">${icon("close")}</button>
       </div>
       <div class="drawer__body" id="cart-drawer-body"></div>
       <div class="drawer__foot" id="cart-drawer-foot"></div>
     </aside>`
  );

  const scrim = document.getElementById("cart-scrim");
  const drawer = document.getElementById("cart-drawer");
  const close = () => closeCartDrawer();

  scrim.addEventListener("click", close);
  drawer.addEventListener("click", (event) => {
    if (event.target.closest("[data-cart-close]")) close();
  });

  drawer.addEventListener("click", (event) => {
    const qtyBtn = event.target.closest("[data-line-qty]");
    if (qtyBtn) {
      const { pid, vid, delta } = qtyBtn.dataset;
      const line = cartLines().find((l) => l.product.id === pid && l.variant.id === vid);
      if (line) setCartQty(pid, vid, line.qty + Number(delta));
      return;
    }
    const removeBtn = event.target.closest("[data-line-remove]");
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.pid, removeBtn.dataset.vid);
      toast(t("cart.updated"));
    }
  });

  subscribe(() => {
    refreshCartDrawer();
    syncCartBadge();
  });

  refreshCartDrawer();
  syncCartBadge();

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) closeCartDrawer();
  });
}

export function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const scrim = document.getElementById("cart-scrim");
  if (!drawer || !scrim) return;
  refreshCartDrawer();
  scrim.hidden = false;
  requestAnimationFrame(() => {
    scrim.classList.add("is-open");
    drawer.classList.add("is-open");
  });
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  drawer.querySelector("[data-cart-close]")?.focus();
}

export function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const scrim = document.getElementById("cart-scrim");
  if (!drawer || !scrim) return;
  drawer.classList.remove("is-open");
  scrim.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  setTimeout(() => {
    if (!scrim.classList.contains("is-open")) scrim.hidden = true;
  }, 600);
}

function lineHTML(line) {
  return `<div class="cart-line">
    <a href="#/product/${esc(line.product.slug)}" data-cart-close>
      <img src="${artUrl(line.product.art)}" alt="${esc(L(line.product.name))}" width="76" height="88" />
    </a>
    <div>
      <div class="cart-line__title"><a href="#/product/${esc(line.product.slug)}" data-cart-close>${esc(L(line.product.name))}</a></div>
      <div class="cart-line__variant">${esc(L(line.variant.label))}</div>
      <div class="cart-line__variant">${esc(money(line.variant.price))}</div>
      <div class="cluster mt-2">
        <div class="qty">
          <button data-line-qty data-pid="${esc(line.product.id)}" data-vid="${esc(line.variant.id)}" data-delta="-1" aria-label="${esc(t("common.qty"))} −">−</button>
          <output>${esc(nf(line.qty))}</output>
          <button data-line-qty data-pid="${esc(line.product.id)}" data-vid="${esc(line.variant.id)}" data-delta="1" aria-label="${esc(t("common.qty"))} +">+</button>
        </div>
        <button class="link-danger" data-line-remove data-pid="${esc(line.product.id)}" data-vid="${esc(line.variant.id)}">${esc(t("cart.remove"))}</button>
      </div>
    </div>
    <div style="text-align:end;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end">
      <b style="font-size:var(--fs-sm)">${esc(money(line.lineTotal))}</b>
    </div>
  </div>`;
}

export function refreshCartDrawer() {
  const body = document.getElementById("cart-drawer-body");
  const foot = document.getElementById("cart-drawer-foot");
  if (!body || !foot) return;
  const lines = cartLines();
  const totals = cartTotals();

  if (!lines.length) {
    body.innerHTML = `<div class="empty" style="border-style:solid">
      ${icon("cart")}
      <h3>${esc(t("cart.empty"))}</h3>
      <p>${esc(t("cart.emptyHint"))}</p>
      <div class="mt-4"><a class="btn btn--gold btn--sm" href="#/shop" data-cart-close>${esc(t("action.continue"))}</a></div>
    </div>`;
    foot.innerHTML = "";
    return;
  }

  body.innerHTML = lines.map(lineHTML).join("");
  foot.innerHTML = `
    <div class="summary-row"><span>${esc(t("cart.subtotal"))}</span><b>${esc(money(totals.subtotal))}</b></div>
    ${totals.discount ? `<div class="summary-row"><span>${esc(t("cart.discount"))}</span><b style="color:var(--c-success)">− ${esc(money(totals.discount))}</b></div>` : ""}
    <div class="summary-row"><span>${esc(t("cart.shipping"))}</span><b>${totals.shipping ? esc(money(totals.shipping)) : esc(t("cart.shippingFree"))}</b></div>
    <div class="summary-row summary-row--total"><span>${esc(t("cart.total"))}</span><span>${esc(money(totals.total))}</span></div>
    <a class="btn btn--gold btn--block" href="#/checkout" data-cart-close>${esc(t("cart.checkout"))}</a>
    <button class="btn btn--ghost btn--block" data-cart-close>${esc(t("cart.continue"))}</button>
    <p class="tiny muted" style="text-align:center">${esc(t("cart.sampleNote"))}</p>`;
}

export function syncCartBadge() {
  const totals = cartTotals();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = nf(totals.count);
    el.hidden = totals.count === 0;
  });
}
