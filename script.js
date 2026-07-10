/* ==========================================================
   CONFIG — edita aquí sin tocar el resto del código
   ========================================================== */
const CONFIG = {
  whatsapp: "56961017402"
};

/* ==========================================================
   PLANES — EDITA AQUÍ nombre, precio, spec y descripción.
   Los valores actuales son de ejemplo para visualizar el diseño.
   ========================================================== */
const PLANS = {
  movil: [
    { id: 1, name: "[Plan Básico Móvil]",   price: "[Precio]", spec: "[GB] · 5G", desc: "[Para quién es este plan y qué incluye, en una línea.]" },
    { id: 2, name: "[Plan Estándar Móvil]", price: "[Precio]", spec: "[GB] · 5G", desc: "[Para quién es este plan y qué incluye, en una línea.]" },
    { id: 3, name: "[Plan Premium Móvil]",  price: "[Precio]", spec: "[GB] · 5G", desc: "[Para quién es este plan y qué incluye, en una línea.]" }
  ],
  fibra: [
    { id: 1, name: "[Plan Básico Fibra]",   price: "[Precio]", spec: "[Velocidad] simétrica", desc: "[Para quién es este plan y qué incluye, en una línea.]" },
    { id: 2, name: "[Plan Estándar Fibra]", price: "[Precio]", spec: "[Velocidad] simétrica", desc: "[Para quién es este plan y qué incluye, en una línea.]" },
    { id: 3, name: "[Plan Premium Fibra]",  price: "[Precio]", spec: "[Velocidad] simétrica", desc: "[Para quién es este plan y qué incluye, en una línea.]" }
  ]
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

/* ---------- configurador de planes ---------- */
(function(){
  let category = "movil";
  let selectedId = 1;

  const movilBtn  = document.getElementById("movilBtn");
  const fibraBtn  = document.getElementById("fibraBtn");
  const planList  = document.getElementById("planList");
  const whatsappCta = document.getElementById("elige-plan-whatsapp");

  function updatePhoto() {
    document.querySelectorAll(".plan-photo").forEach(p => p.classList.remove("is-visible"));
    const target = document.getElementById(`planPhoto-${category}-${selectedId}`);
    if (target) target.classList.add("is-visible");
  }

  function updateWhatsappLink() {
    const plan = PLANS[category].find(p => p.id === selectedId);
    const msg = `Hola Manu, quiero cotizar el ${plan.name} (${category === "movil" ? "Móvil" : "Fibra"})`;
    whatsappCta.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
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
            <span class="plan-price">${plan.price}<small> /mes</small></span>
          </span>
          <span class="plan-spec">${plan.spec}</span>
          <p>${plan.desc}</p>
        </span>`;
      card.addEventListener("click", () => {
        selectedId = plan.id;
        renderPlans();
        updatePhoto();
        updateWhatsappLink();
      });
      planList.appendChild(card);
    });
  }

  function setCategory(next) {
    category = next; selectedId = 1;
    movilBtn.setAttribute("aria-pressed", String(next === "movil"));
    fibraBtn.setAttribute("aria-pressed", String(next === "fibra"));
    renderPlans(); updatePhoto(); updateWhatsappLink();
  }

  movilBtn.addEventListener("click", () => setCategory("movil"));
  fibraBtn.addEventListener("click", () => setCategory("fibra"));

  renderPlans();
  updatePhoto();
  updateWhatsappLink();
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
