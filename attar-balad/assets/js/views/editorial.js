/* ── عطار بلد · Editorial pages ───────────────────────────────────────────
   مجله، مقاله، دانشنامه گیاهان، تاریخ ایران، تور باغ، درباره ما و تماس. */

import { t, L, nf, formatDate } from "../core/i18n.js";
import { icon } from "../ui/icons.js";
import { esc, breadcrumb, emptyState, articleCard } from "../ui/ui.js";
import { artUrl } from "../core/art.js";
import {
  articles,
  articleCategories,
  getArticle,
  plants,
  getPlant,
  historyEras,
  gardenSpots,
  faqs,
  contactInfo,
} from "../data/content.js";
import { addMessage } from "../core/store.js";

function pageHead({ title, sub, crumbs }) {
  return `<section class="page-head">
    <div class="container page-head__inner">
      ${breadcrumb(crumbs)}
      <h1>${esc(title)}</h1>
      <p>${esc(sub)}</p>
    </div>
  </section>`;
}

function norm(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ");
}

/* ── Magazine ─────────────────────────────────────────────────────────── */
export function magazine(params, query) {
  return {
    title: t("meta.magazine"),
    description: t("content.magazineSub"),
    html: `${pageHead({
      title: t("content.magazineTitle"),
      sub: t("content.magazineSub"),
      crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.magazine") }],
    })}
    <section class="section section--tight">
      <div class="container">
        <div class="shop-toolbar">
          <div class="shop-toolbar__search">
            <input class="input" type="search" data-article-search placeholder="${esc(t("content.articlesSearch"))}" aria-label="${esc(t("content.articlesSearch"))}" />
          </div>
          <div class="cluster" data-article-cats>
            <button class="chip is-active" type="button" data-cat="">${esc(t("shop.allCategories"))}</button>
            ${articleCategories
              .map((c) => `<button class="chip" type="button" data-cat="${esc(c.id)}">${esc(L(c.name))}</button>`)
              .join("")}
          </div>
        </div>
        <div class="article-grid" data-article-list>
          ${articles.map((a) => articleCard(a)).join("")}
        </div>
      </div>
    </section>`,
    after(root) {
      const list = root.querySelector("[data-article-list]");
      const search = root.querySelector("[data-article-search]");
      let cat = query.cat || "";

      const render = () => {
        const q = norm(search.value);
        const filtered = articles.filter((a) => {
          if (cat && a.cat !== cat) return false;
          if (!q) return true;
          return norm([L(a.title), L(a.excerpt), a.title.en, a.excerpt.en].join(" ")).includes(q);
        });
        list.innerHTML = filtered.length
          ? filtered.map((a) => articleCard(a)).join("")
          : emptyState({ title: t("content.noArticles"), text: t("shop.noResultsHint"), iconName: "book" });
      };

      search.addEventListener("input", render);
      root.querySelectorAll("[data-cat]").forEach((btn) => {
        btn.addEventListener("click", () => {
          root.querySelectorAll("[data-cat]").forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          cat = btn.dataset.cat;
          render();
        });
      });
      render();
    },
  };
}

