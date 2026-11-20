/* ── عطار بلد · Admin panel ─────────────────────────────────────────────── */

import { t, L, nf, money, formatDate, formatDateTime } from "../core/i18n.js";
import { icon } from "../ui/icons.js";
import { esc, breadcrumb, emptyState, openModal, closeModal } from "../ui/ui.js";
import { artUrl } from "../core/art.js";
import {
  isAdmin,
  currentUser,
  catalog,
  stats,
  state,
  allReviews,
  setReviewStatus,
  setOrderStatus,
  saveProductOverride,
  deactivateProduct,
  addProduct,
  customerList,
  productById,
} from "../core/store.js";
import { categories } from "../data/catalog.js";
import { articles } from "../data/content.js";
import { navigate } from "../core/router.js";

const TABS = ["dashboard", "products", "orders", "reviews", "customers", "content", "settings"];

function navItem(tab, label, iconName, active) {
  return `<a href="#/admin/${tab}" ${active === tab ? 'aria-current="true"' : ""}>${icon(iconName)} ${esc(label)}</a>`;
}

function statusOptions(current) {
  return ["awaiting_payment", "processing", "shipped", "delivered", "cancelled"]
    .map(
      (status) =>
        `<option value="${status}" ${current === status ? "selected" : ""}>${esc(t(`order.status.${status}`))}</option>`
    )
    .join("");
}

function dashboard() {
  const s = stats();
  const orders = state.orders.slice(0, 5);
  const low = catalog().filter((p) => p.stock <= 10).slice(0, 5);
  const activity = [
    ...state.orders.map((o) => ({
      at: o.createdAt,
      text: `${t("order.title")} ${o.code} — ${o.customer.firstName} ${o.customer.lastName}`,
    })),
    ...state.reviews.map((r) => ({
      at: r.at,
      text: `${t("admin.reviews")}: ${r.name} — ${L(productById(r.pid)?.name || "")}`,
    })),
  ]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 6);

  return `<div class="stat-grid">
    ${[
      [t("admin.statProducts"), nf(s.products)],
      [t("admin.statOrders"), nf(s.orders)],
      [t("admin.statSales"), money(s.sales)],
      [t("admin.statNew"), nf(s.awaiting)],
      [t("admin.statLow"), nf(s.lowStock)],
      [t("admin.statCustomers"), nf(s.customers)],
    ]
      .map(
        ([label, value]) => `<div class="stat-card"><span>${esc(label)}</span><b>${esc(value)}</b><small>${esc(t("common.sampleData"))}</small></div>`
      )
      .join("")}
  </div>
  <div class="admin-grid-2">
    <div class="panel">
      <h2>${esc(t("admin.recentOrders"))}</h2>
      ${
        orders.length
          ? `<div class="table-wrap"><table class="table" style="min-width:0">
              <thead><tr><th>${esc(t("admin.orderCode"))}</th><th>${esc(t("admin.customer"))}</th><th>${esc(t("admin.total"))}</th></tr></thead>
              <tbody>${orders
                .map(
                  (o) => `<tr><td dir="ltr">${esc(o.code)}</td><td>${esc(o.customer.firstName)} ${esc(o.customer.lastName)}</td><td>${esc(money(o.totals.total))}</td></tr>`
                )
                .join("")}</tbody>
            </table></div>`
          : `<p class="muted">${esc(t("admin.noOrders"))}</p>`
      }
    </div>
    <div class="panel">
      <h2>${esc(t("admin.lowStock"))}</h2>
      ${
        low.length
          ? `<ul class="stack" style="gap:10px">${low
              .map(
                (p) => `<li class="between" style="gap:8px">
                  <span class="cluster" style="gap:8px"><img src="${artUrl(p.art)}" alt="" width="34" height="34" style="border-radius:6px" />${esc(L(p.name))}</span>
                  <b class="${p.stock === 0 ? "stock-note stock-note--out" : "stock-note stock-note--low"}">${esc(nf(p.stock))}</b>
                </li>`
              )
              .join("")}</ul>`
          : `<p class="muted">${esc(t("common.inStock"))}</p>`
      }
    </div>
  </div>
  <div class="panel mt-4">
    <h2>${esc(t("admin.recentActivity"))}</h2>
    ${
      activity.length
        ? `<ul class="stack" style="gap:8px">${activity
            .map(
              (a) => `<li class="between" style="font-size:var(--fs-sm)"><span>${esc(a.text)}</span><span class="tiny muted">${esc(formatDateTime(a.at))}</span></li>`
            )
            .join("")}</ul>`
        : `<p class="muted">${esc(t("admin.noActivity"))}</p>`
    }
    <p class="tiny muted mt-4" style="margin-bottom:0">${esc(t("admin.ordersNote"))}</p>
  </div>`;
}

