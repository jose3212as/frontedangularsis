import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CursoService } from '../../services/curso.service';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { Curso } from '../../models/curso.model';
import { Pedido } from '../../models/pedido.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="flex-1 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Stepper Indicator -->
        <div class="mb-8">
          <div class="flex items-center justify-center max-w-xl mx-auto">
            <div class="flex items-center text-emerald-600 text-xs font-semibold">
              <span class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2 text-[11px] font-bold">✔</span>
              <span>1. Selección</span>
            </div>
            <div class="flex-1 h-0.5 bg-brand-900 mx-4"></div>
            <div class="flex items-center text-brand-900 text-xs font-bold">
              <span class="w-6 h-6 rounded-full bg-brand-900 text-white flex items-center justify-center mr-2 text-[11px]">2</span>
              <span>2. Facturación y Pago</span>
            </div>
            <div class="flex-1 h-0.5 bg-slate-200 mx-4"></div>
            <div class="flex items-center text-slate-400 text-xs font-semibold">
              <span class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-2 text-[11px]">3</span>
              <span>3. Confirmación</span>
            </div>
          </div>
        </div>

        @if (loading) {
          <div class="bg-white rounded-xl p-16 text-center border border-slate-200">
            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-brand-600 mb-3"></i>
            <p class="text-xs text-slate-500">Iniciando orden de matrícula y reservando vacante...</p>
          </div>
        } @else if (curso) {
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left Form: Student, Invoicing & Payment (65%) -->
            <div class="lg:col-span-7 space-y-6">
              
              <!-- 1. Datos del Estudiante -->
              <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 class="font-heading font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-brand-900 text-white text-[10px] flex items-center justify-center">1</span>
                  Datos del Estudiante
                </h3>
                <p class="text-xs text-slate-500 mb-4">Los accesos al Google Meet, comprobante SUNAT y confirmación por WhatsApp se despacharán a estos datos.</p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Nombres y Apellidos <span class="text-red-500">*</span></label>
                    <input type="text" [(ngModel)]="estudianteNombres" placeholder="Ej. Carlos Alarcón" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white font-medium">
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Correo Electrónico <span class="text-red-500">*</span></label>
                    <input type="email" [(ngModel)]="estudianteCorreo" placeholder="estudiante@ejemplo.com" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white font-medium">
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">DNI (8 dígitos) <span class="text-red-500">*</span></label>
                    <input type="text" maxlength="8" [(ngModel)]="estudianteDni" placeholder="72345678" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white font-medium">
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">WhatsApp (+51) <span class="text-red-500">*</span></label>
                    <input type="text" [(ngModel)]="estudianteWhatsapp" placeholder="+51 999 555 666" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600 focus:bg-white font-medium">
                  </div>
                </div>

                <div class="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-800">
                  <i class="fa-brands fa-whatsapp text-emerald-600 text-base"></i>
                  <span>Te enviaremos los accesos directos al aula virtual y tu boleta vía <strong>WhatsApp instantáneo</strong> al confirmar.</span>
                </div>
              </div>

              <!-- 2. Tipo de Comprobante SUNAT -->
              <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 class="font-heading font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-brand-900 text-white text-[10px] flex items-center justify-center">2</span>
                  Tipo de Comprobante de Pago (SUNAT)
                </h3>
                <p class="text-xs text-slate-500 mb-4">Selecciona el tipo de documento tributario que requieres emitir.</p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  
                  <div 
                    (click)="tipoComprobante = 'BOLETA'"
                    class="p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3"
                    [ngClass]="tipoComprobante === 'BOLETA' ? 'border-brand-700 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'">
                    <input type="radio" name="comprobante" [checked]="tipoComprobante === 'BOLETA'" class="mt-1 text-brand-600">
                    <div>
                      <div class="font-bold text-xs text-slate-900">Boleta de Venta Electrónica (B001)</div>
                      <p class="text-[11px] text-slate-500 mt-0.5">Para personas naturales. Emitida con tu DNI proporcionado.</p>
                    </div>
                  </div>

                  <div 
                    (click)="tipoComprobante = 'FACTURA'"
                    class="p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3"
                    [ngClass]="tipoComprobante === 'FACTURA' ? 'border-brand-700 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'">
                    <input type="radio" name="comprobante" [checked]="tipoComprobante === 'FACTURA'" class="mt-1 text-brand-600">
                    <div>
                      <div class="font-bold text-xs text-slate-900">Factura Electrónica con RUC (F001)</div>
                      <p class="text-[11px] text-slate-500 mt-0.5">Para empresas (RUC 20 / 10). Válida para crédito fiscal SUNAT.</p>
                    </div>
                  </div>

                </div>

                @if (tipoComprobante === 'FACTURA') {
                  <div class="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label class="block font-semibold text-slate-700 mb-1">RUC de la Empresa (11 dígitos) <span class="text-red-500">*</span></label>
                        <input type="text" maxlength="11" [(ngModel)]="rucCliente" placeholder="20601234567" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600">
                      </div>
                      <div>
                        <label class="block font-semibold text-slate-700 mb-1">Razón Social <span class="text-red-500">*</span></label>
                        <input type="text" [(ngModel)]="razonSocial" placeholder="TECH SOLUTIONS S.A.C." class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-600">
                      </div>
                    </div>
                  </div>
                }
              </div>

              <!-- 3. Pasarela de Pagos Mercado Pago -->
              <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 class="font-heading font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-brand-900 text-white text-[10px] flex items-center justify-center">3</span>
                  Método de Pago con Mercado Pago
                </h3>
                <p class="text-xs text-slate-500 mb-4">Todas las transacciones son procesadas mediante la infraestructura certificada de Mercado Pago Perú.</p>

                <!-- Tarjeta Exclusiva Mercado Pago -->
                <div class="p-4 rounded-xl border border-sky-200 bg-sky-50/40 mb-4">
                  <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center text-lg shadow-sm">
                        <i class="fa-regular fa-credit-card"></i>
                      </div>
                      <div>
                        <strong class="text-xs text-slate-900 block font-bold">Mercado Pago Checkout Oficial</strong>
                        <span class="text-[11px] text-slate-500">Tarjetas de crédito, débito, saldo MP, Yape, Plin y transferencias</span>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <i class="fa-solid fa-shield-halved me-1"></i> Oficial &bull; 100% Seguro
                    </span>
                  </div>

                  <div class="p-3 bg-white/80 rounded-lg border border-sky-100 flex items-start gap-2.5 text-xs text-slate-600 mb-3">
                    <i class="fa-solid fa-lock text-emerald-600 mt-0.5"></i>
                    <div>
                      <strong class="text-slate-800">Protección con Cifrado SSL de 256 bits</strong>
                      <p class="text-[11px] text-slate-500 mt-0.5">Tus datos bancarios son procesados directamente por la bóveda segura de Mercado Pago. Nunca se almacenan en nuestros servidores.</p>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 pt-1 border-t border-sky-100">
                    <span class="px-2 py-1 bg-white rounded border border-slate-200 flex items-center gap-1.5"><i class="fa-brands fa-cc-visa text-blue-600"></i> VISA</span>
                    <span class="px-2 py-1 bg-white rounded border border-slate-200 flex items-center gap-1.5"><i class="fa-brands fa-cc-mastercard text-red-500"></i> Mastercard</span>
                    <span class="px-2 py-1 bg-white rounded border border-slate-200 flex items-center gap-1.5"><i class="fa-brands fa-cc-amex text-sky-600"></i> AMEX</span>
                    <span class="px-2 py-1 bg-white rounded border border-slate-200 flex items-center gap-1.5"><i class="fa-solid fa-qrcode text-purple-600"></i> Yape / Plin</span>
                    <span class="px-2 py-1 bg-white rounded border border-slate-200 flex items-center gap-1.5"><i class="fa-solid fa-building-columns text-slate-600"></i> Transferencia BCP/BBVA</span>
                  </div>
                </div>

                <!-- Asistente de Pagos Mercado Pago Sandbox -->
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <i class="fa-solid fa-vial"></i> Modo Sandbox / Entorno de Pruebas
                    </span>
                    <span class="text-[11px] text-slate-500">Aprobación instantánea</span>
                  </div>
                  <p class="text-[11px] text-slate-600 mb-3">
                    Para pruebas rápidas de sustentación, puedes confirmar la matrícula inmediatamente con el simulador de pasarela oficial o ingresar las tarjetas de prueba oficiales de Mercado Pago.
                  </p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div class="p-2 bg-white rounded border border-slate-200 font-mono text-slate-700">
                      <strong>Visa Test:</strong> 4242 4242 4242 4242<br>
                      <span class="text-[10px] text-slate-500">Venc: 12/28 &bull; CVV: 123</span>
                    </div>
                    <div class="p-2 bg-white rounded border border-slate-200 font-mono text-slate-700">
                      <strong>Mastercard Test:</strong> 5555 5555 5555 4444<br>
                      <span class="text-[10px] text-slate-500">Venc: 11/27 &bull; CVV: 456</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <!-- Right Sticky: Order Summary & Pay Button (35%) -->
            <div class="lg:col-span-5 sticky top-20 space-y-4">
              <div class="bg-white rounded-xl border border-slate-200 shadow-md p-6 overflow-hidden">
                
                <!-- Urgency Timer -->
                <div class="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs font-medium text-amber-900 flex items-center justify-between gap-2 mb-4">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-stopwatch text-amber-600 text-sm"></i>
                    <span>Vacante reservada:</span>
                  </div>
                  <strong class="font-mono text-sm text-amber-800">{{ minutos }}:{{ segundos < 10 ? '0' + segundos : segundos }} min</strong>
                </div>

                <h3 class="font-heading font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 mb-4">
                  Resumen de Matrícula
                </h3>

                <!-- Mini Course preview -->
                <div class="flex items-start gap-3 pb-4 border-b border-slate-100 mb-4">
                  <div class="w-12 h-12 rounded-lg bg-slate-900 text-brand-400 flex items-center justify-center flex-shrink-0 text-xl">
                    <i class="fa-solid fa-laptop-code"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-xs text-slate-900 leading-snug">{{ curso.titulo }}</h4>
                    <span class="text-[11px] text-slate-500 block mt-0.5">{{ curso.horario }}</span>
                    <span class="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded" [ngClass]="curso.modalidad === 'PRESENCIAL' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'">
                      {{ curso.modalidad }}
                    </span>
                  </div>
                </div>

                <!-- Financial Breakdown -->
                <div class="space-y-2 text-xs pb-4 border-b border-slate-100 mb-4">
                  <div class="flex justify-between text-slate-500">
                    <span>Precio de lista:</span>
                    <span>S/ {{ (curso.precio * 1.4) | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-emerald-600 font-medium">
                    <span>Beca Promocional Semestre 2026:</span>
                    <span>- S/ {{ (curso.precio * 0.4) | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-slate-600">
                    <span>Subtotal Base Imponible:</span>
                    <span>S/ {{ calcularSubtotal(curso.precio) | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-slate-600">
                    <span>IGV (18% SUNAT):</span>
                    <span>S/ {{ calcularIgv(curso.precio) | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-slate-900 text-base font-extrabold pt-2 border-t border-slate-100">
                    <span>Total a Pagar:</span>
                    <span class="text-brand-900">S/ {{ curso.precio | number:'1.2-2' }}</span>
                  </div>
                </div>

                <!-- Error alert if any -->
                @if (errorMensaje) {
                  <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 mb-3 flex items-start gap-2">
                    <i class="fa-solid fa-circle-exclamation mt-0.5 flex-shrink-0"></i>
                    <span>{{ errorMensaje }}</span>
                  </div>
                }

                <!-- Pay Button -->
                <button 
                  (click)="procesarPago()" 
                  [disabled]="procesando"
                  class="w-full py-3.5 bg-brand-900 hover:bg-brand-800 disabled:bg-slate-400 text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                  @if (procesando) {
                    <i class="fa-solid fa-circle-notch fa-spin"></i> Conectando con Mercado Pago...
                  } @else {
                    <i class="fa-solid fa-lock"></i> Pagar S/ {{ curso.precio | number:'1.2-2' }} con Mercado Pago
                  }
                </button>

                <div class="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                  <div class="flex items-center gap-1.5">
                    <i class="fa-solid fa-check text-emerald-600"></i> Descuento automático de vacante en base de datos.
                  </div>
                  <div class="flex items-center gap-1.5">
                    <i class="fa-solid fa-check text-emerald-600"></i> Emisión inmediata de Comprobante SUNAT (PDF).
                  </div>
                  <div class="flex items-center gap-1.5">
                    <i class="fa-solid fa-check text-emerald-600"></i> Alerta WhatsApp y Correo con enlace Google Meet.
                  </div>
                </div>

              </div>
            </div>

          </div>

        }
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cursoService = inject(CursoService);
  private pedidoService = inject(PedidoService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  curso: Curso | null = null;
  loading = true;
  procesando = false;
  errorMensaje = '';

  // Temporizador de vacante reservada
  minutos = 14;
  segundos = 59;
  private timerInterval: any;

  // Form
  estudianteNombres = 'Carlos Estudiante';
  estudianteCorreo = 'estudiante@cursos.com';
  estudianteDni = '30000003';
  estudianteWhatsapp = '+51999555666';

  tipoComprobante: 'BOLETA' | 'FACTURA' = 'BOLETA';
  rucCliente = '20601234567';
  razonSocial = 'TECH SOLUTIONS S.A.C.';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const user = this.auth.currentUser();
    if (user) {
      this.estudianteNombres = `${user.nombres} ${user.apellidos}`;
      this.estudianteCorreo = user.correo;
      this.estudianteDni = user.dni || '30000003';
      this.estudianteWhatsapp = user.whatsapp || '+51999555666';
    }

    this.iniciarTemporizador();

    if (id) {
      this.cursoService.buscarPorId(id).subscribe({
        next: (data) => {
          this.curso = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  iniciarTemporizador(): void {
    this.timerInterval = setInterval(() => {
      if (this.segundos > 0) {
        this.segundos--;
      } else {
        if (this.minutos > 0) {
          this.minutos--;
          this.segundos = 59;
        } else {
          clearInterval(this.timerInterval);
        }
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  calcularSubtotal(monto: number): number {
    return Math.round((monto / 1.18) * 100) / 100;
  }

  calcularIgv(monto: number): number {
    return Math.round((monto - this.calcularSubtotal(monto)) * 100) / 100;
  }

  procesarPago(): void {
    if (!this.curso) return;

    if (this.tipoComprobante === 'FACTURA') {
      if (!this.rucCliente || this.rucCliente.trim().length !== 11) {
        this.errorMensaje = 'Para Factura Electrónica, ingrese un RUC válido de 11 dígitos.';
        return;
      }
      if (!this.razonSocial || this.razonSocial.trim() === '') {
        this.errorMensaje = 'Ingrese la Razón Social de la empresa para la factura.';
        return;
      }
    }

    if (!this.estudianteNombres || !this.estudianteCorreo || !this.estudianteDni) {
      this.errorMensaje = 'Por favor complete todos los datos del estudiante requeridos.';
      return;
    }

    this.procesando = true;
    this.errorMensaje = '';

    const estudianteId = this.auth.currentUser()?.id || 'a0000000-0000-0000-0000-000000000003';

    // 1. Checkout (Crea orden de matrícula en pedidos-service y descuenta vacante)
    this.pedidoService.checkout({
      estudianteId,
      cursoId: this.curso.id
    }).subscribe({
      next: (pedido) => {
        // 2. Procesar pago en Mercado Pago y emitir comprobante SUNAT + WhatsApp
        const paymentId = 'MP-PAY-' + Date.now();
        this.pedidoService.pagar(pedido.id, {
          mpPaymentId: paymentId,
          tipoComprobante: this.tipoComprobante,
          rucCliente: this.tipoComprobante === 'FACTURA' ? this.rucCliente : undefined,
          razonSocial: this.tipoComprobante === 'FACTURA' ? this.razonSocial : undefined,
          whatsapp: this.estudianteWhatsapp,
          correo: this.estudianteCorreo,
          clienteNombres: this.estudianteNombres,
          metodoPago: 'Mercado Pago Checkout Oficial (Tarjeta)'
        }).subscribe({
          next: (pedidoPagado) => {
            this.procesando = false;
            this.router.navigate(['/confirmacion', pedidoPagado.id]);
          },
          error: (err) => {
            this.procesando = false;
            this.errorMensaje = 'Error al confirmar el pago con Mercado Pago: ' + (err.error?.message || err.message);
          }
        });
      },
      error: (err) => {
        this.procesando = false;
        this.errorMensaje = 'Error al registrar orden de matrícula: ' + (err.error?.message || err.message);
      }
    });
  }
}
