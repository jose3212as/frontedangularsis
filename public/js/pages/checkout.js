(function() {
/**
 * checkout.js - Lógica del Proceso de Pago y Emisión de Comprobantes
 * Arquitectura nativa de shop.css (.shop.checkout, .checkout-form, .order-details, .single-widget)
 */

let tipoComp = 'BOLETA';
let metodoPagoSeleccionado = 'TARJETA';
let currentPendingMpOrder = null;
let timerInterval = null;

function selectMetodoPago(metodo) {
	metodoPagoSeleccionado = 'TARJETA';
	actualizarBotonPago();
}

function actualizarBotonPago() {
	const btn = document.getElementById('btn-pago');
	if (!btn) return;
	btn.setAttribute('data-method', 'TARJETA');
	btn.textContent = 'Pagar con Mercado Pago';
}

function renderUserStatusCard() {
	const card = document.getElementById('user-status-card');
	const user = AuthService.getCurrentUser();

	if (user) {
		if (card) card.innerHTML = '';

		const chkNom = document.getElementById('chk-nombres');
		if (chkNom && !chkNom.value) chkNom.value = user.nombres || 'Carlos';
		const chkApe = document.getElementById('chk-apellidos');
		if (chkApe && !chkApe.value) chkApe.value = user.apellidos || 'Alarcón';
		const chkCorreo = document.getElementById('chk-correo');
		if (chkCorreo && !chkCorreo.value) chkCorreo.value = user.correo || 'estudiante@cursos.com';
		const chkDni = document.getElementById('chk-dni');
		if (chkDni && !chkDni.value) chkDni.value = user.dni || '30000003';
		const chkWa = document.getElementById('chk-whatsapp');
		if (chkWa && !chkWa.value) chkWa.value = user.whatsapp ? user.whatsapp.replace('+51', '').trim() : '999555666';
	} else if (card) {
		card.innerHTML = `
			<div class="abmv mb-4">
				<span class="ti-user"></span>
				<h4>Inicia sesión para continuar</h4>
				<p class="mb-2">Necesitas ingresar con tu cuenta de alumno para registrar tu matrícula.</p>
				<a href="login.html?redirect=checkout.html" class="btn_one me-2">Iniciar Sesión</a>
				<a href="registro.html?redirect=checkout.html" class="btn_two">Crear Cuenta</a>
			</div>
		`;
	}
}

function cerrarSesionCheckout() {
	AuthService.logout(null);
	window.location.replace('login.html?redirect=checkout.html');
}

async function cargarUsuarioDemoCheckout() {
	try {
		const res = await AuthService.login('estudiante@cursos.com', '123456');
		Notifications.showToast(`¡Bienvenido, ${res.user.nombres}!`, 'success');
		renderUserStatusCard();
		actualizarBotonPago();
	} catch (err) {
		Notifications.showToast('Error: ' + err.message, 'error');
	}
}

function startCheckoutTimer() {
	if (timerInterval) clearInterval(timerInterval);
	const timerEl = document.getElementById('ck-timer-text');
	if (!timerEl) return;

	CartService.startReservationTimer();

	const tick = () => {
		const t = CartService.getRemainingTime();
		if (t) {
			timerEl.textContent = t.formatted;
			if (t.expired) {
				timerEl.textContent = '00:00';
			}
		}
	};
	tick();
	timerInterval = setInterval(tick, 1000);
}

function copiarTarjetaPrueba(numero) {
	if (!numero) numero = '4067430000000001';
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(numero).then(() => {
			Notifications.showToast('¡Tarjeta copiada!: ' + numero, 'success');
		});
	}
}

function initCheckout() {
	const urlParams = new URLSearchParams(window.location.search);
	const mpStatus = urlParams.get('status') || urlParams.get('collection_status');
	if (mpStatus === 'approved') {
		Notifications.showToast('¡Pago aprobado en Mercado Pago! Confirmando tu matrícula...', 'success');
		setTimeout(() => finalizarMatriculaMp(), 500);
		return;
	}

	let cart = CartService.getCart();
	if (cart.length === 0) {
		const container = document.querySelector('.shop.checkout .container');
		if (container) {
			container.innerHTML = `
				<div class="row">
					<div class="col-12 text-center py-5">
						<i class="ti-shopping-cart text-muted" style="font-size: 72px;"></i>
						<h3 class="mt-3">Tu carrito de matrícula está vacío</h3>
						<p class="text-muted">Selecciona un curso del catálogo para proceder al pago.</p>
						<a href="cursos.html" class="btn_one mt-3">Ver Catálogo de Cursos</a>
					</div>
				</div>
			`;
		}
		CartService.updateBadge();
		AuthService.updateNavbar();
		return;
	}

	renderUserStatusCard();

	const totals = CartService.getTotals();
	const elSub = document.getElementById('side-subtotal');
	if (elSub) elSub.textContent = `S/ ${totals.subtotal}`;
	const elIgv = document.getElementById('side-igv');
	if (elIgv) elIgv.textContent = `S/ ${totals.igv}`;
	const elTot = document.getElementById('side-total');
	if (elTot) elTot.textContent = `S/ ${totals.total}`;

	const list = document.getElementById('order-items-list');
	if (list) {
		list.innerHTML = cart.map(c => `
			<li>${c.titulo}<span>S/ ${Number(c.precio).toFixed(2)}</span></li>
		`).join('');
	}

	startCheckoutTimer();
	actualizarBotonPago();

	CartService.updateBadge();
	AuthService.updateNavbar();

	const form = document.getElementById('checkout-form');
	if (form) {
		form.onsubmit = ejecutarPago;
	}
}

function toggleFactura(isFactura) {
	tipoComp = isFactura ? 'FACTURA' : 'BOLETA';
	const boxFactura = document.getElementById('box-factura');
	if (boxFactura) boxFactura.classList.toggle('d-none', !isFactura);

	const ruc = document.getElementById('chk-ruc');
	const razon = document.getElementById('chk-razon');
	if (isFactura) {
		if (ruc) ruc.setAttribute('required', 'true');
		if (razon) razon.setAttribute('required', 'true');
	} else {
		if (ruc) ruc.removeAttribute('required');
		if (razon) razon.removeAttribute('required');
	}
}

async function ejecutarPago(e) {
	if (e && e.preventDefault) e.preventDefault();

	const user = AuthService.getCurrentUser();
	if (!user) {
		Notifications.showToast('Por favor inicia sesión para matricularte.', 'warning');
		const card = document.getElementById('user-status-card');
		if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
		return;
	}

	const cart = CartService.getCart();
	if (cart.length === 0) return;

	let mpWindow = null;
	try {
		mpWindow = window.open('about:blank', '_blank');
		if (mpWindow) {
			mpWindow.document.write(`
				<!DOCTYPE html>
				<html lang="es">
				<head><meta charset="utf-8"><title>Conectando con Mercado Pago</title></head>
				<body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
					<div style="text-align: center;">
						<h3>Conectando con Mercado Pago...</h3>
						<p>Preparando tu pasarela de pago.</p>
					</div>
				</body>
				</html>
			`);
		}
	} catch (_) {}

	const btn = document.getElementById('btn-pago');
	if (btn) {
		btn.disabled = true;
		btn.textContent = 'Conectando con Mercado Pago...';
	}

	const nombres = (document.getElementById('chk-nombres') ? document.getElementById('chk-nombres').value.trim() : '') || user.nombres || 'Carlos';
	const apellidos = (document.getElementById('chk-apellidos') ? document.getElementById('chk-apellidos').value.trim() : '') || user.apellidos || 'Alarcón';
	const dni = (document.getElementById('chk-dni') ? document.getElementById('chk-dni').value.trim() : '') || user.dni || '30000003';
	const whatsapp = (document.getElementById('chk-whatsapp') ? document.getElementById('chk-whatsapp').value.trim() : '') || user.whatsapp || '999555666';
	const correo = (document.getElementById('chk-correo') ? document.getElementById('chk-correo').value.trim() : '') || user.correo || 'estudiante@cursos.com';
	const docIdent = tipoComp === 'FACTURA' ? (document.getElementById('chk-ruc') ? document.getElementById('chk-ruc').value || '20601234567' : '20601234567') : dni;

	const estId = user.id || 'a0000000-0000-0000-0000-000000000003';

	AuthService.updateProfile({
		nombres: nombres,
		apellidos: apellidos,
		dni: dni,
		whatsapp: whatsapp,
		correo: correo
	});

	try {
		const pedido = await PedidosService.crearPedido(cart[0].id, estId);

		const payInfo = {
			metodoPago: 'Mercado Pago',
			tipoComprobante: tipoComp,
			clienteNombres: `${nombres} ${apellidos}`.trim(),
			docIdentidad: docIdent,
			whatsapp: whatsapp,
			correo: correo
		};

		currentPendingMpOrder = { pedido, payInfo };
		sessionStorage.setItem('pending_mp_order', JSON.stringify(currentPendingMpOrder));

		let prefData = null;
		if (pedido && pedido.initPoint) {
			prefData = { id: pedido.mpPreferenceId || pedido.codigoOrden, initPoint: pedido.initPoint };
		} else {
			const prefPayload = {
				titulo: cart[0].titulo || 'Curso Gestión de Cursos',
				cantidad: 1,
				precio: parseFloat(cart[0].precio) || 150.00
			};

			try {
				prefData = await API.request('/pagos/crear-preferencia', {
					method: 'POST',
					body: JSON.stringify(prefPayload)
				});
			} catch (_) {
				const resDir = await fetch('http://localhost:8083/api/pagos/crear-preferencia', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(prefPayload)
				});
				prefData = await resDir.json();
			}
		}

		if (!prefData || !prefData.initPoint) {
			throw new Error('No se pudo generar la preferencia de Mercado Pago.');
		}

		const modalMp = document.getElementById('mp-modal-container');
		const btnOpen = document.getElementById('btn-mp-open-direct');

		if (btnOpen) {
			btnOpen.href = prefData.initPoint;
		}
		if (modalMp) {
			modalMp.classList.remove('d-none');
		}

		if (mpWindow && !mpWindow.closed) {
			mpWindow.location.href = prefData.initPoint;
		}

		Notifications.showToast('Completa tu pago en la ventana de Mercado Pago.', 'success');
		if (btn) {
			btn.disabled = false;
			btn.textContent = 'Pagar con Mercado Pago';
		}

	} catch (err) {
		Notifications.showToast('Error en Mercado Pago: ' + err.message, 'error');
		if (mpWindow && !mpWindow.closed) {
			mpWindow.close();
		}
		if (btn) {
			btn.disabled = false;
			actualizarBotonPago();
		}
	}
}

