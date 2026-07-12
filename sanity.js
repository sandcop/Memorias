/* ==========================================================
   Cliente de solo lectura para Sanity (dataset público, sin token).
   Usado por index.html (teaser del blog), blog.html (listado) y
   blog-post.html (artículo individual).
   ========================================================== */
const SANITY = { projectId: "7kcrutnz", dataset: "production" };

function escHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sanityQuery(groq, params) {
  let url = `https://${SANITY.projectId}.apicdn.sanity.io/v2024-01-01/data/query/${SANITY.dataset}?query=${encodeURIComponent(groq)}`;
  if (params) {
    Object.keys(params).forEach(key => {
      url += `&$${key}=${encodeURIComponent(JSON.stringify(params[key]))}`;
    });
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("No se pudo conectar con el blog");
  const data = await res.json();
  return data.result;
}

/* Convierte el cuerpo del post (texto plano, párrafos separados por
   línea en blanco) en HTML seguro. */
function bodyToHtml(body) {
  return String(body || "")
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${escHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
