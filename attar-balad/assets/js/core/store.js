/* ── عطار بلد · Local store ───────────────────────────────────────────────
   نسخه‌ی نمایشی: سبد خرید، حساب، سفارش، نظر و خبرنامه در localStorage همین
   مرورگر ذخیره می‌شوند. این لایه جای پایگاه داده و API واقعی را می‌گیرد؛
   برای تولید واقعی باید همین توابع به درخواست‌های سرور متصل شوند و
   اعتبارسنجی مبلغ و موجودی در سمت سرور انجام شود. */

import { products as seedProducts, categories, getProduct } from "../data/catalog.js";

const KEY = "attar-balad:store:v1";
const FREE_SHIPPING = 1500000;
const SHIPPING_COST = 65000;

/* Demo-only password hash. Never use this for real authentication. */
function hash(value) {
  let h = 5381;
  const text = `attar:${value}`;
  for (let i = 0; i < text.length; i += 1) {
    h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  }
  return `h${(h >>> 0).toString(36)}`;
}

const now = () => new Date().toISOString();

function seedState() {
  return {
    version: 1,
    cart: [],
    wishlist: [],
    orders: [],
    newsletter: [],
    messages: [],
    overrides: {},
    customProducts: [],
    session: null,
    users: [
      {
        id: "u-admin",
        name: "مدیر عطار بلد",
        email: "admin@attar-balad.example",
        pass: hash("admin1234"),
        role: "admin",
        addresses: [],
        createdAt: now(),
      },
      {
        id: "u-sara",
        name: "سارا محمدی",
        email: "sara@example.com",
        pass: hash("sara1234"),
        role: "customer",
        addresses: [
          {
            id: "a-1",
            title: "خانه",
            recipient: "سارا محمدی",
            phone: "09120000000",
            province: "تهران",
            city: "تهران",
            address: "خیابان نمونه، کوچه نمونه، پلاک ۱۲",
            postal: "1234567890",
          },
        ],
        createdAt: now(),
      },
    ],
    reviews: [
      {
        id: "r-1",
        pid: "p-saffron",
        name: "مریم ک.",
        rating: 5,
        text: "رنگ و عطر زعفران عالی بود و بسته‌بندی کاملاً محافظ بود.",
        at: "2026-09-12",
        status: "approved",
        sample: true,
      },
      {
        id: "r-2",
        pid: "p-honey",
        name: "حسین ر.",
        rating: 5,
        text: "عسل طبیعی و خوش‌طعم؛ شکرک ملایمش نشانه‌ی طبیعی بودن است.",
        at: "2026-09-20",
        status: "approved",
        sample: true,
      },
      {
        id: "r-3",
        pid: "p-gavzaban",
        name: "الهام ن.",
        rating: 4,
        text: "دمنوش ملایمی است و تلخی ندارد. برای عصرها مناسب است.",
        at: "2026-10-02",
        status: "approved",
        sample: true,
      },
    ],
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    const base = seedState();
    return {
      ...base,
      ...parsed,
      users: Array.isArray(parsed.users) && parsed.users.length ? parsed.users : base.users,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : base.reviews,
    };
  } catch {
    return seedState();
  }
}

export const state = load();

const listeners = new Set();

function commit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or disabled: keep working in memory */
  }
  listeners.forEach((fn) => {
    try {
      fn(state);
    } catch {
      /* a broken listener must not break the store */
    }
  });
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ── Catalogue with admin overrides ───────────────────────────────────── */
export function catalog() {
  return [...seedProducts, ...(state.customProducts || [])]
    .map((p) => {
      const o = state.overrides[p.id] || {};
      const variants = p.variants.map((v) => ({ ...v }));
      if (typeof o.price === "number") {
        variants[0].price = o.price;
      }
      if (typeof o.stock === "number") {
        variants[0].stock = o.stock;
      }
      return {
        ...p,
        variants,
        price: variants[0].price,
        stock: variants.reduce((sum, v) => sum + v.stock, 0),
        active: o.active !== false,
      };
    })
    .filter((p) => p.active !== false);
}

export function productById(id) {
  return catalog().find((p) => p.id === id) || null;
}

export function productBySlug(slug) {
  return catalog().find((p) => p.slug === slug) || null;
}

export function categoriesWithCounts() {
  return categories.map((c) => ({
    ...c,
    count: catalog().filter((p) => p.cat === c.id).length,
  }));
}

/* ── Cart ─────────────────────────────────────────────────────────────── */
function findVariant(product, vid) {
  return product?.variants.find((v) => v.id === vid) || product?.variants[0];
}

export function addToCart(pid, vid, qty = 1) {
  const product = productById(pid);
  if (!product) return false;
  const variant = findVariant(product, vid);
  if (!variant || variant.stock <= 0) return false;
  const existing = state.cart.find((l) => l.pid === pid && l.vid === variant.id);
  const max = variant.stock;
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, max);
  } else {
    state.cart.push({ pid, vid: variant.id, qty: Math.min(qty, max) });
  }
  commit();
  return true;
}

