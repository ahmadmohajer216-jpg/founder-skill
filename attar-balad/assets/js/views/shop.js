/* ── عطار بلد · Shop ────────────────────────────────────────────────────── */

import { t, L, nf, money } from "../core/i18n.js";
import { icon } from "../ui/icons.js";
import { esc, productCard, emptyState, breadcrumb } from "../ui/ui.js";
import { catalog, categoriesWithCounts } from "../core/store.js";
import { categories, priceRange } from "../data/catalog.js";

const PER_PAGE = 9;

function norm(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .trim();
}

function readFilters(root) {
  const get = (name) => root.querySelector(`[name="${name}"]`);
  const min = get("min")?.value;
  const max = get("max")?.value;
  return {
    cat: root.querySelector('[name="cat"]:checked')?.value || "",
    q: get("q")?.value.trim() || "",
    min: min ? Number(min) : null,
    max: max ? Number(max) : null,
    avail: Boolean(get("avail")?.checked),
    sale: Boolean(get("sale")?.checked),
    new: Boolean(get("new")?.checked),
    sort: get("sort")?.value || "new",
    page: 1,
  };
}

function filterProducts(filters) {
  const query = norm(filters.q);
  return catalog().filter((p) => {
    if (filters.cat && p.cat !== filters.cat) return false;
    if (filters.avail && p.stock <= 0) return false;
    if (filters.sale && !(p.compareAt && p.compareAt > p.price)) return false;
    if (filters.new && !p.new) return false;
    if (filters.min !== null && p.price < filters.min) return false;
    if (filters.max !== null && p.price > filters.max) return false;
    if (query) {
      const category = categories.find((c) => c.id === p.cat);
      const hay = norm(
        [L(p.name), p.name.en, p.sci, L(p.short), L(category?.name || ""), p.name.fa].join(" ")
      );
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

function sortProducts(list, sort) {
  const copy = [...list];
  switch (sort) {
    case "cheap":
      return copy.sort((a, b) => a.price - b.price);
    case "expensive":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "name":
      return copy.sort((a, b) => L(a.name).localeCompare(L(b.name), "fa"));
    default:
      return copy.sort((a, b) => Number(b.new) - Number(a.new) || b.rating - a.rating);
  }
}

function activePills(filters) {
  const pills = [];
  if (filters.cat) {
    const cat = categories.find((c) => c.id === filters.cat);
    pills.push({ key: "cat", label: L(cat?.name || "") });
  }
  if (filters.q) pills.push({ key: "q", label: `«${filters.q}»` });
  if (filters.min !== null) pills.push({ key: "min", label: `${t("shop.min")}: ${nf(filters.min)}` });
  if (filters.max !== null) pills.push({ key: "max", label: `${t("shop.max")}: ${nf(filters.max)}` });
  if (filters.avail) pills.push({ key: "avail", label: t("shop.onlyAvailable") });
  if (filters.sale) pills.push({ key: "sale", label: t("shop.onlyDiscounted") });
  if (filters.new) pills.push({ key: "new", label: t("shop.onlyNew") });
  return pills;
}

function paginationHTML(page, pages) {
  if (pages <= 1) return "";
  const items = [];
  items.push(
    `<button class="is-disabled" data-page="${page - 1}" ${page === 1 ? "disabled" : ""} aria-label="${esc(t("shop.prev"))}">${icon("chevronRight")}</button>`
  );
  for (let i = 1; i <= pages; i += 1) {
    items.push(
      `<button data-page="${i}" ${i === page ? 'aria-current="page"' : ""}>${esc(nf(i))}</button>`
    );
  }
  items.push(
    `<button class="${page === pages ? "is-disabled" : ""}" data-page="${page + 1}" ${page === pages ? "disabled" : ""} aria-label="${esc(t("shop.next"))}">${icon("chevronLeft")}</button>`
  );
  return `<nav class="pagination" aria-label="${esc(t("shop.page"))}">${items.join("")}</nav>`;
}

export function shop(params, query) {
  const counts = categoriesWithCounts();
  const range = priceRange();
  const initial = {
    cat: query.cat || "",
    q: query.q || "",
    min: query.min ? Number(query.min) : null,
    max: query.max ? Number(query.max) : null,
    avail: query.avail === "1",
    sale: query.sale === "1",
    new: query.new === "1",
    sort: query.sort || "new",
    page: Math.max(1, Number(query.page) || 1),
  };

  return {
    title: t("meta.shop"),
    description: t("shop.sub"),
    html: `<section class="page-head">
      <div class="container page-head__inner">
        ${breadcrumb([{ label: t("nav.home"), href: "#/" }, { label: t("nav.shop") }])}
        <h1>${esc(t("shop.title"))}</h1>
        <p>${esc(t("shop.sub"))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="container shop-layout">
        <aside class="filters" id="shop-filters" aria-label="${esc(t("shop.filters"))}">
          <div class="filters__group">
            <h3>${esc(t("shop.category"))}</h3>
            <label class="filter-option">
              <span><input type="radio" name="cat" value="" ${initial.cat ? "" : "checked"} /> ${esc(t("shop.allCategories"))}</span>
              <small>${esc(nf(catalog().length))}</small>
            </label>
            ${counts
              .map(
                (c) => `<label class="filter-option">
                  <span><input type="radio" name="cat" value="${esc(c.id)}" ${initial.cat === c.id ? "checked" : ""} /> ${esc(L(c.name))}</span>
                  <small>${esc(nf(c.count))}</small>
                </label>`
              )
              .join("")}
          </div>
          <div class="filters__group">
            <h3>${esc(t("shop.price"))}</h3>
            <div class="price-range">
              <div class="price-range__inputs">
                <input class="input" type="number" name="min" min="0" step="10000" placeholder="${esc(t("shop.min"))}" value="${initial.min ?? ""}" aria-label="${esc(t("shop.min"))}" />
                <input class="input" type="number" name="max" min="0" step="10000" placeholder="${esc(t("shop.max"))}" value="${initial.max ?? ""}" aria-label="${esc(t("shop.max"))}" />
              </div>
              <p class="tiny muted" style="margin:0">${esc(money(range.min))} — ${esc(money(range.max))}</p>
            </div>
          </div>
          <div class="filters__group">
            <h3>${esc(t("shop.availability"))}</h3>
            <label class="check"><input type="checkbox" name="avail" ${initial.avail ? "checked" : ""} /> ${esc(t("shop.onlyAvailable"))}</label>
            <label class="check"><input type="checkbox" name="sale" ${initial.sale ? "checked" : ""} /> ${esc(t("shop.onlyDiscounted"))}</label>
            <label class="check"><input type="checkbox" name="new" ${initial.new ? "checked" : ""} /> ${esc(t("shop.onlyNew"))}</label>
          </div>
          <button class="btn btn--outline btn--sm" type="button" data-clear-filters>${esc(t("shop.clearFilters"))}</button>
        </aside>
        <div>
          <div class="shop-toolbar">
            <div class="shop-toolbar__search">
              <input class="input" type="search" name="q" value="${esc(initial.q)}" placeholder="${esc(t("shop.searchIn"))}" aria-label="${esc(t("shop.searchIn"))}" />
              <button class="btn btn--forest btn--sm mobile-filter-toggle" type="button" data-filter-toggle aria-expanded="false">${icon("filter")}<span>${esc(t("shop.filters"))}</span></button>
            </div>
            <span class="results-count" data-results-count aria-live="polite"></span>
            <label class="cluster" style="gap:8px">
              <span class="tiny muted">${esc(t("shop.sort"))}</span>
              <select class="select" name="sort" style="min-height:40px;width:auto">
                <option value="new" ${initial.sort === "new" ? "selected" : ""}>${esc(t("shop.sortNew"))}</option>
                <option value="cheap" ${initial.sort === "cheap" ? "selected" : ""}>${esc(t("shop.sortCheap"))}</option>
                <option value="expensive" ${initial.sort === "expensive" ? "selected" : ""}>${esc(t("shop.sortExpensive"))}</option>
                <option value="rating" ${initial.sort === "rating" ? "selected" : ""}>${esc(t("shop.sortRating"))}</option>
                <option value="name" ${initial.sort === "name" ? "selected" : ""}>${esc(t("shop.sortName"))}</option>
              </select>
            </label>
          </div>
          <div class="active-filters" data-active-filters></div>
          <div data-shop-results></div>
        </div>
      </div>
    </section>`,
    after(root) {
      const filtersEl = root.querySelector("#shop-filters");
      const toolbar = root.querySelector(".shop-toolbar");
      const results = root.querySelector("[data-shop-results]");
      const countEl = root.querySelector("[data-results-count]");
      const pillsEl = root.querySelector("[data-active-filters]");
      let page = initial.page;
      let searchTimer = null;

      const read = () => {
        const filters = readFilters(root);
        filters.page = page;
        return filters;
      };

      const updateUrl = (filters) => {
        const params = new URLSearchParams();
        if (filters.cat) params.set("cat", filters.cat);
        if (filters.q) params.set("q", filters.q);
        if (filters.min !== null) params.set("min", String(filters.min));
        if (filters.max !== null) params.set("max", String(filters.max));
        if (filters.avail) params.set("avail", "1");
        if (filters.sale) params.set("sale", "1");
        if (filters.new) params.set("new", "1");
        if (filters.sort !== "new") params.set("sort", filters.sort);
        if (page > 1) params.set("page", String(page));
        const qs = params.toString();
        history.replaceState(null, "", `#/shop${qs ? `?${qs}` : ""}`);
      };

      const render = () => {
        const filters = read();
        const filtered = sortProducts(filterProducts(filters), filters.sort);
        const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
        if (page > pages) page = pages;
        const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

        countEl.textContent = t("shop.results", { n: nf(filtered.length) });
        pillsEl.innerHTML = activePills(filters)
          .map(
            (p) => `<span class="filter-pill">${esc(p.label)}<button type="button" data-pill="${esc(p.key)}" aria-label="${esc(t("action.remove"))}">${icon("close")}</button></span>`
          )
          .join("");

        results.innerHTML = slice.length
          ? `<div class="product-grid">${slice.map((p) => productCard(p)).join("")}</div>${paginationHTML(page, pages)}`
          : emptyState({
              title: t("shop.noResults"),
              text: t("shop.noResultsHint"),
              iconName: "search",
              action: `<button class="btn btn--gold btn--sm" type="button" data-clear-filters>${esc(t("shop.clearFilters"))}</button>`,
            });

        updateUrl(filters);
      };

      const reset = () => {
        root.querySelectorAll('[name="cat"]').forEach((el) => {
          el.checked = el.value === "";
        });
        root.querySelector('[name="min"]').value = "";
        root.querySelector('[name="max"]').value = "";
        root.querySelectorAll('[name="avail"], [name="sale"], [name="new"]').forEach((el) => {
          el.checked = false;
        });
        toolbar.querySelector('[name="q"]').value = "";
        page = 1;
        render();
      };

      filtersEl.addEventListener("change", () => {
        page = 1;
        render();
      });
      toolbar.querySelector('[name="sort"]').addEventListener("change", () => {
        page = 1;
        render();
      });
      toolbar.querySelector('[name="q"]').addEventListener("input", (event) => {
        clearTimeout(searchTimer);
        const value = event.target.value;
        searchTimer = setTimeout(() => {
          page = 1;
          const filters = read();
          filters.q = value;
          render();
        }, 220);
      });

      root.addEventListener("click", (event) => {
        const pageBtn = event.target.closest("[data-page]");
        if (pageBtn && !pageBtn.disabled) {
          page = Number(pageBtn.dataset.page);
          render();
          results.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (event.target.closest("[data-clear-filters]")) {
          reset();
          return;
        }
        const pill = event.target.closest("[data-pill]");
        if (pill) {
          const key = pill.dataset.pill;
          if (key === "cat") {
            root.querySelectorAll('[name="cat"]').forEach((el) => {
              el.checked = el.value === "";
            });
          } else if (key === "q") {
            toolbar.querySelector('[name="q"]').value = "";
          } else if (key === "min" || key === "max") {
            root.querySelector(`[name="${key}"]`).value = "";
          } else {
            root.querySelector(`[name="${key}"]`).checked = false;
          }
          page = 1;
          render();
          return;
        }
        const toggle = event.target.closest("[data-filter-toggle]");
        if (toggle) {
          const isOpen = filtersEl.classList.toggle("is-open");
          toggle.setAttribute("aria-expanded", String(isOpen));
        }
      });

      render();
    },
  };
}
