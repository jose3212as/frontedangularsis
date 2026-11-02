import { Component, AfterViewInit, OnDestroy, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';

declare const window: any;

@Component({
  selector: 'app-curso-detalle',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
	<!-- START SECTION TOP -->
	<section class="section-top">
		<div class="container">
			<div class="col-lg-10 offset-lg-1 text-center">
				<div class="section-top-title">
					<h1 id="page-course-title">Detalle de Capacitación</h1>
					<ul>
						<li>Cursos / Detalle</li>
					</ul>
				</div>
			</div>
		</div>
	</section>	
	<!-- END SECTION TOP -->
	
	<!-- Product Details Area  -->
	<div class="prdct_dtls_page_area section-padding">
		<div class="container">
			<div class="row">
				<!-- Product Details Image -->
				<div class="col-md-6 col-xs-12">
					<div class="pd_img fix">
						<a class="venobox" id="course-img-link" href="assets/images/all-img/c1.png">
							<img id="course-main-img" src="assets/images/all-img/c1.png" class="img-fluid" alt="Curso Gestión de Cursos"/>
						</a>
					</div>
				</div>
				<!-- Product Details Content -->
				<div class="col-md-6 col-xs-12">
					<div class="prdct_dtls_content">
						<div class="mb-2" id="course-modality-badge-box">
							<span class="badge-mod-virtual"><i class="fa fa-video-camera"></i> Clases Virtuales en Vivo (Zoom / Meet)</span>
						</div>
						<a class="pd_title" href="javascript:void(0)" id="course-name-heading">Desarrollo Web Integrado con Spring Boot</a>
						
						<div class="pd_price_dtls fix">
							<div class="pd_price">
								<span class="new" id="course-price-display">S/ 150.00</span>
							</div>
							<div class="pd_ratng">
								<div class="rtngs">
									<i class="fa fa-star"></i>
									<i class="fa fa-star"></i>
									<i class="fa fa-star"></i>
									<i class="fa fa-star"></i>
									<i class="fa fa-star"></i>
									<span>(5.0)</span>
								</div>
							</div>
						</div>

						<div class="pd_text">
							<h4>Descripción y Objetivos:</h4>
							<p id="course-overview-text">Domina el desarrollo con Spring Boot, arquitectura de microservicios, seguridad con JWT y despliegue empresarial.</p>
						</div>

						<!-- Especificación de Modalidad y Aforo -->
						<div class="pd_img_size fix">
							<h4>Modalidad de Dictado:</h4>
							<a href="javascript:void(0)" class="active" id="btn-modalidad-info" style="width: auto; padding: 0 15px;">VIRTUAL EN VIVO</a>
						</div>

						<div id="modality-location-box" class="p-3 bg-light rounded mb-3 border">
							<div class="d-flex align-items-center"><i class="fa fa-video-camera text-primary me-3 fa-2x"></i><div><strong>Plataforma Online:</strong> Google Meet / Zoom en Vivo<br><small class="text-muted">Horario: Lun y Mie 19:00 - 22:00 | Enlace enviado al instante por WhatsApp</small></div></div>
						</div>

						<!-- Control de Cupos y Aforo -->
						<div class="mb-4">
							<h4>Control de Vacantes en Tiempo Real:</h4>
							<div id="seats-live-status-container">
								<span class="seats-live-badge"><i class="fa fa-table"></i> Quedan 29 vacantes libres de 30</span>
							</div>
						</div>

						<!-- Product Action -->
						<div class="pd_btn fix">
							<button id="btn-enroll-action" class="btn btn-default acc_btn" style="cursor: pointer;">
								<i class="fa fa-shopping-cart me-1"></i> Inscribirme
							</button>
							<a href="carrito.html" class="btn btn-default acc_btn btn_icn"><i class="fa fa-shopping-bag"></i></a>
							<a href="cursos.html" class="btn btn-default acc_btn btn_icn"><i class="fa fa-arrow-left"></i></a>
						</div>

						<div class="pd_share_area fix mt-3">
							<h4>Garantías de la plataforma:</h4>
							<ul class="text-muted small ps-3">
								<li><i class="fa fa-check text-success"></i> Descuento de cupo en tiempo real (cero sobreventa).</li>
								<li><i class="fa fa-credit-card text-primary"></i> Pago protegido con pasarela oficial de Mercado Pago.</li>
								<li><i class="fa fa-whatsapp text-success"></i> Envío automático a tu WhatsApp con los enlaces de clase o aula física.</li>
								<li><i class="fa fa-file-text-o text-info"></i> Emisión inmediata de Boleta o Factura electrónica SUNAT.</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Pestañas Gestión de Cursos: Description, Information, Reviews -->
			<div class="row">
				<div class="col-xs-12">					
					<div class="pd_tab_area fix">									
						<ul class="pd_tab_btn nav nav-tabs" role="tablist">
						  <li>
							<a [class.active]="activeTab === 'description'" href="javascript:void(0)" (click)="selectTab('description')" role="tab">Temario del Curso</a>
						  </li>
						  <li>
							<a [class.active]="activeTab === 'information'" href="javascript:void(0)" (click)="selectTab('information')" role="tab">Modalidad & Acceso</a>
						  </li>
						  <li>
							<a [class.active]="activeTab === 'reviews'" href="javascript:void(0)" (click)="selectTab('reviews')" role="tab">Docente & Reseñas</a>
						  </li>
						</ul>

						<!-- Tab panes -->
						<div class="tab-content">
							<div role="tabpanel" class="tab-pane fade" [class.show]="activeTab === 'description'" [class.active]="activeTab === 'description'" id="description">
								<div id="tab-temario-content">Contenido completo del curso...</div>
							</div>

							<div role="tabpanel" class="tab-pane fade" [class.show]="activeTab === 'information'" [class.active]="activeTab === 'information'" id="information">
								<div id="tab-info-modality"></div>
							</div>

							<div role="tabpanel" class="tab-pane fade" [class.show]="activeTab === 'reviews'" [class.active]="activeTab === 'reviews'" id="reviews">
								<div class="pda_rtng_area fix">
									<h4>5.0 <span>(Calificación)</span></h4>
									<span>Basado en opiniones de alumnos egresados</span>
								</div>
								<div class="rtng_cmnt_area fix">
									<div class="single_rtng_cmnt">
										<div class="rtngs">
											<i class="fa fa-star"></i>
											<i class="fa fa-star"></i>
											<i class="fa fa-star"></i>
											<i class="fa fa-star"></i>
											<i class="fa fa-star"></i>
										</div>
										<div class="rtng_author">
											<h3 id="docente-tab-name">Docente Certificado</h3>
											<span>Especialista en la materia</span>
										</div>
										<p>Excelente metodología 100% práctica. La plataforma me entregó al instante de pagar el acceso por WhatsApp y no tuve ningún problema para ingresar a la clase.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
  `
})
export class CursoDetalleComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private sub?: Subscription;
  activeTab: 'description' | 'information' | 'reviews' = 'description';

  ngAfterViewInit(): void {
    this.sub = combineLatest([this.route.params, this.route.queryParams]).subscribe(([params, queryParams]) => {
      const routeId = params['id'] || queryParams['id'];
      if (routeId && !window.location.search.includes('id=')) {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('id', routeId);
          window.history.replaceState({}, '', url.toString());
        } catch (_) {}
      }
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.initDetalle) {
          window.initDetalle();
        }
      }, 20);
    });
  }

  selectTab(tab: 'description' | 'information' | 'reviews'): void {
    this.activeTab = tab;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