export function setCartQty(pid, vid, qty) {
  const line = state.cart.find((l) => l.pid === pid && l.vid === vid);
  if (!line) return;
  const product = productById(pid);
  const variant = findVariant(product, vid);
  if (qty <= 0) {
    state.cart = state.cart.filter((l) => !(l.pid === pid && l.vid === vid));
  } else {
    line.qty = Math.min(qty, variant?.stock ?? qty);
  }
  commit();
}

export function removeFromCart(pid, vid) {
  state.cart = state.cart.filter((l) => !(l.pid === pid && l.vid === vid));
  commit();
}

export function clearCart() {
  state.cart = [];
  commit();
}

export function cartLines() {
  return state.cart
    .map((line) => {
      const product = productById(line.pid);
      if (!product) return null;
      const variant = findVariant(product, line.vid);
      if (!variant) return null;
      return {
        ...line,
        product,
        variant,
        lineTotal: variant.price * line.qty,
        lineCompare: (product.compareAt && product.compareAt > variant.price ? product.compareAt : variant.price) * line.qty,
      };
    })
    .filter(Boolean);
}

export function cartTotals() {
  const lines = cartLines();
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const compare = lines.reduce((sum, l) => sum + l.lineCompare, 0);
  const discount = Math.max(0, compare - subtotal);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  return { subtotal, discount, shipping, total: subtotal + shipping, count, freeShipping: subtotal >= FREE_SHIPPING, freeShippingThreshold: FREE_SHIPPING };
}

export function cartCount() {
  return state.cart.reduce((sum, l) => sum + l.qty, 0);
}

/* ── Wishlist ─────────────────────────────────────────────────────────── */
export function inWishlist(pid) {
  return state.wishlist.includes(pid);
}

export function toggleWishlist(pid) {
  if (inWishlist(pid)) {
    state.wishlist = state.wishlist.filter((id) => id !== pid);
    commit();
    return false;
  }
  state.wishlist.push(pid);
  commit();
  return true;
}

export function wishlistProducts() {
  return state.wishlist.map((id) => productById(id)).filter(Boolean);
}

/* ── Auth (demo, local only) ──────────────────────────────────────────── */
export function currentUser() {
  if (!state.session) return null;
  return state.users.find((u) => u.id === state.session) || null;
}

export function isAdmin() {
  return currentUser()?.role === "admin";
}

export function register({ name, email, password }) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!name || !cleanEmail || !password) return { ok: false, error: "registerInvalid" };
  if (password.length < 6) return { ok: false, error: "registerWeak" };
  if (state.users.some((u) => u.email === cleanEmail)) return { ok: false, error: "registerExists" };
  const user = {
    id: `u-${Date.now().toString(36)}`,
    name: String(name).trim(),
    email: cleanEmail,
    pass: hash(password),
    role: "customer",
    addresses: [],
    createdAt: now(),
  };
  state.users.push(user);
  state.session = user.id;
  commit();
  return { ok: true, user };
}

export function login(email, password) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const user = state.users.find((u) => u.email === cleanEmail && u.pass === hash(password));
  if (!user) return { ok: false, error: "loginError" };
  state.session = user.id;
  commit();
  return { ok: true, user };
}

export function logout() {
  state.session = null;
  commit();
}

export function updateProfile({ name, email }) {
  const user = currentUser();
  if (!user) return false;
  if (name) user.name = name;
  if (email && !state.users.some((u) => u.email === email.toLowerCase() && u.id !== user.id)) {
    user.email = email.toLowerCase();
  }
  commit();
  return true;
}

/* ── Addresses ────────────────────────────────────────────────────────── */
export function saveAddress(address) {
  const user = currentUser();
  if (!user) return false;
  const clean = { ...address };
  if (!clean.id) clean.id = `a-${Date.now().toString(36)}`;
  const idx = user.addresses.findIndex((a) => a.id === clean.id);
  if (idx >= 0) user.addresses[idx] = clean;
  else user.addresses.push(clean);
  commit();
  return true;
}

export function removeAddress(id) {
  const user = currentUser();
  if (!user) return;
  user.addresses = user.addresses.filter((a) => a.id !== id);
  commit();
}

