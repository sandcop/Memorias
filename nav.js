/* ==========================================================
   Header + menú móvil + año del footer — versión mínima y
   autocontenida para páginas que no cargan script.js completo
   (blog.html, blog-post.html).
   ========================================================== */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const siteHeader = document.querySelector("header");
function updateHeaderOnScroll() {
  if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

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
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", openMobileMenu);
  mobileMenuClose.addEventListener("click", closeMobileMenu);
  mobileMenuBackdrop.addEventListener("click", closeMobileMenu);
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMobileMenu));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) closeMobileMenu();
  });
}
