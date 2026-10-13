import { BASE } from './config.js';

/* ── Footer año ── */
document.getElementById('footer-year').textContent = new Date().getFullYear();

/*CARGAR EXPERIENCIAS DESDE BD*/
async function cargarExperiencias() {
  try {
    const res  = await fetch(`${BASE}/api/comentarios/get.php`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) return;

    pintarDestacada(data[0]);

    const grid = document.getElementById('gridExperiencias');
    grid.innerHTML = '';
    data.slice(1).forEach(c => {
      grid.insertAdjacentHTML('beforeend', tarjetaHTML(c));
    });

  } catch (e) {
    console.error('Error cargando experiencias:', e);
  }
}

function iniciales(nombre) {
  return nombre?.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) ?? '??';
}

function estrellas(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function valoracionHTML(etiqueta, valor) {
  return `
    <div class="rating-box">
      <span>${etiqueta}</span>
      <strong class="stars-yellow">${estrellas(Number(valor) || 0)}</strong>
    </div>`;
}

function fechaFormateada(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
}

function tituloPaquete(c) {
  return c.nombre_paquete || c.titulo_viaje || 'Paquete de viaje';
}

function resolverImagen(src) {
  if (!src) return null;
  if (/^(https?:)?\/\//i.test(src)) return src;
  if (src.startsWith('/')) return src;

  const limpia = src
    .replace(/^(\.\.\/)+/, '')
    .replace(/^frontend\//, '');

  return `${BASE}/frontend/${limpia}`;
}

function pintarDestacada(c) {
  document.querySelector('.card-featured-body .review-text').textContent  = `"${c.comentario}"`;
  document.querySelector('.card-featured-body .user-name').textContent    = c.autor_nombre;
  document.querySelector('.card-featured-body .user-pkg').textContent     = tituloPaquete(c);
  document.getElementById('destacada-estrellas').innerHTML =
    `${valoracionHTML('Experiencia', c.valoracion_viaje)}
     ${valoracionHTML('Agencia', c.valoracion_compania)}`;
  document.querySelector('.card-featured-body .date-muted').innerHTML     =
    `<i class="bi bi-calendar3 me-1"></i>${fechaFormateada(c.creado_at)}`;
  document.getElementById('destacada-destino').innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${tituloPaquete(c)}`;

  const imgDestacada = document.getElementById('destacada-img');
  if (imgDestacada && (c.foto_url || c.imagen_paquete)) {
    imgDestacada.src = resolverImagen(c.foto_url || c.imagen_paquete);
  }
}

function tarjetaHTML(c) {
  const imgSrc = resolverImagen(c.foto_url || c.imagen_paquete);

  return `
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card card-polaroid shadow-sm">
        <div class="polaroid-photo">
          ${imgSrc
            ? `<img src="${imgSrc}" class="card-img-top object-fit-cover" alt="${c.titulo_viaje}" />`
            : `<div style="background:linear-gradient(135deg,#0077B6,#00B4D8);width:100%;height:100%;position:absolute;top:0;left:0"></div>`

          }
        </div>
        <div class="card-body d-flex flex-column">
          <div class="mb-2">
            <p class="user-pkg mb-0">${tituloPaquete(c)}</p>
          </div>
          <p class="small text-muted mb-1">
            <i class="bi bi-geo-alt"></i> ${c.titulo_viaje}
          </p>
          <div class="ratings-polaroid">
            ${valoracionHTML('Experiencia', c.valoracion_viaje)}
            ${valoracionHTML('Agencia', c.valoracion_compania)}
          </div>
          <p class="card-text small text-muted">"${c.comentario}"</p>
          <div class="polaroid-footer">
            <span class="user-name fw-bold small">${c.autor_nombre}</span>
            <span class="small text-muted">
              <i class="bi bi-calendar3 me-1"></i>${fechaFormateada(c.creado_at)}
            </span>
          </div>
        </div>
      </div>
    </div>`;
}

cargarExperiencias();

/*ESTRELLAS INTERACTIVAS — VIAJE*/
const starBtns = document.querySelectorAll('#starRatingViaje .star-btn');
let valorSeleccionado = 0;

starBtns.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const v = +btn.dataset.val;
    starBtns.forEach(b => b.classList.toggle('activa', +b.dataset.val <= v));
  });
  btn.addEventListener('mouseleave', () => {
    starBtns.forEach(b => b.classList.toggle('activa', +b.dataset.val <= valorSeleccionado));
  });
  btn.addEventListener('click', () => {
    valorSeleccionado = +btn.dataset.val;
    starBtns.forEach(b => b.classList.toggle('activa', +b.dataset.val <= valorSeleccionado));
  });
});

/*ESTRELLAS INTERACTIVAS — COMPAÑÍA*/
const starBtnsCompania = document.querySelectorAll('#starRatingCompania .star-btn');
let valorCompania = 0;

starBtnsCompania.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const v = +btn.dataset.val;
    starBtnsCompania.forEach(b => b.classList.toggle('activa', +b.dataset.val <= v));
  });
  btn.addEventListener('mouseleave', () => {
    starBtnsCompania.forEach(b => b.classList.toggle('activa', +b.dataset.val <= valorCompania));
  });
  btn.addEventListener('click', () => {
    valorCompania = +btn.dataset.val;
    starBtnsCompania.forEach(b => b.classList.toggle('activa', +b.dataset.val <= valorCompania));
  });
});

/*DROPZONE FOTO*/
const dropzone  = document.getElementById('dropzonePub');
const fileInput = document.getElementById('fileInputPub');

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', e => {
  e.preventDefault();
  dropzone.style.background = '#d0eef8';
});
dropzone.addEventListener('dragleave', () => {
  dropzone.style.background = '';
});
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.style.background = '';
  const file = e.dataTransfer.files[0];
  if (file) mostrarArchivo(file.name);
});
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) mostrarArchivo(fileInput.files[0].name);
});

function mostrarArchivo(nombre) {
  dropzone.innerHTML = `
    <i class="bi bi-check-circle-fill" style="font-size:2rem;color:var(--cyan);display:block;margin-bottom:6px"></i>
    <p style="color:var(--navy);font-weight:700;margin:0">${nombre}</p>`;
}

/*PUBLICAR EXPERIENCIA*/
document.querySelector('#modalPublicar .btn-primary').addEventListener('click', async () => {
  const paquete_id   = document.getElementById('selectPaquete').value;
  const comentario   = document.querySelector('#modalPublicar textarea').value.trim();
  const titulo_viaje = comentario.split('\n')[0] || 'Mi experiencia';

  if (!paquete_id)        return alert('Selecciona un paquete');
  if (!valorSeleccionado) return alert('Añade una valoración del viaje');
  if (!valorCompania)     return alert('Añade una valoración de Turistea');
  if (!comentario)        return alert('Escribe tu experiencia');

   const formData = new FormData();
  formData.append('paquete_id', paquete_id);
  formData.append('titulo_viaje', titulo_viaje);
  formData.append('comentario', comentario);
  formData.append('valoracion_viaje', valorSeleccionado);
  formData.append('valoracion_compania', valorCompania);
  if (fileInput.files[0]) {
    formData.append('foto', fileInput.files[0]);
  }

  const res = await fetch(`${BASE}/api/comentarios/create.php`, {
    method: 'POST',
    body: formData
  });

  const data = await res.json();

  if (data.ok) {
    bootstrap.Modal.getInstance(document.getElementById('modalPublicar')).hide();
    cargarExperiencias();
  } else {
    alert(data.mensaje);
  }
});

/*SCROLL TOP*/
const btnArriba = document.getElementById('btn-volver-arriba-exp');
window.addEventListener('scroll', () => {
  btnArriba.classList.toggle('d-none', window.scrollY < 300);
});