export function article(params) {
  const found = getArticle(params.slug);
  if (!found) {
    return {
      title: t("content.noArticles"),
      description: t("content.magazineSub"),
      html: `<section class="section"><div class="container">${emptyState({
        title: t("content.noArticles"),
        text: t("shop.noResultsHint"),
        iconName: "book",
        action: `<a class="btn btn--gold btn--sm" href="#/magazine">${esc(t("nav.magazine"))}</a>`,
      })}</div></section>`,
    };
  }
  const category = articleCategories.find((c) => c.id === found.cat);
  const related = articles.filter((a) => a.slug !== found.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: L(found.title),
    description: L(found.excerpt),
    datePublished: found.date,
    inLanguage: document.documentElement.lang,
    author: { "@type": "Organization", name: t("brand.name") },
    publisher: { "@type": "Organization", name: t("brand.name") },
  };

  return {
    title: `${L(found.title)} | ${t("brand.name")}`,
    description: L(found.excerpt),
    html: `<section class="section section--tight">
      <div class="container">
        ${breadcrumb([
          { label: t("nav.home"), href: "#/" },
          { label: t("nav.magazine"), href: "#/magazine" },
          { label: L(found.title) },
        ])}
        <div class="article-layout">
          <article>
            <div class="article-hero">
              <img src="${artUrl(found.art)}" alt="${esc(L(found.title))}" width="1600" height="900" />
            </div>
            <div class="cluster mb-3">
              <span class="badge badge--gold">${esc(L(category?.name || ""))}</span>
              <span class="tiny muted">${esc(formatDate(found.date))}</span>
              <span class="tiny muted">${esc(t("content.readTime", { n: nf(found.read) }))}</span>
            </div>
            <h1 style="font-family:var(--font-display);font-size:var(--fs-3xl);margin-bottom:var(--sp-3)">${esc(L(found.title))}</h1>
            <p class="lead mb-5">${esc(L(found.excerpt))}</p>
            <div class="article-body">${L(found.body)}</div>
            <div class="notice mt-5">${icon("info")}<span>${esc(t("content.knowledgeNote"))}</span></div>
          </article>
          <aside>
            <div class="side-card">
              <h3>${esc(t("content.categories"))}</h3>
              <div class="stack" style="gap:6px">
                ${articleCategories
                  .map(
                    (c) => `<a class="cluster" style="gap:6px" href="#/magazine?cat=${esc(c.id)}">${icon("chevronLeft")} ${esc(L(c.name))}</a>`
                  )
                  .join("")}
              </div>
            </div>
            <div class="side-card">
              <h3>${esc(t("content.relatedArticles"))}</h3>
              <div class="stack" style="gap:12px">
                ${related
                  .map(
                    (a) => `<a href="#/magazine/${esc(a.slug)}" style="display:flex;gap:10px;align-items:center">
                      <img src="${artUrl(a.art)}" alt="" width="54" height="54" style="border-radius:8px;object-fit:cover" />
                      <span style="font-size:var(--fs-sm)">${esc(L(a.title))}</span>
                    </a>`
                  )
                  .join("")}
              </div>
            </div>
            <div class="side-card" style="background:var(--surface-tint)">
              <h3>${esc(t("content.plantsTitle"))}</h3>
              <p class="small muted">${esc(t("content.plantsSub"))}</p>
              <a class="btn btn--forest btn--sm mt-3" href="#/plants">${esc(t("action.viewAll"))}</a>
            </div>
          </aside>
        </div>
      </div>
    </section>
    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  };
}

/* ── Plant encyclopedia ───────────────────────────────────────────────── */
export function plantsPage() {
  return {
    title: t("meta.plants"),
    description: t("content.plantsSub"),
    html: `${pageHead({
      title: t("content.plantsTitle"),
      sub: t("content.plantsSub"),
      crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.plants") }],
    })}
    <section class="section section--tight">
      <div class="container">
        <div class="shop-toolbar">
          <div class="shop-toolbar__search">
            <input class="input" type="search" data-plant-search placeholder="${esc(t("content.plantsSearch"))}" aria-label="${esc(t("content.plantsSearch"))}" />
          </div>
          <span class="results-count" data-plant-count></span>
        </div>
        <div class="article-grid" data-plant-list></div>
        <div class="notice mt-5">${icon("info")}<span>${esc(t("content.knowledgeNote"))}</span></div>
      </div>
    </section>`,
    after(root) {
      const list = root.querySelector("[data-plant-list]");
      const count = root.querySelector("[data-plant-count]");
      const search = root.querySelector("[data-plant-search]");

      const card = (plant) => `<article class="article-card">
        <a class="article-card__media" href="#/plants/${esc(plant.slug)}">
          <img src="${artUrl(plant.art)}" alt="${esc(L(plant.name))}" loading="lazy" width="800" height="500" />
        </a>
        <div class="article-card__body">
          <h3><a href="#/plants/${esc(plant.slug)}">${esc(L(plant.name))}</a></h3>
          <p class="product-card__sci" dir="ltr">${esc(plant.sci)}</p>
          <p>${esc(L(plant.habitat))}</p>
          <a class="article-card__more" href="#/plants/${esc(plant.slug)}">${esc(t("action.readMore"))} ←</a>
        </div>
      </article>`;

      const render = () => {
        const q = norm(search.value);
        const filtered = plants.filter((p) =>
          !q ? true : norm([L(p.name), p.name.en, p.sci, L(p.habitat), L(p.uses)].join(" ")).includes(q)
        );
        count.textContent = t("shop.results", { n: nf(filtered.length) });
        list.innerHTML = filtered.length
          ? filtered.map(card).join("")
          : emptyState({ title: t("content.noPlants"), text: t("shop.noResultsHint"), iconName: "leaf" });
      };
      search.addEventListener("input", render);
      render();
    },
  };
}

export function plantPage(params) {
  const plant = getPlant(params.slug);
  if (!plant) {
    return {
      title: t("content.noPlants"),
      description: t("content.plantsSub"),
      html: `<section class="section"><div class="container">${emptyState({
        title: t("content.noPlants"),
        text: t("shop.noResultsHint"),
        iconName: "leaf",
        action: `<a class="btn btn--gold btn--sm" href="#/plants">${esc(t("nav.plants"))}</a>`,
      })}</div></section>`,
    };
  }
  const others = plants.filter((p) => p.slug !== plant.slug).slice(0, 3);

  return {
    title: `${L(plant.name)} | ${t("content.plantsTitle")}`,
    description: L(plant.habitat),
    html: `${pageHead({
      title: L(plant.name),
      sub: plant.sci,
      crumbs: [
        { label: t("nav.home"), href: "#/" },
        { label: t("nav.plants"), href: "#/plants" },
        { label: L(plant.name) },
      ],
    })}
    <section class="section section--tight">
      <div class="container article-layout">
        <article>
          <div class="article-hero" style="aspect-ratio:16/10">
            <img src="${artUrl(plant.art)}" alt="${esc(L(plant.name))}" width="1600" height="1000" />
          </div>
          <div class="plant-facts">
            <div class="plant-fact"><span>${esc(t("content.scientific"))}</span><b dir="ltr">${esc(plant.sci)}</b></div>
            <div class="plant-fact"><span>${esc(t("content.family"))}</span><b>${esc(L(plant.family))}</b></div>
            <div class="plant-fact"><span>${esc(t("content.habitat"))}</span><b>${esc(L(plant.habitat))}</b></div>
            <div class="plant-fact"><span>${esc(t("brand.name"))}</span><b>${esc(t("common.sampleData"))}</b></div>
          </div>
          <div class="article-body">
            <h2>${esc(t("content.appearance"))}</h2>
            <p>${esc(L(plant.appearance))}</p>
            <h2>${esc(t("content.uses"))}</h2>
            <p>${esc(L(plant.uses))}</p>
            <h2>${esc(t("content.warnings"))}</h2>
            <p>${esc(L(plant.warnings))}</p>
            <h2>${esc(t("content.sources"))}</h2>
            <p>${esc(L(plant.sources))}</p>
          </div>
          <div class="notice mt-4">${icon("alert")}<span>${esc(t("content.knowledgeNote"))}</span></div>
        </article>
        <aside>
          <div class="side-card">
            <h3>${esc(t("content.plantsTitle"))}</h3>
            <div class="stack" style="gap:12px">
              ${others
                .map(
                  (p) => `<a href="#/plants/${esc(p.slug)}" style="display:flex;gap:10px;align-items:center">
                    <img src="${artUrl(p.art)}" alt="" width="54" height="54" style="border-radius:8px;object-fit:cover" />
                    <span style="font-size:var(--fs-sm)">${esc(L(p.name))}</span>
                  </a>`
                )
                .join("")}
            </div>
          </div>
          <div class="side-card" style="background:var(--surface-tint)">
            <h3>${esc(t("nav.shop"))}</h3>
            <p class="small muted">${esc(t("home.categoriesSub"))}</p>
            <a class="btn btn--forest btn--sm mt-3" href="#/shop">${esc(t("hero.ctaShop"))}</a>
          </div>
        </aside>
      </div>
    </section>`,
  };
}

/* ── History ──────────────────────────────────────────────────────────── */
export function historyPage() {
  return {
    title: t("meta.history"),
    description: t("content.historySub"),
    html: `${pageHead({
      title: t("content.historyTitle"),
      sub: t("content.historySub"),
      crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.history") }],
    })}
    <section class="section section--tight">
      <div class="container container--narrow">
        <div class="timeline">
          ${historyEras
            .map(
              (era) => `<article class="timeline__item">
                <div class="timeline__media">
                  <img src="${artUrl(era.art)}" alt="${esc(L(era.title))}" loading="lazy" width="800" height="600" />
                </div>
                <div class="timeline__body">
                  <span class="timeline__era">${esc(L(era.era))}</span>
                  <h3>${esc(L(era.title))}</h3>
                  <p>${esc(L(era.text))}</p>
                  <div class="cluster mt-3">
                    <a class="btn btn--ghost btn--sm" href="#/plants">${icon("leaf")} ${esc(t("nav.plants"))}</a>
                    <a class="btn btn--ghost btn--sm" href="#/garden">${icon("spark")} ${esc(t("nav.garden"))}</a>
                  </div>
                </div>
              </article>`
            )
            .join("")}
        </div>
        <div class="notice mt-6">${icon("info")}<span>${esc(t("content.gardenNote"))}</span></div>
      </div>
    </section>`,
  };
}

/* ── Garden tour ──────────────────────────────────────────────────────── */
export function gardenPage() {
  return {
    title: t("meta.garden"),
    description: t("content.gardenSub"),
    html: `${pageHead({
      title: t("content.gardenTitle"),
      sub: t("content.gardenSub"),
      crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.garden") }],
    })}
    <section class="section section--tight">
      <div class="container">
        <p class="small muted mb-4">${esc(t("content.gardenHint"))}</p>
        <div class="garden-stage" data-garden-stage>
          <img src="${artUrl("garden")}" alt="${esc(t("content.gardenTitle"))}" width="1600" height="900" />
          ${gardenSpots
            .map(
              (spot, i) => `<button class="hotspot" type="button" style="left:${spot.x}%;top:${spot.y}%" data-spot="${i}" aria-label="${esc(L(spot.title))}">${esc(nf(i + 1))}</button>`
            )
            .join("")}
        </div>
        <div class="hotspot-info" data-spot-info>
          <b>${esc(L(gardenSpots[0].title))}</b>
          <p class="small muted" style="margin:6px 0 0">${esc(L(gardenSpots[0].text))}</p>
        </div>
        <div class="garden-thumbs">
          ${gardenSpots
            .map(
              (spot, i) => `<button class="garden-thumb" type="button" data-spot="${i}" aria-pressed="${i === 0}">
                <img src="${artUrl(spot.art)}" alt="" width="300" height="225" />
                <span>${esc(nf(i + 1))}. ${esc(L(spot.title))}</span>
              </button>`
            )
            .join("")}
        </div>
        <div class="notice mt-5">${icon("info")}<span>${esc(t("content.gardenNote"))}</span></div>
      </div>
    </section>`,
    after(root) {
      const info = root.querySelector("[data-spot-info]");
      const select = (index) => {
        const spot = gardenSpots[index];
        info.innerHTML = `<b>${esc(L(spot.title))}</b><p class="small muted" style="margin:6px 0 0">${esc(L(spot.text))}</p>`;
        root.querySelectorAll("[data-spot]").forEach((el) => {
          const isActive = Number(el.dataset.spot) === index;
          if (el.classList.contains("garden-thumb")) el.setAttribute("aria-pressed", String(isActive));
          if (el.classList.contains("hotspot")) el.style.background = isActive ? "var(--c-gold)" : "";
        });
      };
      root.querySelectorAll("[data-spot]").forEach((el) => {
        el.addEventListener("click", () => select(Number(el.dataset.spot)));
      });
      select(0);
    },
  };
}

/* ── About ────────────────────────────────────────────────────────────── */
export function aboutPage() {
  return {
    title: t("meta.about"),
    description: t("content.aboutSub"),
    html: `${pageHead({
      title: t("content.aboutTitle"),
      sub: t("content.aboutSub"),
      crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.about") }],
    })}
    <section class="section">
      <div class="container brand-intro">
        <div class="brand-intro__media">
          <img src="${artUrl("garden")}" alt="${esc(t("content.aboutTitle"))}" width="1000" height="800" />
          <span class="brand-intro__seal">${esc(t("brand.tagline"))}</span>
        </div>
        <div>
          <span class="eyebrow">${esc(t("brand.latin"))}</span>
          <h2>${esc(t("home.brandTitle"))}</h2>
          <p class="lead mt-3">${esc(t("home.brandText"))}</p>
          <ul class="brand-intro__list">
            <li>${icon("check")}<span>${esc(t("home.brandPoint1"))}</span></li>
            <li>${icon("check")}<span>${esc(t("home.brandPoint2"))}</span></li>
            <li>${icon("check")}<span>${esc(t("home.brandPoint3"))}</span></li>
          </ul>
        </div>
      </div>
    </section>
    <section class="section section--cream">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">${esc(t("nav.history"))}</span>
          <h2>${esc(t("content.historyTitle"))}</h2>
          <p>${esc(t("content.historySub"))}</p>
        </div>
        <div class="feature-cards">
          <a class="feature-card" href="#/history">
            <div class="feature-card__bg"><img src="${artUrl("ruins")}" alt="" width="800" height="1000" /></div>
            <h3>${esc(t("nav.history"))}</h3>
            <p>${esc(t("content.historySub"))}</p>
          </a>
          <a class="feature-card" href="#/plants">
            <div class="feature-card__bg"><img src="${artUrl("herbs")}" alt="" width="800" height="1000" /></div>
            <h3>${esc(t("content.plantsTitle"))}</h3>
            <p>${esc(t("content.plantsSub"))}</p>
          </a>
          <a class="feature-card" href="#/garden">
            <div class="feature-card__bg"><img src="${artUrl("arch")}" alt="" width="800" height="1000" /></div>
            <h3>${esc(t("content.gardenTitle"))}</h3>
            <p>${esc(t("content.gardenSub"))}</p>
          </a>
        </div>
        <div class="notice mt-6">${icon("info")}<span>${esc(t("content.knowledgeNote"))}</span></div>
      </div>
    </section>`,
  };
}

/* ── Contact ──────────────────────────────────────────────────────────── */
export function contactPage() {
  return {
    title: t("meta.contact"),
    description: t("content.contactSub"),
    html: `${pageHead({
      title: t("content.contactTitle"),
      sub: t("content.contactSub"),
      crumbs: [{ label: t("nav.home"), href: "#/" }, { label: t("nav.contact") }],
    })}
    <section class="section section--tight">
      <div class="container contact-grid">
        <div class="stack" style="gap:var(--sp-3)">
          <div class="contact-card">${icon("mail")}<div><b>${esc(t("content.email"))}</b><a href="mailto:${esc(contactInfo.email)}" dir="ltr">${esc(contactInfo.email)}</a></div></div>
          <div class="contact-card">${icon("phone")}<div><b>${esc(t("content.phone"))}</b><a href="tel:${esc(contactInfo.phone.replace(/\s/g, ""))}" dir="ltr">${esc(contactInfo.phone)}</a></div></div>
          <div class="contact-card">${icon("pin")}<div><b>${esc(t("content.address"))}</b><span>${esc(L(contactInfo.address))}</span></div></div>
          <div class="contact-card">${icon("clock")}<div><b>${esc(t("content.hours"))}</b><span>${esc(L(contactInfo.hours))}</span></div></div>
          <div class="notice">${icon("info")}<span>${esc(t("content.contactOk"))}</span></div>
        </div>
        <form class="panel" data-contact-form novalidate>
          <h2>${esc(t("content.contactForm"))}</h2>
          <div class="form-grid">
            <div class="field">
              <label for="ct-name">${esc(t("content.contactName"))} *</label>
              <input class="input" id="ct-name" name="name" autocomplete="name" required />
            </div>
            <div class="field">
              <label for="ct-email">${esc(t("content.contactEmail"))} *</label>
              <input class="input" id="ct-email" name="email" type="email" dir="ltr" autocomplete="email" required />
            </div>
            <div class="field span-2">
              <label for="ct-subject">${esc(t("content.contactSubject"))}</label>
              <input class="input" id="ct-subject" name="subject" />
            </div>
            <div class="field span-2">
              <label for="ct-message">${esc(t("content.contactMessage"))} *</label>
              <textarea class="textarea" id="ct-message" name="message" required></textarea>
            </div>
          </div>
          <button class="btn btn--gold mt-4" type="submit">${esc(t("content.contactSend"))}</button>
        </form>
      </div>
    </section>
    <section class="section section--cream" id="faq">
      <div class="container container--narrow">
        <div class="section-head section-head--center">
          <h2>${esc(t("content.faqTitle"))}</h2>
        </div>
        <div class="faq">
          ${faqs
            .map(
              (f) => `<details>
                <summary>${esc(L(f.q))}<span aria-hidden="true">+</span></summary>
                <p>${esc(L(f.a))}</p>
              </details>`
            )
            .join("")}
        </div>
      </div>
    </section>`,
    after(root) {
      const form = root.querySelector("[data-contact-form]");
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const { toast } = await import("../ui/ui.js");
        const values = Object.fromEntries(new FormData(form).entries());
        if (!values.name || !values.email || !values.message) {
          toast(t("content.contactErr"), "error");
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
          toast(t("validation.email"), "error");
          return;
        }
        addMessage(values);
        form.reset();
        toast(t("content.contactOk"));
      });
    },
  };
}

/* ── 404 ──────────────────────────────────────────────────────────────── */
export function notFound() {
  return {
    title: `${t("notfound.title")} | ${t("brand.name")}`,
    description: t("notfound.text"),
    html: `<section class="section">
      <div class="container notfound">
        <b aria-hidden="true">۴۰۴</b>
        <h1>${esc(t("notfound.title"))}</h1>
        <p class="muted mt-3">${esc(t("notfound.text"))}</p>
        <div class="cluster mt-5" style="justify-content:center">
          <a class="btn btn--gold" href="#/">${esc(t("notfound.cta"))}</a>
          <a class="btn btn--outline" href="#/shop">${esc(t("nav.shop"))}</a>
        </div>
      </div>
    </section>`,
  };
}
