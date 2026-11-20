/* ── عطار بلد · Generative Persian artwork ────────────────────────────────
   تصویرسازی‌های برداری اختصاصی با نقش‌مایه‌های ایرانی: طاق، سرو، کاشی،
   ظرف مسی و گیاه. همه به‌صورت SVG تولید می‌شوند تا سایت به تصویر بیرونی
   وابسته نباشد و در هر اندازه‌ای شارپ بماند. */

const themes = {
  herbs: { sky: ["#f2f4e6", "#cfdfc2"], floor: "#2c5138", accent: "#8fae7a", ink: "#24412d", glow: "#f6e9b8" },
  tea: { sky: ["#f8f1e1", "#e3d3b2"], floor: "#3d4b39", accent: "#a9843f", ink: "#3a4634", glow: "#f3dfae" },
  spice: { sky: ["#f9ead1", "#e3bd8b"], floor: "#7a3f22", accent: "#c0762f", ink: "#5d2f18", glow: "#f6cf8d" },
  special: { sky: ["#1a4029", "#0b2015"], floor: "#081a10", accent: "#c5a45b", ink: "#0a1d12", glow: "#e8c77b" },
  care: { sky: ["#f5f2e6", "#dbe4cf"], floor: "#4c6b4a", accent: "#a3cfa5", ink: "#3a4d3c", glow: "#f0e3b4" },
  wellness: { sky: ["#eff4e7", "#d5e4cd"], floor: "#39603f", accent: "#9dc08b", ink: "#2f4a34", glow: "#e9efb8" },
  oil: { sky: ["#faf0d9", "#e6cd9b"], floor: "#6b4a20", accent: "#d3a24a", ink: "#5a3d1a", glow: "#f4d58e" },
  honey: { sky: ["#fcf1d1", "#efd494"], floor: "#7a5218", accent: "#e0a83a", ink: "#5f4112", glow: "#ffe3a0" },
  garden: { sky: ["#f6ecd2", "#e3c99c"], floor: "#2f5a3a", accent: "#c5a45b", ink: "#2b4634", glow: "#ffe6ad" },
  arch: { sky: ["#f2e9d3", "#dcc69c"], floor: "#2b4b36", accent: "#3f7f76", ink: "#244033", glow: "#f7dfa9" },
  ruins: { sky: ["#f8ecd4", "#ddc39c"], floor: "#8a6a45", accent: "#b99a6b", ink: "#7a5c3a", glow: "#ffe8b5" },
  book: { sky: ["#f6eedb", "#e1d0ae"], floor: "#5b4630", accent: "#c5a45b", ink: "#4a3a27", glow: "#f5ddb0" },
  pool: { sky: ["#eaf2e7", "#c6ddd2"], floor: "#2d5a4a", accent: "#7fb6a8", ink: "#285044", glow: "#e6f2e2" },
  pattern: { sky: ["#14532d", "#0c2417"], floor: "#0b2015", accent: "#c5a45b", ink: "#0a1d12", glow: "#e8c77b" },
};

const leaf = (x, y, rx, ry, rot, fill, op = 0.92) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${op}" transform="rotate(${rot} ${x} ${y})"/>`;

const flower = (x, y, r, fill, core) => {
  const petals = [0, 60, 120, 180, 240, 300]
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      return `<circle cx="${(x + Math.cos(rad) * r).toFixed(1)}" cy="${(y + Math.sin(rad) * r).toFixed(1)}" r="${r * 0.72}" fill="${fill}" opacity="0.95"/>`;
    })
    .join("");
  return `${petals}<circle cx="${x}" cy="${y}" r="${r * 0.6}" fill="${core}"/>`;
};

const cypress = (x, baseY, h, w, fill, op = 1) =>
  `<path d="M${x} ${baseY} C ${x - w} ${baseY - h * 0.45}, ${x - w * 0.72} ${baseY - h * 0.85}, ${x} ${baseY - h} C ${x + w * 0.72} ${baseY - h * 0.85}, ${x + w} ${baseY - h * 0.45}, ${x} ${baseY} Z" fill="${fill}" opacity="${op}"/>`;

