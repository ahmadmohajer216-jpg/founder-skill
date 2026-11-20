/* ── عطار بلد · Chat assistant (local, no AI service) ─────────────────────
   این دستیار به سرویس هوش مصنوعی متصل نیست. پاسخ‌ها با جست‌وجوی ساده در
   کاتالوگ و محتوای سایت ساخته می‌شوند و در رابط کاربری هم صریحاً همین
   موضوع اعلام می‌شود. */

import { t, L } from "../core/i18n.js";
import { icon } from "./icons.js";
import { esc } from "./ui.js";
import { catalog } from "../core/store.js";
import { categories } from "../data/catalog.js";
import { plants } from "../data/content.js";
import { navigate } from "../core/router.js";

let mounted = false;
let logEl = null;

const norm = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ");

function productLinks(list) {
  return `<div class="stack" style="gap:6px">${list
    .map(
      (p) => `<a href="#/product/${esc(p.slug)}" data-chat-link>${esc(L(p.name))} — ${esc(
        new Intl.NumberFormat(document.documentElement.lang === "en" ? "en-US" : "fa-IR").format(p.price)
      )} ${esc(t("common.currency"))}</a>`
    )
    .join("")}</div>`;
}

function respond(text) {
  const q = norm(text);
  const all = catalog();

  if (/تور|باغ|garden|tour/.test(q)) {
    return `${esc(t("content.gardenSub"))} — <a href="#/garden" data-chat-link>${esc(t("content.gardenTitle"))}</a>`;
  }
  if (/مقاله|مجله|article|journal|blog/.test(q)) {
    return `<a href="#/magazine" data-chat-link>${esc(t("content.magazineTitle"))}</a>`;
  }
  if (/گیاه|دانشنامه|plant|herb encyclopedia/.test(q)) {
    const hits = plants.filter((p) => norm(L(p.name)).includes(q) || q.includes(norm(p.name.en))).slice(0, 3);
    if (hits.length) {
      return `${esc(t("content.plantsTitle"))}: ${hits
        .map((p) => `<a href="#/plants/${esc(p.slug)}" data-chat-link>${esc(L(p.name))}</a>`)
        .join(" · ")}`;
    }
    return `<a href="#/plants" data-chat-link>${esc(t("content.plantsTitle"))}</a> — ${esc(t("content.plantsSub"))}`;
  }
  if (/ارسال|پست|تیپاکس|shipping|delivery/.test(q)) {
    return esc(t("cart.shippingNote"));
  }
  if (/پرداخت|درگاه|payment|checkout/.test(q)) {
    return esc(t("checkout.payNote"));
  }
  if (/سفارش|پیگیری|order|track/.test(q)) {
    return `<a href="#/account/orders" data-chat-link>${esc(t("account.orders"))}</a> — ${esc(t("order.demoNote"))}`;
  }
  if (/موجود|stock|available/.test(q)) {
    const available = all.filter((p) => p.stock > 0).slice(0, 3);
    return `${esc(t("common.inStock"))}: ${productLinks(available)}`;
  }

  const category = categories.find((c) => norm(L(c.name)).includes(q) || q.includes(norm(c.name.en)));
  const hits = all
    .filter((p) => {
      const hay = norm([L(p.name), p.name.en, p.sci, L(p.short)].join(" "));
      return hay.includes(q) && q.length > 1;
    })
    .slice(0, 3);
  if (hits.length) return `${esc(t("chat.productFound"))} ${productLinks(hits)}`;
  if (category) {
    const list = all.filter((p) => p.cat === category.id).slice(0, 3);
    return `<a href="#/shop?cat=${esc(category.id)}" data-chat-link>${esc(L(category.name))}</a>${list.length ? `: ${productLinks(list)}` : ""}`;
  }
  return esc(t("chat.fallback"));
}

function appendMessage(html, mine = false) {
  if (!logEl) return;
  const el = document.createElement("div");
  el.className = `chat-msg${mine ? " chat-msg--me" : ""}`;
  el.innerHTML = html;
  logEl.appendChild(el);
  logEl.scrollTop = logEl.scrollHeight;
}

export function mountChat() {
  if (mounted) return;
  mounted = true;
  const host = document.getElementById("overlays");
  host.insertAdjacentHTML(
    "beforeend",
    `<button class="chat-launcher" type="button" data-chat-open aria-label="${esc(t("chat.open"))}">${icon("chat")}</button>
     <section class="chat-panel" id="chat-panel" aria-label="${esc(t("chat.title"))}" hidden>
       <div class="chat-panel__head">
         <div><strong>${esc(t("chat.title"))}</strong><span>${esc(t("chat.subtitle"))}</span></div>
         <button class="icon-btn" type="button" data-chat-close aria-label="${esc(t("action.close"))}" style="color:inherit">${icon("close")}</button>
       </div>
       <div class="chat-log" id="chat-log" aria-live="polite"></div>
       <div class="chat-form">
         <input class="input" type="text" data-chat-input placeholder="${esc(t("chat.placeholder"))}" aria-label="${esc(t("chat.placeholder"))}" />
         <button class="icon-btn" type="button" data-chat-send aria-label="${esc(t("action.send"))}" style="background:var(--c-forest);color:var(--c-cream)">${icon("send")}</button>
       </div>
     </section>`
  );
  logEl = document.getElementById("chat-log");
  const panel = document.getElementById("chat-panel");
  const input = panel.querySelector("[data-chat-input]");

  const open = () => {
    if (!logEl.childElementCount) {
      appendMessage(esc(t("chat.greeting")));
      appendMessage(
        `<span class="cluster" style="gap:6px">
          <button class="chip" type="button" data-chat-suggest>${esc(t("chat.suggest1"))}</button>
          <button class="chip" type="button" data-chat-suggest>${esc(t("chat.suggest2"))}</button>
          <button class="chip" type="button" data-chat-suggest>${esc(t("chat.suggest3"))}</button>
        </span>`
      );
      appendMessage(`<span class="tiny muted">${esc(t("chat.noAI"))}</span>`);
    }
    panel.hidden = false;
    input.focus();
  };
  const close = () => {
    panel.hidden = true;
  };

  const send = (value) => {
    const text = String(value || "").trim();
    if (!text) return;
    appendMessage(esc(text), true);
    appendMessage(respond(text));
    input.value = "";
  };

  document.querySelector("[data-chat-open]")?.addEventListener("click", () => {
    if (panel.hidden) open();
    else close();
  });
  panel.querySelector("[data-chat-close]")?.addEventListener("click", close);
  panel.querySelector("[data-chat-send]")?.addEventListener("click", () => send(input.value));
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      send(input.value);
    }
  });
  logEl.addEventListener("click", (event) => {
    const suggest = event.target.closest("[data-chat-suggest]");
    if (suggest) {
      send(suggest.textContent);
      return;
    }
    const link = event.target.closest("[data-chat-link]");
    if (link) {
      const href = link.getAttribute("href");
      if (href?.startsWith("#/")) {
        close();
        navigate(href.slice(1));
      }
    }
  });
}
