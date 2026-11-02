import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const window: any;

@Component({
  selector: 'app-docente-panel',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
	<!-- START SECTION TOP  -->
	<section class="section-top">
		<div class="container">
			<div class="col-lg-10 offset-lg-1 text-center">
				<div class="section-top-title">
					<h1><i class="fa fa-briefcase me-2"></i>Portal del Docente</h1>
					<ul>
						<li><a href="index.html">Inicio</a></li>
						<li> / Gestión de Cursos y Aulas</li>
					</ul>
				</div>
			</div>
		</div>
	</section>	
	<!-- END SECTION TOP -->

	<!-- CONTENIDO DEL PORTAL DOCENTE -->
	<div class="section-padding" style="background: #f8fafc; min-height: 70vh;">
		<div class="container">
			
			<!-- PERFIL DOCENTE Y MÉTRICAS (DISEÑO ABIERTO Y HUMANO) -->
			<div class="row mb-4">
				<div class="col-12">
					<div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 border-bottom" style="border-color: #e2e8f0 !important;">
						<div class="d-flex align-items-center gap-3">
							<div style="width: 48px; height: 48px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 22px;">
								<i class="fa fa-user"></i>
							</div>
							<div>
								<div class="d-flex align-items-center gap-2">
									<h3 id="docente-nombre-header" style="font-size: 19px; font-weight: 800; color: #0f172a; margin: 0;">Prof. Roberto Mendoza</h3>
									<span class="badge bg-success bg-opacity-10 text-success fw-bold" style="font-size: 11px;">Docente Oficial</span>
								</div>
								<span id="docente-correo-header" style="font-size: 13.5px; color: #64748b;">docente@cursos.com</span>
							</div>
						</div>
						<div class="d-flex align-items-center gap-4">
							<div>
								<span class="text-muted text-uppercase" style="font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">Cursos a Cargo</span>
								<div id="docente-total-cursos" style="font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.1;">-</div>
							</div>
							<div style="width: 1px; height: 30px; background: #e2e8f0;"></div>
							<div>
								<span class="text-muted text-uppercase" style="font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">Alumnos Inscritos</span>
								<div id="docente-total-alumnos" style="font-size: 22px; font-weight: 800; color: #16a34a; line-height: 1.1;">-</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- PESTAÑAS DE TRABAJO (SUBRAYADO MINIMALISTA) -->
			<div class="row mb-3">
				<div class="col-12">
					<div class="platform-tabs-wrapper">
						<div class="platform-tabs-nav" role="tablist">
							<button type="button" class="platform-tab-btn active" id="tab-btn-cursos" onclick="switchDocenteTab('cursos')">
								<i class="fa fa-book me-1"></i>
								<span>Mis Cursos Asignados</span>
								<span class="platform-tab-badge" id="docente-tab-badge-cursos">-</span>
							</button>
							<button type="button" class="platform-tab-btn" id="tab-btn-alumnos" onclick="switchDocenteTab('alumnos')">
								<i class="fa fa-users me-1"></i>
								<span>Lista de Alumnos Matriculados</span>
								<span class="platform-tab-badge" id="docente-tab-badge-alumnos">-</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- SECCIÓN 1: MIS CURSOS ASIGNADOS -->
			<div id="seccion-cursos-docente">
				<div class="row" id="docente-cursos-container">
					<div class="col-12 text-center py-5">
						<i class="fa fa-spinner fa-spin fa-2x text-primary mb-2"></i>
						<p class="text-muted">Cargando tus cursos asignados...</p>
					</div>
				</div>
			</div>

			<!-- SECCIÓN 2: LISTA DE ALUMNOS MATRICULADOS -->
			<div id="seccion-alumnos-docente" style="display: none;">
				<div class="clean-surface">
					<div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
						<div>
							<h4 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">
								<i class="fa fa-users text-success me-2"></i>Nómina Real de Estudiantes Matriculados
							</h4>
							<p class="text-muted" style="font-size: 13.5px; margin: 0;">Estudiantes reales registrados en la base de datos con matrícula confirmada:</p>
						</div>
						<div class="d-flex flex-wrap align-items-center gap-2">
							<div class="input-group input-group-sm" style="width: 260px;">
								<span class="input-group-text bg-white border-end-0"><i class="fa fa-search text-muted"></i></span>
								<input type="text" id="buscador-alumnos-docente" class="form-control border-start-0" placeholder="Buscar por alumno, DNI o correo..." oninput="filtrarAlumnosDocenteEnTabla(this.value)">
							</div>
							<select id="select-curso-participantes" class="form-select form-select-sm" style="min-width: 260px; font-weight: 600;" onchange="cargarAlumnosDeCurso(this.value)">
								<option value="TODOS">-- Todos mis cursos asignados --</option>
							</select>
							<button type="button" class="btn btn-sm btn-outline-secondary" onclick="window.print()" title="Imprimir lista">
								<i class="fa fa-print"></i> Imprimir
							</button>
						</div>
					</div>

					<div class="table-responsive">
						<table class="table table-hover align-middle" style="font-size: 13.5px;">
							<thead style="background: #f8fafc; color: #475569; font-weight: 700;">
								<tr>
									<th style="width: 40px;">#</th>
									<th>Estudiante</th>
									<th>Curso Asignado</th>
									<th>Correo Electrónico</th>
									<th>WhatsApp</th>
									<th>Fecha de Matrícula</th>
									<th>Estado</th>
									<th>Comprobante</th>
								</tr>
							</thead>
							<tbody id="tabla-participantes-body">
								<tr>
									<td colspan="8" class="text-center py-4 text-muted">
										<i class="fa fa-spinner fa-spin me-2"></i>Cargando nómina oficial de alumnos...
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

		</div>
	</div>

	<!-- MODAL: ACTUALIZAR ENLACE DE CLASE (VIRTUAL) -->
	<div id="modal-actualizar-enlace" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.7); z-index: 9999999; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
		<div style="background: #ffffff; border-radius: 16px; padding: 28px 24px; max-width: 500px; width: 92%; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);">
			<h4 style="font-weight: 800; color: #0f172a; margin-bottom: 6px;">
				<i class="fa fa-video-camera text-primary me-2"></i>Actualizar Enlace de Clase en Vivo
			</h4>
			<p class="text-muted" style="font-size: 13px;">Los alumnos matriculados verán este enlace de inmediato en su portal para conectarse a clase.</p>
			
			<input type="hidden" id="edit-enlace-curso-id">
			
			<div class="form-group mb-3">
				<label for="edit-enlace-input" style="font-size: 12.5px; font-weight: 700; color: #334155;">Enlace de Zoom / Google Meet / Teams *</label>
				<input type="url" id="edit-enlace-input" class="form-control" placeholder="https://meet.google.com/..." required>
			</div>

			<div class="d-flex justify-content-end gap-2 mt-4">
				<button type="button" class="btn btn-outline-secondary btn-sm" onclick="cerrarModalEnlace()">Cancelar</button>
				<button type="button" class="btn btn-primary btn-sm fw-bold px-3" id="btn-guardar-enlace" onclick="guardarEnlaceClase()">
					<i class="fa fa-save me-1"></i> Guardar Enlace
				</button>
			</div>
		</div>
	</div>

	<!-- MODAL: ACTUALIZAR DATOS DE SEDE Y AULA (PRESENCIAL) -->
	<div id="modal-actualizar-aula" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.7); z-index: 9999999; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
		<div style="background: #ffffff; border-radius: 16px; padding: 28px 24px; max-width: 500px; width: 92%; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);">
			<h4 style="font-weight: 800; color: #0f172a; margin-bottom: 6px;">
				<i class="fa fa-building text-warning me-2"></i>Actualizar Sede y Aula Física
			</h4>
			<p class="text-muted" style="font-size: 13px;">Informa a tus estudiantes la dirección exacta del campus y el aula o laboratorio asignado.</p>
			
			<input type="hidden" id="edit-aula-curso-id">
			
			<div class="form-group mb-3">
				<label for="edit-sede-input" style="font-size: 12.5px; font-weight: 700; color: #334155;">Dirección de Sede / Campus *</label>
				<input type="text" id="edit-sede-input" class="form-control" placeholder="Ej: Av. Universitaria 1234, Lima" required>
			</div>

			<div class="form-group mb-3">
				<label for="edit-aula-input" style="font-size: 12.5px; font-weight: 700; color: #334155;">Aula o Laboratorio *</label>
				<input type="text" id="edit-aula-input" class="form-control" placeholder="Ej: Laboratorio 204" required>
			</div>

			<div class="d-flex justify-content-end gap-2 mt-4">
				<button type="button" class="btn btn-outline-secondary btn-sm" onclick="cerrarModalAula()">Cancelar</button>
				<button type="button" class="btn btn-primary btn-sm fw-bold px-3" id="btn-guardar-aula" onclick="guardarAulaSede()">
					<i class="fa fa-save me-1"></i> Guardar Cambios
				</button>
			</div>
		</div>
	</div>
  `
})
export class DocentePanelComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && window.initPortalDocente) {
      window.initPortalDocente();
    }
  }
}
