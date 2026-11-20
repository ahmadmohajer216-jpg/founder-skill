/* ── عطار بلد · Editorial content ─────────────────────────────────────────
   مقالات، دانشنامه گیاهان، تاریخ طب ایران و نقاط تور باغ.
   تمام متن‌ها محتوای نمونه‌ی تحریریه هستند و ادعای درمانی ندارند. */

const S = (fa, en) => ({ fa, en });

export const articles = [
  {
    slug: "shirazi-thyme-heritage",
    cat: "herbs",
    art: "herbs",
    date: "2026-10-02",
    read: 6,
    title: S("آویشن شیرازی؛ گیاهی که از فلات ایران آمد", "Shirazi Thyme: A Herb From the Iranian Plateau"),
    excerpt: S(
      "آویشن شیرازی یکی از شناخته‌شده‌ترین گیاهان معطر ایران است. نگاهی به رویشگاه، عطر و جایگاه آن در آشپزی و عطاری.",
      "Shirazi thyme is one of Iran's best-known aromatic plants. A look at its habitat, aroma and place in cooking and apothecary."
    ),
    body: {
      fa: `
        <p>آویشن شیرازی با نام علمی <em>Zataria multiflora</em> از تیره‌ی نعناعیان است و در دامنه‌های خشک و سنگی جنوب و مرکز ایران می‌روید. برگ‌های کوچک و پوشیده از کرک آن، عطری تند و کمی فلفلی دارند که آن را از آویشن‌های مدیترانه‌ای جدا می‌کند.</p>
        <h2>رویشگاه و فصل برداشت</h2>
        <p>این گیاه به خاک کم‌آب و آفتاب مستقیم وابسته است. برداشت معمولاً در اردیبهشت و خرداد و پیش از باز شدن کامل گل‌ها انجام می‌شود؛ در این زمان بیشترین مقدار اسانس در برگ‌ها وجود دارد. چیدن بی‌رویه از رویشگاه‌های طبیعی، یکی از فشارهای اصلی بر جمعیت این گیاه است.</p>
        <blockquote>در عطاری‌های قدیم، آویشن را بیشتر برای عطر و طعم می‌شناختند تا برای مصرف دارویی.</blockquote>
        <h2>در آشپزی ایرانی</h2>
        <p>آویشن شیرازی در خورش‌ها، کباب‌ها و برخی آش‌ها به‌کار می‌رود. مقدار کم آن کافی است؛ عطر تند گیاه با حرارت طولانی‌مدت کاهش می‌یابد، بنابراین بهتر است در مراحل پایانی پخت افزوده شود.</p>
        <h2>نکته‌ی نگهداری</h2>
        <p>برگ خشک‌شده در سایه، رنگ و عطر خود را بهتر حفظ می‌کند. ظرف شیشه‌ای دربسته و جای خشک و خنک، عمر عطری آن را تا حدود یک سال نگه می‌دارد.</p>
      `,
      en: `
        <p>Shirazi thyme (<em>Zataria multiflora</em>) belongs to the mint family and grows on the dry, rocky slopes of southern and central Iran. Its small, downy leaves carry a sharp, slightly peppery scent that sets it apart from Mediterranean thymes.</p>
        <h2>Habitat and harvest</h2>
        <p>The plant depends on poor, dry soil and direct sun. Harvest usually happens in May and June, before the flowers fully open, when essential oil levels in the leaves peak. Unregulated picking from wild habitats is one of the main pressures on the species.</p>
        <blockquote>In old apothecaries, thyme was known more for aroma and flavour than for medicinal use.</blockquote>
        <h2>In Persian cooking</h2>
        <p>Shirazi thyme appears in stews, kebabs and some soups. A little goes a long way; the sharp aroma fades with long cooking, so it is best added near the end.</p>
        <h2>Storage note</h2>
        <p>Shade-dried leaves keep colour and aroma best. A sealed glass jar in a dry, cool place preserves the scent for about a year.</p>
      `,
    },
  },
  {
    slug: "saffron-grading",
    cat: "spices",
    art: "spice",
    date: "2026-09-18",
    read: 5,
    title: S("درجه‌بندی زعفران: سرگل، پوشال و دسته", "Saffron Grades: Sargol, Pushal and Bunch"),
    excerpt: S(
      "تفاوت سرگل و پوشال فقط در ظاهر نیست؛ در رنگ‌دهی، تلخی و قیمت هم اثر دارد. راهنمای کوتاه انتخاب.",
      "Sargol and pushal differ in more than appearance: colour, bitterness and price all shift. A short buying guide."
    ),
    body: {
      fa: `
        <p>زعفران بر اساس بخشی از گل که برداشت می‌شود درجه‌بندی می‌شود. کلاله‌ی سرخ بخش اصلی رنگ و عطر است و خامه‌ی زرد رنگ کمتری دارد.</p>
        <h2>سرگل</h2>
        <p>در سرگل، خامه‌ی زرد جدا شده و تنها بخش سرخ کلاله باقی می‌ماند. نتیجه، رنگ‌دهی قوی‌تر و تلخی کمتر است. سرگل برای شیرینی، شربت و غذاهایی که رنگ مهم است مناسب‌تر است.</p>
        <h2>پوشال</h2>
        <p>در پوشال، بخش کوتاهی از خامه همراه کلاله می‌ماند. عطر آن کمی متفاوت و قیمت آن معمولاً کمتر است. برای دمنوش و دم‌کردن، پوشال انتخاب رایجی است.</p>
        <h2>دسته</h2>
        <p>دسته، زعفران با خامه‌ی کامل و بسته‌شده است و بیشتر جنبه‌ی نمایشی و هدیه دارد.</p>
        <h2>چطور تشخیص دهیم</h2>
        <p>زعفران خوب در آب گرم به‌آرامی رنگ می‌دهد و رشته‌ها ساختار خود را حفظ می‌کنند. رنگ فوری و یکنواخت می‌تواند نشانه‌ی رنگ افزوده باشد. نگهداری در ظرف دربسته و دور از نور، از افت عطر جلوگیری می‌کند.</p>
      `,
      en: `
        <p>Saffron is graded by which part of the flower is harvested. The red stigma carries most of the colour and aroma; the yellow style carries less.</p>
        <h2>Sargol</h2>
        <p>In sargol the yellow style is removed, leaving only the red stigma tip. The result is stronger colouring and less bitterness — a good fit for sweets, sherbet and dishes where colour matters.</p>
        <h2>Pushal</h2>
        <p>Pushal keeps a short section of style with the stigma. Its aroma is a little different and the price is usually lower. It is a common choice for steeping.</p>
        <h2>Bunch</h2>
        <p>Bunch saffron keeps the full style and is tied together, mostly for presentation and gifting.</p>
        <h2>How to tell</h2>
        <p>Good saffron releases colour slowly in warm water while the threads keep their shape. Instant, uniform colour can indicate added dye. A sealed, dark container protects the aroma.</p>
      `,
    },
  },
  {
    slug: "persian-garden-medicinal-plants",
    cat: "history",
    art: "garden",
    date: "2026-09-04",
    read: 8,
    title: S("باغ ایرانی و گیاهان دارویی؛ یک پیوند کهن", "The Persian Garden and Medicinal Plants"),
    excerpt: S(
      "باغ ایرانی فقط یک فضای سبز نبود؛ آزمایشگاهی زنده از گیاهان دارویی و آشپزی بود.",
      "The Persian garden was not only greenery; it was a living laboratory of herbs and cooking."
    ),
    body: {
      fa: `
        <p>در توصیف باغ ایرانی همیشه از آب، سایه و هندسه گفته می‌شود. اما بخش مهمی از باغ، باغِ گیاهان بود: کرت‌هایی که به سبزی‌های خوراکی، گل‌های معطر و گیاهان دارویی اختصاص داشت.</p>
        <h2>چهار بخش و چهار کاربرد</h2>
        <p>تقسیم باغ به چهار بخش، تنها یک انتخاب هندسی نبود. در بسیاری از باغ‌ها هر بخش کارکردی جدا داشت: گل و گیاهان معطر، درختان میوه، سبزی خوراکی و گیاهان مورد استفاده در خانه.</p>
        <h2>آب و آبیاری</h2>
        <p>قنات و جوی‌های آبیاری، امکان پرورش گیاهان حساس‌تر را فراهم می‌کرد. همین شبکه، باغ را به محلی برای آزمودن گیاهان تازه از مناطق دیگر تبدیل می‌کرد.</p>
        <blockquote>باغ، جایی بود که دانش گیاهان از نسلی به نسل دیگر منتقل می‌شد.</blockquote>
        <h2>امروز چه چیزی مانده است</h2>
        <p>بسیاری از باغ‌های تاریخی امروز فقط ساختار خود را حفظ کرده‌اند. بازگرداندن کرت‌های گیاهی، فرصتی برای پیوند دوباره‌ی میراث معماری با دانش گیاهان است.</p>
      `,
      en: `
        <p>Descriptions of the Persian garden always mention water, shade and geometry. Yet a significant part of the garden was the plant beds: plots given over to culinary greens, fragrant flowers and medicinal herbs.</p>
        <h2>Four quarters, four uses</h2>
        <p>Dividing the garden into four was not only a geometric choice. In many gardens each quarter had its own function: flowers and aromatics, fruit trees, culinary greens, and plants used in the household.</p>
        <h2>Water and irrigation</h2>
        <p>Qanats and irrigation channels made it possible to grow more delicate plants. The same network turned the garden into a place to trial plants brought from elsewhere.</p>
        <blockquote>The garden was where plant knowledge passed from one generation to the next.</blockquote>
        <h2>What remains today</h2>
        <p>Many historic gardens now preserve only their structure. Restoring the plant beds is a chance to reconnect architectural heritage with botanical knowledge.</p>
      `,
    },
  },
  {
    slug: "herbal-tea-basics",
    cat: "tea",
    art: "tea",
    date: "2026-08-21",
    read: 4,
    title: S("اصول دم‌کردن دمنوش: دما، زمان و نسبت", "Infusion Basics: Temperature, Time and Ratio"),
    excerpt: S(
      "یک دمنوش خوب سه متغیر ساده دارد. با رعایت آن‌ها تلخی و بی‌عطری را کنار می‌گذارید.",
      "A good infusion has three simple variables. Get them right and bitterness and flat aroma disappear."
    ),
    body: {
      fa: `
        <p>دم‌کردن، استخراج آرام ترکیب‌های معطر و محلول در آب است. اگر دما زیاد یا زمان طولانی باشد، ترکیب‌های تلخ هم خارج می‌شوند.</p>
        <h2>دما</h2>
        <p>برگ‌های نازک و گل‌ها با آب ۸۰ تا ۹۰ درجه بهترند. ریشه و پوست به آب جوش و زمان بیشتر نیاز دارند.</p>
        <h2>زمان</h2>
        <p>گل و برگ نازک: ۵ تا ۷ دقیقه. ریشه و دانه: ۱۰ تا ۱۵ دقیقه. چای سبز: ۲ تا ۳ دقیقه.</p>
        <h2>نسبت</h2>
        <p>یک قاشق چای‌خوری گیاه خشک برای یک فنجان، نقطه‌ی شروع مناسبی است. برای ترکیب‌های چندگیاهی، نسبت را بر اساس گیاه غالب تنظیم کنید.</p>
        <h2>ظرف</h2>
        <p>شیشه، چینی یا سرامیک بهتر از فلز است؛ فلز می‌تواند روی عطر اثر بگذارد.</p>
      `,
      en: `
        <p>Infusing is the slow extraction of aromatic, water-soluble compounds. Too much heat or time pulls out bitter notes as well.</p>
        <h2>Temperature</h2>
        <p>Thin leaves and flowers do best at 80–90°C. Roots and barks need boiling water and more time.</p>
        <h2>Time</h2>
        <p>Delicate leaves and flowers: 5–7 minutes. Roots and seeds: 10–15 minutes. Green tea: 2–3 minutes.</p>
        <h2>Ratio</h2>
        <p>One teaspoon of dried herb per cup is a good starting point. For blends, set the ratio around the dominant herb.</p>
        <h2>Vessel</h2>
        <p>Glass, porcelain or ceramic beats metal, which can affect the aroma.</p>
      `,
    },
  },
  {
    slug: "honey-crystallisation",
    cat: "natural",
    art: "honey",
    date: "2026-08-02",
    read: 3,
    title: S("شکرک عسل؛ نشانه‌ی تقلبی بودن نیست", "Honey Crystallisation Is Not a Sign of Adulteration"),
    excerpt: S(
      "شکرک زدن یک فرآیند طبیعی است. توضیح می‌دهیم چرا اتفاق می‌افتد و چگونه می‌توان آن را برگرداند.",
      "Crystallisation is a natural process. Why it happens, and how to reverse it gently."
    ),
    body: {
      fa: `
        <p>عسل محلولی اشباع از قند است. در دمای پایین یا در حضور ذرات ریز، گلوکز شروع به تشکیل بلور می‌کند. این فرآیند طبیعی است و در عسل‌های با نسبت گلوکز بالاتر سریع‌تر رخ می‌دهد.</p>
        <h2>چرا بعضی عسل‌ها زودتر شکرک می‌زنند</h2>
        <p>نوع شهد، دمای نگهداری و مقدار گرده تأثیر دارند. عسل اقاقیا دیر و عسل آفتابگردان زود شکرک می‌زند.</p>
        <h2>برگرداندن حالت روان</h2>
        <p>ظرف را در آب گرم (حدود ۴۰ تا ۴۵ درجه) قرار دهید. حرارت بالا عطر و آنزیم‌های عسل را آسیب می‌زند.</p>
        <h2>نگهداری</h2>
        <p>دمای اتاق و دوری از نور، ساده‌ترین راه است. در یخچال شکرک سریع‌تر می‌شود.</p>
      `,
      en: `
        <p>Honey is a supersaturated sugar solution. At low temperatures or around tiny particles, glucose begins to form crystals. This is natural, and happens faster in honey with a higher glucose share.</p>
        <h2>Why some honey crystallises sooner</h2>
        <p>Nectar source, storage temperature and pollen content all matter. Acacia honey crystallises slowly; sunflower honey quickly.</p>
        <h2>Bringing it back</h2>
        <p>Stand the jar in warm water at about 40–45°C. High heat damages aroma and enzymes.</p>
        <h2>Storage</h2>
        <p>Room temperature away from light is simplest. The refrigerator speeds crystallisation.</p>
      `,
    },
  },
  {
    slug: "rose-water-distillation",
    cat: "history",
    art: "special",
    date: "2026-07-15",
    read: 7,
    title: S("گلاب‌گیری؛ دانشی که در قمصر زنده مانده", "Rose Distillation: Knowledge Kept Alive in Qamsar"),
    excerpt: S(
      "هر اردیبهشت، دیگ‌های مسی و آتش چوبی، گلاب کاشان را می‌سازند. روایتی از یک صنعت خانگی.",
      "Every May, copper stills and wood fire make Kashan's rose water. A story of a household craft."
    ),
    body: {
      fa: `
        <p>گلاب‌گیری در قمصر کاشان با برداشت گل محمدی در سحر شروع می‌شود. گل‌ها باید پیش از گرم شدن هوا به دیگ برسند تا اسانس آن‌ها از دست نرود.</p>
        <h2>دیگ مسی و آتش ملایم</h2>
        <p>گل و آب در دیگ مسی ریخته می‌شود و با آتش ملایم حرارت می‌بیند. بخار از سردکننده می‌گذرد و تقطیر می‌شود. «دوآتشه» یعنی همین گلاب یک بار دیگر تقطیر شود.</p>
        <h2>کیفیت را چه چیزی می‌سازد</h2>
        <p>تازگی گل، نسبت گل به آب، جنس دیگ و کنترل دما. گلاب خوب شفاف است و عطر آن پس از چند دقیقه باز می‌شود.</p>
        <blockquote>در قمصر، گلاب فقط یک محصول نیست؛ تقویم سال را تعیین می‌کند.</blockquote>
        <h2>نگهداری</h2>
        <p>شیشه‌ی تیره، دربسته و جای خنک. پس از باز شدن، یخچال عمر عطر را بیشتر می‌کند.</p>
      `,
      en: `
        <p>Rose distillation in Qamsar, Kashan begins with picking Damask roses at dawn. Flowers must reach the still before the air warms, or their essential oil is lost.</p>
        <h2>Copper still, gentle fire</h2>
        <p>Petals and water go into a copper still over a low fire. Steam passes through a condenser and becomes distillate. "Double-fired" means that rose water is distilled a second time.</p>
        <h2>What makes quality</h2>
        <p>Fresh petals, the petal-to-water ratio, the still's material and temperature control. Good rose water is clear, and its scent opens after a few minutes.</p>
        <blockquote>In Qamsar, rose water is not just a product; it sets the calendar of the year.</blockquote>
        <h2>Storage</h2>
        <p>Dark glass, tightly closed, in a cool place. Once opened, the refrigerator extends the aroma's life.</p>
      `,
    },
  },
];

