import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  user = signal('');
  password = signal('');
  tipo = signal<string>('M');
  hidePassword = signal(true);
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin() {
    const user = this.user().trim();
    const pass = this.password();
    if (!user || !pass) {
      this.errorMessage.set('Ingresa tu usuario y contraseña');
      return;
    }
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.authService.loginWithEmail(user, pass, this.tipo()).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res.status) {
          if (this.tipo() === 'M' || this.tipo() === 'P') {
            const tutorial = localStorage.getItem('tutorial_pendiente') === 'true';
            this.router.navigate([tutorial ? '/onboarding' : '/dashboardprv']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.errorMessage.set(res.message || 'Credenciales inválidas');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Error de conexión con el servidor');
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar con la API.', confirmButtonColor: '#0A6E6E' });
      },
    });
  }
}
