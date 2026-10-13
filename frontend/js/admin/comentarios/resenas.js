import { obtener, crear } from "../../utils/fetch.js";
import { BASE } from "../../config.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnResenasAdmin");
  const contenido = document.getElementById("contenido");
  let resenasActuales = [];

  if (!btn || !contenido) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    await cargarResenas();
  });

  async function cargarResenas() {
    contenido.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="text-muted mt-2">Cargando reseñas...</p>
      </div>`;

    const resenas = await obtener("/api/comentarios/admin_listar.php");

    if (!Array.isArray(resenas)) {
      contenido.innerHTML = '<div class="alert alert-danger text-center mt-4">Error al cargar las reseñas.</div>';
      return;
    }

    resenasActuales = resenas;
    contenido.innerHTML = renderResenas(resenas);
    activarModalResena();
  }

  function renderResenas(resenas) {
    return `
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 class="fw-bold mb-0">Gestión de reseñas</h2>
          <small class="text-muted">Total: ${resenas.length} reseñas</small>
        </div>
      </div>

      <div class="table-responsive shadow-sm rounded bg-white">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Imagen</th>
              <th>Paquete</th>
              <th>Cliente</th>
              <th>Reseña</th>
              <th class="text-center">Valoraciones</th>
              <th class="text-center">Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${resenas.length === 0
              ? '<tr><td colspan="7" class="text-center text-muted py-4">No hay reseñas.</td></tr>'
              : resenas.map(renderFila).join("")}
          </tbody>
        </table>
      </div>

      <div class="modal fade" id="modalEditarResena" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <form class="modal-content" id="formEditarResena">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Editar reseña</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="edit-resena-id" />

              <div class="row g-3 align-items-center mb-3">
                <div class="col-sm-auto">
                  <img id="edit-resena-preview" class="admin-resena-thumb" src="" alt="Imagen de la reseña" style="width:96px;height:72px;object-fit:cover;" />
                </div>
                <div class="col">
                  <label for="edit-foto" class="form-label">Imagen</label>
                  <input type="file" class="form-control" id="edit-foto" accept="image/jpeg,image/png,image/webp,image/gif" />
                  <small class="text-muted">Déjala vacía para mantener la imagen actual.</small>
                </div>
              </div>

              <div class="mb-3">
                <label for="edit-titulo-viaje" class="form-label">Título</label>
                <input type="text" class="form-control" id="edit-titulo-viaje" maxlength="150" required />
              </div>

              <div class="mb-3">
                <label for="edit-comentario" class="form-label">Comentario</label>
                <textarea class="form-control" id="edit-comentario" rows="5" required></textarea>
              </div>

              <div class="row g-3">
                <div class="col-md-4">
                  <label for="edit-valoracion-viaje" class="form-label">Valoración viaje</label>
                  <select class="form-select" id="edit-valoracion-viaje" required>
                    ${opcionesValoracion()}
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="edit-valoracion-compania" class="form-label">Valoración agencia</label>
                  <select class="form-select" id="edit-valoracion-compania" required>
                    ${opcionesValoracion()}
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="edit-estado" class="form-label">Estado</label>
                  <select class="form-select" id="edit-estado" required>
                    <option value="APROBADA">Aprobada</option>
                    <option value="PENDIENTE">Pendiente</option>
                  </select>
                </div>
              </div>

              <div class="alert d-none mt-3 mb-0" id="edit-resena-feedback"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-danger me-auto" id="btn-eliminar-resena-modal">
                <i class="bi bi-trash me-1"></i>Eliminar
              </button>
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary" id="btn-guardar-resena">
                <i class="bi bi-save me-1"></i>Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>`;
  }

  function renderFila(r) {
    const fecha = r.creado_at
      ? new Date(r.creado_at).toLocaleDateString("es-ES")
      : "-";

    return `
      <tr class="admin-resena-row" data-id="${r.id}" role="button" tabindex="0" title="Editar reseña">
        <td>
          <img class="admin-resena-thumb" src="${escaparAttr(imagenResena(r))}" alt="${escaparAttr(r.titulo_viaje || "Reseña")}" />
        </td>
        <td>
          <div class="fw-semibold">${escapar(r.paquete_titulo || "Sin paquete")}</div>
          <small class="text-muted">${escapar(r.paquete_destino || "")}</small>
        </td>
        <td>
          <div class="fw-semibold">${escapar(`${r.autor_nombre || ""} ${r.autor_apellidos || ""}`.trim() || "Cliente")}</div>
          <small class="text-muted">${escapar(r.autor_email || "")}</small>
        </td>
        <td style="min-width: 260px;">
          <div class="fw-semibold">${escapar(r.titulo_viaje || "Sin título")}</div>
          <small class="text-muted d-block">${escapar(r.comentario || "")}</small>
        </td>
        <td class="text-center small">
          <div><span class="text-muted">Viaje:</span> <span class="text-warning">${estrellas(r.valoracion_viaje)}</span></div>
          <div><span class="text-muted">Agencia:</span> <span class="text-warning">${estrellas(r.valoracion_compania)}</span></div>
        </td>
        <td class="text-center">${badgeEstado(r.estado)}</td>
        <td><small class="text-muted">${fecha}</small></td>
      </tr>`;
  }

  function activarModalResena() {
    const modalEl = document.getElementById("modalEditarResena");
    const form = document.getElementById("formEditarResena");
    const inputFoto = document.getElementById("edit-foto");
    const btnEliminar = document.getElementById("btn-eliminar-resena-modal");
    if (!modalEl || !form) return;

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.querySelectorAll(".admin-resena-row").forEach((fila) => {
      const abrir = () => {
        const resena = resenasActuales.find((item) => String(item.id) === String(fila.dataset.id));
        if (!resena) return;

        document.getElementById("edit-resena-id").value = resena.id;
        document.getElementById("edit-titulo-viaje").value = resena.titulo_viaje || "";
        document.getElementById("edit-comentario").value = resena.comentario || "";
        document.getElementById("edit-valoracion-viaje").value = String(resena.valoracion_viaje || 5);
        document.getElementById("edit-valoracion-compania").value = String(resena.valoracion_compania || 5);
        document.getElementById("edit-estado").value = resena.estado || "APROBADA";
        document.getElementById("edit-resena-preview").src = imagenResena(resena);
        inputFoto.value = "";
        mostrarFeedbackEdicion("", "");
        modal.show();
      };

      fila.addEventListener("click", abrir);
      fila.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          abrir();
        }
      });
    });

    inputFoto?.addEventListener("change", () => {
      const archivo = inputFoto.files?.[0];
      if (!archivo) return;
      document.getElementById("edit-resena-preview").src = URL.createObjectURL(archivo);
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btnGuardar = document.getElementById("btn-guardar-resena");
      btnGuardar.disabled = true;

      const formData = new FormData();
      formData.append("id", document.getElementById("edit-resena-id").value);
      formData.append("titulo_viaje", document.getElementById("edit-titulo-viaje").value.trim());
      formData.append("comentario", document.getElementById("edit-comentario").value.trim());
      formData.append("valoracion_viaje", document.getElementById("edit-valoracion-viaje").value);
      formData.append("valoracion_compania", document.getElementById("edit-valoracion-compania").value);
      formData.append("estado", document.getElementById("edit-estado").value);
      if (inputFoto?.files?.[0]) formData.append("foto", inputFoto.files[0]);

      const texto = await crear("/api/comentarios/update.php", formData);

      const respuesta = parsear(texto);
      btnGuardar.disabled = false;

      if (!respuesta?.ok) {
        mostrarFeedbackEdicion(respuesta?.mensaje || "No se pudo actualizar la reseña.", "danger");
        return;
      }

      modal.hide();
      await cargarResenas();
    });

    btnEliminar?.addEventListener("click", async () => {
      const id = Number(document.getElementById("edit-resena-id").value);
      const titulo = document.getElementById("edit-titulo-viaje").value || "esta reseña";
      if (!confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return;

      btnEliminar.disabled = true;
      const texto = await crear("/api/comentarios/delete.php", { id });
      const respuesta = parsear(texto);
      btnEliminar.disabled = false;

      if (!respuesta?.ok) {
        mostrarFeedbackEdicion(respuesta?.mensaje || "No se pudo eliminar la reseña.", "danger");
        return;
      }

      modal.hide();
      await cargarResenas();
    });
  }
});

function opcionesValoracion() {
  return [1, 2, 3, 4, 5]
    .map((valor) => `<option value="${valor}">${valor} ${valor === 1 ? "estrella" : "estrellas"}</option>`)
    .join("");
}

function mostrarFeedbackEdicion(mensaje, tipo) {
  const feedback = document.getElementById("edit-resena-feedback");
  if (!feedback) return;

  if (!mensaje) {
    feedback.className = "alert d-none mt-3 mb-0";
    feedback.textContent = "";
    return;
  }

  feedback.className = `alert alert-${tipo} mt-3 mb-0`;
  feedback.textContent = mensaje;
}

function imagenResena(resena) {
  const src = resena.foto_url || resena.paquete_imagen || "";
  if (!src) return `${BASE}/frontend/assets/img/default.jpg`;
  if (/^https?:\/\//i.test(src)) return src;

  const limpio = src.replace(/^\.\.\//, "");
  return `${BASE}/frontend/${limpio}`;
}

function estrellas(valor) {
  const n = Math.max(0, Math.min(5, Number(valor) || 0));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function badgeEstado(estado) {
  const clase = estado === "PENDIENTE" ? "bg-warning text-dark" : "bg-success";
  return `<span class="badge ${clase}">${escapar(estado || "APROBADA")}</span>`;
}

function parsear(texto) {
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

function escapar(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escaparAttr(valor) {
  return escapar(valor).replaceAll("`", "&#096;");
}
