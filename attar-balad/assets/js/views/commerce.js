/* ── عطار بلد · Cart, checkout and order ────────────────────────────────── */

import { t, L, nf, money, formatDate } from "../core/i18n.js";
import { icon } from "../ui/icons.js";
import { esc, breadcrumb, emptyState, stockHTML } from "../ui/ui.js";
import { artUrl } from "../core/art.js";
import {
  cartLines,
  cartTotals,
  setCartQty,
  removeFromCart,
  createOrder,
  findOrder,
  markOrderPaid,
  currentUser,
} from "../core/store.js";
import { navigate } from "../core/router.js";

const toEnDigits = (value) =>
  String(value || "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

function summaryRows(totals) {
  return `<div class="summary-row"><span>${esc(t("cart.subtotal"))}</span><b>${esc(money(totals.subtotal))}</b></div>
    ${totals.discount ? `<div class="summary-row"><span>${esc(t("cart.discount"))}</span><b style="color:var(--c-success)">− ${esc(money(totals.discount))}</b></div>` : ""}
    <div class="summary-row"><span>${esc(t("cart.shipping"))}</span><b>${totals.shipping ? esc(money(totals.shipping)) : esc(t("cart.shippingFree"))}</b></div>
    <div class="summary-row summary-row--total"><span>${esc(t("cart.total"))}</span><span>${esc(money(totals.total))}</span></div>`;
}

function cartRow(line) {
  return `<div class="cart-row">
    <a href="#/product/${esc(line.product.slug)}"><img src="${artUrl(line.product.art)}" alt="${esc(L(line.product.name))}" width="96" height="112" /></a>
    <div>
      <a href="#/product/${esc(line.product.slug)}" style="font-weight:600;font-size:var(--fs-sm)">${esc(L(line.product.name))}</a>
      <p class="tiny muted" style="margin:4px 0 0">${esc(L(line.variant.label))} · ${esc(money(line.variant.price))}</p>
      ${stockHTML(line.product)}
      <div class="cart-row__actions mt-2">
        <div class="qty">
          <button type="button" data-cart-qty data-pid="${esc(line.product.id)}" data-vid="${esc(line.variant.id)}" data-delta="-1" aria-label="−">−</button>
          <output>${esc(nf(line.qty))}</output>
          <button type="button" data-cart-qty data-pid="${esc(line.product.id)}" data-vid="${esc(line.variant.id)}" data-delta="1" aria-label="+">+</button>
        </div>
        <button class="link-danger" type="button" data-cart-remove data-pid="${esc(line.product.id)}" data-vid="${esc(line.variant.id)}">${esc(t("cart.remove"))}</button>
      </div>
    </div>
    <b style="font-size:var(--fs-sm);white-space:nowrap">${esc(money(line.lineTotal))}</b>
  </div>`;
}

export function cart() {
  const lines = cartLines();
  const totals = cartTotals();

  return {
    title: t("meta.cart"),
    description: t("cart.title"),
    html: `<section class="page-head">
      <div class="container page-head__inner">
        ${breadcrumb([{ label: t("nav.home"), href: "#/" }, { label: t("cart.title") }])}
        <h1>${esc(t("cart.title"))}</h1>
        <p>${esc(t("cart.sampleNote"))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="container">
        ${
          lines.length
            ? `<div class="cart-layout">
                <div>
                  <div class="cart-table">${lines.map(cartRow).join("")}</div>
                  <div class="cluster mt-4">
                    <a class="btn btn--outline btn--sm" href="#/shop">${icon("arrowRight")} ${esc(t("cart.continue"))}</a>
                  </div>
                </div>
                <aside class="panel panel--sticky">
                  <h2>${esc(t("checkout.summary"))}</h2>
                  ${summaryRows(totals)}
                  <a class="btn btn--gold btn--block mt-4" href="#/checkout">${esc(t("cart.checkout"))}</a>
                  <p class="tiny muted mt-3" style="margin-bottom:0">${esc(t("cart.shippingNote"))}</p>
                </aside>
              </div>`
            : emptyState({
                title: t("cart.empty"),
                text: t("cart.emptyHint"),
                iconName: "cart",
                action: `<a class="btn btn--gold btn--sm" href="#/shop">${esc(t("action.continue"))}</a>`,
              })
        }
      </div>
    </section>`,
    after(root) {
      root.addEventListener("click", (event) => {
        const qtyBtn = event.target.closest("[data-cart-qty]");
        if (qtyBtn) {
          const { pid, vid, delta } = qtyBtn.dataset;
          const line = cartLines().find((l) => l.product.id === pid && l.variant.id === vid);
          if (line) setCartQty(pid, vid, line.qty + Number(delta));
          navigate("/cart", { replace: true });
          return;
        }
        const removeBtn = event.target.closest("[data-cart-remove]");
        if (removeBtn) {
          removeFromCart(removeBtn.dataset.pid, removeBtn.dataset.vid);
          navigate("/cart", { replace: true });
        }
      });
    },
  };
}

/* ── Checkout ─────────────────────────────────────────────────────────── */
export function checkout() {
  const lines = cartLines();
  const totals = cartTotals();
  const user = currentUser();
  const address = user?.addresses?.[0];

  if (!lines.length) {
    return {
      title: t("meta.checkout"),
      description: t("checkout.title"),
      html: `<section class="page-head"><div class="container page-head__inner"><h1>${esc(t("checkout.title"))}</h1></div></section>
      <section class="section"><div class="container">${emptyState({
        title: t("cart.empty"),
        text: t("checkout.emptyCart"),
        iconName: "cart",
        action: `<a class="btn btn--gold btn--sm" href="#/shop">${esc(t("action.continue"))}</a>`,
      })}</div></section>`,
    };
  }

  return {
    title: t("meta.checkout"),
    description: t("checkout.title"),
    html: `<section class="page-head">
      <div class="container page-head__inner">
        ${breadcrumb([{ label: t("nav.home"), href: "#/" }, { label: t("cart.title"), href: "#/cart" }, { label: t("checkout.title") }])}
        <h1>${esc(t("checkout.title"))}</h1>
        <p>${esc(t("checkout.payNote"))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="container">
        <div class="checkout__steps">
          <span class="step-chip is-active"><b>۱</b>${esc(t("checkout.contact"))}</span>
          <span class="step-chip is-active"><b>۲</b>${esc(t("checkout.payment"))}</span>
          <span class="step-chip"><b>۳</b>${esc(t("order.title"))}</span>
        </div>
        <form class="checkout" data-checkout novalidate>
          <div class="stack" style="gap:var(--sp-4)">
            <div class="panel">
              <h2>${esc(t("checkout.contact"))}</h2>
              <p class="tiny muted mb-4">${esc(t("checkout.loginHint"))}</p>
              <div class="form-grid">
                <div class="field">
                  <label for="co-first">${esc(t("checkout.firstName"))} *</label>
                  <input class="input" id="co-first" name="firstName" autocomplete="given-name" required value="${esc(address?.recipient?.split(" ")[0] || user?.name?.split(" ")[0] || "")}" />
                </div>
                <div class="field">
                  <label for="co-last">${esc(t("checkout.lastName"))} *</label>
                  <input class="input" id="co-last" name="lastName" autocomplete="family-name" required value="${esc(address?.recipient?.split(" ").slice(1).join(" ") || user?.name?.split(" ").slice(1).join(" ") || "")}" />
                </div>
                <div class="field">
                  <label for="co-phone">${esc(t("checkout.phone"))} *</label>
                  <input class="input" id="co-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required dir="ltr" value="${esc(address?.phone || "")}" />
                </div>
                <div class="field">
                  <label for="co-email">${esc(t("checkout.email"))} *</label>
                  <input class="input" id="co-email" name="email" type="email" autocomplete="email" required dir="ltr" value="${esc(user?.email || "")}" />
                </div>
                <div class="field">
                  <label for="co-country">${esc(t("checkout.country"))}</label>
                  <select class="select" id="co-country" name="country">
                    <option value="IR">${esc(document.documentElement.lang === "en" ? "Iran" : "ایران")}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="co-province">${esc(t("checkout.province"))} *</label>
                  <input class="input" id="co-province" name="province" autocomplete="address-level1" required value="${esc(address?.province || "")}" />
                </div>
                <div class="field">
                  <label for="co-city">${esc(t("checkout.city"))} *</label>
                  <input class="input" id="co-city" name="city" autocomplete="address-level2" required value="${esc(address?.city || "")}" />
                </div>
                <div class="field">
                  <label for="co-postal">${esc(t("checkout.postal"))} *</label>
                  <input class="input" id="co-postal" name="postal" inputmode="numeric" autocomplete="postal-code" required dir="ltr" value="${esc(address?.postal || "")}" />
                </div>
                <div class="field span-2">
                  <label for="co-address">${esc(t("checkout.address"))} *</label>
                  <textarea class="textarea" id="co-address" name="address" autocomplete="street-address" required style="min-height:90px">${esc(address?.address || "")}</textarea>
                </div>
              </div>
            </div>

            <div class="panel">
              <h2>${esc(t("checkout.shippingMethod"))}</h2>
              <div class="pay-methods">
                <label class="pay-method">
                  <input type="radio" name="shipping" value="post" checked />
                  <span><b>${esc(t("checkout.shipPost"))}</b><br /><span class="tiny muted">${esc(t("checkout.shipPostTime"))}</span></span>
                </label>
                <label class="pay-method">
                  <input type="radio" name="shipping" value="tipax" />
                  <span><b>${esc(t("checkout.shipTipax"))}</b><br /><span class="tiny muted">${esc(t("checkout.shipTipaxTime"))}</span></span>
                </label>
                <label class="pay-method">
                  <input type="radio" name="shipping" value="courier" />
                  <span><b>${esc(t("checkout.shipCourier"))}</b><br /><span class="tiny muted">${esc(t("checkout.shipCourierTime"))}</span></span>
                </label>
              </div>
            </div>

            <div class="panel">
              <h2>${esc(t("checkout.payment"))}</h2>
              <div class="pay-methods">
                <label class="pay-method">
                  <input type="radio" name="payment" value="demo" checked />
                  <span><b>${esc(t("checkout.payDemo"))}</b><br /><span class="tiny muted">${esc(t("checkout.payNote"))}</span></span>
                </label>
              </div>
              <div class="field mt-4">
                <label for="co-note">${esc(t("checkout.summary"))} — ${esc(t("common.optional"))}</label>
                <input class="input" id="co-note" name="note" placeholder="${esc(t("common.optional"))}" />
              </div>
              <label class="check mt-4">
                <input type="checkbox" name="terms" required />
                <span>${esc(t("checkout.terms"))}</span>
              </label>
              <p class="field__error" data-checkout-error hidden></p>
            </div>
          </div>

          <aside class="panel panel--sticky">
            <h2>${esc(t("checkout.summary"))}</h2>
            <div class="stack" style="gap:10px">
              ${lines
                .map(
                  (l) => `<div class="summary-row">
                    <span style="display:flex;gap:8px;align-items:center">
                      <img src="${artUrl(l.product.art)}" alt="" width="36" height="44" style="border-radius:6px;object-fit:cover" />
                      <span>${esc(L(l.product.name))}<br /><span class="tiny muted">${esc(L(l.variant.label))} × ${esc(nf(l.qty))}</span></span>
                    </span>
                    <b>${esc(money(l.lineTotal))}</b>
                  </div>`
                )
                .join("")}
            </div>
            <div class="mt-4" style="border-top:1px dashed var(--c-line);padding-top:var(--sp-3)">
              ${summaryRows(totals)}
            </div>
            <button class="btn btn--gold btn--block mt-4" type="submit">${esc(t("checkout.placeOrder"))}</button>
            <p class="tiny muted mt-3" style="margin-bottom:0">${esc(t("cart.sampleNote"))}</p>
          </aside>
        </form>
      </div>
    </section>`,
    after(root) {
      const form = root.querySelector("[data-checkout]");
      const errorEl = root.querySelector("[data-checkout-error]");
      const showError = (message, field) => {
        errorEl.hidden = false;
        errorEl.textContent = message;
        field?.setAttribute("aria-invalid", "true");
        field?.focus();
      };

      form.addEventListener("input", (event) => {
        event.target.removeAttribute?.("aria-invalid");
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const { toast } = await import("../ui/ui.js");
        const data = new FormData(form);
        const get = (key) => toEnDigits(String(data.get(key) || "").trim());
        const required = ["firstName", "lastName", "phone", "email", "province", "city", "address", "postal"];
        const labels = {
          firstName: t("checkout.firstName"),
          lastName: t("checkout.lastName"),
          phone: t("checkout.phone"),
          email: t("checkout.email"),
          province: t("checkout.province"),
          city: t("checkout.city"),
          address: t("checkout.address"),
          postal: t("checkout.postal"),
        };
        for (const key of required) {
          if (!get(key)) {
            showError(`${labels[key]}: ${t("checkout.errRequired")}`, form.querySelector(`[name="${key}"]`));
            return;
          }
        }
        if (!/^0?9\d{9}$/.test(get("phone"))) {
          showError(t("checkout.errPhone"), form.querySelector('[name="phone"]'));
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(get("email"))) {
          showError(t("checkout.errEmail"), form.querySelector('[name="email"]'));
          return;
        }
        if (!/^\d{10}$/.test(get("postal"))) {
          showError(t("checkout.errPostal"), form.querySelector('[name="postal"]'));
          return;
        }
        if (!form.querySelector('[name="terms"]').checked) {
          showError(t("checkout.needTerms"), form.querySelector('[name="terms"]'));
          return;
        }

        const result = createOrder({
          customer: {
            firstName: get("firstName"),
            lastName: get("lastName"),
            phone: get("phone"),
            email: get("email"),
            country: get("country"),
            province: get("province"),
            city: get("city"),
            address: get("address"),
            postal: get("postal"),
          },
          shippingMethod: data.get("shipping") || "post",
          note: get("note"),
        });

        if (!result.ok) {
          toast(t("checkout.emptyCart"), "error");
          return;
        }
        toast(t("order.title"));
        navigate(`/order/${result.order.code}`);
      });
    },
  };
}

/* ── Order confirmation / detail ──────────────────────────────────────── */
export function order(params) {
  const found = findOrder(params.code);
  if (!found) {
    return {
      title: t("order.notFound"),
      description: t("order.notFound"),
      html: `<section class="section"><div class="container">${emptyState({
        title: t("order.notFound"),
        text: t("order.demoNote"),
        iconName: "package",
        action: `<a class="btn btn--gold btn--sm" href="#/shop">${esc(t("nav.shop"))}</a>`,
      })}</div></section>`,
    };
  }

  const statusClass =
    found.status === "cancelled"
      ? "status--cancelled"
      : found.status === "awaiting_payment"
      ? "status--pending"
      : "status--paid";

  return {
    title: `${t("order.title")} ${found.code} | ${t("brand.name")}`,
    description: t("order.demoNote"),
    html: `<section class="page-head">
      <div class="container page-head__inner">
        ${breadcrumb([{ label: t("nav.home"), href: "#/" }, { label: t("order.title") }])}
        <h1>${esc(t("order.title"))}</h1>
        <p>${esc(t("order.demoNote"))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="container cart-layout">
        <div class="panel">
          <div class="between">
            <div>
              <span class="tiny muted">${esc(t("order.code"))}</span>
              <h2 style="margin:0" dir="ltr">${esc(found.code)}</h2>
            </div>
            <span class="status ${statusClass}">${esc(t(`order.status.${found.status}`))}</span>
          </div>
          <p class="tiny muted mt-2">${esc(t("order.date"))}: ${esc(formatDate(found.createdAt))}</p>
          <div class="table-wrap mt-4">
            <table class="table">
              <thead><tr><th>${esc(t("order.items"))}</th><th>${esc(t("common.qty"))}</th><th>${esc(t("cart.subtotal"))}</th></tr></thead>
              <tbody>
                ${found.items
                  .map(
                    (item) => `<tr>
                      <td style="display:flex;gap:10px;align-items:center">
                        <img src="${artUrl(item.art)}" alt="" width="42" height="42" />
                        <span>${esc(L(item.name))}<br /><span class="tiny muted">${esc(L(item.variant))}</span></span>
                      </td>
                      <td>${esc(nf(item.qty))}</td>
                      <td>${esc(money(item.price * item.qty))}</td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <div class="mt-4">${summaryRows(found.totals)}</div>
        </div>
        <aside class="stack" style="gap:var(--sp-4)">
          <div class="panel">
            <h2>${esc(t("order.deliverTo"))}</h2>
            <p style="font-size:var(--fs-sm);margin:0">
              <b>${esc(found.customer.firstName)} ${esc(found.customer.lastName)}</b><br />
              ${esc(found.customer.province)}، ${esc(found.customer.city)}<br />
              ${esc(found.customer.address)}<br />
              <span dir="ltr">${esc(found.customer.phone)}</span><br />
              ${esc(found.customer.postal)}
            </p>
          </div>
          <div class="panel">
            <h2>${esc(t("order.paymentStatus"))}</h2>
            <p class="cluster">
              <span class="status ${found.payment.status === "paid" ? "status--paid" : "status--pending"}">
                ${esc(found.payment.status === "paid" ? t("payment.paid") : t("payment.unpaid"))}
              </span>
            </p>
            ${
              found.payment.status !== "paid"
                ? `<button class="btn btn--gold btn--block mt-3" type="button" data-mark-paid>${esc(t("checkout.payDemo"))}</button>`
                : ""
            }
            <p class="tiny muted mt-3" style="margin-bottom:0">${esc(t("order.demoNote"))}</p>
          </div>
          <a class="btn btn--outline btn--block" href="#/account/orders">${esc(t("account.orders"))}</a>
          <a class="btn btn--ghost btn--block" href="#/shop">${esc(t("action.continue"))}</a>
        </aside>
      </div>
    </section>`,
    after(root) {
      root.querySelector("[data-mark-paid]")?.addEventListener("click", async () => {
        markOrderPaid(found.code);
        const { toast } = await import("../ui/ui.js");
        toast(t("payment.paid"));
        navigate(`/order/${found.code}`, { replace: true });
      });
    },
  };
}
