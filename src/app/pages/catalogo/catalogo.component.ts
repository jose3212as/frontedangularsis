import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CursoService } from '../../services/curso.service';
import { Curso } from '../../models/curso.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="flex-1 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <a routerLink="/" class="hover:text-brand-900 transition">Inicio</a>
          <i class="fa-solid fa-chevron-right text-[10px]"></i>
          <span class="text-slate-800 font-medium">Catálogo de Cursos Profesionales</span>
        </nav>

        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-brand-950 via-brand-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg mb-8 relative overflow-hidden">
          <div class="relative z-10 max-w-2xl">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-3">
              <i class="fa-solid fa-sparkles text-[10px]"></i> Matrícula Abierta • Semestre 2026-I
            </span>
            <h1 class="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
              Especialízate en Arquitecturas Web y Microservicios
            </h1>
            <p class="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              Cursos dictados por profesionales de la industria con acceso en vivo por Google Meet, proyectos de arquitectura distribuida y certificación digital verificable.
            </p>
            <div class="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div class="flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check text-emerald-400"></i> Clases en Vivo & Presenciales
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check text-emerald-400"></i> Boletas y Facturas Inmediatas
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check text-emerald-400"></i> Pagos con Mercado Pago
              </div>
            </div>
          </div>
          <div class="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
            <i class="fa-solid fa-cubes text-[240px]"></i>
          </div>
        </div>

        <!-- Main Layout: Sidebar Filters + Course Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <!-- Filters Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm sticky top-20">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 class="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                  <i class="fa-solid fa-sliders text-brand-600"></i> Filtros
                </h3>
                <button (click)="resetFiltros()" class="text-xs text-slate-500 hover:text-brand-600 transition cursor-pointer">
                  Limpiar
                </button>
              </div>

              <!-- Search -->
              <div class="mb-5">
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Búsqueda rápida</label>
                <div class="relative">
                  <input 
                    type="text" 
                    [(ngModel)]="filtroTexto" 
                    (input)="filtrarCursos()"
                    placeholder="Buscar curso..." 
                    class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white">
                </div>
              </div>

              <!-- Modality Filter -->
              <div class="mb-5">
                <label class="block text-xs font-semibold text-slate-700 mb-2">Modalidad</label>
                <div class="space-y-2">
                  <label class="flex items-center text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                    <input type="radio" name="modalidad" value="TODAS" [(ngModel)]="filtroModalidad" (change)="filtrarCursos()" class="mr-2 text-brand-600 focus:ring-brand-500">
                    Todas las modalidades
                  </label>
                  <label class="flex items-center text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                    <input type="radio" name="modalidad" value="VIRTUAL" [(ngModel)]="filtroModalidad" (change)="filtrarCursos()" class="mr-2 text-brand-600 focus:ring-brand-500">
                    <span class="inline-flex items-center gap-1.5"><i class="fa-solid fa-video text-blue-500"></i> Virtual (Meet/Zoom)</span>
                  </label>
                  <label class="flex items-center text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                    <input type="radio" name="modalidad" value="PRESENCIAL" [(ngModel)]="filtroModalidad" (change)="filtrarCursos()" class="mr-2 text-brand-600 focus:ring-brand-500">
                    <span class="inline-flex items-center gap-1.5"><i class="fa-solid fa-location-dot text-purple-500"></i> Presencial (Campus)</span>
                  </label>
                </div>
              </div>

              <!-- Support Card -->
              <div class="p-3.5 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-900">
                <div class="font-bold mb-1 flex items-center gap-1.5">
                  <i class="fa-solid fa-headset text-blue-600"></i> ¿Dudas sobre matrícula?
                </div>
                <p class="text-[11px] text-blue-800 leading-relaxed">
                  Asesoría académica directa vía WhatsApp para convalidaciones y pagos con RUC.
                </p>
                <a href="#contacto" class="inline-block mt-2 font-bold text-[11px] text-brand-700 hover:underline">
                  Contáctanos aquí &rarr;
                </a>
              </div>

            </div>
          </div>

          <!-- Course Cards Grid -->
          <div class="lg:col-span-3">

            @if (loading) {
              <div class="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                <i class="fa-solid fa-circle-notch fa-spin text-3xl text-brand-600 mb-3"></i>
                <p class="text-xs text-slate-500">Consultando microservicio de catálogo de cursos...</p>
              </div>
            } @else if (errorMensaje) {
              <div class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center shadow-sm">
                <i class="fa-solid fa-triangle-exclamation text-2xl mb-2 text-red-600"></i>
                <p class="text-xs font-semibold mb-3">{{ errorMensaje }}</p>
                <button (click)="cargarCursos()" class="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition cursor-pointer">
                  Reintentar conexión
                </button>
              </div>
            } @else if (cursosFiltrados.length === 0) {
              <div class="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
                <i class="fa-regular fa-folder-open text-4xl mb-3 text-slate-300"></i>
                <h4 class="font-bold text-sm text-slate-700 mb-1">No se encontraron cursos</h4>
                <p class="text-xs text-slate-500 mb-4">Intenta ajustar los términos de búsqueda o los filtros de modalidad.</p>
                <button (click)="resetFiltros()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer">
                  Restablecer filtros
                </button>
              </div>
            } @else {
              
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-semibold text-slate-500">
                  Mostrando <strong class="text-slate-800">{{ cursosFiltrados.length }}</strong> cursos disponibles
                </span>
                <span class="text-[11px] text-slate-400">
                  Semestre Académico 2026-I
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                @for (curso of cursosFiltrados; track curso.id) {
                  <div class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
                    
                    <!-- Card Top Header -->
                    <div class="p-5 pb-3 border-b border-slate-100">
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span 
                          class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                          [ngClass]="curso.modalidad === 'PRESENCIAL' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'">
                          {{ curso.modalidad === 'PRESENCIAL' ? 'Presencial (Sede)' : 'Virtual en Vivo' }}
                        </span>

                        <span class="text-[11px] font-semibold text-slate-400">
                          ID: {{ curso.id.substring(0, 8) }}...
                        </span>
                      </div>

                      <div class="flex items-center gap-3 text-xs text-slate-500 pt-1">
                        <span class="flex items-center gap-1"><i class="fa-regular fa-clock"></i> {{ curso.horario }}</span>
                      </div>
                    </div>

                    <!-- Card Body -->
                    <div class="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 class="font-heading font-bold text-base text-slate-900 leading-snug group-hover:text-brand-700 transition mb-2">
                          {{ curso.titulo }}
                        </h3>
                        <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                          {{ curso.descripcion || 'Especialízate con proyectos reales, arquitecturas distribuidas y asesoría directa del docente.' }}
                        </p>
                      </div>

                      <div>
                        <!-- Vacancy Progress Meter -->
                        <div class="mb-4">
                          <div class="flex items-center justify-between text-[11px] mb-1">
                            <span class="text-slate-500 font-medium">Disponibilidad</span>
                            <span class="font-bold" [ngClass]="curso.aforoDisponible <= 5 ? 'text-amber-600' : 'text-emerald-600'">
                              {{ curso.aforoDisponible }} vacantes disponibles de {{ curso.aforoMaximo }}
                            </span>
                          </div>
                          <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              class="h-1.5 rounded-full transition-all duration-500" 
                              [ngClass]="curso.aforoDisponible <= 5 ? 'bg-amber-500' : 'bg-emerald-500'"
                              [style.width.%]="((curso.aforoMaximo - curso.aforoDisponible) / curso.aforoMaximo) * 100">
                            </div>
                          </div>
                        </div>

                        <!-- Price & CTA Button -->
                        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block">Inversión</span>
                            <span class="font-heading text-xl font-extrabold text-slate-900">
                              S/ {{ curso.precio | number:'1.2-2' }}
                            </span>
                          </div>

                          <a 
                            [routerLink]="['/curso', curso.id]" 
                            class="px-4 py-2 bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 group-hover:gap-2">
                            Ver Detalle <i class="fa-solid fa-arrow-right text-[10px]"></i>
                          </a>
                        </div>
                      </div>

                    </div>

                  </div>
                }
              </div>
            }

          </div>

        </div>

        <!-- Seccion de Contacto Moderna con WhatsApp y Formulario -->
        <section class="mt-16 pt-12 border-t border-slate-200" id="contacto">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <!-- Columna Izquierda: Información de Contacto -->
            <div class="lg:col-span-5 space-y-6">
              <div>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
                  <i class="fa-solid fa-headphones"></i> Mesa de Ayuda Académica
                </span>
                <h2 class="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  Comunícate con <span class="text-brand-600 underline decoration-emerald-400 decoration-4">Nosotros</span>
                </h2>
                <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  ¿Tienes dudas sobre nuestros cursos, el proceso de pago con Mercado Pago o las certificaciones oficiales? Nuestro equipo está listo para ayudarte.
                </p>
              </div>

              <div class="space-y-4">
                <!-- Tarjeta 1: Sede Presencial -->
                <div class="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-base">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900">Sede Principal de Clases</h4>
                    <p class="text-xs text-slate-600 mt-0.5">Av. Universitaria 1234, Lima - Campus Central (Lab 204 y 301)</p>
                  </div>
                </div>

                <!-- Tarjeta 2: WhatsApp y Teléfono -->
                <div class="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-base">
                    <i class="fa-brands fa-whatsapp"></i>
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900">WhatsApp & Teléfonos de Atención</h4>
                    <p class="text-xs text-slate-600 mt-0.5">
                      <a href="tel:+51999555666" class="hover:text-emerald-700 font-semibold">+51 999 555 666</a> &bull; 
                      <a href="tel:+5113118888" class="hover:text-emerald-700">+51 (01) 311 8888</a>
                    </p>
                  </div>
                </div>

                <!-- Tarjeta 3: Correo Electrónico -->
                <div class="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div class="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 text-base">
                    <i class="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900">Correo Electrónico Institucional</h4>
                    <p class="text-xs text-slate-600 mt-0.5">
                      <a href="mailto:soporte@cursos.com" class="hover:text-sky-700 font-semibold">soporte@cursos.com</a> &bull; admision@cursos.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Columna Derecha: Formulario Interactivo -->
            <div class="lg:col-span-7">
              <div class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <h3 class="font-heading font-bold text-base text-slate-900 mb-1">
                  Envíanos tu consulta académica
                </h3>
                <p class="text-xs text-slate-500 mb-6">
                  Te responderemos directamente a tu correo o WhatsApp en menos de 15 minutos.
                </p>

                @if (contactoEnviado) {
                  <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 text-xs mb-4">
                    <i class="fa-solid fa-circle-check text-xl text-emerald-600 mb-1 block"></i>
                    <strong>¡Gracias por comunicarte con nosotros!</strong><br>
                    Hemos recibido tu mensaje correctamente y nuestro asesor se contactará contigo a la brevedad.
                  </div>
                }

                <form (ngSubmit)="enviarMensajeContacto()" class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                      <input 
                        type="text" 
                        required 
                        [(ngModel)]="contactoNombre" 
                        name="nombre" 
                        placeholder="Ej. Carlos Alarcón" 
                        class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white">
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                      <input 
                        type="email" 
                        required 
                        [(ngModel)]="contactoCorreo" 
                        name="correo" 
                        placeholder="correo@ejemplo.com" 
                        class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white">
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp</label>
                      <input 
                        type="tel" 
                        [(ngModel)]="contactoTelefono" 
                        name="telefono" 
                        placeholder="+51 999 555 666" 
                        class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white">
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1">Asunto de Consulta</label>
                      <select 
                        [(ngModel)]="contactoAsunto" 
                        name="asunto" 
                        class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white">
                        <option value="Información de Cursos">Información de Cursos y Horarios</option>
                        <option value="Pagos con Mercado Pago">Pagos con Mercado Pago y Facturación</option>
                        <option value="Acceso a Google Meet">Acceso a Clases en Vivo Google Meet</option>
                        <option value="Certificaciones">Certificación y Horas Académicas</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Mensaje o Detalle *</label>
                    <textarea 
                      required 
                      rows="4" 
                      [(ngModel)]="contactoMensaje" 
                      name="mensaje" 
                      placeholder="Escribe aquí tu consulta..." 
                      class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white"></textarea>
                  </div>

                  <button 
                    type="submit" 
                    class="w-full sm:w-auto px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <i class="fa-solid fa-paper-plane"></i> Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  `
})
export class CatalogoComponent implements OnInit {
  private cursoService = inject(CursoService);
  private cdr = inject(ChangeDetectorRef);

  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];
  loading = true;
  errorMensaje = '';

  filtroTexto = '';
  filtroModalidad = 'TODAS';

  // Contacto Form
  contactoNombre = '';
  contactoCorreo = '';
  contactoTelefono = '';
  contactoAsunto = 'Información de Cursos';
  contactoMensaje = '';
  contactoEnviado = false;

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.loading = true;
    this.errorMensaje = '';
    this.cdr.detectChanges();

    console.log('[Catalogo] Solicitando cursos al backend...');
    this.cursoService.listarPublicos().subscribe({
      next: (data) => {
        console.log('[Catalogo] Cursos recibidos del backend:', data);
        this.cursos = data;
        this.cursosFiltrados = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Catalogo] Error cargando cursos:', err);
        this.loading = false;
        this.errorMensaje = 'No se pudo conectar con el microservicio de cursos en http://localhost:8080/api/cursos. Verifica que los servidores se encuentren activos.';
        this.cdr.detectChanges();
      }
    });
  }

  filtrarCursos(): void {
    this.cursosFiltrados = this.cursos.filter(c => {
      const matchText = this.filtroTexto.trim() === '' || 
        c.titulo.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        (c.descripcion && c.descripcion.toLowerCase().includes(this.filtroTexto.toLowerCase()));
      
      const matchModalidad = this.filtroModalidad === 'TODAS' || c.modalidad === this.filtroModalidad;

      return matchText && matchModalidad;
    });
  }

  resetFiltros(): void {
    this.filtroTexto = '';
    this.filtroModalidad = 'TODAS';
    this.cursosFiltrados = [...this.cursos];
  }

  enviarMensajeContacto(): void {
    this.contactoEnviado = true;
    this.contactoNombre = '';
    this.contactoCorreo = '';
    this.contactoTelefono = '';
    this.contactoMensaje = '';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.contactoEnviado = false;
      this.cdr.detectChanges();
    }, 6000);
  }
}
