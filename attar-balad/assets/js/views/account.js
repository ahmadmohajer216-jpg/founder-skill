/* ── عطار بلد · Customer account ────────────────────────────────────────── */

import { t, L, nf, money, formatDate } from "../core/i18n.js";
import { icon } from "../ui/icons.js";
import { esc, productCard, emptyState, breadcrumb } from "../ui/ui.js";
import {
  currentUser,
  login,
  register,
  logout,
  updateProfile,
  myOrders,
  wishlistProducts,
  saveAddress,
  removeAddress,
} from "../core/store.js";
import { navigate } from "../core/router.js";

function authView() {
  return `<section class="page-head">
    <div class="container page-head__inner">
      ${breadcrumb([{ label: t("nav.home"), href: "#/" }, { label: t("account.title") }])}
      <h1>${esc(t("account.title"))}</h1>
      <p>${esc(t("account.demoNote"))}</p>
    </div>
  </section>
  <section class="section section--tight">
    <div class="container">
      <div class="auth-card">
        <div class="auth-tabs" role="tablist">
          <button role="tab" aria-selected="true" data-auth-tab="login">${esc(t("account.login"))}</button>
          <button role="tab" aria-selected="false" data-auth-tab="register">${esc(t("account.register"))}</button>
        </div>
        <form data-login-form novalidate>
          <div class="stack">
            <div class="field">
              <label for="login-email">${esc(t("account.email"))}</label>
              <input class="input" id="login-email" name="email" type="email" dir="ltr" autocomplete="email" required />
            </div>
            <div class="field">
              <label for="login-pass">${esc(t("account.password"))}</label>
              <input class="input" id="login-pass" name="password" type="password" dir="ltr" autocomplete="current-password" required />
            </div>
            <p class="field__error" data-auth-error hidden></p>
            <button class="btn btn--gold btn--block" type="submit">${esc(t("account.loginCta"))}</button>
          </div>
        </form>
        <form data-register-form novalidate hidden>
          <div class="stack">
            <div class="field">
              <label for="reg-name">${esc(t("account.name"))}</label>
              <input class="input" id="reg-name" name="name" autocomplete="name" required />
            </div>
            <div class="field">
              <label for="reg-email">${esc(t("account.email"))}</label>
              <input class="input" id="reg-email" name="email" type="email" dir="ltr" autocomplete="email" required />
            </div>
            <div class="field">
              <label for="reg-pass">${esc(t("account.password"))}</label>
              <input class="input" id="reg-pass" name="password" type="password" dir="ltr" autocomplete="new-password" required />
              <span class="field__hint">${esc(t("account.passwordHint"))}</span>
            </div>
            <p class="field__error" data-auth-error hidden></p>
            <button class="btn btn--gold btn--block" type="submit">${esc(t("account.registerCta"))}</button>
          </div>
        </form>
        <div class="notice mt-5">
          ${icon("info")}
          <span>
            ${esc(t("account.demoAdmin"))}<br />
            ${esc(t("account.demoCustomer"))}
          </span>
        </div>
      </div>
    </div>
  </section>`;
}

function navItem(tab, label, iconName, active) {
  return `<a href="#/account/${tab}" ${active === tab ? 'aria-current="true"' : ""}>${icon(iconName)} ${esc(label)}</a>`;
}

function profilePanel(user) {
  return `<div class="panel">
    <h2>${esc(t("account.profile"))}</h2>
    <form data-profile-form>
      <div class="form-grid">
        <div class="field">
          <label for="pf-name">${esc(t("account.name"))}</label>
          <input class="input" id="pf-name" name="name" value="${esc(user.name)}" />
        </div>
        <div class="field">
          <label for="pf-email">${esc(t("account.email"))}</label>
          <input class="input" id="pf-email" name="email" type="email" dir="ltr" value="${esc(user.email)}" />
        </div>
      </div>
      <div class="cluster mt-4">
        <button class="btn btn--forest btn--sm" type="submit">${esc(t("action.save"))}</button>
        <button class="btn btn--danger btn--sm" type="button" data-logout>${esc(t("account.logout"))}</button>
      </div>
    </form>
    <p class="tiny muted mt-4" style="margin-bottom:0">${esc(t("account.demoNote"))}</p>
  </div>`;
}

