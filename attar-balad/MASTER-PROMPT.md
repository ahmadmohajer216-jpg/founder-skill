# MASTER PROMPT – ATTAR BALAD

A build brief for **عطار بلد (Attar Balad)**, a Persian herbal apothecary storefront.
Paste the section below into any AI builder to reproduce this page; the working
reference implementation is the Phase 3 storefront beside this file (`index.html`,
`shop.html`, `product.html`, `assets/css/`, `assets/js/`, `assets/courtyard.svg`).

---

## THE PROMPT

Build the homepage of **عطار بلد**, a Persian herbal apothecary that sells
medicinal plants, extracts and oils, spices, infusions and herbal health
products. The site is **right-to-left, Persian, and feels like a royal Iranian
herbal house**: warm cream paper, ink black, gold leaf, and a courtyard at dusk.
It must feel expensive and calm – not like a discount supplement shop – while
staying completely scannable, because the buyer is a 30–55 year old Iranian
woman shopping on a phone who wants to reach a product category in one tap.

### 1. Art direction

- **Mood:** a restored Safavid courtyard at golden hour. Warm light, deep
  shadow, gold ornament used sparingly, photography or painterly scenes rather
  than flat illustration.
- **Colour tokens:** ink `#14120f`, ink-soft `#4a4337`, gold `#c9a24d`, light
  gold `#e3c88f`, deep gold `#9d7a33`, cream `#f8f3e8`, sand `#efe7d5`, herbal
  green `#1f2b23`, paper white `#fffdf8`. Borders are `rgba(20,18,15,.12)`.
  Never use pure black, never use blue, never put gold text on cream.
- **Type:** one Persian family throughout (Vazirmatn or IRANSans, Tahoma
  fallback). Weights 300–800. The brand wordmark is 800 weight at ~78px with a
  tight line height; section titles 700 at ~33px; body 16px with 1.75 line
  height; meta labels 11.5–12.5px in `--muted`.
- **Geometry:** pill buttons, 18–22px card radius, and **arch-topped category
  tiles** (fully round top, soft corners at the bottom) as the signature shape.
  Hairline gold rules separate sections; no heavy drop shadows, only soft
  long-tailed ones.
- **Ornament:** a small gold crown mark before the wordmark, thin gold dividers
  either side of the word «سلطنتی», and a gold hairline on the sticky nav.

### 2. Page structure, top to bottom

**a. Utility bar** (ink black, 54px tall, full width)

- Start side: pill search field, placeholder «جست‌وجو در محصولات…», magnifier
  button inside the field; then a language toggle `Fa / En` where the active
  language is gold.
- End side: circular cart button with a gold counter badge showing ۰, and a
  pill link «ورود / ثبت‌نام» with a person icon.
- On a phone this bar wraps: login + cart on one row, full-width search below.

**b. Sticky navigation** (ink black, gold hairline at the bottom)

Right-to-left links: خانه (active, gold, gold underline), فروشگاه، گیاهان دارویی،
دمنوش‌ها، تاریخ طب ایران، درباره ما، تماس با ما. Under 900px collapse them behind
a hamburger that opens a full-width dark panel; the active item gets a gold
tinted background there.

**c. Hero** (full-bleed, min 520–660px tall, RTL two-column grid)

- Background: a warm Persian courtyard at dusk – a sandstone arcade of five
  arches, the middle one a tall iwan with a lit interior, two dark cypress
  trees, distant blue-grey ranges, and a still life on the foreground ledge
  (books, brass mortar, oil bottle, herb sprigs, saffron threads). A dark scrim
  runs from the text side so every letter sits on near-solid ink.
- Content column (start side): gold kicker «سلطنتی» between two hairlines; the
  wordmark «عطار بلد» as the page `h1` with the crown mark in gold; tagline
  «طبیعت در خدمت سلامتی» in light gold; supporting line «با اصالت طبیعت به نسل
  سالم‌تری می‌اندیشیم»; then a gold pill button «مشاهده محصولات» with a leftward
  arrow (forward in RTL) jumping to the categories.
- Side rail (end side, 232px, hairline borders both sides): four circular icon
  links stacked, each a ringed icon plus a label – گیاهان دارویی، تاریخ ایران،
  محصولات ایران، تور مجازی – then a note «سفری در تاریخ، طبیعت و سلامت ایران».
  On mobile the rail becomes a horizontally scrollable strip of four items.

**d. Services strip** (sand background, five columns, hairline dividers)

Icon in a white rounded square + a bold line + a muted second line:

1. پاسخ خودکار دایرکت اینستاگرام – پاسخ فوری، هر ساعت از شبانه‌روز
2. پرداخت امن زرین‌پال – درگاه بانکی و کارت‌های شتاب
3. ارسال سریع – پست، تیپاکس، پیک شهری
4. چت‌بات پشتیبانی – راهنمای خرید و انتخاب گیاه
5. پیشنهاد محصول مرتبط – بر پایه سبد خرید شما

**e. Categories** – `h2` «دسته‌بندی محصولات», eyebrow «فروشگاه», and a
«همه محصولات» link on the other side of a hairline rule. Seven arch-topped tiles
in one row, each: tinted gradient arch with a line icon, the name, and a small
count. عصاره‌ها و روغن‌ها (۲۴)، ادویه‌جات (۳۸)، گیاهان دارویی (۵۲)، دمنوش‌ها (۱۹)،
محصولات ویژه (۱۲)، فرآورده‌های گیاهی (۳۱)، محصولات سلامت (۲۷). Each tile lifts on
hover. On mobile: two columns.