/* ── Orders ───────────────────────────────────────────────────────────── */
export function createOrder({ customer, shippingMethod, note }) {
  const lines = cartLines();
  if (!lines.length) return { ok: false, error: "emptyCart" };
  const totals = cartTotals();
  const code = `AB-${Date.now().toString(36).slice(-5).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
  const order = {
    code,
    userId: currentUser()?.id || null,
    customer,
    shippingMethod,
    note: note || "",
    items: lines.map((l) => ({
      pid: l.product.id,
      vid: l.variant.id,
      name: l.product.name,
      variant: l.variant.label,
      price: l.variant.price,
      qty: l.qty,
      art: l.product.art,
    })),
    totals,
    payment: { method: "demo", status: "unpaid" },
    status: "awaiting_payment",
    createdAt: now(),
  };
  state.orders.unshift(order);
  state.cart = [];
  commit();
  return { ok: true, order };
}

export function findOrder(code) {
  return state.orders.find((o) => o.code === code) || null;
}

export function myOrders() {
  const user = currentUser();
  if (!user) return [];
  return state.orders.filter((o) => o.userId === user.id);
}

export function setOrderStatus(code, status) {
  const order = findOrder(code);
  if (!order) return false;
  order.status = status;
  commit();
  return true;
}

export function markOrderPaid(code) {
  const order = findOrder(code);
  if (!order) return false;
  order.payment = { method: "demo", status: "paid" };
  order.status = "processing";
  commit();
  return true;
}

/* ── Reviews ──────────────────────────────────────────────────────────── */
export function approvedReviews(pid) {
  return state.reviews.filter((r) => r.pid === pid && r.status === "approved");
}

export function allReviews() {
  return [...state.reviews].sort((a, b) => (a.at < b.at ? 1 : -1));
}

export function addReview({ pid, name, rating, text }) {
  if (!pid || !name || !text) return false;
  state.reviews.unshift({
    id: `r-${Date.now().toString(36)}`,
    pid,
    name,
    rating: Number(rating) || 5,
    text,
    at: now(),
    status: "pending",
    sample: false,
  });
  commit();
  return true;
}

export function setReviewStatus(id, status) {
  const review = state.reviews.find((r) => r.id === id);
  if (!review) return false;
  review.status = status;
  commit();
  return true;
}

export function reviewAverage(pid) {
  const list = approvedReviews(pid);
  if (!list.length) {
    const product = getProduct(pid);
    return { avg: product?.rating ?? 0, count: product?.reviewCount ?? 0 };
  }
  const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
  return { avg: Math.round(avg * 10) / 10, count: list.length };
}

/* ── Newsletter & messages ────────────────────────────────────────────── */
export function subscribeNewsletter(email) {
  const clean = String(email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) return { ok: false, error: "newsletterInvalid" };
  if (state.newsletter.some((n) => n.email === clean)) return { ok: false, error: "newsletterExists" };
  state.newsletter.push({ email: clean, at: now() });
  commit();
  return { ok: true };
}

export function addMessage(message) {
  state.messages.unshift({ ...message, at: now() });
  commit();
  return true;
}

/* ── Admin product overrides ──────────────────────────────────────────── */
export function saveProductOverride(id, patch) {
  const product = getProduct(id);
  if (!product) return false;
  state.overrides[id] = { ...(state.overrides[id] || {}), ...patch };
  commit();
  return true;
}

export function deactivateProduct(id) {
  const custom = (state.customProducts || []).find((p) => p.id === id);
  if (custom) {
    custom.active = false;
  } else {
    state.overrides[id] = { ...(state.overrides[id] || {}), active: false };
  }
  commit();
}

export function addProduct({ nameFa, nameEn, cat, price, stock, shortFa, shortEn }) {
  const stamp = Date.now().toString(36);
  const priceValue = Math.max(0, Number(price) || 0);
  const stockValue = Math.max(0, Number(stock) || 0);
  const product = {
    id: `p-custom-${stamp}`,
    slug: `custom-${stamp}`,
    cat,
    name: { fa: nameFa, en: nameEn || nameFa },
    sci: "",
    price: priceValue,
    compareAt: 0,
    stock: stockValue,
    rating: 0,
    reviewCount: 0,
    badges: [],
    art: "herbs",
    new: true,
    short: { fa: shortFa || "", en: shortEn || shortFa || "" },
    desc: { fa: shortFa || "", en: shortEn || shortFa || "" },
    specs: [],
    ingredients: { fa: "", en: "" },
    storage: { fa: "", en: "" },
    usage: { fa: "", en: "" },
    warning: { fa: "", en: "" },
    variants: [{ id: "std", label: { fa: "بسته استاندارد", en: "Standard pack" }, price: priceValue, stock: stockValue }],
    active: true,
    custom: true,
  };
  state.customProducts.push(product);
  commit();
  return product;
}

export function customerList() {
  return state.users.filter((u) => u.role === "customer");
}

export function stats() {
  const orders = state.orders;
  const sales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.totals?.total || 0), 0);
  return {
    products: catalog().length,
    orders: orders.length,
    sales,
    awaiting: orders.filter((o) => o.status === "awaiting_payment").length,
    lowStock: catalog().filter((p) => p.stock > 0 && p.stock <= 10).length,
    outOfStock: catalog().filter((p) => p.stock === 0).length,
    customers: customerList().length,
    pendingReviews: state.reviews.filter((r) => r.status === "pending").length,
    subscribers: state.newsletter.length,
  };
}

export const SHIPPING = { FREE_SHIPPING, SHIPPING_COST };