export const articleCategories = [
  { id: "herbs", name: S("گیاهان دارویی", "Medicinal Herbs") },
  { id: "spices", name: S("ادویه‌ها", "Spices") },
  { id: "tea", name: S("دمنوش‌ها", "Infusions") },
  { id: "history", name: S("تاریخ عطاری", "Apothecary History") },
  { id: "natural", name: S("محصولات طبیعی", "Natural Products") },
];

export const getArticle = (slug) => articles.find((a) => a.slug === slug);
export const getArticleCategory = (id) => articleCategories.find((c) => c.id === id);

export const plants = [
  {
    slug: "avishan",
    art: "herbs",
    name: S("آویشن شیرازی", "Shirazi Thyme"),
    en: "Shirazi Thyme",
    sci: "Zataria multiflora",
    family: S("نعناعیان", "Lamiaceae"),
    habitat: S("دامنه‌های خشک و سنگی جنوب و مرکز ایران", "Dry rocky slopes of southern and central Iran"),
    appearance: S(
      "بوته‌ای کوچک با برگ‌های ریز، بیضی و پوشیده از کرک. گل‌های سفید و صورتی در بهار ظاهر می‌شوند.",
      "A small shrub with tiny oval, downy leaves. White and pink flowers appear in spring."
    ),
    uses: S(
      "در آشپزی ایرانی برای عطر و طعم، و در دمنوش‌های سنتی. کاربردهای آن بیشتر بر پایه‌ی تجربه‌ی عطاری است و ادعای درمانی تأییدشده ندارد.",
      "Used in Persian cooking for aroma and flavour, and in traditional infusions. Its uses rest on apothecary practice rather than confirmed therapeutic claims."
    ),
    warnings: S("مصرف زیاد در بارداری توصیه نمی‌شود. اسانس خالص باید رقیق شود.", "High intake is not advised during pregnancy. Pure essential oil must be diluted."),
    sources: S("فلور ایران، تیره نعناعیان؛ منابع گیاه‌شناسی دانشگاهی.", "Flora of Iran, Lamiaceae; university botanical sources."),
  },
  {
    slug: "saffron",
    art: "spice",
    name: S("زعفران", "Saffron"),
    en: "Saffron",
    sci: "Crocus sativus",
    family: S("زنبق", "Iridaceae"),
    habitat: S("کشت‌شده در خراسان جنوبی و رضوی", "Cultivated in South and Razavi Khorasan"),
    appearance: S(
      "گیاهی پیازی و کم‌برگ با گل بنفش. بخش ارزشمند آن، سه کلاله‌ی سرخ است.",
      "A low-leafed bulbous plant with purple flowers. Its valuable part is the three red stigmas."
    ),
    uses: S(
      "رنگ‌دهی و طعم‌دهی در غذا و شیرینی. در پژوهش‌ها ترکیب‌های آن بررسی شده، اما این دانشنامه توصیه‌ی درمانی ارائه نمی‌کند.",
      "Colouring and flavouring in food and sweets. Its compounds have been studied, but this encyclopedia offers no therapeutic advice."
    ),
    warnings: S("مصرف زیاد توصیه نمی‌شود. در بارداری در حد چاشنی.", "High intake is not advised. Use only as seasoning in pregnancy."),
    sources: S("پژوهش‌های زراعی زعفران؛ منابع گیاه‌شناسی.", "Saffron agronomy research; botanical sources."),
  },
  {
    slug: "gavzaban",
    art: "tea",
    name: S("گل گاوزبان", "Borage"),
    en: "Borage",
    sci: "Borago officinalis",
    family: S("گاوزبانیان", "Boraginaceae"),
    habitat: S("باغ‌ها و زمین‌های باز، کشت‌شده در شمال ایران", "Gardens and open ground; cultivated in northern Iran"),
    appearance: S(
      "گیاهی علفی با برگ‌های زبر و گل‌های ستاره‌ای آبی-بنفش.",
      "An herbaceous plant with rough leaves and star-shaped blue-purple flowers."
    ),
    uses: S(
      "گل خشک آن در دمنوش سنتی استفاده می‌شود. مصرف آن باید متعادل باشد.",
      "Dried flowers are used in traditional infusions. Consumption should be moderate."
    ),
    warnings: S(
      "مصرف طولانی‌مدت و زیاد توصیه نمی‌شود. افراد با مشکلات کبدی پیش از مصرف با پزشک مشورت کنند.",
      "Long-term, high intake is not advised. People with liver conditions should consult a doctor."
    ),
    sources: S("منابع گیاه‌شناسی دانشگاهی؛ راهنمای گیاهان دارویی.", "University botanical sources; herbal reference guides."),
  },
  {
    slug: "bidmeshk",
    art: "oil",
    name: S("بیدمشک", "Bidmeshk ( Musk Willow )"),
    en: "Musk Willow",
    sci: "Salix aegyptiaca",
    family: S("بیدیان", "Salicaceae"),
    habitat: S("باغ‌ها و حاشیه‌ی رودخانه‌ها در غرب و مرکز ایران", "Gardens and riverbanks in western and central Iran"),
    appearance: S(
      "درختی کوچک که در اوایل بهار سنبله‌های معطر و کرکی تولید می‌کند.",
      "A small tree that produces fragrant, downy catkins in early spring."
    ),
    uses: S(
      "عرق آن در شربت و دسر استفاده می‌شود. عطر آن در عطرسازی سنتی نیز کاربرد دارد.",
      "Its distillate flavours sherbet and desserts. The scent is also used in traditional perfumery."
    ),
    warnings: S("مصرف خوراکی عرق در حد طعم‌دهی.", "Culinary use of the distillate in flavouring amounts."),
    sources: S("منابع گیاه‌شناسی ایرانی؛ دانش عطاری.", "Iranian botanical sources; apothecary practice."),
  },
  {
    slug: "kakooti",
    art: "herbs",
    name: S("کاکوتی", "Kakooti"),
    en: "Kakooti",
    sci: "Ziziphora clinopodioides",
    family: S("نعناعیان", "Lamiaceae"),
    habitat: S("ارتفاعات و دامنه‌های کوهستانی ایران", "Highlands and mountain slopes of Iran"),
    appearance: S("بوته‌ای کم‌ارتفاع با برگ‌های ریز و گل‌های بنفش روشن.", "A low shrub with small leaves and pale purple flowers."),
    uses: S(
      "در آش، دوغ و دمنوش استفاده می‌شود. عطر آن شبیه نعناع و آویشن است.",
      "Used in soup, doogh and infusions. Its aroma resembles mint and thyme."
    ),
    warnings: S("بدون ادعای درمانی؛ مصرف متعادل توصیه می‌شود.", "No therapeutic claims; moderate use advised."),
    sources: S("فلور ایران؛ منابع گیاه‌شناسی.", "Flora of Iran; botanical sources."),
  },
  {
    slug: "chamomile",
    art: "care",
    name: S("بابونه", "Chamomile"),
    en: "Chamomile",
    sci: "Matricaria chamomilla",
    family: S("کاسنی", "Asteraceae"),
    habitat: S("زمین‌های زراعی و حاشیه‌ی مزارع در مناطق معتدل", "Farmland edges in temperate regions"),
    appearance: S("گیاهی علفی با گل‌های سفید و مرکز زرد مخروطی.", "An herbaceous plant with white petals and a conical yellow centre."),
    uses: S(
      "دمنوش گل خشک و استفاده‌ی موضعی در محصولات مراقبتی سنتی.",
      "Dried flower infusions and topical use in traditional care products."
    ),
    warnings: S("افراد با حساسیت به تیره‌ی کاسنی احتیاط کنند.", "People allergic to the Asteraceae family should take care."),
    sources: S("منابع گیاه‌شناسی؛ راهنمای گیاهان دارویی.", "Botanical sources; herbal reference guides."),
  },
  {
    slug: "damask-rose",
    art: "special",
    name: S("گل محمدی", "Damask Rose"),
    en: "Damask Rose",
    sci: "Rosa damascena",
    family: S("گلسرخیان", "Rosaceae"),
    habitat: S("کشت‌شده در کاشان، فارس و آذربایجان", "Cultivated in Kashan, Fars and Azerbaijan"),
    appearance: S("درختچه‌ای خاردار با گل‌های صورتی چندلایه و عطر قوی.", "A thorny shrub with layered pink flowers and a strong scent."),
    uses: S(
      "تقطیر برای گلاب و استفاده در شیرینی، دسر و محصولات مراقبتی.",
      "Distilled for rose water and used in sweets, desserts and care products."
    ),
    warnings: S("اسانس خالص بدون رقیق‌سازی استفاده نشود.", "Pure essential oil should not be used undiluted."),
    sources: S("پژوهش‌های گلاب‌گیری کاشان؛ منابع گیاه‌شناسی.", "Kashan rose-water research; botanical sources."),
  },
  {
    slug: "senjed",
    art: "care",
    name: S("سنجد", "Russian Olive"),
    en: "Russian Olive",
    sci: "Elaeagnus angustifolia",
    family: S("سنجدیان", "Elaeagnaceae"),
    habitat: S("حاشیه‌ی رودخانه‌ها و دامنه‌های نیمه‌خشک ایران", "Riverbanks and semi-arid slopes of Iran"),
    appearance: S("درختی کوچک با برگ‌های نقره‌ای و میوه‌ی بیضی زرد-نارنجی.", "A small tree with silvery leaves and oval yellow-orange fruit."),
    uses: S(
      "میوه‌ی خشک و پودر آن در غذا و ترکیب‌های سنتی استفاده می‌شود.",
      "The dried fruit and its powder are used in food and traditional blends."
    ),
    warnings: S("بدون ادعای درمانی؛ مصرف متعادل.", "No therapeutic claims; moderate use."),
    sources: S("منابع گیاه‌شناسی ایرانی.", "Iranian botanical sources."),
  },
];

