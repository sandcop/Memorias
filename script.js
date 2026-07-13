/* ==========================================================
   CONFIG — edita aquí sin tocar el resto del código
   ========================================================== */
const CONFIG = {
  whatsapp: "56961017402",
  /* Backend del CRM (Manu Conecta). Pega aquí la URL que te da Apps
     Script al desplegar eac/crm/Code.gs como aplicación web — hasta
     entonces el popup "Contratar" guarda el intento localmente y no
     falla, pero no crea el lead en el CRM. */
  scriptUrl: "https://script.google.com/macros/s/AKfycbzc3TsN0nzPSbvPjb_XCcSAPFyU2DoTlOKm8z39FgsSzg-Ni2QY_mqC6g4wALHnnne-/exec",
  crmToken: "qkD1yR6CD6xPm1pzRUmACLMtz3JyLRZf"
};

/* ==========================================================
   PLANES — precios y promociones vigentes al 2026-07-08.
   Actualiza aquí cuando cambien las promociones oficiales Movistar.
   ========================================================== */
const PLANS = {
  movil: [
    { id: 1, name: "Plan Libre 450", price: "$8.990", priceNote: " x 6 meses", oldPrice: "$15.990", discount: "44%",
      spec: "450 GB en alta velocidad · 5G",
      includes: ["Redes sociales libres", "Minutos libres y 500 SMS", "Roaming: datos ilimitados 10 días en 24 países"] },
    { id: 2, name: "Plan Libre 800", price: "$11.990", priceNote: " x 6 meses", oldPrice: "$18.990", discount: "37%",
      spec: "800 GB en alta velocidad · 5G",
      includes: ["Redes sociales libres", "Minutos libres y 500 SMS", "Roaming: datos ilimitados 10 días en 24 países"] },
    { id: 3, name: "Plan Libre 1000", price: "$14.990", priceNote: " x 6 meses", oldPrice: "$23.990", discount: "38%",
      spec: "1000 GB en alta velocidad · 5G",
      includes: ["Redes sociales libres", "Minutos libres y 500 SMS", "Roaming: datos ilimitados 21 días en 30 países"] }
  ],
  fibra: [
    { id: 1, name: "Fibra 600 Megas", price: "$15.990", priceNote: " x 6 meses", oldPrice: "$18.990", discount: "15%",
      spec: "600 Mbps simétrica",
      includes: ["Incluye router"] },
    { id: 2, name: "Fibra 800 Megas", price: "$19.990", priceNote: " precio único", oldPrice: null, discount: null,
      spec: "800 Mbps simétrica",
      includes: ["Incluye router", "Incluye Paramount+"] },
    { id: 3, name: "Fibra Giga", price: "$19.990", priceNote: " x 12 meses", oldPrice: "$26.990", discount: "26%",
      spec: "940 Mbps simétrica",
      includes: ["Incluye router WiFi 6"] }
  ],
  tv: [
    { id: 1, name: "Dúo Fibra 600 + TV Inicia", price: "$29.990", priceNote: " x 6 meses", oldPrice: "$36.990", discount: "19%",
      spec: "600 Mbps · TV Inicia HD",
      includes: ["95 canales + 10 nacionales", "Incluye router", "Movistar TV + HBO Max (c/anuncios)", "Disponible desde el 1° de junio"] },
    { id: 2, name: "Dúo Fibra 800 + TV Full", price: "$37.990", priceNote: " precio único", oldPrice: null, discount: null,
      spec: "800 Mbps · TV Full HD",
      includes: ["102 canales + 10 nacionales", "Incluye router", "Movistar TV + HBO Max + Paramount+"] },
    { id: 3, name: "Dúo Fibra Giga + TV Pro", price: "$33.990", priceNote: " x 12 meses", oldPrice: "$52.990", discount: "35%",
      spec: "940 Mbps · TV Pro HD",
      includes: ["102 canales + 10 nacionales", "Router WiFi 6", "Movistar TV + HBO Max + Disney+"] }
  ],
  soloTv: [
    { id: 1, name: "TV Inicia", price: "$24.990", priceNote: " precio normal", oldPrice: null, discount: null,
      spec: "IPTV · Decodificador HD",
      includes: ["95 canales + 10 nacionales", "Movistar TV + HBO Max (c/anuncios)"] },
    { id: 2, name: "TV Full", price: "$26.990", priceNote: " precio normal", oldPrice: null, discount: null,
      spec: "IPTV · Decodificador HD",
      includes: ["102 canales + 10 nacionales", "Movistar TV + HBO Max"] },
    { id: 3, name: "TV Pro", price: "$29.990", priceNote: " precio normal", oldPrice: null, discount: null,
      spec: "IPTV · Decodificador HD",
      includes: ["102 canales + 10 nacionales", "Movistar TV + HBO Max + Disney+"] }
  ],
  full: [
    { id: 1, name: "Fibra 800 Megas + Móvil", price: "$29.980", priceNote: " precio único", oldPrice: null, discount: null,
      spec: "Internet + Móvil",
      includes: ["Fibra 800 Megas + router incluido", "Plan Móvil Libre 400 GB · RRSS y minutos ilimitados", "Precio SIM $1.990"] },
    { id: 2, name: "Dúo Fibra 800 Megas + TV Full + Móvil", price: "$47.980", priceNote: " precio único", oldPrice: null, discount: null,
      spec: "Internet + TV + Móvil",
      includes: ["Fibra 800 Megas + router incluido", "TV Full HD · 102 canales + 10 nacionales", "Plan Móvil Libre 400 GB · RRSS y minutos ilimitados", "Precio SIM $1.990"] }
  ]
};

