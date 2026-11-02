import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const window: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
	<!-- START SECTION TOP  -->
	<section class="section-top">
		<div class="container">
			<div class="col-lg-10 offset-lg-1 text-center">
				<div class="section-top-title wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.3s">
					<h1>Registro de Estudiantes</h1>
					<ul>
						<li><a href="index.html">Inicio</a></li>
						<li> / Crear Cuenta de Alumno</li>
					</ul>
				</div>
			</div>
		</div>
	</section>	
	<!-- END SECTION TOP -->

	<!-- START REGISTER  -->
	<section class="login_register section-padding">
		<div class="container">
			<div class="row">				
				<div class="col-lg-6 offset-lg-3 col-xs-12">
					<div class="register">
						<h4 class="login_register_title">Crea tu cuenta de estudiante:</h4>
						<p class="text-muted small mb-3">Completa tus datos para matricularte, recibir tu comprobante oficial y los enlaces de tus clases por WhatsApp y correo.</p>

						<form id="registro-form" onsubmit="hacerRegistro(event)">
							<div class="form-group mb-2">
								<label>Nombres *</label>
								<input type="text" id="reg-nom" class="form-control requiredField input-label" required placeholder="Tus nombres">
							</div>
							<div class="form-group mb-2">
								<label>Apellidos *</label>
								<input type="text" id="reg-ape" class="form-control requiredField input-label" required placeholder="Tus apellidos">
							</div>
							<div class="form-group mb-2">
								<label>DNI / Documento *</label>
								<input type="text" id="reg-dni" class="form-control requiredField input-label" required maxlength="12" placeholder="8 dígitos">
							</div>
							<div class="form-group mb-2">
								<label>WhatsApp (Para recibir tus enlaces de clase) *</label>
								<input type="tel" id="reg-wa" class="form-control requiredField input-label" required placeholder="Ej. 999555666">
							</div>
							<div class="form-group mb-2">
								<label>Correo Electrónico *</label>
								<input type="email" id="reg-mail" class="form-control requiredField input-label" required placeholder="correo@ejemplo.com">
							</div>
							<div class="form-group mb-3">
								<label>Contraseña *</label>
								<input type="password" id="reg-pwd" class="form-control requiredField input-label" required minlength="6" placeholder="Mínimo 6 caracteres">
							</div>
							<div class="form-group col-lg-12">
								<button class="btn_one w-100" type="submit" id="btn-reg">Crear Cuenta y Continuar</button>
							</div>
						</form>

						<p class="mt-3 text-center">¿Ya tienes cuenta? <a href="login.html" class="fw-bold text-success">Inicia sesión</a></p>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!-- END REGISTER -->
  `
})
export class RegistroComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && window.initRegistroPage) {
      window.initRegistroPage();
    }
  }
}
