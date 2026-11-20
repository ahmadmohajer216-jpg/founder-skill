/* ── عطار بلد · Home ────────────────────────────────────────────────────── */

import { t, L, nf } from "../core/i18n.js";
import { icon } from "../ui/icons.js";
import { esc, productCard, categoryCard, articleCard } from "../ui/ui.js";
import { artUrl, heroSVG } from "../core/art.js";
import { catalog, subscribeNewsletter } from "../core/store.js";
import { categories } from "../data/catalog.js";
import { articles, testimonials } from "../data/content.js";

function heroSection() {
  const shortcuts = [
    { href: "#/shop?cat=herbal", icon: "leaf", title: t("hero.short1"), sub: t("hero.short1sub") },
    { href: "#/history", icon: "map", title: t("hero.short2"), sub: t("hero.short2sub") },
    { href: "#/shop", icon: "gift", title: t("hero.short3"), sub: t("hero.short3sub") },
    { href: "#/garden", icon: "spark", title: t("hero.short4"), sub: t("hero.short4sub") },
  ];
  return `<section class="hero">
    <div class="hero__art">${heroSVG()}</div>
    <div class="hero__scrim"></div>
    <div class="hero__inner">
      <div class="hero__content">
        <span class="hero__crest">
          <img src="assets/img/logo.svg" alt="" width="56" height="56" />
          ${esc(t("hero.crest"))}
        </span>
        <h1>${esc(t("brand.name"))}</h1>
        <p class="hero__slogan">${esc(t("hero.slogan"))}</p>
        <p class="hero__lead">${esc(t("hero.lead"))}</p>
        <div class="hero__cta">
          <a class="btn btn--gold" href="#/shop">${esc(t("hero.ctaShop"))} ${icon("arrowLeft")}</a>
          <a class="btn btn--outline" href="#/about" style="color:var(--c-cream)">${esc(t("hero.ctaStory"))}</a>
        </div>
      </div>
      <div class="hero__shortcuts" aria-label="${esc(t("hero.crest"))}">
        ${shortcuts
          .map(
            (s) => `<a class="shortcut" href="${s.href}">
              <span class="shortcut__ring">${icon(s.icon)}</span>
              <span><b>${esc(s.title)}</b><span>${esc(s.sub)}</span></span>
            </a>`
          )
          .join("")}
      </div>
    </div>
    <div class="hero__caption">
      <div class="container hero__caption-inner">
        <p>${esc(t("hero.captionTitle"))}</p>
        <small>${esc(t("hero.captionSub"))}</small>
      </div>
    </div>
  </section>`;
}

function servicesSection() {
  const items = [
    { icon: "spark", title: t("services.related"), sub: t("services.relatedSub") },
    { icon: "chat", title: t("services.support"), sub: t("services.supportSub") },
    { icon: "truck", title: t("services.shipping"), sub: t("services.shippingSub") },
    { icon: "shield", title: t("services.payment"), sub: t("services.paymentSub") },
    { icon: "instagram", title: t("services.social"), sub: t("services.socialSub") },
  ];
  return `<section class="services" aria-label="${esc(t("services.title"))}">
    <div class="container">
      <div class="services__grid">
        ${items
          .map(
            (i) => `<div class="service">${icon(i.icon)}<div><b>${esc(i.title)}</b><span>${esc(i.sub)}</span></div></div>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
}

function categoriesSection() {
  return `<section class="section" id="categories">
    <div class="container">
      <div class="section-head section-head--center">
        <span class="eyebrow">${esc(t("nav.shop"))}</span>
        <h2>${esc(t("home.categoriesTitle"))}</h2>
        <p>${esc(t("home.categoriesSub"))}</p>
      </div>
      <div class="category-rail reveal">
        ${categories.map((c) => categoryCard(c)).join("")}
      </div>
    </div>
  </section>`;
}

