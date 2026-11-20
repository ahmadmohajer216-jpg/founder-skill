/* ── عطار بلد · Product detail ──────────────────────────────────────────── */

import { t, L, nf, money, formatDate } from "../core/i18n.js";
import { icon } from "../ui/icons.js";
import { esc, productCard, breadcrumb, emptyState, stars, stockHTML, priceHTML } from "../ui/ui.js";
import { artUrl } from "../core/art.js";
import {
  productBySlug,
  catalog,
  addReview,
  approvedReviews,
  reviewAverage,
  inWishlist,
} from "../core/store.js";
import { categories } from "../data/catalog.js";

function galleryHTML(product, category) {
  const views = [
    { src: artUrl(product.art), label: L(product.name) },
    { src: artUrl(category?.art || "pattern"), label: `${L(product.name)} — ${L(category?.name || "")}` },
    { src: artUrl("pattern"), label: `${L(product.name)} — ${t("brand.name")}` },
  ];
  return `<div class="pdp__gallery">
    <div class="pdp__main-image">
      <img id="pdp-image" src="${views[0].src}" alt="${esc(views[0].label)}" width="800" height="1000" />
    </div>
    <div class="pdp__thumbs" role="group" aria-label="${esc(t("product.tabIntro"))}">
      ${views
        .map(
          (v, i) => `<button type="button" class="${i === 0 ? "is-active" : ""}" data-gallery="${i}" aria-label="${esc(v.label)}" aria-pressed="${i === 0}">
            <img src="${v.src}" alt="${esc(v.label)}" width="74" height="88" />
          </button>`
        )
        .join("")}
    </div>
  </div>`;
}

function reviewHTML(review) {
  return `<article class="review">
    <div class="review__head">
      <b>${esc(review.name)}</b>
      <span class="cluster" style="gap:8px">
        ${review.sample ? `<span class="badge badge--sample">${esc(t("common.sample"))}</span>` : ""}
        <span class="rating">${Array.from({ length: review.rating }, () => icon("star")).join("")}</span>
        <time class="tiny muted" datetime="${esc(review.at)}">${esc(formatDate(review.at))}</time>
      </span>
    </div>
    <p>${esc(review.text)}</p>
  </article>`;
}

