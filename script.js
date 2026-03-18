/*
  Lógica simple sin backend:
  - Lee el parámetro ?empresa=...
  - Muestra el nombre de la empresa en carga.html
  - Valida monto (no vacío, no 0)
  - Simula confirmación y muestra mensaje en pantalla
*/

const EMPRESAS = {
  personal: "Personal",
  tuenti: "Tuenti",
  claro: "Claro",
};

function getEmpresaFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("empresa") || "").trim().toLowerCase();
  return raw;
}

function getMontoFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("monto") || "").trim();
  return raw;
}

function formatEmpresa(raw) {
  return EMPRESAS[raw] || "Empresa desconocida";
}

function isPositiveInteger(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 && Number.isInteger(n);
}

function setToast(el, { type, text }) {
  el.className = "toast";
  el.classList.add(type === "success" ? "toast--success" : "toast--error");
  el.textContent = text;
  el.hidden = false;
}

function initCargaPage() {
  const empresaNombreEl = document.getElementById("empresaNombre");
  const form = document.getElementById("formCarga");
  const montoInput = document.getElementById("monto");
  const mensajeEl = document.getElementById("mensaje");

  if (!empresaNombreEl || !form || !montoInput || !mensajeEl) return;

  const empresaRaw = getEmpresaFromUrl();
  empresaNombreEl.textContent = formatEmpresa(empresaRaw);

  // Si no viene empresa válida, igual dejamos la pantalla usable.
  // (La validación de empresa no es requisito; solo mostramos el nombre dinámico.)

  const validate = () => {
    const ok = isPositiveInteger(montoInput.value);
    montoInput.classList.toggle("is-invalid", !ok);
    return ok;
  };

  montoInput.addEventListener("input", () => {
    // Validación suave: solo marcamos estado mientras el usuario tipea.
    if (montoInput.value === "") montoInput.classList.remove("is-invalid");
    else validate();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validate()) {
      setToast(mensajeEl, {
        type: "error",
        text: "Ingresá un monto válido (mayor a 0).",
      });
      return;
    }

    const empresa = empresaRaw;
    const monto = Number(montoInput.value);
    const url = new URL("./exito.html", window.location.href);
    url.searchParams.set("empresa", empresa);
    url.searchParams.set("monto", String(monto));
    window.location.assign(url.toString());
  });
}

function initExitoPage() {
  const empresaEl = document.getElementById("exitoEmpresa");
  const montoEl = document.getElementById("exitoMonto");
  const confettiEl = document.getElementById("confetti");
  const reintentarLink = document.getElementById("reintentarLink");

  if (!empresaEl || !montoEl || !confettiEl || !reintentarLink) return;

  const empresaRaw = getEmpresaFromUrl();
  empresaEl.textContent = formatEmpresa(empresaRaw);
  reintentarLink.href = `./carga.html?empresa=${encodeURIComponent(empresaRaw || "")}`;

  const montoRaw = getMontoFromUrl();
  const monto = Number(montoRaw);
  if (Number.isFinite(monto) && monto > 0) {
    montoEl.textContent = `Monto: $${monto}`;
    montoEl.hidden = false;
  }

  // Confetti simple con elementos DOM. Sin canvas, sin librerías.
  // Respeta prefers-reduced-motion: si el usuario lo pidió, no animamos.
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduceMotion) return;

  const colors = ["#7c5cff", "#22c55e", "#fb7185", "#38bdf8", "#fbbf24", "#a78bfa"];
  const pieces = 36;

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti__piece";

    const left = Math.random() * 100;
    const dx = (Math.random() * 2 - 1) * 160; // deriva lateral
    const rot = (Math.random() * 2 - 1) * 520;
    const duration = 1700 + Math.random() * 1200;
    const delay = Math.random() * 280;

    piece.style.left = `${left}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--dx", `${dx}px`);
    piece.style.setProperty("--rot", `${rot}deg`);
    piece.style.animationDuration = `${duration}ms`;
    piece.style.animationDelay = `${delay}ms`;

    confettiEl.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initCargaPage();
  initExitoPage();
});