const PLAN_EXTRA_NOTES = {
  movil: "Líneas adicionales: $4.990 x 6 meses (precio normal desde el mes 7: $9.990).",
  fibra: "",
  tv: "",
  soloTv: ""
};

/* ==========================================================
   TESTIMONIOS — EDITA AQUÍ. Los valores actuales son de ejemplo
   (marcados entre corchetes) hasta que tengas citas reales de clientes.
   ========================================================== */
const TESTIMONIALS = [
  { avatar: "CM", name: "[Nombre del cliente]", role: "Portabilidad + equipo",
    headline: "[Frase corta y llamativa del testimonio]",
    body: "[Testimonio real del cliente: qué contrató, cómo fue la atención y qué problema le resolviste.]" },
  { avatar: "JP", name: "[Nombre del cliente]", role: "Fibra hogar",
    headline: "[Frase corta y llamativa del testimonio]",
    body: "[Testimonio real del cliente sobre la instalación de fibra o Movistar Full.]" },
  { avatar: "AV", name: "[Nombre del cliente]", role: "Movistar Full",
    headline: "[Frase corta y llamativa del testimonio]",
    body: "[Testimonio real de un cliente empresa o de seguimiento post-venta.]" }
];

/* ---------- año footer ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- header: transparente arriba, sólido al hacer scroll ---------- */
const siteHeader = document.querySelector("header");
function updateHeaderOnScroll() {
  siteHeader.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

/* ---------- selector interactivo de testimonios ---------- */
(function(){
  const list = document.getElementById("testiList");
  const headline = document.getElementById("testiHeadline");
  const body = document.getElementById("testiBody");
  if (!list) return;
  let active = 0;

  function renderList() {
    list.innerHTML = "";
    TESTIMONIALS.forEach((t, i) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "testi-tab" + (i === active ? " is-active" : "");
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(i === active));
      tab.innerHTML = `
        <span class="testi-tab-avatar" aria-hidden="true">${t.avatar}</span>
        <span class="testi-tab-info">
          <strong>${t.name}</strong>
          <span>${t.role}</span>
        </span>`;
      tab.addEventListener("click", () => {
        active = i;
        renderList();
        renderDetail();
      });
      list.appendChild(tab);
    });
  }

  function renderDetail() {
    const t = TESTIMONIALS[active];
    headline.textContent = `"${t.headline}"`;
    body.textContent = t.body;
  }

  renderList();
  renderDetail();
})();