export function product(params) {
  const found = productBySlug(params.slug);
  if (!found) {
    return {
      title: t("product.notFound"),
      description: t("product.notFound"),
      html: `<section class="section"><div class="container">${emptyState({
        title: t("product.notFound"),
        text: t("shop.noResultsHint"),
        iconName: "search",
        action: `<a class="btn btn--gold btn--sm" href="#/shop">${esc(t("nav.shop"))}</a>`,
      })}</div></section>`,
    };
  }

  const category = categories.find((c) => c.id === found.cat);
  const rating = reviewAverage(found.id);
  const reviews = approvedReviews(found.id);
  const related = catalog()
    .filter((p) => p.id !== found.id && p.cat === found.cat)
    .concat(catalog().filter((p) => p.id !== found.id && p.cat !== found.cat))
    .slice(0, 4);
  const wished = inWishlist(found.id);
  const variant = found.variants[0];
  const soldOut = variant.stock <= 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: L(found.name),
    alternateName: found.name.en,
    description: L(found.short),
    category: L(category?.name || ""),
    image: [artUrl(found.art)],
    offers: {
      "@type": "Offer",
      price: found.price,
      priceCurrency: "IRR",
      availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
    aggregateRating: rating.count
      ? { "@type": "AggregateRating", ratingValue: rating.avg, reviewCount: rating.count }
      : undefined,
  };

  return {
    title: `${L(found.name)} | ${t("brand.name")}`,
    description: L(found.short),
    html: `<section class="section section--tight">
      <div class="container">
        ${breadcrumb([
          { label: t("nav.home"), href: "#/" },
          { label: t("nav.shop"), href: "#/shop" },
          { label: L(category?.name || ""), href: `#/shop?cat=${found.cat}` },
          { label: L(found.name) },
        ])}
        <div class="pdp">
          ${galleryHTML(found, category)}
          <div class="pdp__info">
            <div class="cluster">
              <span class="badge badge--sample">${esc(t("common.sample"))}</span>
              ${found.new ? `<span class="badge badge--new">${esc(t("common.new"))}</span>` : ""}
              ${found.badges?.includes("bestseller") ? `<span class="badge badge--gold">${esc(t("common.bestseller"))}</span>` : ""}
              <a class="badge" href="#/shop?cat=${esc(found.cat)}">${esc(L(category?.name || ""))}</a>
            </div>
            <h1 class="pdp__title">${esc(L(found.name))}</h1>
            <p class="pdp__sci" dir="ltr">${esc(found.sci)}</p>
            <div class="cluster">
              ${stars(rating.avg, rating.count)}
              <span class="tiny muted">${esc(t("product.ratingLabel"))}</span>
            </div>
            <div class="pdp__price" id="pdp-price">${priceHTML(found, variant)}</div>
            <div class="pdp__options">
              <div>
                <span class="field__label">${esc(t("product.weight"))}</span>
                <div class="option-row mt-2" role="group" aria-label="${esc(t("product.weight"))}">
                  ${found.variants
                    .map(
                      (v, i) => `<button type="button" class="option-btn" data-variant="${esc(v.id)}" data-price="${v.price}" data-stock="${v.stock}" aria-pressed="${i === 0}">
                        ${esc(L(v.label))}${v.stock <= 0 ? ` — ${esc(t("common.outOfStock"))}` : ""}
                      </button>`
                    )
                    .join("")}
                </div>
              </div>
            </div>
            <div class="cluster" id="pdp-stock">${stockHTML(found)}</div>
            <div class="pdp__buy">
              <div class="qty" role="group" aria-label="${esc(t("common.qty"))}">
                <button type="button" data-pdp-qty="-1" aria-label="−">−</button>
                <output id="pdp-qty" data-qty-value="1">${esc(nf(1))}</output>
                <button type="button" data-pdp-qty="1" aria-label="+">+</button>
              </div>
              <button class="btn btn--gold" type="button" data-add="${esc(found.id)}" data-vid="${esc(variant.id)}" data-qty-from="#pdp-qty" ${soldOut ? 'aria-disabled="true"' : ""}>
                ${icon("cart")}<span>${esc(soldOut ? t("common.outOfStock") : t("action.addToCart"))}</span>
              </button>
              <button class="icon-btn" type="button" data-wish="${esc(found.id)}" aria-pressed="${wished}" aria-label="${esc(t("action.wishlist"))}" style="border-color:var(--c-line)">
                ${icon("heart")}
              </button>
              <button class="icon-btn" type="button" data-share aria-label="${esc(t("common.share"))}" style="border-color:var(--c-line)">
                ${icon("share")}
              </button>
            </div>
            <div class="pdp__facts">
              <div>${icon("leaf")}<span>${esc(t("product.scientific"))}: <b dir="ltr">${esc(found.sci)}</b></span></div>
              <div>${icon("package")}<span>${esc(t("product.weight"))}: <b>${esc(L(variant.label))}</b></span></div>
              <div>${icon("truck")}<span>${esc(t("cart.shippingNote"))}</span></div>
              <div>${icon("shield")}<span>${esc(t("product.sampleNote"))}</span></div>
            </div>
            ${soldOut ? `<div class="notice">${icon("info")}<span>${esc(t("product.outOfStockNote"))}</span></div>` : ""}
          </div>
        </div>

        <div class="pdp__tabs">
          <div class="tabs" role="tablist" aria-label="${esc(L(found.name))}">
            <button class="tab" role="tab" id="tab-intro" aria-controls="panel-intro" aria-selected="true">${esc(t("product.tabIntro"))}</button>
            <button class="tab" role="tab" id="tab-specs" aria-controls="panel-specs" aria-selected="false">${esc(t("product.tabSpecs"))}</button>
            <button class="tab" role="tab" id="tab-use" aria-controls="panel-use" aria-selected="false">${esc(t("product.tabUse"))}</button>
            <button class="tab" role="tab" id="tab-reviews" aria-controls="panel-reviews" aria-selected="false">${esc(t("product.tabReviews"))} (${esc(nf(reviews.length))})</button>
          </div>
          <div class="pdp__tab-body">
            <div class="prose tab-panel" role="tabpanel" id="panel-intro" aria-labelledby="tab-intro">
              <p>${esc(L(found.desc))}</p>
              <h3>${esc(t("product.ingredients"))}</h3>
              <p>${esc(L(found.ingredients))}</p>
              <div class="notice mt-4">${icon("info")}<span>${esc(t("product.sampleNote"))}</span></div>
            </div>
            <div class="prose tab-panel" role="tabpanel" id="panel-specs" aria-labelledby="tab-specs" hidden>
              <table class="spec-table">
                <tbody>
                  ${found.specs
                    .map(
                      (s) => `<tr><th>${esc(L(s.label))}</th><td>${esc(L(s.value))}</td></tr>`
                    )
                    .join("")}
                  <tr><th>${esc(t("product.scientific"))}</th><td dir="ltr">${esc(found.sci)}</td></tr>
                  <tr><th>${esc(t("shop.category"))}</th><td>${esc(L(category?.name || ""))}</td></tr>
                </tbody>
              </table>
            </div>
            <div class="prose tab-panel" role="tabpanel" id="panel-use" aria-labelledby="tab-use" hidden>
              <h3>${esc(t("product.storage"))}</h3>
              <p>${esc(L(found.storage))}</p>
              <h3>${esc(t("product.usage"))}</h3>
              <p>${esc(L(found.usage))}</p>
              <h3>${esc(t("product.warning"))}</h3>
              <p>${esc(L(found.warning))}</p>
            </div>
            <div class="tab-panel" role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews" hidden>
              <div class="review-list">
                ${reviews.length ? reviews.map(reviewHTML).join("") : `<p class="muted">${esc(t("common.noReviews"))}</p>`}
              </div>
              <form class="review-form mt-4" data-review-form novalidate>
                <h3 style="font-size:var(--fs-md);margin:0">${esc(t("product.reviewTitle"))}</h3>
                <div class="form-grid">
                  <div class="field">
                    <label for="review-name">${esc(t("product.reviewName"))}</label>
                    <input class="input" id="review-name" name="name" autocomplete="name" required />
                  </div>
                  <div class="field">
                    <label for="review-rating">${esc(t("product.reviewRating"))}</label>
                    <select class="select" id="review-rating" name="rating">
                      <option value="5">۵</option><option value="4">۴</option><option value="3">۳</option><option value="2">۲</option><option value="1">۱</option>
                    </select>
                  </div>
                  <div class="field span-2">
                    <label for="review-text">${esc(t("product.reviewText"))}</label>
                    <textarea class="textarea" id="review-text" name="text" required></textarea>
                  </div>
                </div>
                <div class="cluster">
                  <button class="btn btn--forest btn--sm" type="submit">${esc(t("product.reviewSubmit"))}</button>
                  <span class="tiny muted">${esc(t("product.reviewNote"))}</span>
                </div>
              </form>
            </div>
            <aside class="side-card">
              <h3>${esc(t("product.facts"))}</h3>
              <table class="spec-table">
                <tbody>
                  <tr><th>${esc(t("common.sampleData"))}</th><td>${esc(t("common.sample"))}</td></tr>
                  <tr><th>${esc(t("common.inStock"))}</th><td>${esc(nf(found.stock))}</td></tr>
                  <tr><th>${esc(t("product.weight"))}</th><td>${esc(L(variant.label))}</td></tr>
                </tbody>
              </table>
              <p class="tiny muted mt-3">${esc(t("content.knowledgeNote"))}</p>
            </aside>
          </div>
        </div>

        <div class="section-head mt-6">
          <h2>${esc(t("product.related"))}</h2>
        </div>
        <div class="product-grid">${related.map((p) => productCard(p)).join("")}</div>
      </div>
    </section>
    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
    after(root) {
      const mainImage = root.querySelector("#pdp-image");
      const thumbs = root.querySelectorAll("[data-gallery]");
      const priceEl = root.querySelector("#pdp-price");
      const stockEl = root.querySelector("#pdp-stock");
      const addBtn = root.querySelector("[data-add]");
      const qtyOutput = root.querySelector("#pdp-qty");
      let maxQty = variant.stock || 0;

      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
          thumbs.forEach((t2) => {
            t2.classList.remove("is-active");
            t2.setAttribute("aria-pressed", "false");
          });
          thumb.classList.add("is-active");
          thumb.setAttribute("aria-pressed", "true");
          mainImage.src = thumb.querySelector("img").src;
        });
      });

      root.querySelectorAll("[data-variant]").forEach((btn) => {
        btn.addEventListener("click", () => {
          root.querySelectorAll("[data-variant]").forEach((b) => b.setAttribute("aria-pressed", "false"));
          btn.setAttribute("aria-pressed", "true");
          const price = Number(btn.dataset.price);
          const stock = Number(btn.dataset.stock);
          maxQty = stock;
          addBtn.dataset.vid = btn.dataset.variant;
          const compare = found.compareAt && found.compareAt > price ? `<span class="price__was">${esc(money(found.compareAt))}</span>` : "";
          priceEl.innerHTML = `<div class="price"><span class="price__now">${esc(money(price))}</span>${compare}</div>`;
          stockEl.innerHTML =
            stock <= 0
              ? `<span class="stock-note stock-note--out">${esc(t("common.outOfStock"))}</span>`
              : stock <= 10
              ? `<span class="stock-note stock-note--low">${esc(t("common.lowStock", { n: nf(stock) }))}</span>`
              : `<span class="stock-note">${esc(t("common.inStock"))}</span>`;
          addBtn.setAttribute("aria-disabled", stock <= 0 ? "true" : "false");
          addBtn.querySelector("span").textContent = stock <= 0 ? t("common.outOfStock") : t("action.addToCart");
          qtyOutput.dataset.qtyValue = "1";
          qtyOutput.textContent = nf(1);
        });
      });

      root.querySelectorAll("[data-pdp-qty]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const current = Number(qtyOutput.dataset.qtyValue || 1);
          const next = Math.min(Math.max(1, current + Number(btn.dataset.pdpQty)), Math.max(1, maxQty || 1));
          qtyOutput.dataset.qtyValue = String(next);
          qtyOutput.textContent = nf(next);
        });
      });

      root.querySelector("[data-share]")?.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          import("../ui/ui.js").then(({ toast }) => toast(t("product.shareCopied")));
        } catch {
          import("../ui/ui.js").then(({ toast }) => toast(window.location.href));
        }
      });

      const tabs = root.querySelectorAll('[role="tab"]');
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          tabs.forEach((t2) => t2.setAttribute("aria-selected", "false"));
          tab.setAttribute("aria-selected", "true");
          root.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
            panel.hidden = panel.id !== tab.getAttribute("aria-controls");
          });
        });
      });

      const form = root.querySelector("[data-review-form]");
      form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = form.querySelector('[name="name"]').value.trim();
        const text = form.querySelector('[name="text"]').value.trim();
        const rating = Number(form.querySelector('[name="rating"]').value);
        const { toast } = await import("../ui/ui.js");
        if (!name) {
          toast(t("product.reviewNeedName"), "error");
          form.querySelector('[name="name"]').focus();
          return;
        }
        if (!text) {
          toast(t("product.reviewNeedText"), "error");
          form.querySelector('[name="text"]').focus();
          return;
        }
        addReview({ pid: found.id, name, rating, text });
        form.reset();
        toast(t("product.reviewPending"));
      });
    },
  };
}