function ordersPanel(user) {
  const orders = myOrders();
  return `<div class="panel">
    <h2>${esc(t("account.orders"))}</h2>
    ${
      orders.length
        ? `<div class="table-wrap"><table class="table">
            <thead><tr><th>${esc(t("order.code"))}</th><th>${esc(t("order.date"))}</th><th>${esc(t("order.status"))}</th><th>${esc(t("cart.total"))}</th><th></th></tr></thead>
            <tbody>
              ${orders
                .map(
                  (o) => `<tr>
                    <td dir="ltr">${esc(o.code)}</td>
                    <td>${esc(formatDate(o.createdAt))}</td>
                    <td><span class="status ${o.status === "cancelled" ? "status--cancelled" : o.status === "awaiting_payment" ? "status--pending" : "status--paid"}">${esc(t(`order.status.${o.status}`))}</span></td>
                    <td>${esc(money(o.totals.total))}</td>
                    <td><a class="btn btn--ghost btn--sm" href="#/account/orders/${esc(o.code)}">${esc(t("action.details"))}</a></td>
                  </tr>`
                )
                .join("")}
            </tbody>
          </table></div>`
        : emptyState({
            title: t("account.noOrders"),
            text: t("cart.emptyHint"),
            iconName: "package",
            action: `<a class="btn btn--gold btn--sm" href="#/shop">${esc(t("nav.shop"))}</a>`,
          })
    }
  </div>`;
}

function wishlistPanel() {
  const items = wishlistProducts();
  return `<div class="panel">
    <h2>${esc(t("account.wishlist"))}</h2>
    ${
      items.length
        ? `<div class="product-grid">${items.map((p) => productCard(p)).join("")}</div>`
        : emptyState({
            title: t("account.noWishlist"),
            text: t("cart.emptyHint"),
            iconName: "heart",
            action: `<a class="btn btn--gold btn--sm" href="#/shop">${esc(t("nav.shop"))}</a>`,
          })
    }
  </div>`;
}

function addressForm(address = {}) {
  return `<form class="panel mt-4" data-address-form>
    <h3 style="font-size:var(--fs-md)">${esc(address.id ? t("account.editAddress") : t("account.addAddress"))}</h3>
    <input type="hidden" name="id" value="${esc(address.id || "")}" />
    <div class="form-grid mt-3">
      <div class="field">
        <label for="ad-title">${esc(t("account.addressTitle"))} *</label>
        <input class="input" id="ad-title" name="title" value="${esc(address.title || "")}" required />
      </div>
      <div class="field">
        <label for="ad-recipient">${esc(t("account.recipient"))} *</label>
        <input class="input" id="ad-recipient" name="recipient" value="${esc(address.recipient || "")}" required />
      </div>
      <div class="field">
        <label for="ad-phone">${esc(t("checkout.phone"))} *</label>
        <input class="input" id="ad-phone" name="phone" dir="ltr" value="${esc(address.phone || "")}" required />
      </div>
      <div class="field">
        <label for="ad-postal">${esc(t("checkout.postal"))} *</label>
        <input class="input" id="ad-postal" name="postal" dir="ltr" value="${esc(address.postal || "")}" required />
      </div>
      <div class="field">
        <label for="ad-province">${esc(t("checkout.province"))} *</label>
        <input class="input" id="ad-province" name="province" value="${esc(address.province || "")}" required />
      </div>
      <div class="field">
        <label for="ad-city">${esc(t("checkout.city"))} *</label>
        <input class="input" id="ad-city" name="city" value="${esc(address.city || "")}" required />
      </div>
      <div class="field span-2">
        <label for="ad-address">${esc(t("checkout.address"))} *</label>
        <textarea class="textarea" id="ad-address" name="address" required style="min-height:90px">${esc(address.address || "")}</textarea>
      </div>
    </div>
    <div class="cluster mt-4">
      <button class="btn btn--forest btn--sm" type="submit">${esc(t("action.save"))}</button>
      <a class="btn btn--ghost btn--sm" href="#/account/addresses">${esc(t("action.cancel"))}</a>
    </div>
  </form>`;
}

function addressesPanel(user) {
  return `<div class="panel">
    <div class="between">
      <h2 style="margin:0">${esc(t("account.addresses"))}</h2>
      <a class="btn btn--outline btn--sm" href="#/account/addresses?edit=new">${esc(t("account.addAddress"))}</a>
    </div>
    ${
      user.addresses.length
        ? `<div class="stack mt-4">
            ${user.addresses
              .map(
                (a) => `<div class="cart-row" style="grid-template-columns:1fr auto">
                  <div>
                    <b>${esc(a.title)}</b> — ${esc(a.recipient)}
                    <p class="tiny muted" style="margin:4px 0 0">${esc(a.province)}، ${esc(a.city)}، ${esc(a.address)} — <span dir="ltr">${esc(a.phone)}</span></p>
                  </div>
                  <div class="cluster">
                    <a class="btn btn--ghost btn--sm" href="#/account/addresses?edit=${esc(a.id)}">${esc(t("action.edit"))}</a>
                    <button class="btn btn--danger btn--sm" type="button" data-address-remove="${esc(a.id)}">${esc(t("action.delete"))}</button>
                  </div>
                </div>`
              )
              .join("")}
          </div>`
        : `<p class="muted mt-4">${esc(t("account.noAddresses"))}</p>`
    }
  </div>`;
}

