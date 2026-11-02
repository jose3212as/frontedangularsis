import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const window: any;

@Component({
  selector: 'app-estudiante-panel',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
	<!-- START SECTION TOP  -->
	<section class="section-top">
		<div class="container">
			<div class="col-lg-10 offset-lg-1 text-center">
				<div class="section-top-title wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.3s">
					<h1>Portal del Estudiante</h1>
					<ul>
						<li><a href="index.html">Inicio</a></li>
						<li> / Mis Cursos y Accesos</li>
					</ul>
				</div>
			</div>
		</div>
	</section>	
	<!-- END SECTION TOP -->

	<!-- CONTENIDO DEL PORTAL -->
	<div class="best-cpurse section-padding">
		<div class="container">
			<div class="section-title">
			  <h2>Mis Cursos Matriculados</h2>
			  <p>Accede directamente a tu <span><u>enlace de Zoom / Meet</u></span> o consulta tu <span><u>aula física</u></span></p>
			</div>

			<div class="row g-4" id="mis-cursos-list">
				<!-- Inyectado dinámicamente según el usuario que ingrese -->
			</div>
		</div>
	</div>
  `
})
export class EstudiantePanelComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && window.initMisCursos) {
      window.initMisCursos();
    }
  }
}