export const getPlant = (slug) => plants.find((p) => p.slug === slug);

export const historyEras = [
  {
    id: "persepolis",
    art: "ruins",
    era: S("هخامنشیان · سده ششم پیش از میلاد", "Achaemenid · 6th century BCE"),
    title: S("تخت جمشید و باغ‌های سلطنتی", "Persepolis and the Royal Gardens"),
    text: S(
      "کتیبه‌ها و نقش‌برجسته‌های تخت جمشید، تصویری از باغ‌های سلطنتی و گیاهان آیینی به دست می‌دهند. درختان سرو و گیاهان معطر بخشی از معماری منظر بودند.",
      "Inscriptions and reliefs at Persepolis give a picture of royal gardens and ritual plants. Cypress trees and aromatic plants were part of the landscape architecture."
    ),
  },
  {
    id: "sasanian",
    art: "garden",
    era: S("ساسانیان · سده سوم تا هفتم میلادی", "Sasanian · 3rd–7th century CE"),
    title: S("چهارباغ؛ هندسه‌ی آب و گیاه", "Chahar Bagh: Geometry of Water and Plants"),
    text: S(
      "ایده‌ی تقسیم باغ به چهار بخش و جوی‌های آب در این دوره شکل گرفت. باغ به الگویی برای معماری منظر در سراسر منطقه تبدیل شد.",
      "The idea of dividing a garden into four quarters with water channels took shape in this period. The garden became a model for landscape architecture across the region."
    ),
  },
  {
    id: "islamic",
    art: "book",
    era: S("دوره اسلامی · سده چهارم تا دهم", "Islamic Period · 10th–16th century"),
    title: S("دانش گیاهان در متون کهن", "Plant Knowledge in Classical Texts"),
    text: S(
      "پزشکان و نویسندگان دوره اسلامی، دانش گیاهان را گردآوری و دسته‌بندی کردند. عطاری به حرفه‌ای مستقل با بازار و صنف خود تبدیل شد.",
      "Physicians and writers of the Islamic period collected and classified plant knowledge. The apothecary became an independent trade with its own bazaar and guild."
    ),
  },
  {
    id: "safavid",
    art: "pattern",
    era: S("صفویان · سده یازدهم", "Safavid · 17th century"),
    title: S("اصفهان؛ شهر باغ و بازار عطاران", "Isfahan: City of Gardens and Apothecaries"),
    text: S(
      "شهر اصفهان با محور چهارباغ و بازارهای تخصصی، پیوند باغ و تجارت را نشان می‌دهد. کاشی‌کاری و نقش گیاهان در معماری به اوج رسید.",
      "Isfahan, with the Chahar Bagh axis and specialised bazaars, shows the link between garden and trade. Tilework and plant motifs in architecture reached a peak."
    ),
  },
  {
    id: "qajar",
    art: "special",
    era: S("قاجار · سده سیزدهم", "Qajar · 19th century"),
    title: S("عطاری در بازار سنتی", "The Apothecary in the Traditional Bazaar"),
    text: S(
      "دکان عطاری به محل فروش گیاهان، عرقیات، ادویه و صابون تبدیل شد. گلاب کاشان و زعفران خراسان از کالاهای شناخته‌شده‌ی این دوره‌اند.",
      "The apothecary shop became a place for herbs, distillates, spices and soap. Kashan rose water and Khorasan saffron were well-known goods of the period."
    ),
  },
  {
    id: "contemporary",
    art: "herbs",
    era: S("ایران معاصر", "Contemporary Iran"),
    title: S("دانش گیاهان در سنجه‌ی امروز", "Plant Knowledge by Today's Standards"),
    text: S(
      "امروز دانش سنتی با پژوهش‌های گیاه‌شناسی و استانداردهای کیفیت سنجیده می‌شود. عطار بلد می‌کوشد این دو را کنار هم نگه دارد: احترام به میراث و دقت در توصیف.",
      "Today traditional knowledge is measured against botanical research and quality standards. Attar Balad tries to hold both: respect for heritage and precision in description."
    ),
  },
];