/* ---------- configurador de planes + modal de contratación ---------- */
(function(){
  const CATEGORY_LABELS = { movil: "Móvil", fibra: "Internet Hogar", tv: "Internet + TV", soloTv: "Solo TV", full: "Movistar Full" };
  const CATEGORY_FIELDS = {
    movil:  { install: false, lines: true },
    fibra:  { install: true,  lines: false },
    tv:     { install: true,  lines: false },
    soloTv: { install: true,  lines: false },
    full:   { install: true,  lines: true }
  };

  let category = "movil";
  let selectedId = 1;
  let fmcSelectedId = 1;
  let lines = [];
  let lineCount = 0;

  const movilBtn   = document.getElementById("movilBtn");
  const fibraBtn   = document.getElementById("fibraBtn");
  const tvBtn      = document.getElementById("tvBtn");
  const soloTvBtn  = document.getElementById("soloTvBtn");
  const planList   = document.getElementById("planList");
  const planExtraNote = document.getElementById("planExtraNote");
  const contractTrigger = document.getElementById("elige-plan-whatsapp");

  function populatePlanPhotos() {
    Object.keys(PLANS).forEach(cat => {
      PLANS[cat].forEach(plan => {
        const el = document.getElementById(`planPhoto-${cat}-${plan.id}`);
        if (!el) return;
        el.innerHTML = `
          <div class="plan-photo-content">
            <span class="plan-photo-category">${CATEGORY_LABELS[cat]}</span>
            <h4>${plan.name}</h4>
            <div class="plan-photo-price">
              ${plan.price}<small>${plan.priceNote}</small>
              ${plan.oldPrice ? `<s>${plan.oldPrice}</s>` : ""}
            </div>
            <ul class="plan-photo-includes">
              ${plan.includes.map(item => `<li>${item}</li>`).join("")}
            </ul>
          </div>`;
      });
    });
  }

  function updatePhoto() {
    document.querySelectorAll(".plan-photo").forEach(p => p.classList.remove("is-visible"));
    const target = document.getElementById(`planPhoto-${category}-${selectedId}`);
    if (target) target.classList.add("is-visible");
  }

  function renderPlans() {
    planList.innerHTML = "";
    PLANS[category].forEach(plan => {
      const isSelected = plan.id === selectedId;
      const card = document.createElement("button");
      card.type = "button";
      card.setAttribute("role", "radio");
      card.setAttribute("aria-checked", String(isSelected));
      card.className = "plan-option" + (isSelected ? " is-selected" : "");
      card.innerHTML = `
        <span class="plan-radio" aria-hidden="true">
          <svg viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5 2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span class="plan-option-main">
          <span class="plan-option-row">
            <h4>${plan.name}</h4>
            <span class="plan-price">
              ${plan.price}<small>${plan.priceNote}</small>
              ${plan.oldPrice ? `<s class="plan-price-old">${plan.oldPrice}</s>` : ""}
            </span>
          </span>
          <span class="plan-spec">${plan.spec}</span>
          ${plan.discount ? `<span class="plan-discount">${plan.discount} dcto</span>` : ""}
        </span>`;
      card.addEventListener("click", () => {
        selectedId = plan.id;
        renderPlans();
        updatePhoto();
      });
      planList.appendChild(card);
    });
    const extraNote = PLAN_EXTRA_NOTES[category];
    planExtraNote.textContent = extraNote || "";
    planExtraNote.style.visibility = extraNote ? "visible" : "hidden";
  }

  function setCategory(next) {
    category = next; selectedId = 1;
    movilBtn.setAttribute("aria-pressed", String(next === "movil"));
    fibraBtn.setAttribute("aria-pressed", String(next === "fibra"));
    tvBtn.setAttribute("aria-pressed", String(next === "tv"));
    soloTvBtn.setAttribute("aria-pressed", String(next === "soloTv"));
    renderPlans(); updatePhoto();
  }

  movilBtn.addEventListener("click", () => setCategory("movil"));
  fibraBtn.addEventListener("click", () => setCategory("fibra"));
  tvBtn.addEventListener("click", () => setCategory("tv"));
  soloTvBtn.addEventListener("click", () => setCategory("soloTv"));

  populatePlanPhotos();
  renderPlans();
  updatePhoto();

  /* ---- modal: contratar (crea el lead en el backend al enviar) ---- */
  let currentModalPlan = null;
  const backdrop        = document.getElementById("contractBackdrop");
  const modal            = document.getElementById("contractModal");
  const modalTitle       = document.getElementById("contractModalTitle");
  const modalSummary     = document.getElementById("modalPlanSummary");
  const modalForm        = document.getElementById("contractForm");
  const modalSuccess     = document.getElementById("contractSuccess");
  const installWrap      = document.getElementById("cf-install-wrap");
  const linesWrap        = document.getElementById("cf-lines-wrap");
  const linesList        = document.getElementById("cf-lines-list");
  const addLineBtn       = document.getElementById("cf-add-line");
  const modalCloseBtn    = document.getElementById("contractClose");
  const successCloseBtn  = document.getElementById("contractSuccessClose");

  function addLine(type = "nueva") {
    lineCount += 1;
    lines.push({ index: lineCount, type, number: "", quantity: 1 });
    renderLines();
  }

  function removeLine(index) {
    lines = lines.filter(l => l.index !== index);
    renderLines();
  }

  function renderLines() {
    linesList.innerHTML = "";
    lines.forEach((line, i) => {
      const item = document.createElement("div");
      item.className = "line-item";
      const extraField = line.type === "portabilidad"
        ? `<div class="form-field">
             <label>Número a portar</label>
             <input type="tel" data-port-number="${line.index}" placeholder="+56 9 1234 5678" value="${line.number}">
           </div>`
        : `<div class="form-field">
             <label>¿Cuántas líneas nuevas quieres?</label>
             <input type="number" min="1" max="10" data-quantity="${line.index}" value="${line.quantity}">
           </div>`;
      item.innerHTML = `
        <div class="line-item-head">
          <span>Línea ${i + 1}</span>
          ${lines.length > 1 ? `<button type="button" class="line-remove" data-remove="${line.index}">Eliminar</button>` : ""}
        </div>
        <div class="line-toggle" role="radiogroup" aria-label="Tipo de línea ${i + 1}">
          <label class="line-radio">
            <input type="radio" name="line-type-${line.index}" value="nueva" ${line.type === "nueva" ? "checked" : ""}>
            <span>Línea nueva</span>
          </label>
          <label class="line-radio">
            <input type="radio" name="line-type-${line.index}" value="portabilidad" ${line.type === "portabilidad" ? "checked" : ""}>
            <span>Portabilidad</span>
          </label>
        </div>
        ${extraField}`;
      linesList.appendChild(item);
    });

    linesList.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => removeLine(Number(btn.dataset.remove)));
    });
    linesList.querySelectorAll("input[type=radio]").forEach(radio => {
      radio.addEventListener("change", (e) => {
        const line = lines.find(l => `line-type-${l.index}` === e.target.name);
        line.type = e.target.value;
        renderLines();
      });
    });
    linesList.querySelectorAll("[data-port-number]").forEach(input => {
      input.addEventListener("input", (e) => {
        const line = lines.find(l => l.index === Number(e.target.dataset.portNumber));
        line.number = e.target.value;
      });
    });
    linesList.querySelectorAll("[data-quantity]").forEach(input => {
      input.addEventListener("input", (e) => {
        const line = lines.find(l => l.index === Number(e.target.dataset.quantity));
        line.quantity = e.target.value;
      });
    });

    addLineBtn.hidden = !lines.some(l => l.type === "portabilidad");
  }

  addLineBtn.addEventListener("click", () => addLine("portabilidad"));

  function openModal(cat, selId) {
    cat = cat || category;
    selId = selId != null ? selId : selectedId;
    const plan = PLANS[cat].find(p => p.id === selId);
    const fields = CATEGORY_FIELDS[cat];
    currentModalPlan = { category: cat, categoryLabel: CATEGORY_LABELS[cat], name: plan.name };
    modalTitle.textContent = `Contratar ${CATEGORY_LABELS[cat]}`;
    modalSummary.innerHTML = `<strong>${plan.name}</strong><span>${CATEGORY_LABELS[cat]} · ${plan.price}${plan.priceNote}</span>`;

    installWrap.hidden = !fields.install;
    linesWrap.hidden = !fields.lines;

    modalForm.reset();
    if (fields.lines) {
      lines = [];
      lineCount = 0;
      addLine();
    }

    modalForm.hidden = false;
    modalSuccess.hidden = true;

    backdrop.classList.add("open");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    backdrop.classList.remove("open");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  contractTrigger.addEventListener("click", () => openModal());
  modalCloseBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  successCloseBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  const modalErrorEl = document.getElementById("modal-error");

  modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!modalForm.checkValidity()) {
      modalForm.reportValidity();
      return;
    }

    const submitBtn = modalForm.querySelector(".modal-submit");
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";
    modalErrorEl.hidden = true;

    const payload = {
      type: "createLead",
      token: CONFIG.crmToken,
      fromWebsite: true,
      nombre: document.getElementById("cf-name").value.trim(),
      telefono: document.getElementById("cf-phone").value.trim(),
      correo: document.getElementById("cf-email").value.trim(),
      direccion: document.getElementById("cf-address").value.trim(),
      direccion_instalacion: installWrap.hidden ? "" : (document.getElementById("cf-install").value || "").trim(),
      plan_categoria: currentModalPlan ? currentModalPlan.categoryLabel : "",
      plan_nombre: currentModalPlan ? currentModalPlan.name : "",
      lineas_json: linesWrap.hidden ? "" : JSON.stringify(lines),
      origen: "landing-popup"
    };

    try {
      if (CONFIG.scriptUrl && CONFIG.scriptUrl !== "PENDIENTE_DESPLEGAR_CODE_GS") {
        const url = CONFIG.scriptUrl + "?data=" + encodeURIComponent(JSON.stringify(payload));
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      }
      modalForm.hidden = true;
      modalSuccess.hidden = false;
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      modalErrorEl.textContent = "No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos directo por WhatsApp.";
      modalErrorEl.hidden = false;
    }
  });

  /* ---- Movistar Full: fondo cambia según la tarjeta seleccionada, 1 solo CTA ---- */
  const fmcCards = document.querySelectorAll(".full-card[data-fmc-index]");
  const fmcBgImages = document.querySelectorAll(".full-bg-slideshow img");
  const fmcContratarBtn = document.getElementById("fmc-contratar");
  fmcCards.forEach(card => {
    card.addEventListener("click", () => {
      const idx = card.dataset.fmcIndex;
      fmcSelectedId = Number(idx) + 1;
      fmcCards.forEach(c => c.classList.toggle("is-selected", c === card));
      fmcBgImages.forEach(img => img.classList.toggle("is-visible", img.dataset.fmcBg === idx));
    });
  });
  if (fmcContratarBtn) {
    fmcContratarBtn.addEventListener("click", () => openModal("full", fmcSelectedId));
  }
})();