const tileDefs = (id = "tile") => `
  <pattern id="${id}" width="96" height="96" patternUnits="userSpaceOnUse">
    <g fill="none" stroke="#c5a45b" stroke-width="1.1" opacity="0.55">
      <rect x="10" y="10" width="76" height="76" transform="rotate(45 48 48)"/>
      <circle cx="48" cy="48" r="15"/>
      <path d="M48 14 L58 38 L82 48 L58 58 L48 82 L38 58 L14 48 L38 38 Z"/>
    </g>
    <circle cx="48" cy="48" r="3" fill="#c5a45b" opacity="0.5"/>
  </pattern>`;

function shell(kind, body, opts = {}) {
  const th = themes[kind] || themes.herbs;
  const { w = 800, h = 1000, pattern = true } = opts;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="img">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0.25" y2="1">
        <stop offset="0" stop-color="${th.sky[0]}"/>
        <stop offset="1" stop-color="${th.sky[1]}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="38%" r="52%">
        <stop offset="0" stop-color="${th.glow}" stop-opacity="0.85"/>
        <stop offset="1" stop-color="${th.glow}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${th.floor}" stop-opacity="0.95"/>
        <stop offset="1" stop-color="${th.floor}"/>
      </linearGradient>
      ${pattern ? tileDefs() : ""}
    </defs>
    <rect width="${w}" height="${h}" fill="url(#sky)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    ${pattern ? `<rect width="${w}" height="${h}" fill="url(#tile)" opacity="0.07"/>` : ""}
    ${body}
    <rect width="${w}" height="${h}" fill="none" stroke="#c5a45b" stroke-opacity="0.28" stroke-width="2"/>
  </svg>`;
}

const motifs = {
  herbs(th) {
    return `
      <g stroke="${th.ink}" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.9">
        <path d="M400 790 C 386 660, 356 566, 322 470"/>
        <path d="M410 790 C 424 664, 466 574, 500 486"/>
        <path d="M400 800 C 400 672, 402 566, 396 436"/>
        <path d="M404 792 C 386 700, 340 640, 286 604"/>
      </g>
      ${leaf(350, 640, 30, 12, -38, th.accent)}
      ${leaf(452, 636, 30, 12, 34, th.accent)}
      ${leaf(368, 566, 26, 11, -46, th.accent, 0.85)}
      ${leaf(434, 560, 26, 11, 42, th.accent, 0.85)}
      ${leaf(340, 700, 26, 10, -22, th.accent, 0.8)}
      ${leaf(462, 706, 26, 10, 20, th.accent, 0.8)}
      ${leaf(326, 618, 20, 9, -66, th.ink, 0.55)}
      ${leaf(476, 604, 20, 9, 64, th.ink, 0.55)}
      ${flower(322, 466, 17, "#f7f3e8", "#e8c77b")}
      ${flower(500, 482, 17, "#f7f3e8", "#e8c77b")}
      ${flower(396, 430, 21, "#f3d9e2", "#c5a45b")}
      ${flower(286, 600, 13, "#f7f3e8", "#c5a45b")}
      <ellipse cx="400" cy="806" rx="150" ry="16" fill="${th.floor}" opacity="0.18"/>`;
  },

  tea(th) {
    return `
      <g opacity="0.55" stroke="${th.ink}" stroke-width="4" fill="none" stroke-linecap="round">
        <path d="M352 430 C 330 390, 372 362, 352 320"/>
        <path d="M400 414 C 378 372, 420 344, 400 300"/>
        <path d="M448 430 C 426 390, 468 362, 448 320"/>
      </g>
      <ellipse cx="400" cy="742" rx="180" ry="30" fill="${th.floor}" opacity="0.22"/>
      <ellipse cx="400" cy="728" rx="176" ry="26" fill="#fffdf6" opacity="0.85"/>
      <path d="M292 548 h216 v66 a108 108 0 0 1 -216 0 z" fill="#fffdf6"/>
      <path d="M508 566 q64 6 52 54 q-10 44 -58 40" fill="none" stroke="#fffdf6" stroke-width="18" stroke-linecap="round"/>
      <ellipse cx="400" cy="550" rx="108" ry="22" fill="${th.accent}" opacity="0.65"/>
      <ellipse cx="400" cy="550" rx="108" ry="22" fill="none" stroke="#fffdf6" stroke-width="6"/>
      <path d="M320 690 q80 26 160 0" fill="none" stroke="#c5a45b" stroke-width="4" opacity="0.6"/>
      ${leaf(560, 690, 30, 12, -24, th.accent, 0.85)}
      ${leaf(578, 664, 24, 10, -58, th.accent, 0.7)}
      <circle cx="596" cy="700" r="7" fill="${th.ink}" opacity="0.4"/>`;
  },

  spice(th) {
    const bowl = (x, y, r) => `
      <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.26}" fill="${th.ink}" opacity="0.18"/>
      <path d="M${x - r} ${y - 10} a ${r} ${r * 0.78} 0 0 0 ${r * 2} 0 z" fill="#b8703a"/>
      <ellipse cx="${x}" cy="${y - 10}" rx="${r}" ry="${r * 0.24}" fill="#8a4f26"/>
      <ellipse cx="${x}" cy="${y - 16}" rx="${r * 0.72}" ry="${r * 0.2}" fill="${th.accent}" opacity="0.85"/>`;
    return `
      ${bowl(320, 700, 116)}
      ${bowl(512, 660, 92)}
      <g fill="${th.accent}" opacity="0.8">
        <circle cx="430" cy="786" r="6"/><circle cx="470" cy="800" r="4"/>
        <circle cx="390" cy="806" r="5"/><circle cx="520" cy="784" r="4"/>
        <circle cx="350" cy="770" r="3"/><circle cx="560" cy="740" r="4"/>
      </g>
      <g stroke="${th.ink}" stroke-width="3" opacity="0.5" fill="none">
        <path d="M250 560 q-30 -40 10 -70"/>
        <path d="M600 500 q30 -36 -6 -68"/>
      </g>
      <path d="M360 470 q26 -46 10 -96" stroke="#b8402f" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>
      <path d="M392 486 q14 -52 -6 -104" stroke="#b8402f" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.7"/>
      <path d="M424 476 q24 -50 4 -96" stroke="#b8402f" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/>`;
  },

  special(th) {
    return `
      <g transform="translate(400 470)">
        <circle r="210" fill="none" stroke="${th.accent}" stroke-width="1.5" opacity="0.5"/>
        <circle r="176" fill="none" stroke="${th.accent}" stroke-width="1" opacity="0.4"/>
        <g opacity="0.9">
          <rect x="-118" y="-118" width="236" height="236" fill="none" stroke="${th.accent}" stroke-width="2" transform="rotate(45)"/>
          <rect x="-118" y="-118" width="236" height="236" fill="none" stroke="${th.accent}" stroke-width="2"/>
          <circle r="86" fill="none" stroke="${th.accent}" stroke-width="2"/>
        </g>
        <path d="M0 -74 C 26 -30, 30 -26, 74 0 C 30 26, 26 30, 0 74 C -26 30, -30 26, -74 0 C -30 -26, -26 -30, 0 -74 Z" fill="${th.glow}" opacity="0.85"/>
        <circle r="20" fill="${th.ink}" opacity="0.65"/>
        <g fill="${th.accent}">
          <circle cx="0" cy="-140" r="4"/><circle cx="0" cy="140" r="4"/>
          <circle cx="-140" cy="0" r="4"/><circle cx="140" cy="0" r="4"/>
        </g>
      </g>
      <path d="M150 800 q250 -70 500 0" fill="none" stroke="${th.accent}" stroke-width="2" opacity="0.5"/>
      <path d="M170 830 q230 -58 460 0" fill="none" stroke="${th.accent}" stroke-width="1.4" opacity="0.35"/>`;
  },

  care(th) {
    return `
      <ellipse cx="400" cy="792" rx="190" ry="26" fill="${th.floor}" opacity="0.2"/>
      <rect x="252" y="612" width="196" height="128" rx="26" fill="#f6efdc"/>
      <rect x="252" y="612" width="196" height="42" rx="22" fill="${th.accent}" opacity="0.5"/>
      <rect x="274" y="676" width="152" height="8" rx="4" fill="${th.ink}" opacity="0.25"/>
      <rect x="274" y="696" width="108" height="8" rx="4" fill="${th.ink}" opacity="0.18"/>
      <rect x="486" y="588" width="118" height="152" rx="22" fill="#fffdf6"/>
      <rect x="492" y="566" width="106" height="34" rx="12" fill="${th.ink}" opacity="0.75"/>
      <rect x="502" y="630" width="86" height="6" rx="3" fill="${th.ink}" opacity="0.22"/>
      <rect x="502" y="650" width="60" height="6" rx="3" fill="${th.ink}" opacity="0.16"/>
      ${leaf(620, 700, 40, 15, -32, th.accent, 0.9)}
      ${leaf(640, 664, 32, 12, -64, th.accent, 0.75)}
      <path d="M300 560 q40 -60 96 -70" stroke="${th.ink}" stroke-width="4" fill="none" opacity="0.45" stroke-linecap="round"/>
      ${leaf(370, 500, 26, 11, -28, th.accent, 0.8)}
      ${flower(414, 486, 13, "#fffdf6", "#e8c77b")}`;
  },

  wellness(th) {
    return `
      <ellipse cx="400" cy="794" rx="186" ry="26" fill="${th.floor}" opacity="0.2"/>
      <path d="M262 606 h276 a138 138 0 0 1 -276 0 z" fill="#c9b48c"/>
      <ellipse cx="400" cy="606" rx="138" ry="30" fill="#b39d76"/>
      <ellipse cx="400" cy="600" rx="112" ry="22" fill="${th.ink}" opacity="0.55"/>
      <rect x="452" y="360" width="34" height="230" rx="17" fill="#d9c39a" transform="rotate(24 469 475)"/>
      <rect x="446" y="332" width="46" height="48" rx="14" fill="#a98f63" transform="rotate(24 469 356)"/>
      <g fill="${th.accent}">
        <ellipse cx="336" cy="574" rx="24" ry="10" transform="rotate(-24 336 574)"/>
        <ellipse cx="366" cy="560" rx="20" ry="9" transform="rotate(18 366 560)"/>
        <ellipse cx="404" cy="552" rx="26" ry="10" transform="rotate(-8 404 552)"/>
        <ellipse cx="440" cy="564" rx="19" ry="8" transform="rotate(28 440 564)"/>
      </g>
      ${leaf(560, 700, 38, 14, -40, th.accent, 0.85)}
      ${leaf(586, 664, 30, 11, -70, th.accent, 0.7)}
      ${flower(618, 620, 14, "#fffdf6", "#e8c77b")}`;
  },

  oil(th) {
    return `
      <ellipse cx="400" cy="804" rx="150" ry="22" fill="${th.floor}" opacity="0.22"/>
      <rect x="366" y="326" width="68" height="52" rx="12" fill="#7a5b33"/>
      <path d="M366 378 h68 v40 c 46 22 62 52 62 96 v220 a34 34 0 0 1 -34 34 h-124 a34 34 0 0 1 -34 -34 v-220 c0 -44 16 -74 62 -96 z" fill="#f7f3e8" opacity="0.55"/>
      <path d="M310 610 h180 v124 a34 34 0 0 1 -34 34 h-112 a34 34 0 0 1 -34 -34 z" fill="${th.accent}"/>
      <rect x="330" y="524" width="140" height="118" rx="8" fill="#fffdf6" opacity="0.9"/>
      <g stroke="${th.ink}" stroke-width="3" opacity="0.4">
        <path d="M352 556 h96"/><path d="M352 578 h68"/><path d="M352 600 h84"/>
      </g>
      <path d="M312 430 q88 -26 176 0" fill="none" stroke="#fffdf6" stroke-width="6" opacity="0.5"/>
      ${leaf(560, 700, 34, 13, -36, th.accent, 0.8)}
      ${leaf(584, 668, 26, 10, -66, th.accent, 0.65)}`;
  },

  honey(th) {
    const hex = (cx, cy, r, fill, op) => {
      const pts = [0, 60, 120, 180, 240, 300]
        .map((a) => {
          const rad = ((a + 30) * Math.PI) / 180;
          return `${(cx + Math.cos(rad) * r).toFixed(1)},${(cy + Math.sin(rad) * r).toFixed(1)}`;
        })
        .join(" ");
      return `<polygon points="${pts}" fill="${fill}" opacity="${op}" stroke="#a8752a" stroke-width="1.5"/>`;
    };
    return `
      <g opacity="0.5">
        ${hex(300, 400, 46, "#e0a83a", 0.5)}${hex(386, 400, 46, "#e0a83a", 0.42)}
        ${hex(472, 400, 46, "#e0a83a", 0.5)}${hex(343, 480, 46, "#e0a83a", 0.4)}
        ${hex(429, 480, 46, "#e0a83a", 0.46)}${hex(515, 480, 46, "#e0a83a", 0.36)}
      </g>
      <ellipse cx="400" cy="806" rx="160" ry="24" fill="${th.floor}" opacity="0.22"/>
      <rect x="292" y="560" width="216" height="220" rx="26" fill="#f4d79a" opacity="0.9"/>
      <rect x="292" y="620" width="216" height="160" rx="26" fill="${th.accent}"/>
      <rect x="276" y="524" width="248" height="48" rx="14" fill="#6d4a1c"/>
      <rect x="300" y="656" width="200" height="86" rx="10" fill="#fffdf6" opacity="0.9"/>
      <g stroke="${th.ink}" stroke-width="3" opacity="0.45">
        <path d="M322 688 h156"/><path d="M322 710 h104"/>
      </g>
      <path d="M530 470 q40 40 12 96" stroke="#8a5a1e" stroke-width="12" fill="none" stroke-linecap="round"/>
      <circle cx="530" cy="462" r="18" fill="#8a5a1e"/>`;
  },

  garden(th) {
    return `
      <circle cx="620" cy="250" r="120" fill="#ffe6ad" opacity="0.55"/>
      <path d="M180 780 V470 a220 220 0 0 1 440 0 V780" fill="none" stroke="${th.accent}" stroke-width="5" opacity="0.85"/>
      <path d="M214 780 V478 a186 186 0 0 1 372 0 V780" fill="none" stroke="${th.accent}" stroke-width="1.6" opacity="0.6"/>
      ${cypress(300, 700, 300, 44, "#2f5a3a", 0.9)}
      ${cypress(500, 706, 340, 50, "#2f5a3a", 0.92)}
      ${cypress(366, 690, 220, 34, "#3f7049", 0.8)}
      ${cypress(444, 696, 240, 36, "#3f7049", 0.8)}
      <path d="M140 760 H660" stroke="${th.accent}" stroke-width="3" opacity="0.6"/>
      <ellipse cx="400" cy="806" rx="180" ry="30" fill="#9ec7bf" opacity="0.75"/>
      <ellipse cx="400" cy="806" rx="132" ry="20" fill="#c8e0d6" opacity="0.6"/>
      <g fill="#fffdf6" opacity="0.9">
        <circle cx="240" cy="716" r="8"/><circle cx="266" cy="730" r="6"/>
        <circle cx="548" cy="720" r="8"/><circle cx="574" cy="736" r="6"/>
      </g>
      <g fill="#e8c77b" opacity="0.9">
        <circle cx="240" cy="716" r="3"/><circle cx="548" cy="720" r="3"/>
      </g>
      <path d="M120 830 q280 -34 560 0" fill="none" stroke="${th.accent}" stroke-width="2" opacity="0.4"/>`;
  },

  arch(th) {
    return `
      <path d="M170 820 V450 a230 230 0 0 1 460 0 V820 Z" fill="#fffdf6" opacity="0.16"/>
      <path d="M170 820 V450 a230 230 0 0 1 460 0 V820" fill="none" stroke="${th.accent}" stroke-width="6"/>
      <path d="M206 820 V458 a194 194 0 0 1 388 0 V820" fill="none" stroke="${th.accent}" stroke-width="2" opacity="0.7"/>
      <path d="M400 264 L470 340 L400 416 L330 340 Z" fill="${th.accent}" opacity="0.5"/>
      <g fill="none" stroke="${th.accent}" stroke-width="1.4" opacity="0.45">
        <path d="M232 500 h336"/><path d="M232 560 h336"/><path d="M232 620 h336"/>
        <path d="M280 470 v180"/><path d="M340 470 v180"/><path d="M460 470 v180"/><path d="M520 470 v180"/>
      </g>
      ${cypress(320, 780, 190, 30, "#2f5a3a", 0.85)}
      ${cypress(480, 780, 190, 30, "#2f5a3a", 0.85)}
      <path d="M180 800 H620" stroke="${th.accent}" stroke-width="3" opacity="0.7"/>`;
  },

  ruins(th) {
    const column = (x, h) => `
      <rect x="${x - 34}" y="${760 - h}" width="68" height="${h}" fill="#d9c3a0"/>
      <rect x="${x - 44}" y="${760 - h - 18}" width="88" height="20" rx="4" fill="#c8ad84"/>
      <rect x="${x - 42}" y="748" width="84" height="18" rx="4" fill="#c8ad84"/>
      <g stroke="${th.ink}" stroke-width="1.4" opacity="0.22">
        <path d="M${x - 20} ${760 - h + 10} v${h - 20}"/>
        <path d="M${x} ${760 - h + 10} v${h - 20}"/>
        <path d="M${x + 20} ${760 - h + 10} v${h - 20}"/>
      </g>`;
    return `
      <circle cx="600" cy="260" r="96" fill="#ffe9b8" opacity="0.7"/>
      ${column(240, 330)}
      ${column(340, 400)}
      ${column(460, 300)}
      ${column(560, 360)}
      <path d="M160 760 H640 V820 H160 Z" fill="#c9ae86"/>
      <path d="M150 820 H650 V842 H150 Z" fill="#b99a6b"/>
      <g fill="none" stroke="${th.ink}" stroke-width="1.4" opacity="0.3">
        <path d="M190 780 h420"/><path d="M190 800 h420"/>
      </g>
      <path d="M170 700 q40 -40 84 -8" fill="none" stroke="#7d9b6a" stroke-width="4" opacity="0.6"/>`;
  },

  book(th) {
    return `
      <ellipse cx="400" cy="800" rx="230" ry="26" fill="${th.floor}" opacity="0.2"/>
      <path d="M400 690 L180 620 V420 L400 490 Z" fill="#fffdf6"/>
      <path d="M400 690 L620 620 V420 L400 490 Z" fill="#f7f0dd"/>
      <path d="M400 490 V690" stroke="#c5a45b" stroke-width="3" opacity="0.6"/>
      <g stroke="${th.ink}" stroke-width="2.4" opacity="0.28">
        <path d="M230 500 L360 536"/><path d="M230 536 L360 572"/><path d="M230 572 L330 602"/>
        <path d="M570 500 L440 536"/><path d="M570 536 L440 572"/><path d="M570 572 L470 602"/>
      </g>
      ${leaf(250, 400, 34, 12, -34, th.accent, 0.85)}
      ${leaf(226, 366, 26, 10, -64, th.accent, 0.7)}
      ${flower(200, 336, 14, "#fffdf6", "#e8c77b")}
      ${leaf(556, 386, 32, 12, 36, th.accent, 0.8)}
      ${flower(590, 350, 13, "#f3d9e2", "#c5a45b")}
      <path d="M160 700 q240 60 480 0" fill="none" stroke="${th.accent}" stroke-width="2" opacity="0.5"/>`;
  },

  pool(th) {
    return `
      <ellipse cx="400" cy="600" rx="280" ry="180" fill="#9ec7bf" opacity="0.7"/>
      <ellipse cx="400" cy="600" rx="230" ry="146" fill="#b8d8cf" opacity="0.8"/>
      <g fill="none" stroke="#fffdf6" stroke-width="3" opacity="0.5">
        <ellipse cx="400" cy="600" rx="150" ry="94"/>
        <ellipse cx="400" cy="600" rx="86" ry="54"/>
      </g>
      <g fill="#3f7049" opacity="0.85">
        <ellipse cx="300" cy="560" rx="42" ry="18" transform="rotate(-18 300 560)"/>
        <ellipse cx="510" cy="650" rx="36" ry="15" transform="rotate(14 510 650)"/>
      </g>
      <circle cx="300" cy="552" r="9" fill="#f3d9e2"/>
      <circle cx="514" cy="646" r="7" fill="#f7f3e8"/>
      ${cypress(180, 470, 190, 30, "#2f5a3a", 0.7)}
      ${cypress(620, 470, 200, 32, "#2f5a3a", 0.7)}
      <path d="M120 820 q280 -50 560 0" fill="none" stroke="${th.accent}" stroke-width="2" opacity="0.4"/>`;
  },

  pattern(th) {
    return `
      <g opacity="0.85">
        <rect x="120" y="250" width="560" height="560" fill="none" stroke="${th.accent}" stroke-width="3"/>
        <rect x="150" y="280" width="500" height="500" fill="url(#tile)" opacity="0.9"/>
        <g fill="none" stroke="${th.accent}" stroke-width="2">
          <circle cx="400" cy="530" r="150"/>
          <circle cx="400" cy="530" r="110"/>
          <rect x="300" y="430" width="200" height="200" transform="rotate(45 400 530)"/>
        </g>
        <path d="M400 400 C 440 470, 470 500, 540 530 C 470 560, 440 590, 400 660 C 360 590, 330 560, 260 530 C 330 500, 360 470, 400 400 Z" fill="${th.accent}" opacity="0.35"/>
      </g>`;
  },
};

export function artSVG(kind) {
  const th = themes[kind] || themes.herbs;
  const motif = motifs[kind] || motifs.herbs;
  return shell(kind, motif(th));
}

export function artUrl(kind) {
  return `data:image/svg+xml,${encodeURIComponent(artSVG(kind))}`;
}

/* ── Wide hero illustration ───────────────────────────────────────────── */
export function heroSVG() {
  const th = themes.garden;
  const body = `
    <circle cx="430" cy="230" r="200" fill="#ffe6ad" opacity="0.6"/>
    <path d="M200 0 v520 a170 170 0 0 1 340 0 V0" fill="none" stroke="#c5a45b" stroke-width="4" opacity="0.35"/>
    <g opacity="0.9">
      ${cypress(420, 690, 430, 62, "#1f4529", 0.95)}
      ${cypress(300, 700, 360, 52, "#2a5533", 0.9)}
      ${cypress(510, 700, 330, 48, "#2a5533", 0.85)}
    </g>
    <path d="M140 690 H700" stroke="#c5a45b" stroke-width="3" opacity="0.5"/>
    <ellipse cx="410" cy="748" rx="290" ry="44" fill="#9ec7bf" opacity="0.7"/>
    <ellipse cx="410" cy="748" rx="200" ry="27" fill="#c8e0d6" opacity="0.55"/>
    <g transform="translate(760 500)">
      <rect x="-96" y="-40" width="192" height="16" rx="8" fill="#c5a45b" opacity="0.55"/>
      <path d="M-150 300 q150 -160 300 0 z" fill="#7a3f22" opacity="0.85"/>
      <path d="M-150 300 q150 -120 300 0" fill="none" stroke="#c5a45b" stroke-width="2" opacity="0.5"/>
      <ellipse cx="0" cy="-6" rx="70" ry="16" fill="#e8c77b" opacity="0.75"/>
      <g fill="#3f7049">
        <ellipse cx="-40" cy="-60" rx="46" ry="16" transform="rotate(-28 -40 -60)"/>
        <ellipse cx="46" cy="-64" rx="42" ry="15" transform="rotate(26 46 -64)"/>
        <ellipse cx="2" cy="-104" rx="34" ry="14" transform="rotate(-4 2 -104)"/>
      </g>
      ${flower(0, -128, 20, "#f3d9e2", "#e8c77b")}
      ${flower(-70, -30, 14, "#fffdf6", "#c5a45b")}
      ${flower(74, -24, 13, "#fffdf6", "#c5a45b")}
    </g>
    <g transform="translate(1120 560)" opacity="0.55">
      <path d="M0 220 L-150 160 V40 L0 100 Z" fill="#fffdf6" opacity="0.92"/>
      <path d="M0 220 L150 160 V40 L0 100 Z" fill="#f7f0dd" opacity="0.9"/>
      <path d="M0 100 V220" stroke="#c5a45b" stroke-width="2" opacity="0.6"/>
      <g stroke="#2b4634" stroke-width="2" opacity="0.25">
        <path d="M-130 76 L-24 118"/><path d="M-130 104 L-24 146"/>
        <path d="M130 76 L24 118"/><path d="M130 104 L24 146"/>
      </g>
    </g>
    <g stroke="#c5a45b" stroke-width="1.4" opacity="0.28">
      <path d="M1280 160 h180"/><path d="M1340 190 h120"/>
    </g>
    <rect x="0" y="0" width="1600" height="900" fill="url(#vignette)" opacity="0.6"/>
    <defs>
      <radialGradient id="vignette" cx="50%" cy="45%" r="72%">
        <stop offset="0.5" stop-color="#0b2015" stop-opacity="0"/>
        <stop offset="1" stop-color="#0b2015" stop-opacity="0.55"/>
      </radialGradient>
    </defs>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0" stop-color="#f8efd8"/>
        <stop offset="0.55" stop-color="#eed9b0"/>
        <stop offset="1" stop-color="#d9b98a"/>
      </linearGradient>
      <radialGradient id="glow" cx="72%" cy="24%" r="58%">
        <stop offset="0" stop-color="#ffe9b5" stop-opacity="0.9"/>
        <stop offset="1" stop-color="#ffe9b5" stop-opacity="0"/>
      </radialGradient>
      ${tileDefs()}
    </defs>
    <rect width="1600" height="900" fill="url(#sky)"/>
    <rect width="1600" height="900" fill="url(#glow)"/>
    <rect width="1600" height="900" fill="url(#tile)" opacity="0.06"/>
    ${body}
  </svg>`;
}

export function heroUrl() {
  return `data:image/svg+xml,${encodeURIComponent(heroSVG())}`;
}

export const tilePatternUrl = () =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">${tileDefs()}<rect width="96" height="96" fill="none"/></svg>`
  )}`;
