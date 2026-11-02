(function() {
/**
 * carrito.js - Lógica del Carrito de Matrículas
 * Control de reservas, temporizador de vacante temporal (15 min),
 * cálculo dinámico de subtotales e IGV, y navegación hacia checkout
 * usando la arquitectura nativa de assets/css/shop.css y assets/css/style.css.
 */

let intervalTimer = null;

async function initCart() {
	try {
		const params = new URLSearchParams(window.location.search);
		const cid = params.get('cursoId') || params.get('id');
		if (cid) {
			let c = (typeof CONFIG !== 'undefined' && CONFIG.INITIAL_COURSES) ? CONFIG.INITIAL_COURSES.find(x => x.id === cid) : null;
			if (!c) {
				const cached = JSON.parse(localStorage.getItem('app_cursos_cache') || '[]');
				c = cached.find(x => x.id === cid);
			}
			if (c) {
				CartService.addToCart(c);
			}
			try {
				const url = new URL(window.location.href);
				url.searchParams.delete('cursoId');
				url.searchParams.delete('id');
				window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ''));
			} catch (_) {}
		}
	} catch (_) {}

	renderCart();
	actualizarNavbar();
}

function actualizarNavbar() {
	CartService.updateBadge();
	if (typeof AuthService !== 'undefined' && AuthService.updateNavbar) {
		AuthService.updateNavbar();
	}
}

function renderCart() {
	const area = document.getElementById('cart-dynamic-area');
	const timerBox = document.getElementById('cart-timer-box');
	const cart = CartService.getCart();
	if (!area) return;

	if (cart.length === 0) {
		if (timerBox) timerBox.classList.add('d-none');
		if (intervalTimer) clearInterval(intervalTimer);

		area.innerHTML = `
			<div class="row">
				<div class="col-12 text-center py-5">
					<i class="ti-shopping-cart text-muted" style="font-size: 72px;"></i>
					<h3 class="mt-3">Tu carrito de matrícula está vacío</h3>
					<p class="text-muted">No tienes ningún curso reservado en este momento.</p>
					<a href="cursos.html" class="btn_one mt-3">Ver Catálogo de Cursos</a>
				</div>
			</div>
		`;
		return;
	}

	if (timerBox) timerBox.classList.remove('d-none');
	activarTimer();

	const totals = CartService.getTotals();

	const rowsHtml = cart.map(item => {
		const isVirtual = item.modalidad === 'VIRTUAL';
		const badge = isVirtual
			? `<span class="badge-mod-virtual"><i class="fa fa-video-camera"></i> Virtual Zoom</span>`
			: `<span class="badge-mod-presencial"><i class="fa fa-building"></i> Presencial Sede</span>`;

		return `
			<tr>
				<td class="image" data-title="Curso">
					<img src="${item.imagen || 'assets/images/all-img/c1.png'}" alt="${item.titulo}">
				</td>
				<td class="product-des" data-title="Descripción">
					<p class="product-name"><a href="curso-detalle.html?id=${item.id}">${item.titulo}</a></p>
					<p class="product-des mb-1">${badge} &bull; Horario: ${item.horario || 'Horario asignado'}</p>
					<small class="text-muted"><i class="fa fa-user"></i> ${item.docente || 'Docente asignado'}</small>
				</td>
				<td class="price text-center" data-title="Precio">
					<span>S/ ${Number(item.precio).toFixed(2)}</span>
				</td>
				<td class="qty text-center" data-title="Vacante">
					<span class="badge bg-light text-dark p-2 border">1 Vacante</span>
				</td>
				<td class="total-amount text-center" data-title="Total">
					<span>S/ ${Number(item.precio).toFixed(2)}</span>
				</td>
				<td class="action text-center" data-title="Quitar">
					<a href="javascript:void(0)" onclick="quitar('${item.id}', event); return false;" title="Quitar curso del carrito">
						<i class="ti-trash remove-icon"></i>
					</a>
				</td>
			</tr>
		`;
	}).join('');

	area.innerHTML = `
		<div class="row">
			<div class="col-12">
				<table class="table shopping-summery">
					<thead>
						<tr class="main-hading">
							<th>CURSO</th>
							<th>DETALLE Y MODALIDAD</th>
							<th class="text-center">PRECIO</th>
							<th class="text-center">RESERVA</th>
							<th class="text-center">SUBTOTAL</th> 
							<th class="text-center"><i class="ti-trash remove-icon"></i></th>
						</tr>
					</thead>
					<tbody>
						${rowsHtml}
					</tbody>
				</table>
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<div class="total-amount">
					<div class="row align-items-center">
						<div class="col-lg-8 col-md-5 col-12">
							<div class="left">
								<div class="abmv mb-0">
									<span class="ti-shield"></span>
									<h4>Garantía de Pago y Reserva</h4>
									<p>Tu pago se procesa mediante la pasarela de Mercado Pago y tu Boleta o Factura electrónica se emite al instante junto con tus accesos por WhatsApp.</p>
								</div>
							</div>
						</div>
						<div class="col-lg-4 col-md-7 col-12">
							<div class="right">
								<ul>
									<li>Subtotal (sin IGV)<span>S/ ${totals.subtotal}</span></li>
									<li>I.G.V. (18%)<span>S/ ${totals.igv}</span></li>
									<li class="last">Total a Pagar<span>S/ ${totals.total}</span></li>
								</ul>
								<div class="button5">
									<a href="javascript:void(0)" onclick="procederAlPago(); return false;" class="btn">Continuar al Pago</a>
									<a href="cursos.html" class="btn">Seguir Explorando Cursos</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
}

function procederAlPago() {
	const cart = CartService.getCart();
	if (cart.length === 0) {
		Notifications.showToast('Tu carrito de matrícula está vacío.', 'warning');
		return;
	}

	if (!AuthService.isAuthenticated()) {
		window.location.href = 'login.html?redirect=checkout.html';
	} else {
		window.location.href = 'checkout.html';
	}
}

function quitar(id, ev) {
	if (ev) {
		if (ev.preventDefault) ev.preventDefault();
		if (ev.stopPropagation) ev.stopPropagation();
	}
	if (!id) return false;
	CartService.removeFromCart(id);
	renderCart();
	actualizarNavbar();
	if (typeof Notifications !== 'undefined' && Notifications.showToast) {
		Notifications.showToast('Curso eliminado del carrito.', 'info');
	}
	return false;
}

function activarTimer() {
	if (intervalTimer) clearInterval(intervalTimer);

	const timerEl = document.getElementById('timer-text');
	if (!timerEl) return;

	CartService.startReservationTimer();

	const updateTimerDisplay = () => {
		const res = CartService.getRemainingTime();
		if (!res) return;

		timerEl.textContent = res.formatted;

		if (res.expired) {
			clearInterval(intervalTimer);
			Notifications.showToast('El tiempo de reserva de vacante ha expirado.', 'warning');
		}
	};

	updateTimerDisplay();
	intervalTimer = setInterval(updateTimerDisplay, 1000);
}

window.quitar = quitar;
window.procederAlPago = procederAlPago;
window.initCart = initCart;
window.renderCart = renderCart;
window.stopCartTimer = function() {
	if (intervalTimer) {
		clearInterval(intervalTimer);
		intervalTimer = null;
	}
};
})();
