import { Component, AfterViewInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

declare const window: any;
declare const Notifications: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
	<!-- START HOME HERO -->
	<section id="home" class="home_bg">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-lg-6 col-sm-6 col-xs-12">	
					<div class="home_content">
						<h1>Capacitación <span>Profesional</span> en Vivo y Presencial</h1>
						<p>Inscripción 100% automatizada: Elige tu curso, reserva tu vacante en tiempo real sin sobreventa, paga seguro con Mercado Pago y recibe al instante tu boleta y tus accesos de Zoom o Aula por WhatsApp.</p>						
					</div>
					<div class="home_btn">
						<a href="cursos.html" class="cta"><span>Explorar Cursos</span>
						  <svg width="13px" height="10px" viewBox="0 0 13 10">
							<path d="M1,5 L11,5"></path>
							<polyline points="8 1 12 5 8 9"></polyline>
						  </svg>
						</a>
					</div>		
				</div><!-- END COL-->
				<div class="col-lg-6 col-sm-6 col-xs-12">	
					<div class="home_me_img">
						<img src="assets/images/all-img/home-image.png" class="img-fluid" alt="Estudiantes Gestión de Cursos" />
						<div class="home_ps">
							<img src="assets/images/icon/user2.svg" alt="" />
							<h2>100%</h2>
							<span>Vacantes en Tiempo Real</span>
						</div>
						<div class="home_ps2">
							<img src="assets/images/icon/file2.svg" alt="" />
							<h2>Zoom & Sede</h2>
							<span>Modalidad Virtual / Física</span>
						</div>
					</div>		
				</div><!-- END COL-->
			</div><!--- END ROW -->			
		</div><!--- END CONTAINER -->
	</section>
	<!-- END HOME HERO -->

	<!-- START TOP PROMO FEATURES  -->
	<section class="tp_feature">
	   <div class="container-fluid">			
			<div class="row">					
				<div class="col-lg-4 col-sm-4 col-xs-12 no-padding wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
					<div class="single_tp">
						<h3>Cero Sobreventa de Vacantes</h3>
						<p>Control automático que descuenta los cupos en el momento exacto en que compras, garantizando tu asiento en el aula física o tu cupo en Zoom.</p>
						<a href="cursos.html" class="cta"><span>Ver Cursos Disponibles</span>
						  <svg width="13px" height="10px" viewBox="0 0 13 10"><path d="M1,5 L11,5"></path><polyline points="8 1 12 5 8 9"></polyline></svg>
						</a>
					</div>
				</div>			
				<div class="col-lg-4 col-sm-4 col-xs-12 no-padding wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
					<div class="single_tp">
						<h3>Pago Seguro con Mercado Pago</h3>
						<p>Paga en línea al instante con tarjeta de crédito, débito o Yape/Plin mediante pasarela cifrada sin esperar transferencias manuales.</p>
						<a href="carrito.html" class="cta"><span>Conocer Pasarela</span>
						  <svg width="13px" height="10px" viewBox="0 0 13 10"><path d="M1,5 L11,5"></path><polyline points="8 1 12 5 8 9"></polyline></svg>
						</a>
					</div>
				</div>			
				<div class="col-lg-4 col-sm-4 col-xs-12 no-padding wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s">
					<div class="single_tp">
						<h3>WhatsApp & Boleta Inmediatos</h3>
						<p>Recibe tu Boleta o Factura electrónica al instante y un mensaje automático a tu WhatsApp con los enlaces de clase o dirección del laboratorio.</p>
						<a href="mis-cursos.html" class="cta"><span>Mis Matrículas</span>
						  <svg width="13px" height="10px" viewBox="0 0 13 10"><path d="M1,5 L11,5"></path><polyline points="8 1 12 5 8 9"></polyline></svg>
						</a>
					</div>
				</div>							
			</div>
		</div>
	</section>
	<!-- END TOP PROMO FEATURES -->	

	<!-- START ABOUT US  -->
	<section class="ab_one section-padding">
		<div class="container">									
			<div class="row align-items-center">								
				<div class="col-lg-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
					<div class="ab_img">
						<img src="assets/images/all-img/about1.png" class="img-fluid" alt="Acerca de Gestión de Cursos">
					</div>
				</div>					
				<div class="col-lg-6 col-sm-12 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s">
					<div class="ab_content">
						<h2>Aprende con <u><span>las dos modalidades</span></u> que mejor se adaptan a ti.</h2>
						<p>Hemos renovado por completo nuestra plataforma web para eliminar las demoras administrativas y ofrecerte confirmaciones al segundo.</p>
					</div>
					<div class="abmv">
						<span class="ti-video-camera"></span>
						<h4>Clases Virtuales en Vivo</h4>
						<p>Dictadas en tiempo real mediante Zoom y Google Meet con chat interactivo, docente en vivo y resolución de dudas.</p>
					</div>
					<div class="abmv">
						<span class="ti-home"></span>
						<h4>Clases Presenciales en Sede</h4>
						<p>Laboratorios de cómputo y aulas físicas equipadas con asignación estricta de carpetas para garantizar tu comodidad.</p>
					</div>	
					<a class="btn_one" href="cursos.html">Explorar Todos los Cursos</a>
				</div>								  
			</div>
		</div>
	</section>
	<!-- END ABOUT US -->

	<!-- START COURSE SECTION  -->
	<div class="best-cpurse section-padding" id="cursos-section">
		<div class="container">
			<div class="section-title">
			  <h2>Cursos Destacados</h2>
			  <p>Capacitación profesional en vivo con <span><u>vacantes limitadas en tiempo real</u></span></p>
			</div>				
			
			<!-- Filtros de Modalidad -->
			<div class="text-center mb-5">
				<button onclick="filtrarCursos('TODOS', this)" class="btn_one me-2 mb-2 filter-mod-btn" style="cursor: pointer;">Todos los Cursos</button>
				<button onclick="filtrarCursos('VIRTUAL', this)" class="btn_two me-2 mb-2 filter-mod-btn" style="cursor: pointer;"><i class="fa fa-video-camera"></i> Virtuales en Vivo</button>
				<button onclick="filtrarCursos('PRESENCIAL', this)" class="btn_two mb-2 filter-mod-btn" style="cursor: pointer;"><i class="fa fa-building"></i> Presenciales en Sede</button>
			</div>

			<!-- Grid de Cursos Gestión de Cursos con .course-slide -->
			<div class="row" id="cursos-container"></div>

			<div class="row mt-4">
				<div class="col-12 text-center">
					<a href="cursos.html" class="btn_one" style="padding: 13px 32px; font-size: 15px; font-weight: 800; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
						<i class="fa fa-graduation-cap"></i> Ver Catálogo Completo de Cursos <i class="fa fa-arrow-right"></i>
					</a>
				</div>
			</div>
		</div>
	</div>
	<!-- END COURSE SECTION -->

	<!-- START CONTACT SECTION (DISEÑO MODERNO) -->
	<section class="section-contact-modern" id="contacto">
		<div class="container">
			<div class="row align-items-center g-5">
				<!-- Columna Izquierda: Información de Contacto -->
				<div class="col-lg-5 col-md-12">
					<div class="contact-info-wrapper">
						<span class="contact-eyebrow"><i class="fa fa-headphones me-1"></i> Contáctanos</span>
						<h2 class="contact-main-heading">
							Comunícate con <span class="highlight-coral-word">Nosotros<svg class="handdrawn-stroke" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M 0 15 Q 50 0 100 12" stroke="#2eca7f" stroke-width="4" fill="none" stroke-linecap="round"></path></svg></span>
						</h2>
						<p class="contact-subtext">
							¿Tienes dudas sobre nuestros cursos, matrículas o certificaciones universitarias? Nuestro equipo de soporte académico está listo para ayudarte en todo momento.
						</p>

						<div class="contact-items-list">
							<!-- Item 1: Correo Electrónico -->
							<div class="contact-item-card">
								<div class="contact-icon-box icon-box-pink">
									<i class="fa fa-envelope-o"></i>
								</div>
								<div class="contact-item-content">
									<h4 class="contact-item-title">Correo Electrónico :</h4>
									<a href="mailto:soporte@cursos.com" class="contact-item-link">soporte@cursos.com</a>
								</div>
							</div>

							<!-- Item 2: Teléfonos de Contacto -->
							<div class="contact-item-card">
								<div class="contact-icon-box icon-box-teal">
									<i class="fa fa-phone"></i>
								</div>
								<div class="contact-item-content">
									<h4 class="contact-item-title">Llámanos o WhatsApp :</h4>
									<a href="tel:+51999555666" class="contact-item-link">+51 999 555 666</a>, <a href="tel:+5113118888" class="contact-item-link">+51 (01) 311 8888</a>
								</div>
							</div>

							<!-- Item 3: Sede Central -->
							<div class="contact-item-card">
								<div class="contact-icon-box icon-box-yellow">
									<i class="fa fa-map-marker"></i>
								</div>
								<div class="contact-item-content">
									<h4 class="contact-item-title">Sede Central :</h4>
									<p class="contact-item-text mb-0">Av. Universitaria 1801, San Miguel, Lima, Perú</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Columna Derecha: Tarjeta con Formulario de Contacto -->
				<div class="col-lg-7 col-md-12">
					<div class="contact-form-card">
						<form id="homeContactForm" (submit)="onContactSubmit($event)">
							<div class="row g-3">
								<div class="col-md-6 col-12">
									<input type="text" class="form-control contact-input" placeholder="Nombre Completo *" required>
								</div>
								<div class="col-md-6 col-12">
									<input type="email" class="form-control contact-input" placeholder="Correo Electrónico *" required>
								</div>
								<div class="col-md-6 col-12">
									<input type="text" class="form-control contact-input" placeholder="Asunto o Curso de Interés *" required>
								</div>
								<div class="col-md-6 col-12">
									<input type="tel" class="form-control contact-input" placeholder="Teléfono o WhatsApp">
								</div>
								<div class="col-12">
									<textarea class="form-control contact-textarea" rows="4" placeholder="Escribe aquí tu mensaje o consulta... *" required></textarea>
								</div>
								<div class="col-12">
									<button type="submit" class="btn btn-contact-submit">
										<i class="fa fa-paper-plane me-2"></i> Enviar Mensaje
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</section>
  `
})
export class HomeComponent implements AfterViewInit {
  private route = inject(ActivatedRoute);

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && window.initHome) {
      window.initHome();
    }
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  }

  onContactSubmit(event: Event): void {
    event.preventDefault();
    if (typeof Notifications !== 'undefined') {
      if (Notifications.success) {
        Notifications.success('¡Gracias por comunicarte con nosotros! Te responderemos a la brevedad.');
      } else if (Notifications.showToast) {
        Notifications.showToast('¡Gracias por comunicarte con nosotros! Te responderemos a la brevedad.', 'success');
      }
    }
    const form = event.target as HTMLFormElement;
    if (form && form.reset) form.reset();
  }
}
