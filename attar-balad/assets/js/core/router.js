/* ── عطار بلد · Hash router ───────────────────────────────────────────────
   مسیرها با # شروع می‌شوند تا روی هر میزبان استاتیکی کار کنند:
   #/shop?cat=tea ، #/product/zaferan-sargol-qaenat ، #/admin/orders … */

const routes = [];
let onRoute = null;
let started = false;

export function defineRoute(pattern, view) {
  const keys = [];
  const source =
    pattern === "/"
      ? "/"
      : pattern
          .replace(/\/+$/, "")
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\/:(\w+)/g, (_, key) => {
            keys.push(key);
            return "/([^/]+)";
          });
  const regex = new RegExp(`^${source}$`);
  routes.push({ pattern, regex, keys, view: view || pattern });
}

export function parseHash(hash = window.location.hash) {
  const raw = (hash || "").replace(/^#/, "") || "/";
  const [pathPart, queryPart] = raw.split("?");
  const path = pathPart === "" ? "/" : pathPart.replace(/\/+$/, "") || "/";
  const query = {};
  new URLSearchParams(queryPart || "").forEach((value, key) => {
    query[key] = value;
  });
  return { path, query };
}

export function link(path) {
  return `#${path}`;
}

export function navigate(path, { replace = false } = {}) {
  const target = `#${path}`;
  if (replace) {
    history.replaceState(null, "", target);
    resolve();
  } else if (window.location.hash === target) {
    resolve();
  } else {
    window.location.hash = target;
  }
}

function match(path) {
  for (const route of routes) {
    const m = path.match(route.regex);
    if (m) {
      const params = {};
      route.keys.forEach((key, i) => {
        params[key] = decodeURIComponent(m[i + 1]);
      });
      return { route, params };
    }
  }
  return null;
}

export function resolve() {
  const { path, query } = parseHash();
  const found = match(path);
  if (found) {
    onRoute?.(found.route.view, found.params, query, path);
  } else {
    onRoute?.("notfound", {}, query, path);
  }
}

export function startRouter(handler) {
  onRoute = handler;
  if (!started) {
    window.addEventListener("hashchange", () => {
      resolve();
    });
    started = true;
  }
  resolve();
}

export function setTitle(title) {
  document.title = title;
}

export function setMetaDescription(text) {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", text);
}

export function setJsonLd(id, data) {
  let tag = document.getElementById(`ld-${id}`);
  if (!data) {
    tag?.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = `ld-${id}`;
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(data);
}

export function currentQueryString(overrides = {}) {
  const { query } = parseHash();
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();
  Object.entries(merged).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
