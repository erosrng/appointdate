import { Component, AfterViewInit, ElementRef, Renderer2, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';

// Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';

import { API_URL } from '../../app.config';

interface Rubro {
  grupo: string;
  gr_desc: string;
}

@Component({
  selector: 'app-authprv-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatIconModule,
    MatButtonModule, 
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule
  ],
  templateUrl: './authprv-page.html',
  styleUrl: './authprv-page.scss',
})
export class AuthprvPage implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  hidePassword = true;
  registerData = { 
    uscodigo: '',
    idType: 'V', // Por defecto V
    rif: '',
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    phonePrefix: '0414',
    phoneNumber: '',
    businessType: [] as string[], // Estos son los grupos para la tabla sprv
    estado: '',
    ciudad: '', 
    direccion: ''
  };
  tipoDocumento = ['V', 'J', 'G', 'E', 'P'];
  prefijos = ['0414', '0424', '0412', '0416', '0426', '0212', '0291', '0281'];

  userData = { user: '', password: '' };
  errorMessage: string = '';

  listaEstados: any[] = []; // Array para los estados de la BD
  isLoadingEstados = false;
  isLoading = false;

  // Lógica de Categorías y Filtro
  filterRubroOptions: Rubro[] = [];
  rubrosProveedores: Rubro[] = []; 
  searchText: string = '';
  isLoadingCats = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private http: HttpClient,
    public authService: AuthService,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) { 
      if (this.authService.getToken()) {
        this.router.navigate(['/dashboardprv']);
      }
    }
  }


  // Se dispara al cambiar de pestaña en el mat-tab-group
  onTabChange(index: number) {
    if (index === 1 && this.rubrosProveedores.length === 0) {
      this.traeRubros();
    }
    if (this.listaEstados.length === 0) this.traeEstados();
  }

  traeEstados() {
    this.isLoadingEstados = true;
    const apiUrl = `${API_URL}estados/estados`; // Ajusta la ruta a tu controlador

    this.http.post(apiUrl, {}).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.listaEstados = response.data;
        }
        this.isLoadingEstados = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingEstados = false;
      }
    });
  }

  // Se dispara al abrir/cerrar el mat-select
  onSelectOpened(opened: boolean) {
    if (opened && this.rubrosProveedores.length === 0) {
      this.traeRubros();
    }
    // Al cerrar, limpiamos el filtro visual pero mantenemos los datos originales
    if (!opened) {
      this.searchText = '';
      this.filterRubroOptions = [...this.rubrosProveedores];
    } else {
      this.aplicarFiltro(this.searchText);
    }
  }

  traeRubros() {
    if (this.isLoadingCats) return;
    
    this.isLoadingCats = true;
    const formData = new FormData();
    const apiUrl = `${API_URL}portalcli/buscagrupoprv`;

    this.http.post(apiUrl, formData).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.rubrosProveedores = response.data;
          this.filterRubroOptions = response.data;
        }
        this.isLoadingCats = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando rubros:', error);
        this.isLoadingCats = false;
        this.cdr.detectChanges();
      },
    });
  }

  filtrarRubros(event: any) {
    this.searchText = event.target.value.toLowerCase().trim();
    this.aplicarFiltro(this.searchText);
  }

  aplicarFiltro(term: string) {
    this.filterRubroOptions = this.rubrosProveedores.filter(cat => {
      const coincideBusqueda = cat.gr_desc.toLowerCase().includes(term);
      const yaEstaSeleccionado = this.registerData.businessType.includes(cat.grupo);
      return coincideBusqueda || yaEstaSeleccionado;
    });
  }

  // ESTA ES LA FUNCIÓN QUE TE DABA EL ERROR SI NO ESTABA
  getNombreCategoria(id: string): string {
    const cat = this.rubrosProveedores.find(c => c.grupo === id);
    return cat ? cat.gr_desc : '';
  }

  // Función para obtener todos los nombres de los rubros seleccionados
  getNombresSeleccionados(): string[] {
    return this.registerData.businessType.map(id => this.getNombreCategoria(id)).filter(n => n !== '');
  }

  onLogin() {
    // 1. Limpiamos errores previos de inmediato
    this.errorMessage = '';

    // 2. Validaciones preventivas ANTES de activar el loading
    if (!this.userData.user || !this.userData.password) {
      this.errorMessage = 'Debes ingresar tus credenciales para continuar.';
      return;
    }

    // 3. Activamos el estado de carga
    this.isLoading = true;
    this.cdr.detectChanges(); // Forzamos a que el botón y los campos se desactiven YA

    const formData = new FormData();
    formData.append('user', this.userData.user.trim());
    formData.append('password', this.userData.password);

    const apiUrl = `${API_URL}logincli/logincli`;

    this.http.post(apiUrl, formData).subscribe({
      next: (response: any) => {
        if (response.status === false) {
          this.errorMessage = response.message || 'Credenciales incorrectas.';
          this.userData.password = ''; 
          this.isLoading = false;
          this.cdr.detectChanges();
        } else {
          // ÉXITO: Guardamos token
          this.authService.setToken(response.api_key);
          
          // Redirigimos
          setTimeout(() => {
            this.router.navigate(['/dashboardprv']);
            this.isLoading = false;
            this.cdr.detectChanges();
          }, 600);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error de conexión con el servidor.';
        this.cdr.detectChanges();
        
        Swal.fire({
          icon: 'error',
          title: 'Error de Red',
          text: 'No se pudo establecer conexión con la API.',
          confirmButtonColor: '#3085d6'
        });
      },
    });
  }

  onRegister() {
    // Validamos que tenga rubros
    if (this.registerData.businessType.length === 0) {
      alert('Debe seleccionar al menos un rubro');
      return;
    }

    // Validación de coincidencia de claves
    if (this.registerData.password !== this.registerData.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    // Validación de longitud mínima (opcional pero recomendada)
    if (this.registerData.password.length < 6) {
      Swal.fire('Seguridad', 'La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    const formData = new FormData();
    // Mapeo directo a lo que recibe tu función api_guardar_usuario
    formData.append('uscodigo', this.registerData.uscodigo);
    formData.append('idType', this.registerData.idType);
    formData.append('rif', this.registerData.rif);
    formData.append('nombre', this.registerData.name);
    formData.append('email', this.registerData.email);
    formData.append('password', this.registerData.password);
    formData.append('phonePrefix', this.registerData.phonePrefix);
    formData.append('phoneNumber', this.registerData.phoneNumber);
    formData.append('estado', this.registerData.estado);
    formData.append('ciudad', this.registerData.ciudad);
    formData.append('direccion', this.registerData.direccion);
    // Enviamos los rubros como JSON o string separado por comas para el campo "grupo"
    //formData.append('grupos', JSON.stringify(this.registerData.businessType));
    this.registerData.businessType.forEach(grupoId => {
      formData.append('grupos[]', grupoId); // Los [] son la clave para PHP
    });

    const apiUrl = `${API_URL}portalcli/guardar_proveedor`; // Nombre sugerido para tu nueva función

    this.http.post(apiUrl, formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          Swal.fire({
            title: '¡Registro Exitoso!',
            text: 'Hemos enviado un correo para validar tu cuenta.',
            icon: 'success',
            confirmButtonColor: '#0d6efd', 
            confirmButtonText: 'Entendido'
          }).then(() => {
            this.router.navigate(['/authprv']);
          });
        } else {
          Swal.fire('Error', res.error, 'error');
        }
      },
      error: () => alert('Error de conexión con el servidor')
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const elements = this.el.nativeElement.querySelectorAll('[data-reveal]');
      elements.forEach((el: HTMLElement) => this.renderer.addClass(el, 'visible'));
    }
  }
}