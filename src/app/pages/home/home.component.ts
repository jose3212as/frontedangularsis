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
						<a href="beneficios.html?tema=vacantes" class="cta"><span>Ver Cursos Disponibles</span>
						  <svg width="13px" height="10px" viewBox="0 0 13 10"><path d="M1,5 L11,5"></path><polyline points="8 1 12 5 8 9"></polyline></svg>
						</a>
					</div>
				</div>			
				<div class="col-lg-4 col-sm-4 col-xs-12 no-padding wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
					<div class="single_tp">
						<h3>Pago Seguro con Mercado Pago</h3>
						<p>Paga en línea al instante con tarjeta de crédito, débito o Yape/Plin mediante pasarela cifrada sin esperar transferencias manuales.</p>
						<a href="beneficios.html?tema=pasarela" class="cta"><span>Conocer Pasarela</span>
						  <svg width="13px" height="10px" viewBox="0 0 13 10"><path d="M1,5 L11,5"></path><polyline points="8 1 12 5 8 9"></polyline></svg>
						</a>
					</div>
				</div>			
				<div class="col-lg-4 col-sm-4 col-xs-12 no-padding wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s">
					<div class="single_tp">
						<h3>WhatsApp & Boleta Inmediatos</h3>
						<p>Recibe tu Boleta o Factura electrónica al instante y un mensaje automático a tu WhatsApp con los enlaces de clase o dirección del laboratorio.</p>
						<a href="beneficios.html?tema=boleta" class="cta"><span>Mis Matrículas</span>
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
}
