import { Component, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const window: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
	<!-- START SECTION TOP -->
	<section class="section-top">
		<div class="container">
			<div class="col-lg-10 offset-lg-1 text-center">
				<div class="section-top-title">
					<h1>Finalizar Matrícula</h1>
					<ul>
						<li>Pago de Matrícula</li>
					</ul>
				</div>
			</div>
		</div>
	</section>	
	<!-- END SECTION TOP -->
	
	<!-- Start Checkout (Arquitectura nativa shop.css) -->
	<section class="shop checkout section">
		<div class="container">
			<div class="row"> 
				<!-- Columna Izquierda: Datos de Facturación -->
				<div class="col-lg-8 col-12">
					<div class="checkout-form">
						<h2>Datos de Facturación</h2>
						<p>Verifica o completa tus datos para emitir tu comprobante electrónico y enviarte los accesos.</p>
						
						<!-- Aviso solo si no ha iniciado sesión -->
						<div id="user-status-card"></div>

						<form class="form" id="checkout-form">
							<div class="row">
								<div class="col-lg-6 col-md-6 col-12">
									<div class="form-group">
										<label>Nombres<span>*</span></label>
										<input type="text" id="chk-nombres" placeholder="Ej. Carlos" required>
									</div>
								</div>
								<div class="col-lg-6 col-md-6 col-12">
									<div class="form-group">
										<label>Apellidos<span>*</span></label>
										<input type="text" id="chk-apellidos" placeholder="Ej. Alarcón Gómez" required>
									</div>
								</div>
								<div class="col-lg-6 col-md-6 col-12">
									<div class="form-group">
										<label>DNI / Documento<span>*</span></label>
										<input type="text" id="chk-dni" placeholder="8 dígitos" maxlength="12" required>
									</div>
								</div>
								<div class="col-lg-6 col-md-6 col-12">
									<div class="form-group">
										<label>WhatsApp<span>*</span></label>
										<input type="tel" id="chk-whatsapp" placeholder="999 555 666" maxlength="12" required>
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<label>Correo Electrónico<span>*</span></label>
										<input type="email" id="chk-correo" placeholder="correo@ejemplo.com" required>
									</div>
								</div>

								<!-- Tipo de Comprobante -->
								<div class="col-12">
									<div class="form-group">
										<label>Tipo de Comprobante<span>*</span></label>
										<div class="d-flex gap-4 mt-2 p-3" style="background: #F6F7FB;">
											<label class="mb-0" style="cursor: pointer;">
												<input type="radio" name="tipoComp" id="comp-boleta" value="BOLETA" checked onchange="toggleFactura(false)" style="width: auto; height: auto; margin-right: 6px;">
												Boleta de Venta
											</label>
											<label class="mb-0" style="cursor: pointer;">
												<input type="radio" name="tipoComp" id="comp-factura" value="FACTURA" onchange="toggleFactura(true)" style="width: auto; height: auto; margin-right: 6px;">
												Factura (con RUC)
											</label>
										</div>
									</div>
								</div>

								<!-- Campos adicionales solo para Factura -->
								<div id="box-factura" class="col-12 d-none">
									<div class="row">
										<div class="col-lg-6 col-md-6 col-12">
											<div class="form-group">
												<label>RUC<span>*</span></label>
												<input type="text" id="chk-ruc" placeholder="20601234567" maxlength="11">
											</div>
										</div>
										<div class="col-lg-6 col-md-6 col-12">
											<div class="form-group">
												<label>Razón Social<span>*</span></label>
												<input type="text" id="chk-razon" placeholder="Nombre de la empresa">
											</div>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>

				<!-- Columna Derecha: Resumen y Botón de Pago (shop.css .order-details) -->
				<div class="col-lg-4 col-12">
					<div class="order-details">
						<!-- Resumen de Matrícula -->
						<div class="single-widget">
							<h2>RESUMEN DE MATRÍCULA</h2>
							<div class="content">
								<ul id="order-items-list">
									<!-- Cursos inyectados dinámicamente -->
								</ul>
								<ul>
									<li>Subtotal<span id="side-subtotal">S/ 0.00</span></li>
									<li>I.G.V. (18%)<span id="side-igv">S/ 0.00</span></li>
									<li class="last">Total a Pagar<span id="side-total">S/ 0.00</span></li>
								</ul>
							</div>
						</div>

						<!-- Método de Pago -->
						<div class="single-widget">
							<h2>MÉTODO DE PAGO</h2>
							<div class="content">
								<div class="checkbox">
									<label class="checkbox-inline checked">
										<input name="metodoPago" type="radio" checked> Mercado Pago (Tarjetas, Yape y Plin)
									</label>
								</div>
							</div>
						</div>

						<!-- Botón Principal de Pago -->
						<div class="single-widget get-button">
							<div class="content">
								<div class="button">
									<button type="submit" form="checkout-form" id="btn-pago" class="btn" style="cursor: pointer; border: none;">
										Pagar con Mercado Pago
									</button>
								</div>

								<!-- Acciones de confirmación cuando se abre la pasarela de Mercado Pago -->
								<div id="mp-modal-container" class="d-none mt-3 pt-3 border-top text-start">
									<p class="small text-muted mb-2">
										Completa tu operación en la ventana de Mercado Pago y luego confirma tu matrícula:
									</p>
									<div class="button mb-2">
										<button type="button" id="btn-mp-confirmar-pago" onclick="finalizarMatriculaMp()" class="btn" style="background: #2eca7f; cursor: pointer; border: none;">
											Ya pagué - Ver mi Comprobante
										</button>
									</div>
									<div class="text-center">
										<a id="btn-mp-open-direct" href="#" target="_blank" rel="noopener noreferrer" class="small text-muted" style="text-decoration: underline;">
											Volver a abrir ventana de Mercado Pago
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!--/ End Checkout -->
  `
})
export class CheckoutComponent implements AfterViewInit, OnDestroy {
  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && window.initCheckout) {
      window.initCheckout();
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && window.stopCheckoutTimer) {
      window.stopCheckoutTimer();
    }
  }
}