function productsTable() {
  return `<div class="table-wrap">
    <table class="table">
      <thead><tr>
        <th>${esc(t("admin.productName"))}</th>
        <th>${esc(t("admin.category"))}</th>
        <th>${esc(t("admin.price"))}</th>
        <th>${esc(t("admin.stock"))}</th>
        <th>${esc(t("admin.status"))}</th>
        <th></th>
      </tr></thead>
      <tbody>
        ${catalog()
          .map(
            (p) => `<tr>
              <td>
                <span class="cluster" style="gap:8px">
                  <img src="${artUrl(p.art)}" alt="" width="42" height="42" />
                  <span>${esc(L(p.name))}<br /><span class="tiny muted" dir="ltr">${esc(p.sci)}</span></span>
                </span>
              </td>
              <td>${esc(L(categories.find((c) => c.id === p.cat)?.name || ""))}</td>
              <td>${esc(money(p.price))}</td>
              <td>${esc(nf(p.stock))}</td>
              <td><span class="status ${p.stock === 0 ? "status--cancelled" : "status--paid"}">${esc(p.stock === 0 ? t("common.outOfStock") : t("admin.active"))}</span></td>
              <td>
                <span class="cluster" style="gap:4px;justify-content:flex-end">
                  <button class="btn btn--ghost btn--sm" type="button" data-edit-product="${esc(p.id)}">${esc(t("action.edit"))}</button>
                  <button class="btn btn--danger btn--sm" type="button" data-delete-product="${esc(p.id)}">${esc(t("action.delete"))}</button>
                </span>
              </td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </div>`;
}

function ordersTable() {
  return `<div class="table-wrap">
    <table class="table">
      <thead><tr>
        <th>${esc(t("admin.orderCode"))}</th>
        <th>${esc(t("admin.customer"))}</th>
        <th>${esc(t("admin.date"))}</th>
        <th>${esc(t("admin.total"))}</th>
        <th>${esc(t("admin.status"))}</th>
      </tr></thead>
      <tbody>
        ${
          state.orders.length
            ? state.orders
                .map(
                  (o) => `<tr>
                    <td dir="ltr">${esc(o.code)}</td>
                    <td>${esc(o.customer.firstName)} ${esc(o.customer.lastName)}<br /><span class="tiny muted" dir="ltr">${esc(o.customer.phone)}</span></td>
                    <td>${esc(formatDate(o.createdAt))}</td>
                    <td>${esc(money(o.totals.total))}</td>
                    <td>
                      <select class="select" style="min-height:36px;font-size:var(--fs-xs)" data-order-status="${esc(o.code)}" aria-label="${esc(t("admin.changeStatus"))}">
                        ${statusOptions(o.status)}
                      </select>
                    </td>
                  </tr>`
                )
                .join("")
            : `<tr><td colspan="5" class="muted">${esc(t("admin.noOrders"))}</td></tr>`
        }
      </tbody>
    </table>
  </div>`;
}

function reviewsList() {
  const reviews = allReviews();
  if (!reviews.length) return `<p class="muted">${esc(t("admin.noReviews"))}</p>`;
  return `<div class="stack">
    ${reviews
      .map((r) => {
        const product = productById(r.pid);
        return `<article class="review">
          <div class="review__head">
            <span>
              <b>${esc(r.name)}</b>
              <span class="tiny muted"> — ${esc(L(product?.name || ""))}</span>
            </span>
            <span class="cluster" style="gap:8px">
              <span class="status ${r.status === "approved" ? "status--paid" : "status--pending"}">${esc(r.status === "approved" ? t("admin.approved") : t("admin.pending"))}</span>
              <span class="tiny muted">${esc(formatDate(r.at))}</span>
            </span>
          </div>
          <p>${esc(r.text)}</p>
          <div class="cluster mt-3">
            ${
              r.status !== "approved"
                ? `<button class="btn btn--forest btn--sm" type="button" data-review-approve="${esc(r.id)}">${esc(t("admin.approve"))}</button>`
                : ""
            }
            ${
              r.status !== "rejected"
                ? `<button class="btn btn--danger btn--sm" type="button" data-review-reject="${esc(r.id)}">${esc(t("admin.reject"))}</button>`
                : ""
            }
          </div>
        </article>`;
      })
      .join("")}
  </div>`;
}

function customersTable() {
  const customers = customerList();
  return `<div class="table-wrap">
    <table class="table">
      <thead><tr>
        <th>${esc(t("account.name"))}</th>
        <th>${esc(t("account.email"))}</th>
        <th>${esc(t("admin.role"))}</th>
        <th>${esc(t("admin.orders"))}</th>
        <th>${esc(t("admin.date"))}</th>
      </tr></thead>
      <tbody>
        ${customers
          .map(
            (u) => `<tr>
              <td>${esc(u.name)}</td>
              <td dir="ltr">${esc(u.email)}</td>
              <td>${esc(t("admin.roleCustomer"))}</td>
              <td>${esc(nf(state.orders.filter((o) => o.userId === u.id).length))}</td>
              <td>${esc(formatDate(u.createdAt))}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </div>`;
}

function contentPanel() {
  return `<div class="panel">
    <h2>${esc(t("admin.content"))}</h2>
    <p class="muted">${esc(t("admin.contentNote"))}</p>
    <div class="table-wrap mt-4">
      <table class="table">
        <thead><tr><th>${esc(t("content.magazineTitle"))}</th><th>${esc(t("content.published"))}</th><th></th></tr></thead>
        <tbody>
          ${articles
            .map(
              (a) => `<tr>
                <td>${esc(L(a.title))}</td>
                <td>${esc(formatDate(a.date))}</td>
                <td><a class="btn btn--ghost btn--sm" href="#/magazine/${esc(a.slug)}">${esc(t("action.view"))}</a></td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

function settingsPanel() {
  return `<div class="panel">
    <h2>${esc(t("admin.settings"))}</h2>
    <div class="notice">${icon("info")}<span>${esc(t("admin.settingsNote"))}</span></div>
    <div class="stack mt-4">
      <div class="summary-row"><span>${esc(t("checkout.payment"))}</span><b>${esc(t("checkout.payDemo"))}</b></div>
      <div class="summary-row"><span>${esc(t("checkout.shipPost"))}</span><b>${esc(t("common.sampleData"))}</b></div>
      <div class="summary-row"><span>${esc(t("footer.newsletter"))}</span><b>${esc(nf(stats().subscribers))}</b></div>
      <div class="summary-row"><span>${esc(t("admin.reviews"))}</span><b>${esc(nf(stats().pendingReviews))} ${esc(t("admin.pending"))}</b></div>
    </div>
  </div>`;
}

function productModal(product) {
  const isNew = !product;
  const cats = categories
    .map((c) => `<option value="${esc(c.id)}" ${product?.cat === c.id ? "selected" : ""}>${esc(L(c.name))}</option>`)
    .join("");
  openModal(
    `<form data-product-form data-product-id="${esc(product?.id || "")}">
      <p class="eyebrow">${esc(isNew ? t("admin.newProduct") : t("admin.editProduct"))}</p>
      <h2 style="font-family:var(--font-display);font-size:var(--fs-xl);margin-bottom:1rem">
        ${esc(isNew ? t("admin.newProduct") : L(product.name))}
      </h2>
      <div class="stack">
        ${
          isNew
            ? `<div class="form-grid">
                <div class="field"><label for="np-name-fa">${esc(t("admin.productName"))} (فارسی)</label><input class="input" id="np-name-fa" name="nameFa" required /></div>
                <div class="field"><label for="np-name-en">${esc(t("admin.productName"))} (English)</label><input class="input" id="np-name-en" name="nameEn" dir="ltr" /></div>
                <div class="field"><label for="np-cat">${esc(t("admin.category"))}</label><select class="select" id="np-cat" name="cat">${cats}</select></div>
                <div class="field"><label for="np-short">${esc(t("product.tabIntro"))}</label><input class="input" id="np-short" name="shortFa" /></div>
              </div>`
            : ""
        }
        <div class="form-grid">
          <div class="field">
            <label for="np-price">${esc(t("admin.price"))}</label>
            <input class="input" id="np-price" name="price" type="number" min="0" step="10000" value="${product ? product.price : 250000}" required />
          </div>
          <div class="field">
            <label for="np-stock">${esc(t("admin.stock"))}</label>
            <input class="input" id="np-stock" name="stock" type="number" min="0" step="1" value="${product ? product.stock : 20}" required />
          </div>
        </div>
        <div class="cluster">
          <button class="btn btn--gold" type="submit">${esc(t("action.save"))}</button>
          <button class="btn btn--ghost" type="button" data-modal-close>${esc(t("action.cancel"))}</button>
        </div>
        <p class="tiny muted" style="margin:0">${esc(t("common.sampleBadgeNote"))}</p>
      </div>
    </form>`,
    {
      label: isNew ? t("admin.newProduct") : t("admin.editProduct"),
      onMount(wrap) {
        const form = wrap.querySelector("[data-product-form]");
        form.addEventListener("submit", async (event) => {
          event.preventDefault();
          const { toast } = await import("../ui/ui.js");
          const price = Math.max(0, Number(form.querySelector('[name="price"]').value) || 0);
          const stock = Math.max(0, Number(form.querySelector('[name="stock"]').value) || 0);
          const nameFa = form.querySelector('[name="nameFa"]');
          if (nameFa) {
            if (!nameFa.value.trim()) {
              nameFa.focus();
              return;
            }
            addProduct({
              nameFa: nameFa.value.trim(),
              nameEn: form.querySelector('[name="nameEn"]').value.trim(),
              cat: form.querySelector('[name="cat"]').value,
              shortFa: form.querySelector('[name="shortFa"]').value.trim(),
              price,
              stock,
            });
          } else {
            saveProductOverride(form.dataset.productId, { price, stock });
          }
          toast(t("admin.saved"));
          closeModal();
          navigate("/admin/products", { replace: true });
        });
      },
    }
  );
}

export function admin(params) {
  const user = currentUser();
  if (!isAdmin()) {
    return {
      title: t("meta.admin"),
      description: t("admin.denied"),
      html: `<section class="section"><div class="container">${emptyState({
        title: t("admin.denied"),
        text: t("account.loginRequired"),
        iconName: "shield",
        action: `<a class="btn btn--gold btn--sm" href="#/account">${esc(t("account.login"))}</a>`,
      })}</div></section>`,
    };
  }

  const tab = TABS.includes(params.tab) ? params.tab : "dashboard";
  const titles = {
    dashboard: t("admin.dashboard"),
    products: t("admin.products"),
    orders: t("admin.orders"),
    reviews: t("admin.reviews"),
    customers: t("admin.customers"),
    content: t("admin.content"),
    settings: t("admin.settings"),
  };

  const panel =
    tab === "products"
      ? productsTable()
      : tab === "orders"
      ? ordersTable()
      : tab === "reviews"
      ? reviewsList()
      : tab === "customers"
      ? customersTable()
      : tab === "content"
      ? contentPanel()
      : tab === "settings"
      ? settingsPanel()
      : dashboard();

  return {
    title: `${titles[tab]} | ${t("admin.title")}`,
    description: t("admin.title"),
    html: `<section class="page-head">
      <div class="container page-head__inner">
        ${breadcrumb([{ label: t("nav.home"), href: "#/" }, { label: t("admin.title") }])}
        <h1>${esc(t("admin.title"))}</h1>
        <p>${esc(t("account.welcome", { name: user.name }))} — ${esc(t("admin.ordersNote"))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="container admin-layout">
        <nav class="admin-nav" aria-label="${esc(t("admin.title"))}">
          ${navItem("dashboard", t("admin.dashboard"), "dashboard", tab)}
          ${navItem("products", t("admin.products"), "package", tab)}
          ${navItem("orders", t("admin.orders"), "cart", tab)}
          ${navItem("reviews", t("admin.reviews"), "chat", tab)}
          ${navItem("customers", t("admin.customers"), "users", tab)}
          ${navItem("content", t("admin.content"), "book", tab)}
          ${navItem("settings", t("admin.settings"), "settings", tab)}
        </nav>
        <div>
          <div class="admin-head">
            <h1 style="font-size:var(--fs-xl)">${esc(titles[tab])}</h1>
            ${tab === "products" ? `<button class="btn btn--gold btn--sm" type="button" data-new-product>${icon("plus")} ${esc(t("admin.newProduct"))}</button>` : ""}
          </div>
          ${panel}
        </div>
      </div>
    </section>`,
    after(root) {
      root.querySelector("[data-new-product]")?.addEventListener("click", () => productModal(null));

      root.querySelectorAll("[data-edit-product]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const product = catalog().find((p) => p.id === btn.dataset.editProduct);
          if (product) productModal(product);
        });
      });

      root.querySelectorAll("[data-delete-product]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!window.confirm(t("admin.deleteConfirm"))) return;
          deactivateProduct(btn.dataset.deleteProduct);
          const { toast } = await import("../ui/ui.js");
          toast(t("admin.deleted"));
          navigate("/admin/products", { replace: true });
        });
      });

      root.querySelectorAll("[data-order-status]").forEach((select) => {
        select.addEventListener("change", async () => {
          setOrderStatus(select.dataset.orderStatus, select.value);
          const { toast } = await import("../ui/ui.js");
          toast(t("admin.saved"));
          navigate("/admin/orders", { replace: true });
        });
      });

      root.querySelectorAll("[data-review-approve]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          setReviewStatus(btn.dataset.reviewApprove, "approved");
          const { toast } = await import("../ui/ui.js");
          toast(t("admin.reviewApproved"));
          navigate("/admin/reviews", { replace: true });
        });
      });

      root.querySelectorAll("[data-review-reject]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          setReviewStatus(btn.dataset.reviewReject, "rejected");
          const { toast } = await import("../ui/ui.js");
          toast(t("admin.reviewRejected"));
          navigate("/admin/reviews", { replace: true });
        });
      });
    },
  };
}