export const gardenSpots = [
  {
    id: "gate",
    art: "garden",
    x: 18,
    y: 62,
    title: S("سردر باغ", "Garden Gateway"),
    text: S(
      "ورودی باغ با طاق جناغی و کاشی فیروزه‌ای، مرز میان شهر و باغ را می‌سازد.",
      "The garden gate, with its pointed arch and turquoise tile, marks the boundary between city and garden."
    ),
  },
  {
    id: "pool",
    art: "pool",
    x: 50,
    y: 68,
    title: S("حوض مرکزی", "Central Pool"),
    text: S(
      "حوض، آینه‌ی آسمان و نقطه‌ی تعادل باغ است. جوی‌های باریک از آن به چهار کرت می‌روند.",
      "The pool mirrors the sky and anchors the garden. Narrow channels carry water from it to the four beds."
    ),
  },
  {
    id: "herb-bed",
    art: "herbs",
    x: 30,
    y: 44,
    title: S("کرت گیاهان دارویی", "Medicinal Herb Bed"),
    text: S(
      "آویشن، کاکوتی و بابونه در کرت‌های آفتاب‌گیر کاشته می‌شوند؛ گیاهانی که به خاک کم‌آب نیاز دارند.",
      "Thyme, kakooti and chamomile grow in sunlit beds — plants that need little water."
    ),
  },
  {
    id: "rose-bed",
    art: "special",
    x: 70,
    y: 42,
    title: S("کرت گل محمدی", "Damask Rose Bed"),
    text: S(
      "گل محمدی در اردیبهشت برداشت می‌شود و برای گلاب‌گیری به دیگ‌های مسی می‌رود.",
      "Damask roses are picked in May and taken to copper stills for rose water."
    ),
  },
  {
    id: "pavilion",
    art: "arch",
    x: 82,
    y: 64,
    title: S("کلاه‌فرنگی", "Pavilion"),
    text: S(
      "بنای کوچک وسط باغ، سایه‌ای برای نشستن و تماشای باغ در ساعت‌های گرم روز است.",
      "The small pavilion offers shade for sitting and watching the garden in the hot hours."
    ),
  },
];

