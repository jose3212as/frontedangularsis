import { Component, AfterViewInit, OnDestroy, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

declare const window: any;

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
	<!-- START SECTION TOP  -->
	<section class="section-top">
		<div class="container">
			<div class="col-lg-10 offset-lg-1 text-center">
				<div class="section-top-title">
					<h1>Catálogo de Cursos</h1>
					<ul>
						<li><a href="index.html">Inicio</a></li>
						<li> / Cursos Especializados</li>
					</ul>
				</div>
			</div>
		</div>
	</section>	
	<!-- END SECTION TOP -->

	<!-- START COURSE SECTION  -->
	<div class="best-cpurse section-padding">
		<div class="container">
			<div class="section-title text-center">
				<h2>Cursos y Talleres Disponibles</h2>
				<p>Elige tu curso de especialización y <span><u>reserva tu vacante en tiempo real</u></span></p>
			</div>				
			
			<!-- Panel Completo de Filtros Avanzados -->
			<div class="row justify-content-center">
				<div class="col-12 col-xl-11">
					<div class="cursos-filter-card">
						<div class="row g-3 align-items-center">
							<!-- 1. Buscador en tiempo real -->
							<div class="col-lg-5 col-md-12">
								<label class="d-block text-muted mb-1" style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
									<i class="fa fa-search me-1"></i> Búsqueda Rápida
								</label>
								<div class="filter-search-box">
									<input type="text" id="buscador-cursos" class="filter-search-input" placeholder="Buscar por título, docente o tema..." oninput="buscarCursos(this.value)">
									<i class="fa fa-search filter-search-icon"></i>
								</div>
							</div>

							<!-- 2. Filtro por Rango de Precios -->
							<div class="col-lg-3 col-sm-6">
								<label class="d-block text-muted mb-1" style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
									<i class="fa fa-tag me-1"></i> Rango de Precio
								</label>
								<select id="filtro-precio" class="filter-control-select" onchange="cambiarFiltroPrecio(this.value)">
									<option value="TODOS">Todos los precios</option>
									<option value="HASTA_150">Económicos (Hasta S/ 150)</option>
									<option value="151_200">Intermedios (S/ 151 a S/ 200)</option>
									<option value="MAS_200">Especializados (Más de S/ 200)</option>
								</select>
							</div>

							<!-- 3. Ordenar por -->
							<div class="col-lg-4 col-sm-6">
								<label class="d-block text-muted mb-1" style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
									<i class="fa fa-sort me-1"></i> Ordenar Por
								</label>
								<select id="filtro-orden" class="filter-control-select" onchange="cambiarOrdenCursos(this.value)">
									<option value="DESTACADOS">Destacados / Por Defecto</option>
									<option value="PRECIO_ASC">Precio: de menor a mayor</option>
									<option value="PRECIO_DESC">Precio: de mayor a menor</option>
									<option value="TITULO_ASC">Título: Alfabético (A - Z)</option>
									<option value="VACANTES_DESC">Mayor cantidad de vacantes</option>
								</select>
							</div>
						</div>

						<!-- Fila Inferior: Tabs de Modalidad y Toggle de Vacantes -->
						<div class="row g-3 align-items-center mt-2 pt-2 border-top">
							<div class="col-lg-8 col-12">
								<div class="d-flex align-items-center flex-wrap gap-2">
									<span class="text-muted me-1" style="font-size: 12px; font-weight: 700; text-transform: uppercase;">Modalidad:</span>
									<div class="filter-pills-group">
										<button type="button" onclick="filtrarCursos('TODOS', this)" class="filter-pill-btn active filter-mod-btn">
											Todos
										</button>
										<button type="button" onclick="filtrarCursos('VIRTUAL', this)" class="filter-pill-btn filter-mod-btn">
											<i class="fa fa-video-camera text-primary"></i> Virtuales en Vivo
										</button>
										<button type="button" onclick="filtrarCursos('PRESENCIAL', this)" class="filter-pill-btn filter-mod-btn">
											<i class="fa fa-building text-warning"></i> Presenciales en Sede
										</button>
									</div>
								</div>
							</div>

							<div class="col-lg-4 col-12 d-flex justify-content-lg-end align-items-center">
								<label class="filter-checkbox-wrap">
									<input type="checkbox" id="filtro-vacantes" onchange="toggleSoloVacantes(this.checked)">
									<span>Solo con vacantes disponibles</span>
								</label>
							</div>
						</div>

						<!-- Barra de resumen de resultados -->
						<div class="filter-results-bar">
							<div>
								<span id="filtro-contador-text" style="color: #475569; font-weight: 600;">
									Cargando cursos disponibles...
								</span>
							</div>
							<div id="filtro-limpiar-box" style="display: none;">
								<button type="button" class="btn-reset-filters" onclick="limpiarFiltros()">
									<i class="fa fa-times-circle"></i> Limpiar filtros
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Grid de Cursos -->
			<div class="row" id="cursos-container"></div>
		</div>
	</div>
	<!-- END COURSE SECTION -->
  `
})
export class CatalogoComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private qSub?: Subscription;

  ngAfterViewInit(): void {
    this.qSub = this.route.queryParams.subscribe(() => {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.initCursosPage) {
          window.initCursosPage();
        }
      }, 20);
    });
  }

  ngOnDestroy(): void {
    this.qSub?.unsubscribe();
  }
}