function historySection() {
  return `<section class="section section--cream">
    <div class="container">
      <div class="history-banner reveal">
        <div class="history-banner__art">
          <img src="${artUrl("ruins")}" alt="${esc(t("home.historyTitle"))}" loading="lazy" width="1600" height="900" />
        </div>
        <div class="history-banner__body">
          <span class="eyebrow">${esc(t("nav.history"))}</span>
          <h2>${esc(t("home.historyTitle"))}</h2>
          <p>${esc(t("home.historySub"))}</p>
          <div class="era-strip">
            <a class="era-chip" href="#/history">${esc(t("hero.short2sub"))}</a>
            <a class="era-chip" href="#/plants">${esc(t("nav.plants"))}</a>
            <a class="era-chip" href="#/garden">${esc(t("nav.garden"))}</a>
          </div>
          <a class="btn btn--gold" href="#/history">${esc(t("home.historyCta"))} ${icon("arrowLeft")}</a>
        </div>
      </div>
    </div>
  </section>`;
}

function featureSection() {
  const cards = [
    { art: "garden", title: t("home.feature1Title"), text: t("home.feature1Text"), cta: t("home.feature1Cta"), href: "#/garden" },
    { art: "book", title: t("home.feature2Title"), text: t("home.feature2Text"), cta: t("home.feature2Cta"), href: "#/magazine" },
    { art: "arch", title: t("home.feature3Title"), text: t("home.feature3Text"), cta: t("home.feature3Cta"), href: "#/contact" },
  ];
  return `<section class="section">
    <div class="container">
      <div class="feature-cards">
        ${cards
          .map(
            (c) => `<article class="feature-card reveal">
              <div class="feature-card__bg"><img src="${artUrl(c.art)}" alt="${esc(c.title)}" loading="lazy" width="800" height="1000" /></div>
              <h3>${esc(c.title)}</h3>
              <p>${esc(c.text)}</p>
              <a class="btn btn--outline" href="${c.href}" style="color:var(--c-cream);align-self:flex-start">${esc(c.cta)}</a>
            </article>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
}

function productSection({ id, title, sub, products, linkHref = "#/shop", linkLabel = t("action.viewAll") }) {
  if (!products.length) return "";
  return `<section class="section section--tight" id="${id}">
    <div class="container">
      <div class="between mb-5">
        <div class="section-head" style="margin-bottom:0">
          <span class="eyebrow">${esc(t("common.sampleData"))}</span>
          <h2>${esc(title)}</h2>
          <p>${esc(sub)}</p>
        </div>
        <a class="btn btn--outline btn--sm" href="${linkHref}">${esc(linkLabel)} ${icon("arrowLeft")}</a>
      </div>
      <div class="product-grid">
        ${products.map((p) => productCard(p)).join("")}
      </div>
    </div>
  </section>`;
}

function brandSection() {
  return `<section class="section section--cream">
    <div class="container brand-intro">
      <div class="brand-intro__media reveal">
        <img src="${artUrl("garden")}" alt="${esc(t("home.brandTitle"))}" loading="lazy" width="1000" height="800" />
        <span class="brand-intro__seal">${esc(t("brand.tagline"))}</span>
      </div>
      <div class="reveal">
        <span class="eyebrow">${esc(t("nav.about"))}</span>
        <h2>${esc(t("home.brandTitle"))}</h2>
        <p class="lead mt-3">${esc(t("home.brandText"))}</p>
        <ul class="brand-intro__list">
          <li>${icon("check")}<span>${esc(t("home.brandPoint1"))}</span></li>
          <li>${icon("check")}<span>${esc(t("home.brandPoint2"))}</span></li>
          <li>${icon("check")}<span>${esc(t("home.brandPoint3"))}</span></li>
        </ul>
        <a class="btn btn--forest mt-5" href="#/about">${esc(t("nav.about"))} ${icon("arrowLeft")}</a>
      </div>
    </div>
  </section>`;
}