**f. History band** (deep herbal green, gold radial glow, full-bleed)

Eyebrow «تاریخ طب ایران», `h2` «سفر در تاریخ طب ایران», subtitle «از عهد باستان
تا امروز», and a ghost pill button «مشاهده در سه‌بعدی» with a cube icon. Below it
a six-stop timeline of eras – تخت جمشید (۵۵۰ پ.م)، هگمتانه (۷۰۰ پ.م)، ساسانیان
(۲۲۴ م)، دوره اسلامی (۹۰۰ م)، دوره صفوی (۱۵۰۱ م)، ایران معاصر (۱۳۱۳ ش) – each a
gold dot on a hairline that lights up when selected, and a caption under a gold
left rule that changes with the era:

- تخت جمشید: کتیبه‌های باروی تخت جمشید، گیاهان دارویی و سهم آن‌ها در انبارهای شاهی را ثبت کرده‌اند.
- هگمتانه: هگمتانه، گذرگاه طب میان‌رودان و فلات ایران بود؛ دارو و ادویه از همین راه می‌گذشت.
- ساسانیان: دانشگاه گندیشاپور، طب ایرانی، هندی و یونانی را زیر یک سقف گرد آورد.
- دوره اسلامی: ابن‌سینا در قانون، داروشناسی را به دستگاهی منظم تبدیل کرد و قرن‌ها مرجع ماند.
- دوره صفوی: عطاری‌های بازار صفوی، دارو، ادویه و روغن را کنار هم می‌فروختند.
- ایران معاصر: دانشکده داروسازی تهران، طب سنتی ایران را به پژوهش دانشگاهی رساند.

**g. Feature trio** – `h2` «بیشتر از یک فروشگاه», three white cards, each an
icon in a gold-tinted square, a title, a muted line and an outlined pill button:

1. تور مجازی باغ گیاهان دارویی – تجربه‌ای متفاوت از طبیعت – «ورود»
2. مقالات و آموزش‌ها – دانش طبیعت در زندگی روزمره – «مطالعه کنید»
3. مشاوره با متخصصان – پرسش‌های خود را مطرح کنید – «شروع مشاوره»

**h. Footer** (ink black, gold top hairline) – brand block with crown and a
one-line promise, «دسترسی سریع» links, «پشتیبانی» links, and a trust row of
outlined chips: نماد اعتماد الکترونیکی، زرین‌پال، پرداخت بانکی، تیپاکس، پیک شهری،
اینستاگرام (with icon). Legal line «© ۱۴۰۴ عطار بلد – تمام حقوق محفوظ است.»

### 3. Behaviour

- Mobile hamburger toggles the nav panel and closes on any link tap;
  `aria-expanded` tracks the state.
- Era dots work as a tab list: one active at a time, `aria-selected` updated,
  caption swapped, the active dot filled gold with a soft glow.
- The `Fa / En` toggle switches interface labels only (nav, login, search
  placeholder) via `data-fa` / `data-en` attributes; the page stays RTL and
  product content stays Persian.
- Smooth anchor scrolling; every card, tile and button has a hover state
  (lift 2–4px, gold border, no bouncy easing).
- No entrance animations that hide content – the page must be fully legible on
  first paint.

### 4. Rules

- `dir="rtl"`, `lang="fa"`, Persian numerals wherever a number is shown.
- Mobile-first: 360px, 720px, 900px, 1080px are the breakpoints; zero horizontal
  scroll at every width.
- Contrast: gold text only on ink or deep green; body copy on cream is
  `--ink-soft` or darker; every icon-only control has an `aria-label`.
- Semantic landmarks (`header`, `main`, `nav`, `footer`, `section` with a
  heading), one `h1`, a skip link, and `prefers-reduced-motion` respected.
- Static HTML/CSS/vanilla JS, no framework, no build step, no third-party image
  CDNs – photography comes only from `image-library/` (see “Image standard”
  below); icons are inline SVG. Only optional remote dependency: the Persian
  webfont, with a Tahoma fallback.

### 5. Done means

The page renders the whole sequence above, RTL and Persian throughout, with the
seven arch category tiles on one row on desktop and two on mobile, a working
era timeline, a working mobile menu, no console errors, and no sideways scroll
at 360px or 1440px.

---

## Image standard (fixed rule – applies to every dried-herb product)

1. Only dried plant matter goes inside a **copper bowl**.
2. The plant must look **natural, loose and real** – with stems, leaves and dried
   flowers. No uniform powder, no decorative styling, no fresh flowers standing
   in for the product.
3. Each product's look is matched against real samples from the apothecaries
   **مشکستان** and **عطارک**: colour, texture, piece size and how finely it is
   broken.
4. **Logo, frame, colours, historical architecture, lighting and all text stay
   untouched.** The template is fixed; only the plant (and the product inside the
   copper bowl) changes.

Files live in `image-library/` (one folder per category, catalogue links in
`PRODUCT-DATABASE/products.json`); the full checklist is in
`image-library/IMAGE-STANDARD.md`. The page must only reference images from that
library. The optimized WebP copies in `assets/img/` are generated from those same
masters (no new photography) and are the only versions the page loads.