export const testimonials = [
  {
    name: S("سارا م.", "Sara M."),
    city: S("تهران", "Tehran"),
    rating: 5,
    text: S(
      "بسته‌بندی زعفران واقعاً محافظ بود و عطرش از همان لحظه‌ی باز کردن مشخص. ارسال هم سریع انجام شد.",
      "The saffron packaging was genuinely protective and the aroma was clear the moment I opened it. Delivery was quick too."
    ),
  },
  {
    name: S("امیر ک.", "Amir K."),
    city: S("اصفهان", "Isfahan"),
    rating: 4,
    text: S(
      "دمنوش گل گاوزبان را برای عصرها گرفتم؛ ملایم است و تلخی ندارد. کاش بسته‌ی بزرگ‌تر هم موجود بود.",
      "I bought the borage infusion for evenings; it is gentle and not bitter. I wish the larger pack was in stock."
    ),
  },
  {
    name: S("نگار ر.", "Negar R."),
    city: S("شیراز", "Shiraz"),
    rating: 5,
    text: S(
      "صفحه‌ی هر گیاه اطلاعات دقیق و منبع دارد. برای کسی که تازه با گیاهان آشنا می‌شود خیلی کمک‌کننده است.",
      "Each plant page gives precise information and sources. Very helpful for someone new to herbs."
    ),
  },
];