function magazineSection() {
  return `<section class="section">
    <div class="container">
      <div class="between mb-5">
        <div class="section-head" style="margin-bottom:0">
          <span class="eyebrow">${esc(t("nav.magazine"))}</span>
          <h2>${esc(t("home.magazineTitle"))}</h2>
          <p>${esc(t("home.magazineSub"))}</p>
        </div>
        <a class="btn btn--outline btn--sm" href="#/magazine">${esc(t("action.viewAll"))} ${icon("arrowLeft")}</a>
      </div>
      <div class="article-grid">
        ${articles.slice(0, 3).map((a) => articleCard(a)).join("")}
      </div>
    </div>
  </section>`;
}

function testimonialsSection() {
  return `<section class="section section--tight section--cream">
    <div class="container">
      <div class="section-head section-head--center">
        <span class="eyebrow">${esc(t("home.testimonialsTitle"))}</span>
        <h2>${esc(t("home.testimonialsTitle"))}</h2>
        <p>${esc(t("home.testimonialsSub"))}</p>
      </div>
      <div class="testimonial-grid">
        ${testimonials
          .map(
            (item) => `<blockquote class="testimonial reveal">
              <span class="badge badge--sample" style="align-self:flex-start">${esc(t("common.sample"))}</span>
              <span class="testimonial__stars" aria-label="${esc(nf(item.rating))} / ۵">${Array.from({ length: item.rating }, () => icon("star")).join("")}</span>
              <p>${esc(L(item.text))}</p>
              <footer>
                <span class="avatar" aria-hidden="true">${esc(L(item.name).slice(0, 1))}</span>
                <span><cite>${esc(L(item.name))}</cite><small>${esc(L(item.city))}</small></span>
              </footer>
            </blockquote>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
}

function newsletterSection() {
  return `<section class="section">
    <div class="container">
      <div class="newsletter reveal">
        <div class="newsletter__grid">
          <div>
            <span class="eyebrow">${esc(t("footer.newsletter"))}</span>
            <h2>${esc(t("home.newsletterTitle"))}</h2>
            <p>${esc(t("home.newsletterText"))}</p>
          </div>
          <form data-newsletter novalidate>
            <label class="sr-only" for="newsletter-email">${esc(t("home.newsletterPlaceholder"))}</label>
            <input class="input" id="newsletter-email" type="email" name="email" placeholder="${esc(t("home.newsletterPlaceholder"))}" autocomplete="email" required />
            <button class="btn btn--gold" type="submit">${esc(t("home.newsletterCta"))}</button>
            <p class="tiny" style="flex-basis:100%;color:rgba(247,243,232,.6);margin:0">${esc(t("home.newsletterNote"))}</p>
          </form>
        </div>
      </div>
    </div>
  </section>`;
}

export function home() {
  const all = catalog();
  const best = [...all].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const fresh = [...all].filter((p) => p.new).slice(0, 4);
  const sale = all.filter((p) => p.compareAt && p.compareAt > p.price).slice(0, 4);

  return {
    title: t("meta.home"),
    description: t("home.brandText"),
    html: `${heroSection()}
      ${servicesSection()}
      ${categoriesSection()}
      ${historySection()}
      ${featureSection()}
      ${productSection({ id: "bestsellers", title: t("home.bestTitle"), sub: t("home.bestSub"), products: best })}
      ${productSection({ id: "new", title: t("home.newTitle"), sub: t("home.newSub"), products: fresh, linkHref: "#/shop?new=1" })}
      ${productSection({ id: "offers", title: t("home.saleTitle"), sub: t("home.saleSub"), products: sale, linkHref: "#/shop?sale=1" })}
      ${brandSection()}
      ${magazineSection()}
      ${testimonialsSection()}
      ${newsletterSection()}`,
    after(root) {
      const form = root.querySelector("[data-newsletter]");
      form?.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = form.querySelector("input[type=email]");
        const result = subscribeNewsletter(input.value);
        if (result.ok) {
          form.reset();
          import("../ui/ui.js").then(({ toast }) => toast(t("home.newsletterOk")));
        } else {
          input.setAttribute("aria-invalid", "true");
          import("../ui/ui.js").then(({ toast }) => toast(t(`home.${result.error}`), "error"));
        }
      });
    },
  };
}
