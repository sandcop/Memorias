/* ==========================================================
   CONFIG — edita aquí sin tocar el resto del código
   ========================================================== */
const CONFIG = {
  whatsapp: "56961017402",
  /* Backend del CRM (Manu Conecta) — usado solo para traer las reseñas
     reales de Google que se muestran en "Sobre mí". Se despliega
     eac/crm/Code.gs como aplicación web. No recolecta datos de visitantes. */
  scriptUrl: "https://script.google.com/macros/s/AKfycbxo6aCIz_344ITXiSiLnyM_fbbvU4jFu12WfiHFgvwW8Zma2ri0qZexxk7lFBEz-cdf/exec",
  crmToken: "qkD1yR6CD6xPm1pzRUmACLMtz3JyLRZf"
};

/* ==========================================================
   PLANES — nombres y condiciones vigentes al 2026-07-08.
   Los precios no se muestran en el sitio: son los oficiales
   y se confirman por WhatsApp al momento de contratar.
   ========================================================== */
const PLANS = {
  movil: [
    { id: 1, name: "Plan Libre 450",
      spec: "450 GB en alta velocidad · 5G",
      includes: ["Redes sociales libres", "Minutos libres y 500 SMS", "Roaming: datos ilimitados 10 días en 24 países"] },
    { id: 2, name: "Plan Libre 800",
      spec: "800 GB en alta velocidad · 5G",
      includes: ["Redes sociales libres", "Minutos libres y 500 SMS", "Roaming: datos ilimitados 10 días en 24 países"] },
    { id: 3, name: "Plan Libre 1000",
      spec: "1000 GB en alta velocidad · 5G",
      includes: ["Redes sociales libres", "Minutos libres y 500 SMS", "Roaming: datos ilimitados 21 días en 30 países"] }
  ],
  fibra: [
    { id: 1, name: "Fibra 600 Megas",
      spec: "600 Mbps simétrica",
      includes: ["Incluye router"] },
    { id: 2, name: "Fibra 800 Megas",
      spec: "800 Mbps simétrica",
      includes: ["Incluye router", "Incluye Paramount+"] },
    { id: 3, name: "Fibra Giga",
      spec: "940 Mbps simétrica",
      includes: ["Incluye router WiFi 6"] }
  ],
  tv: [
    { id: 1, name: "Dúo Fibra 600 + TV Inicia",
      spec: "600 Mbps · TV Inicia HD",
      includes: ["95 canales + 10 nacionales", "Incluye router", "TV + HBO Max (c/anuncios)", "Disponible desde el 1° de junio"] },
    { id: 2, name: "Dúo Fibra 800 + TV Full",
      spec: "800 Mbps · TV Full HD",
      includes: ["102 canales + 10 nacionales", "Incluye router", "TV + HBO Max + Paramount+"] },
    { id: 3, name: "Dúo Fibra Giga + TV Pro",
      spec: "940 Mbps · TV Pro HD",
      includes: ["102 canales + 10 nacionales", "Router WiFi 6", "TV + HBO Max + Disney+"] }
  ],
  soloTv: [
    { id: 1, name: "TV Inicia",
      spec: "IPTV · Decodificador HD",
      includes: ["95 canales + 10 nacionales", "TV + HBO Max (c/anuncios)"] },
    { id: 2, name: "TV Full",
      spec: "IPTV · Decodificador HD",
      includes: ["102 canales + 10 nacionales", "TV + HBO Max"] },
    { id: 3, name: "TV Pro",
      spec: "IPTV · Decodificador HD",
      includes: ["102 canales + 10 nacionales", "TV + HBO Max + Disney+"] }
  ],
  full: [
    { id: 1, name: "Fibra 800 Megas + Móvil",
      spec: "Internet + Móvil",
      includes: ["Fibra 800 Megas + router incluido", "Plan Móvil Libre 400 GB · RRSS y minutos ilimitados", "Incluye SIM"] },
    { id: 2, name: "Dúo Fibra 800 Megas + TV Full + Móvil",
      spec: "Internet + TV + Móvil",
      includes: ["Fibra 800 Megas + router incluido", "TV Full HD · 102 canales + 10 nacionales", "Plan Móvil Libre 400 GB · RRSS y minutos ilimitados", "Incluye SIM"] }
  ]
};

const PLAN_EXTRA_NOTES = {
  movil: "Puedes agregar líneas adicionales; te confirmo el valor promocional vigente por WhatsApp.",
  fibra: "",
  tv: "",
  soloTv: ""
};

