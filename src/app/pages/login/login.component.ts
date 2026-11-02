import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const window: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
	<!-- START SECTION TOP  -->
	<section class="section-top">
		<div class="container">
			<div class="col-lg-10 offset-lg-1 text-center">
				<div class="section-top-title wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.3s">
					<h1>Ingreso de Alumnos</h1>
					<ul>
						<li><a href="index.html">Inicio</a></li>
						<li> / Iniciar Sesión</li>
					</ul>
				</div>
			</div>
		</div>
	</section>	
	<!-- END SECTION TOP -->

	<!-- START LOGIN  -->
	<section class="login_register section-padding">
		<div class="container">
			<div class="row">				
				<div class="col-lg-6 offset-lg-3 col-xs-12">
					<div class="login">
						<h4 class="login_register_title">Ingreso al Sistema Multirrol:</h4>
						<p class="text-muted" style="font-size: 13.5px; margin-top: -10px; margin-bottom: 20px;">
							Accede directamente a tu plataforma especializada: <strong>Estudiante</strong>, <strong>Docente</strong> o <strong>Administrador</strong>.
						</p>

						<!-- Accesos Rápidos por Perfil -->
						<div class="mb-4 p-3" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
							<span class="d-block text-muted mb-2" style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
								<i class="fa fa-bolt text-warning me-1"></i> Accesos Rápidos de Prueba (1 Clic)
							</span>
							<div class="d-grid gap-2">
								<button type="button" class="btn btn-sm text-start py-2 px-3" onclick="cargarDemo('estudiante@cursos.com')" style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 8px; font-weight: 600; font-size: 13px;">
									<i class="fa fa-graduation-cap me-2 text-primary"></i> <strong>Portal Estudiante:</strong> Carlos Alarcón
								</button>
								<button type="button" class="btn btn-sm text-start py-2 px-3" onclick="cargarDemo('docente@cursos.com')" style="background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; border-radius: 8px; font-weight: 600; font-size: 13px;">
									<i class="fa fa-briefcase me-2 text-success"></i> <strong>Portal Docente:</strong> Prof. Roberto Mendoza
								</button>
								<button type="button" class="btn btn-sm text-start py-2 px-3" onclick="cargarDemo('admin@cursos.com')" style="background: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; border-radius: 8px; font-weight: 600; font-size: 13px;">
									<i class="fa fa-shield me-2 text-purple" style="color: #9333ea;"></i> <strong>Portal Administrador:</strong> Admin General
								</button>
							</div>
						</div>

						<form id="login-form" onsubmit="hacerLogin(event)">
							<div class="form-group mb-3">
								<label for="login-email">Correo Electrónico *</label>
								<input type="email" id="login-email" class="form-control requiredField input-label" required placeholder="tu@correo.com">
							</div>
							<div class="form-group mb-3">
								<label for="login-pwd">Contraseña *</label>
								<input type="password" id="login-pwd" class="form-control requiredField input-label" required placeholder="Tu contraseña">
							</div>
							<div class="form-group col-lg-12">
								<button class="btn_one w-100" type="submit" id="btn-login">Iniciar Sesión</button>
							</div>
						</form>

						<p class="mt-4 text-center">¿Eres nuevo estudiante? <a href="registro.html" class="fw-bold text-success">Regístrate aquí</a></p>
					</div>

					<!-- MODAL DE VERIFICACIÓN 2FA -->
					<div id="modal-2fa" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.7); z-index: 9999999; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
						<div style="background: #ffffff; border-radius: 16px; padding: 28px 24px; max-width: 440px; width: 92%; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25); border: 1px solid #e2e8f0; animation: toastSlideInRight 0.3s ease;">
							<div class="text-center mb-3">
								<div style="width: 52px; height: 52px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 12px;">
									<i class="fa fa-shield"></i>
								</div>
								<h4 style="font-weight: 800; color: #0f172a; margin-bottom: 4px;">Verificación 2FA</h4>
								<p class="text-muted" style="font-size: 13.5px; margin: 0;">Ingresa tu código de seguridad para acceder a tu portal.</p>
							</div>

							<div id="modal-2fa-msg"></div>

							<div class="form-group mb-3">
								<label for="otp-code-input" style="font-size: 12.5px; font-weight: 700; color: #334155;">Código OTP (6 Dígitos):</label>
								<input type="text" id="otp-code-input" class="form-control text-center" maxlength="6" placeholder="Ej: 123456" style="font-size: 22px; font-weight: 800; letter-spacing: 6px; height: 48px; border: 2px solid #cbd5e1; border-radius: 8px;">
							</div>

							<div class="d-grid gap-2">
								<button type="button" id="btn-confirmar-2fa" class="btn_one w-100" onclick="confirmar2fa()">
									<i class="fa fa-unlock-alt me-1"></i> Verificar y Entrar al Portal
								</button>
								<button type="button" class="btn btn-outline-secondary btn-sm" onclick="cerrarModal2fa()" style="border-radius: 6px; font-weight: 600;">
									Cancelar
								</button>
							</div>
						</div>
					</div>
				</div><!--- END COL -->	
			</div><!--- END ROW -->
		</div><!--- END CONTAINER -->
	</section>
	<!-- END LOGIN -->
  `
})
export class LoginComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && window.initLoginPage) {
      window.initLoginPage();
    }
  }
}
