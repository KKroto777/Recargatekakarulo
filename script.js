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

    setToast(mensajeEl, {
      type: "success",
      text: "Carga realizada con éxito",
    });

    // Simulación: limpiar input para que sea claro que ya se procesó.
    montoInput.value = "";
    montoInput.focus();
    montoInput.classList.remove("is-invalid");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCargaPage();
});

