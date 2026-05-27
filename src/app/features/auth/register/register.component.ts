import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { API_URL } from '../../../app.config';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  tipo = signal<string>('M');
  idType = signal<string>('V');
  rif = signal('');
  name = signal('');
  email = signal('');
  phonePrefix = signal('0414');
  phoneNumber = signal('');
  username = signal('');
  password = signal('');
  confirmPassword = signal('');
  hidePassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');

  tipoDocumento = ['V', 'J', 'G', 'E', 'P'];
  prefijos = ['0414', '0424', '0412', '0416', '0426', '0212', '0291', '0281'];

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  async onRegister() {
    const pass = this.password();
    const confirm = this.confirmPassword();
    if (pass !== confirm) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        confirmButtonColor: '#0A6E6E',
      });
      return;
    }
    if (pass.length < 6) {
      await Swal.fire({
        icon: 'warning',
        title: 'Seguridad',
        text: 'La contraseña debe tener al menos 6 caracteres',
        confirmButtonColor: '#0A6E6E',
      });
      return;
    }
    this.isLoading.set(true);
    const formData = new FormData();
    formData.append('idType', this.idType());
    formData.append('rif', this.rif());
    formData.append('nombre', this.name());
    formData.append('email', this.email());
    formData.append('phonePrefix', this.phonePrefix());
    formData.append('phoneNumber', this.phoneNumber());
    formData.append('uscodigo', this.username());
    formData.append('password', pass);
    formData.append('tipo', this.tipo());

    this.http.post(`${API_URL}guardar_proveedor`, formData).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res.success) {
          Swal.fire({
            title: '¡Registro Exitoso!',
            text: 'Hemos enviado un correo para validar tu cuenta.',
            icon: 'success',
            confirmButtonColor: '#0A6E6E',
          }).then(() => {
            this.router.navigate(['/auth/login']);
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: res.error || 'Error al registrar', confirmButtonColor: '#0A6E6E' });
        }
      },
      error: () => {
        this.isLoading.set(false);
        Swal.fire({ icon: 'error', title: 'Error de Red', text: 'No se pudo conectar con el servidor', confirmButtonColor: '#0A6E6E' });
      },
    });
  }
}