async function ejecutarPagoDirectoDemo() {
	await finalizarMatriculaMp();
}

async function finalizarMatriculaMp() {
	const btnConfirm = document.getElementById('btn-mp-confirmar-pago');
	if (btnConfirm) {
		btnConfirm.disabled = true;
		btnConfirm.textContent = 'Confirmando pago...';
	}

	let orderData = currentPendingMpOrder;
	if (!orderData) {
		const saved = sessionStorage.getItem('pending_mp_order');
		if (saved) {
			try { orderData = JSON.parse(saved); } catch (_) {}
		}
	}

	try {
		if (orderData && orderData.pedido) {
			await PedidosService.procesarPagoMercadoPago(orderData.pedido, orderData.payInfo);
		} else {
			const cart = CartService.getCart();
			const user = AuthService.getCurrentUser();
			if (cart.length > 0 && user) {
				const nuevoPedido = await PedidosService.crearPedido(cart[0].id, user.id);
				const payInfo = {
					metodoPago: 'Mercado Pago',
					tipoComprobante: tipoComp || 'BOLETA',
					clienteNombres: `${user.nombres || ''} ${user.apellidos || ''}`.trim() || 'Alumno',
					docIdentidad: user.dni || '30000003',
					whatsapp: user.whatsapp || '999555666',
					correo: user.correo || 'estudiante@cursos.com'
				};
				await PedidosService.procesarPagoMercadoPago(nuevoPedido, payInfo);
			}
		}

		sessionStorage.removeItem('pending_mp_order');
		Notifications.showToast('¡Pago recibido con éxito!', 'success');
		CartService.clearCart();

		setTimeout(() => {
			window.location.href = 'confirmacion.html';
		}, 600);
	} catch (err) {
		Notifications.showToast('Error al confirmar matrícula: ' + err.message, 'error');
		if (btnConfirm) {
			btnConfirm.disabled = false;
			btnConfirm.textContent = 'Reintentar confirmación';
		}
	}
}

window.selectMetodoPago = selectMetodoPago;
window.actualizarBotonPago = actualizarBotonPago;
window.renderUserStatusCard = renderUserStatusCard;
window.cerrarSesionCheckout = cerrarSesionCheckout;
window.cargarUsuarioDemoCheckout = cargarUsuarioDemoCheckout;
window.copiarTarjetaPrueba = copiarTarjetaPrueba;
window.toggleFactura = toggleFactura;
window.ejecutarPago = ejecutarPago;
window.ejecutarPagoDirectoDemo = ejecutarPagoDirectoDemo;
window.finalizarMatriculaMp = finalizarMatriculaMp;
window.initCheckout = initCheckout;
window.stopCheckoutTimer = function() {
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = null;
	}
};
})();