/* ---------- tabs de equipos (con estado accesible) ---------- */
const equiposTabs = document.querySelectorAll(".tab");
const equiposPanels = document.querySelectorAll(".catalog");
equiposTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    equiposTabs.forEach(t => t.setAttribute("aria-selected", String(t === tab)));
    equiposPanels.forEach(p => { p.hidden = p.dataset.panel !== target; });
  });
});

/* ---------- nav: resalta la sección activa (desktop + móvil) ---------- */
const navLinks = document.querySelectorAll(".nav-links a[href^='#'], .mobile-menu-links a[href^='#']");
const navSections = [...new Set(
  Array.from(navLinks).map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean)
)];
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.remove("active"));
    document.querySelectorAll(`.nav-links a[href="#${entry.target.id}"], .mobile-menu-links a[href="#${entry.target.id}"]`)
      .forEach(a => a.classList.add("active"));
  });
}, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
navSections.forEach(sec => navObserver.observe(sec));

/* ---------- menú móvil: abrir / cerrar ---------- */
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");
function openMobileMenu() {
  mobileMenu.classList.add("open");
  mobileMenuBackdrop.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}
function closeMobileMenu() {
  mobileMenu.classList.remove("open");
  mobileMenuBackdrop.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
menuToggle.addEventListener("click", openMobileMenu);
mobileMenuClose.addEventListener("click", closeMobileMenu);
mobileMenuBackdrop.addEventListener("click", closeMobileMenu);
mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMobileMenu));
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && mobileMenu.classList.contains("open")) closeMobileMenu();
});

