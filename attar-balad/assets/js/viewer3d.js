/* عطار بلد — جزیرهٔ سه‌بعدی (فاز ۵)
   <attar-3d-viewer> — وب‌کامپوننت ایزوله بر پایهٔ «سند ماژول سه‌بعدی ووکامرس»:
   معماری جزیره‌ای، Shadow DOM، بدون وابستگی خارجی، بدون WebGL و بدون حلقهٔ رندر.
   موتور قابلیت‌سنجی دستگاه (save-data / 2G / نبود preserve-3d) نمای دوبعدی می‌دهد،
   چرخش فقط با تعامل کاربر رخ می‌دهد و همهٔ کنترل‌ها با کیبورد و screen reader کار می‌کنند.
   این نسخه به‌جای Three.js از رندر CSS 3D استفاده می‌کند: صفر بایت کتابخانه و صفر GPU. */
(function () {
  "use strict";
  if (typeof window === "undefined" || customElements.get("attar-3d-viewer")) return;

  var ERAS = [
    {
      id: "persepolis", name: "تخت جمشید", date: "۵۵۰ پ.م",
      caption: "کتیبه‌های باروی تخت جمشید، گیاهان دارویی و سهم آن‌ها در انبارهای شاهی را ثبت کرده‌اند.",
      detail: "گیاهان دارویی در انبارهای شاهی با نام و مقدار ثبت می‌شدند؛ سنگ‌نگاره‌ها هم پیشکش‌آورندگان گیاه را نشان می‌دهند.",
      icon: '<path d="M4.4 20.4h15.2"/><path d="M6.8 20.4V10.2M17.2 20.4V10.2"/><path d="M5.2 10.2h13.6"/><path d="M7 10.2c0-2.2 2.3-3.6 5-3.6s5 1.4 5 3.6"/><path d="M9.6 20.4v-6h4.8v6"/><path d="M10.2 4.6h3.6"/>'
    },
    {
      id: "ecbatana", name: "هگمتانه", date: "۷۰۰ پ.م",
      caption: "هگمتانه، گذرگاه طب میان‌رودان و فلات ایران بود؛ دارو و ادویه از همین راه می‌گذشت.",
      detail: "کاروان‌های دارو و ادویه از میان‌رودان به فلات ایران می‌رسیدند و هگمتانه ایستگاه میانی آن راه بود.",
      icon: '<path d="M3.6 20.4h16.8"/><path d="M5.6 20.4v-4h12.8v4"/><path d="M7.6 16.4v-4h8.8v4"/><path d="M9.6 12.4V8.4h4.8v4"/><path d="M11.2 8.4V5.2h1.6v3.2"/>'
    },
    {
      id: "sasanian", name: "ساسانیان", date: "۲۲۴ م",
      caption: "دانشگاه گندیشاپور، طب ایرانی، هندی و یونانی را زیر یک سقف گرد آورد.",
      detail: "ترجمه‌های پهلوی، پزشکی هند، یونان و ایران را به هم پیوند داد و بیمارستان آموزشی را رسم کرد.",
      icon: '<path d="M5.2 20.4V11a6.8 6.8 0 0 1 13.6 0v9.4"/><path d="M3.4 20.4h17.2"/><path d="M9.6 20.4v-5.6a2.4 2.4 0 0 1 4.8 0v5.6"/><path d="M12 4.2v2"/>'
    },
    {
      id: "islamic", name: "دورهٔ اسلامی", date: "۹۰۰ م",
      caption: "ابن‌سینا در قانون، داروشناسی را به دستگاهی منظم تبدیل کرد و قرن‌ها مرجع ماند.",
      detail: "قانون ابن‌سینا قرن‌ها در دانشگاه‌های اروپا تدریس شد و نام گیاهان را در چند زبان ثبت کرد.",
      icon: '<path d="M12 6.4c-1.9-1.3-4.2-1.7-6.8-1.4v12.6c2.6-.3 4.9 0 6.8 1.4 1.9-1.4 4.2-1.7 6.8-1.4V5c-2.6-.3-4.9 0-6.8 1.4z"/><path d="M12 6.4V19"/><path d="M7.4 9.2c1.2 0 2.2.3 3 .8M7.4 12c1.2 0 2.2.3 3 .8M13.6 10c.8-.5 1.8-.8 3-.8M13.6 12.8c.8-.5 1.8-.8 3-.8"/>'
    },
    {
      id: "safavid", name: "دورهٔ صفوی", date: "۱۵۰۱ م",
      caption: "عطاری‌های بازار صفوی، دارو، ادویه و روغن را کنار هم می‌فروختند.",
      detail: "در بازار صفوی، عطار دارو، ادویه و روغن را در یک دکان می‌فروخت و برای بیمار نسخه می‌نوشت.",
      icon: '<path d="M3.8 20.4h16.4"/><path d="M6.4 20.4v-6.2h11.2v6.2"/><path d="M12 14.2V9.4"/><path d="M8.4 11.6c0-3.2 1.4-5.2 3.6-6.8 2.2 1.6 3.6 3.6 3.6 6.8z"/><path d="M12 4.6v-.8"/>'
    },
    {
      id: "modern", name: "ایران معاصر", date: "۱۳۱۳ ش",
      caption: "دانشکده داروسازی تهران، طب سنتی ایران را به پژوهش دانشگاهی رساند.",
      detail: "پژوهش دانشگاهی، گیاه‌درمانی سنتی را به آزمایشگاه آورد و اثر بخش‌های گیاهان را سنجید.",
      icon: '<path d="M9.4 3.6h5.2v3.9l4 10.1a2 2 0 0 1-1.9 2.8H7.3a2 2 0 0 1-1.9-2.8l4-10.1z"/><path d="M9.4 7.5h5.2"/><path d="M7.8 15.2h8.4"/>'
    }
  ];

  var STYLE = [
    ":host{display:block;--gold:#c5a45b;--gold-lt:#e3c88f;--cream:#f7f3e8;--deep:#0b2a19;--line:rgba(197,164,91,.34);",
    "color:var(--cream);font-family:var(--ab-font-body,Vazirmatn,Tahoma,sans-serif);-webkit-font-smoothing:antialiased}",
    "*,*::before,*::after{box-sizing:border-box}",
    ".stage{position:relative;height:392px;perspective:1100px;perspective-origin:50% 44%;",
    "touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:grab;border-radius:22px}",
    ".stage:focus-visible{outline:2px solid var(--gold);outline-offset:6px}",
    ".stage.is-drag{cursor:grabbing}",
    ".stage::after{content:'';position:absolute;inset-inline:12%;inset-block-end:6px;height:26px;border-radius:50%;",
    "background:radial-gradient(closest-side,rgba(0,0,0,.55),transparent);pointer-events:none}",
    ".ring{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .62s cubic-bezier(.22,.61,.36,1);will-change:transform}",
    ".panel{position:absolute;top:50%;left:50%;width:clamp(214px,60vw,282px);height:328px;",
    "margin:0;transform:translate(-50%,-50%) rotateY(var(--a,0deg)) translateZ(var(--r,232px));transform-style:preserve-3d;",
    "backface-visibility:hidden;display:flex;flex-direction:column;gap:10px;padding:22px 20px 18px;",
    "background:linear-gradient(164deg,#1c4b30 0%,#123a23 54%,#0c2d1c 100%);border:1px solid var(--line);border-radius:22px;",
    "box-shadow:0 30px 56px -34px rgba(0,0,0,.9),inset 0 0 0 1px rgba(255,255,255,.04);",
    "opacity:.4;filter:saturate(.55) brightness(.7);transition:opacity .4s var(--ab-ease,ease),filter .4s var(--ab-ease,ease);overflow:hidden}",
    ".panel::before{content:'';position:absolute;inset-block-start:8px;inset-inline:34px;height:58px;",
    "border:1px solid rgba(197,164,91,.2);border-block-end:0;border-radius:80px 80px 0 0;pointer-events:none}",
    ".panel.is-front{opacity:1;filter:none}",
    ".yr{font-size:11.5px;letter-spacing:.14em;color:var(--gold-lt);text-align:center;margin-block-start:4px}",
    ".ic{display:grid;place-items:center;width:52px;height:52px;margin:6px auto 0;border-radius:50%;",
    "border:1px solid var(--line);background:rgba(197,164,91,.1);color:var(--gold)}",
    ".ic svg{width:26px;height:26px}",
    ".panel h3{margin:0;font-family:var(--ab-font-head,Estedad,Vazirmatn,Tahoma,sans-serif);font-size:21px;",
    "font-weight:700;line-height:1.4;text-align:center;color:#fff}",
    ".panel p{margin:0;font-size:13px;line-height:1.95;color:rgba(247,243,232,.72);text-align:center;flex:1}",
    ".no{font-size:11px;letter-spacing:.1em;color:rgba(197,164,91,.75);text-align:center}",
    ".bar{display:flex;align-items:center;justify-content:center;gap:14px;margin-block-start:14px}",
    ".nav{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;cursor:pointer;",
    "background:transparent;border:1px solid var(--line);color:var(--gold-lt);transition:background .2s,border-color .2s,color .2s}",
    ".nav:hover{background:rgba(197,164,91,.14);border-color:var(--gold);color:#fff}",
    ".nav:focus-visible{outline:2px solid var(--gold);outline-offset:3px}",
    ".nav svg{width:18px;height:18px}",
    ".readout{margin:0;font-size:12.5px;color:rgba(247,243,232,.66);min-width:112px;text-align:center}",
    ".readout b{color:var(--gold-lt);font-weight:600}",
    ".hint{margin:10px 0 0;font-size:11.5px;line-height:1.8;text-align:center;color:rgba(247,243,232,.45)}",
    ".sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}",
    "@media (max-width:560px){.stage{height:352px;perspective:900px}.panel{height:300px;padding:18px 16px 14px}",
    ".panel h3{font-size:19px}.panel p{font-size:12.5px;line-height:1.85}}",
    "@media (prefers-reduced-motion:reduce){.ring{transition:none}.panel{transition:none}}",
    /* جایگزین دوبعدی: دستگاه ضعیف، save-data یا مرورگر بدون preserve-3d */
    ":host(.is-flat) .stage{height:auto;perspective:none;cursor:auto;overflow-x:auto;scroll-snap-type:x mandatory;",
    "padding-block-end:8px;-webkit-overflow-scrolling:touch}",
    ":host(.is-flat) .stage::after{display:none}",
    ":host(.is-flat) .ring{position:relative;inset:auto;display:flex;gap:12px;transform:none!important;transition:none;transform-style:flat}",
    ":host(.is-flat) .panel{position:relative;inset:auto;margin:0;transform:none!important;flex:0 0 82%;",
    "height:auto;min-height:272px;opacity:1;filter:none;scroll-snap-align:center}",
    ":host(.is-flat) .bar{display:none}",
    ":host(.is-flat) .hint{display:none}"
  ].join("");

  function faNum(n) {
    return String(n).replace(/\d/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; });
  }

  function chev(dir) {
    var d = dir === "left" ? "M14.4 5.6 8 12l6.4 6.4" : "M9.6 5.6 16 12l-6.4 6.4";
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  }

  class Attar3DViewer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._i = 0;
      this._silent = true;
    }

    connectedCallback() {
      if (this._built) { this.refresh(); return; }
      this._built = true;
      var wanted = this.getAttribute("data-active");
      var start = 0;
      ERAS.forEach(function (e, i) { if (e.id === wanted) start = i; });
      this._i = start;
      this.shadowRoot.innerHTML = "<style>" + STYLE + "</style>" + this._markup();
      this._ring = this.shadowRoot.querySelector(".ring");
      this._panels = Array.prototype.slice.call(this.shadowRoot.querySelectorAll(".panel"));
      this._readout = this.shadowRoot.querySelector(".readout b");
      this._live = this.shadowRoot.querySelector(".sr");
      this._stage = this.shadowRoot.querySelector(".stage");
      this._detectCapability();
      this._bind();
      this._measure();
      this._silent = false;
      this._render({ instant: true, silent: true });
      if (window.ResizeObserver) {
        var self = this;
        this._ro = new ResizeObserver(function () { self._measure(); self._render({ instant: true, silent: true }); });
        this._ro.observe(this);
      }
    }

    disconnectedCallback() {
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
    }

    _markup() {
      var panels = ERAS.map(function (e, i) {
        return '<article class="panel" data-id="' + e.id + '" aria-hidden="' + (i === 0 ? "false" : "true") + '">' +
          '<span class="yr">' + e.date + "</span>" +
          '<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
          'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + e.icon + "</svg></span>" +
          "<h3>" + e.name + "</h3>" +
          "<p>" + e.detail + "</p>" +
          '<span class="no">' + faNum(i + 1) + " / " + faNum(ERAS.length) + "</span>" +
          "</article>";
      }).join("");

      return '<div class="stage" tabindex="0" role="group" aria-roledescription="گردان سه‌بعدی" ' +
          'aria-label="سفر در تاریخ طب ایران، شش دورهٔ تاریخی">' +
          '<div class="ring">' + panels + "</div></div>" +
        '<div class="bar">' +
          '<button type="button" class="nav prev" aria-label="دورهٔ قبلی">' + chev("right") + "</button>" +
          '<p class="readout">دورهٔ <b>۱</b> از ' + faNum(ERAS.length) + "</p>" +
          '<button type="button" class="nav next" aria-label="دورهٔ بعدی">' + chev("left") + "</button>" +
        "</div>" +
        '<p class="hint">برای چرخش بکشید یا با کلیدهای جهت‌دار جابه‌جا شوید.</p>' +
        '<p class="sr" aria-live="polite"></p>';
    }

    _detectCapability() {
      var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      var weak = !!(conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "")));
      var no3d = !(window.CSS && CSS.supports && CSS.supports("transform-style", "preserve-3d"));
      if (weak || no3d) this.classList.add("is-flat");
    }

    _measure() {
      if (!this._panels || !this._panels.length) return;
      if (this.classList.contains("is-flat")) return;
      var pw = this._panels[0].offsetWidth;
      if (!pw) return;
      var r = Math.round((pw / 2) / Math.tan(Math.PI / 6));
      this._panels.forEach(function (p, k) {
        p.style.setProperty("--a", (-k * 60) + "deg");
        p.style.setProperty("--r", r + "px");
      });
    }

    refresh() {
      this._measure();
      this._render({ instant: true, silent: true });
    }

    setEra(id) {
      var idx = -1;
      ERAS.forEach(function (e, i) { if (e.id === id) idx = i; });
      if (idx < 0 || idx === this._i) return;
      this._i = idx;
      this._render({ silent: true });
    }

    _goTo(i) {
      var n = ERAS.length;
      var next = ((i % n) + n) % n;
      if (next === this._i) return;
      this._i = next;
      this._render({});
    }

    _render(opts) {
      opts = opts || {};
      if (!this._ring) return;
      if (opts.instant) {
        this._ring.style.transition = "none";
        this._ring.style.transform = "rotateY(" + (this._i * 60) + "deg)";
        void this._ring.offsetWidth;
        this._ring.style.transition = "";
      } else {
        this._ring.style.transform = "rotateY(" + (this._i * 60) + "deg)";
      }
      var self = this;
      this._panels.forEach(function (p, k) {
        p.classList.toggle("is-front", k === self._i);
        p.setAttribute("aria-hidden", k === self._i ? "false" : "true");
      });
      var era = ERAS[this._i];
      if (this._readout) this._readout.textContent = faNum(this._i + 1);
      if (this._live) this._live.textContent = "دورهٔ " + era.name + "، " + era.date;
      if (!opts.silent && !this._silent) {
        this.dispatchEvent(new CustomEvent("era-change", {
          detail: { id: era.id, index: this._i }, bubbles: true
        }));
      }
    }

    _bind() {
      var self = this;
      var stage = this._stage;
      var startX = null;
      var startRot = 0;
      var moved = 0;

      this.shadowRoot.querySelector(".prev").addEventListener("click", function () { self._goTo(self._i - 1); });
      this.shadowRoot.querySelector(".next").addEventListener("click", function () { self._goTo(self._i + 1); });

      stage.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { e.preventDefault(); self._goTo(self._i + 1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); self._goTo(self._i - 1); }
        else if (e.key === "Home") { e.preventDefault(); self._goTo(0); }
        else if (e.key === "End") { e.preventDefault(); self._goTo(ERAS.length - 1); }
      });

      this._panels.forEach(function (p, k) {
        p.addEventListener("click", function () {
          if (Math.abs(moved) > 12) return;
          self._goTo(k);
        });
      });

      stage.addEventListener("pointerdown", function (e) {
        if (e.button !== undefined && e.button !== 0) return;
        startX = e.clientX;
        startRot = self._i * 60;
        moved = 0;
        stage.classList.add("is-drag");
        self._ring.style.transition = "none";
        if (stage.setPointerCapture) {
          try { stage.setPointerCapture(e.pointerId); } catch (err) {}
        }
      });

      stage.addEventListener("pointermove", function (e) {
        if (startX === null) return;
        moved = e.clientX - startX;
        self._ring.style.transform = "rotateY(" + (startRot + moved * 0.34) + "deg)";
      });

      function endDrag() {
        if (startX === null) return;
        startX = null;
        stage.classList.remove("is-drag");
        self._ring.style.transition = "";
        if (Math.abs(moved) > 46) {
          self._goTo(moved > 0 ? self._i - 1 : self._i + 1);
        } else {
          self._render({});
        }
      }
      stage.addEventListener("pointerup", endDrag);
      stage.addEventListener("pointercancel", endDrag);
      stage.addEventListener("pointerleave", function () { if (startX !== null) endDrag(); });
    }
  }

  customElements.define("attar-3d-viewer", Attar3DViewer);

  /* اتصال خودکار دکمهٔ باز/بسته: هر صفحه‌ای که #history3dBtn و #history3d دارد. */
  function initToggle() {
    var wrap = document.getElementById("history3d");
    var btn = document.getElementById("history3dBtn");
    if (!wrap || !btn || btn.dataset.ab3d === "1") return;
    btn.dataset.ab3d = "1";
    btn.addEventListener("click", function () {
      var opening = wrap.hasAttribute("hidden");
      if (opening) { wrap.removeAttribute("hidden"); } else { wrap.setAttribute("hidden", ""); }
      btn.setAttribute("aria-expanded", opening ? "true" : "false");
      var label = btn.querySelector("[data-label]");
      if (label) label.textContent = opening ? "بستن نمای سه‌بعدی" : "مشاهده در سه‌بعدی";
      var viewer = document.querySelector("attar-3d-viewer");
      if (opening && viewer) {
        var active = document.querySelector(".ab-era.is-active");
        if (viewer.setEra && active) viewer.setEra(active.getAttribute("data-era"));
        if (viewer.refresh) requestAnimationFrame(function () { viewer.refresh(); });
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initToggle);
  } else {
    initToggle();
  }
})();