/* ---------- año footer ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- header: transparente arriba, sólido al hacer scroll ---------- */
const siteHeader = document.querySelector("header");
function updateHeaderOnScroll() {
  siteHeader.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

/* ---------- testimonios: reseñas reales de Google (vía Code.gs) ---------- */
(function(){
  const wrap = document.getElementById("testiWrap");
  const list = document.getElementById("testiList");
  const headline = document.getElementById("testiHeadline");
  const name = document.getElementById("testiName");
  const body = document.getElementById("testiBody");
  if (!list) return;

  let items = [];
  let active = 0;
  let timer = null;

  function starString(rating) {
    const n = Math.round(rating) || 0;
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }

  function renderList() {
    list.innerHTML = "";
    items.forEach((t, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "testi-avatar-btn" + (i === active ? " is-active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(i === active));
      btn.setAttribute("aria-label", t.name);
      btn.innerHTML = `
        <span class="testi-avatar-img" aria-hidden="true">${
          t.photo ? `<img src="${t.photo}" alt="" loading="lazy">` : t.avatar
        }</span>`;
      btn.addEventListener("click", () => {
        active = i;
        renderList();
        renderDetail();
        restartAutoplay();
      });
      list.appendChild(btn);
    });
  }

  function renderDetail() {
    const t = items[active];
    if (!t) return;
    body.textContent = t.body;
    name.textContent = t.name;
    headline.textContent = starString(t.rating);
  }

  function restartAutoplay() {
    if (timer) clearInterval(timer);
    if (items.length < 2) return;
    timer = setInterval(() => {
      active = (active + 1) % items.length;
      renderList();
      renderDetail();
    }, 5000);
  }

  async function loadReviews() {
    try {
      if (!CONFIG.scriptUrl || CONFIG.scriptUrl === "PENDIENTE_DESPLEGAR_CODE_GS") throw new Error("sin backend");
      const payload = { type: "getGoogleReviews", token: CONFIG.crmToken };
      const url = CONFIG.scriptUrl + "?data=" + encodeURIComponent(JSON.stringify(payload));
      const res = await fetch(url);
      const data = await res.json();
      if (data.error || !data.result || !data.result.reviews || !data.result.reviews.length) throw new Error("sin reseñas");

      items = data.result.reviews
        .filter(r => r.rating >= 4)
        .map(r => ({
          avatar: (r.author_name || "?").trim().charAt(0).toUpperCase(),
          photo: r.profile_photo_url || "",
          name: r.author_name || "Cliente",
          role: r.relative_time_description || "",
          rating: r.rating || 5,
          body: r.text || ""
        }));
      if (!items.length) throw new Error("sin reseñas de 4+ estrellas");

      if (wrap) wrap.hidden = false;
      renderList();
      renderDetail();
      restartAutoplay();
    } catch (err) {
      if (wrap) wrap.hidden = true;
    }
  }

  loadReviews();
})();

/* ---------- configurador de planes + CTA de WhatsApp ---------- */
(function(){
  const CATEGORY_LABELS = { movil: "Móvil", fibra: "Internet Hogar", tv: "Internet + TV", soloTv: "Solo TV", full: "Plan Ideal" };

  let category = "movil";
  let selectedId = 1;
  let fmcSelectedId = 1;

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
          </span>
          <span class="plan-spec">${plan.spec}</span>
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
    contractTrigger.href = planWhatsAppUrl(category, selectedId);
  }

  function planWhatsAppUrl(cat, selId) {
    const plan = PLANS[cat].find(p => p.id === selId);
    const text = `Hola Manu, quiero contratar ${plan.name} (${CATEGORY_LABELS[cat]})`;
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
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

  /* ---- Plan Ideal: fondo cambia según la tarjeta seleccionada, CTA de WhatsApp ---- */
  const fmcCards = document.querySelectorAll(".full-card[data-fmc-index]");
  const fmcBgImages = document.querySelectorAll(".full-bg-slideshow img");
  const fmcContratarBtn = document.getElementById("fmc-contratar");

  function fmcWhatsAppUrl(selId) {
    const plan = PLANS.full.find(p => p.id === selId);
    const text = `Hola Manu, quiero contratar ${plan.name} (Plan Ideal)`;
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  fmcCards.forEach(card => {
    card.addEventListener("click", () => {
      const idx = card.dataset.fmcIndex;
      fmcSelectedId = Number(idx) + 1;
      fmcCards.forEach(c => c.classList.toggle("is-selected", c === card));
      fmcBgImages.forEach(img => img.classList.toggle("is-visible", img.dataset.fmcBg === idx));
      if (fmcContratarBtn) fmcContratarBtn.href = fmcWhatsAppUrl(fmcSelectedId);
    });
  });
  if (fmcContratarBtn) fmcContratarBtn.href = fmcWhatsAppUrl(fmcSelectedId);
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