/* ---------- analítica de CTAs ---------- */
document.querySelectorAll("[data-ev]").forEach(el => {
  el.addEventListener("click", () => {
    const ev = el.dataset.ev;
    if (window.gtag) gtag("event", ev);
    else if (window.dataLayer) dataLayer.push({ event: ev });
  });
});

/* ---------- reveal / stagger con Intersection Observer ---------- */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* ---------- Blog: listado completo, real, desde Sanity (con estado vacío) ---------- */
async function renderHomeBlogListing() {
  const container = document.getElementById("blog-grid-container");
  if (!container) return;

  const postLink = (p) => `blog-post.html?slug=${encodeURIComponent(p.slug)}`;
  const arrowSvg = `<svg viewBox="0 0 14 10" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>`;
  const fmtDate = (iso) => new Date(iso).toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" });
  const featuredItem = (p) => `
    <article class="blog-featured">
      <div class="blog-featured-visual" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      </div>
      <span class="blog-listing-date">${fmtDate(p.publishedAt)}</span>
      <h3>${escHtml(p.title)}</h3>
      <p>${escHtml(p.excerpt || "")}</p>
      <a class="btn-link btn-link--light" href="${postLink(p)}">Seguir leyendo ${arrowSvg}</a>
    </article>`;
  const postItem = (p) => `
    <article class="blog-listing-card">
      <span class="blog-listing-date">${fmtDate(p.publishedAt)}</span>
      <h3>${escHtml(p.title)}</h3>
      <p>${escHtml(p.excerpt || "")}</p>
      <a class="btn-link btn-link--light" href="${postLink(p)}">Seguir leyendo ${arrowSvg}</a>
    </article>`;

  try {
    const posts = await sanityQuery('*[_type=="post"]|order(publishedAt desc){title,excerpt,"slug":slug.current,publishedAt}');
    if (!posts || !posts.length) {
      container.innerHTML = `
        <div class="blog-empty">
          <p>Muy pronto vas a encontrar aquí guías sobre portabilidad, fibra y equipos. Mientras tanto, escríbeme directo si tienes una duda.</p>
          <a class="btn btn-wsp" href="https://wa.me/56961017402?text=Hola%20Manu%2C%20tengo%20una%20consulta" target="_blank" rel="noopener">Escríbeme por WhatsApp</a>
        </div>`;
      return;
    }
    const rest = posts.slice(1);
    let html = `<div class="blog-listing">`;
    html += featuredItem(posts[0]);
    if (rest.length) html += `<div class="blog-listing-grid">${rest.map(postItem).join("")}</div>`;
    html += `</div>`;
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = `<p style="text-align:center;color:rgba(255,255,255,.6);">No pudimos cargar el blog por ahora.</p>`;
  }
}
renderHomeBlogListing();