export const faqs = [
  {
    q: S("آیا محصولات این فروشگاه واقعی هستند؟", "Are the products in this shop real?"),
    a: S(
      "در نسخه‌ی نمایشی، همه‌ی محصولات، قیمت‌ها و موجودی‌ها داده‌ی نمونه هستند و با برچسب «نمونه» مشخص شده‌اند. برای فروش واقعی باید کاتالوگ از پایگاه داده و تأمین‌کننده‌ی واقعی بارگذاری شود.",
      "In this demo version all products, prices and stock levels are sample data marked “Sample”. Real selling requires a catalogue loaded from a database and a real supplier."
    ),
  },
  {
    q: S("پرداخت چگونه انجام می‌شود؟", "How does payment work?"),
    a: S(
      "درگاه پرداخت واقعی به این پروژه متصل نیست. در صفحه‌ی تسویه‌حساب، سفارش به‌صورت «پرداخت آزمایشی» ثبت می‌شود و مبلغی از حساب شما کسر نمی‌شود.",
      "No real payment gateway is connected. At checkout the order is placed as a “test payment” and no money is charged."
    ),
  },
  {
    q: S("سفارش من کجا ذخیره می‌شود؟", "Where is my order stored?"),
    a: S(
      "در این نسخه، سبد خرید، حساب کاربری و سفارش‌ها به‌صورت محلی در مرورگر همین دستگاه ذخیره می‌شوند. با پاک کردن داده‌های مرورگر از بین می‌روند.",
      "In this version the cart, account and orders are stored locally in this browser. Clearing browser data removes them."
    ),
  },
  {
    q: S("آیا اطلاعات سلامت محصولات قابل اتکاست؟", "Is the health information reliable?"),
    a: S(
      "محتوای گیاه‌شناسی این سایت برای معرفی و آشنایی است و ادعای درمانی ندارد. پیش از مصرف گیاهان برای اهداف سلامتی با پزشک یا داروساز مشورت کنید.",
      "The botanical content here is introductory and makes no therapeutic claims. Consult a doctor or pharmacist before using herbs for health purposes."
    ),
  },
  {
    q: S("چطور می‌توانم سفارشم را پیگیری کنم؟", "How can I track my order?"),
    a: S(
      "پس از ثبت سفارش، کد پیگیری نمایش داده می‌شود. با ورود به حساب کاربری و بخش «سفارش‌های من» می‌توانید وضعیت را ببینید. مدیر فروشگاه هم می‌تواند وضعیت را تغییر دهد.",
      "After placing an order a tracking code is shown. Sign in and open “My orders” to see the status. The shop admin can also change it."
    ),
  },
];

export const contactInfo = {
  email: "hello@attar-balad.example",
  phone: "+98 21 0000 0000",
  address: S("تهران، بازار عطاران، پلاک نمونه", "Tehran, Attaran Bazaar, sample address"),
  hours: S("شنبه تا چهارشنبه، ۹ تا ۱۷", "Saturday to Wednesday, 9am–5pm"),
};