export function account(params, query) {
  const user = currentUser();
  if (!user) {
    const view = {
      title: t("meta.account"),
      description: t("account.demoNote"),
      html: authView(),
    };
    view.after = (root) => {
      const loginForm = root.querySelector("[data-login-form]");
      const registerForm = root.querySelector("[data-register-form]");
      const tabs = root.querySelectorAll("[data-auth-tab]");

      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          tabs.forEach((t2) => t2.setAttribute("aria-selected", "false"));
          tab.setAttribute("aria-selected", "true");
          const isLogin = tab.dataset.authTab === "login";
          loginForm.hidden = !isLogin;
          registerForm.hidden = isLogin;
        });
      });

      const showError = (form, key) => {
        const el = form.querySelector("[data-auth-error]");
        el.hidden = false;
        el.textContent = t(`account.${key}`);
      };

      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const { toast } = await import("../ui/ui.js");
        const result = login(loginForm.email.value, loginForm.password.value);
        if (!result.ok) {
          showError(loginForm, result.error);
          return;
        }
        toast(t("account.welcome", { name: result.user.name }));
        navigate(result.user.role === "admin" ? "/admin" : "/account/profile");
      });

      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const { toast } = await import("../ui/ui.js");
        const result = register({
          name: registerForm.querySelector('[name="name"]').value,
          email: registerForm.email.value,
          password: registerForm.password.value,
        });
        if (!result.ok) {
          showError(registerForm, result.error);
          return;
        }
        toast(t("account.welcome", { name: result.user.name }));
        navigate("/account/profile");
      });
    };
    return view;
  }

  const tab = ["profile", "orders", "wishlist", "addresses"].includes(params.tab) ? params.tab : "profile";
  const editingId = query.edit;
  const editing =
    editingId === "new"
      ? {}
      : editingId
      ? user.addresses.find((a) => a.id === editingId)
      : null;

  let panel = "";
  if (tab === "orders") panel = ordersPanel(user);
  else if (tab === "wishlist") panel = wishlistPanel();
  else if (tab === "addresses") panel = addressesPanel(user) + (editing !== null ? addressForm(editing) : "");
  else panel = profilePanel(user);

  return {
    title: `${t("account.title")} | ${t("brand.name")}`,
    description: t("account.title"),
    html: `<section class="page-head">
      <div class="container page-head__inner">
        ${breadcrumb([{ label: t("nav.home"), href: "#/" }, { label: t("account.title") }])}
        <h1>${esc(t("account.welcome", { name: user.name }))}</h1>
        <p>${esc(t("account.demoNote"))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="container account-layout">
        <nav class="account-nav" aria-label="${esc(t("account.title"))}">
          ${navItem("profile", t("account.profile"), "user", tab)}
          ${navItem("orders", t("account.orders"), "package", tab)}
          ${navItem("wishlist", t("account.wishlist"), "heart", tab)}
          ${navItem("addresses", t("account.addresses"), "pin", tab)}
          <button type="button" data-logout>${icon("logout")} ${esc(t("account.logout"))}</button>
        </nav>
        <div>${panel}</div>
      </div>
    </section>`,
    after(root) {
      root.querySelector("[data-logout]")?.addEventListener("click", async () => {
        if (!window.confirm(t("account.signOutConfirm"))) return;
        logout();
        const { toast } = await import("../ui/ui.js");
        toast(t("account.logout"));
        navigate("/account", { replace: true });
      });

      root.querySelector("[data-profile-form]")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target;
        updateProfile({
          name: form.querySelector('[name="name"]').value.trim(),
          email: form.querySelector('[name="email"]').value.trim(),
        });
        const { toast } = await import("../ui/ui.js");
        toast(t("account.saved"));
        navigate("/account/profile", { replace: true });
      });

      root.querySelector("[data-address-form]")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target;
        const values = Object.fromEntries(new FormData(form).entries());
        if (!values.title || !values.address) {
          const { toast } = await import("../ui/ui.js");
          toast(t("account.addressRequired"), "error");
          return;
        }
        saveAddress(values);
        const { toast } = await import("../ui/ui.js");
        toast(t("account.saved"));
        navigate("/account/addresses", { replace: true });
      });

      root.querySelectorAll("[data-address-remove]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          removeAddress(btn.dataset.addressRemove);
          const { toast } = await import("../ui/ui.js");
          toast(t("account.saved"));
          navigate("/account/addresses", { replace: true });
        });
      });
    },
  };
}
