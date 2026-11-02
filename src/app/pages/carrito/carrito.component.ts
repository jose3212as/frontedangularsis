import { Component, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const window: any;

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
	<!-- START SECTION TOP  -->
	<section class="section-top">
		<div class="container">
			<div class="col-lg-10 offset-lg-1 text-center">
				<div class="section-top-title wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.3s" data-wow-offset="0">
					<h1>Carrito de Inscripción</h1>
					<ul>
						<li>Carrito de Matrícula</li>
					</ul>
				</div>
			</div>
		</div>
	</section>	
	<!-- END SECTION TOP -->
	
	<!-- Shopping Cart  -->
	<div class="shopping-cart section">
		<div class="container">
			
			<!-- Temporizador de Reserva de Vacante en Tiempo Real -->
			<div class="cart-timer-box d-none" id="cart-timer-box">
				<div class="d-flex align-items-center gap-3">
					<i class="fa fa-clock-o fs-2 text-warning"></i>
					<div>
						<h5 class="mb-0 fw-bold">¡Tu Vacante está Reservada en Tiempo Real!</h5>
						<small class="text-muted">El sistema bloquea temporalmente tu cupo para que nadie te lo gane mientras completas el pago.</small>
					</div>
				</div>
				<div class="text-end">
					<small class="d-block text-muted">Tiempo restante:</small>
					<span class="timer-digits" id="timer-text">15:00</span>
				</div>
			</div>

			<div id="cart-dynamic-area">
				<!-- Inyectado con la tabla Gestión de Cursos -->
			</div>
		</div>
	</div>
	<!--/ End Shopping Cart -->
  `
})
export class CarritoComponent implements AfterViewInit, OnDestroy {
  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && window.initCart) {
      window.initCart();
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && window.stopCartTimer) {
      window.stopCartTimer();
    }
  }
}
