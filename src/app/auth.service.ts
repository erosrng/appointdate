// src/app/services/auth.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core'; // Añadido PLATFORM_ID e Inject
import { isPlatformBrowser } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface DecodedToken {
  usuario: string;
  nombre: string;
  logged_in: boolean;
  tipo_u: string;
  almacen: string;
  tasa: string;
  proveed: string | null;
  cmatriz: string;
  lgrup: { grupo: string; nom_grup: string;}[];
  clientes: { cliente: string; nombre: string; rifci: string }[];
  API_TIME: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  private decodedToken: DecodedToken | null = null;
  private jwtHelper = new JwtHelperService();
  private _codCli: string | null = null;
  private isHandlingSessionExpired = false;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inyectamos el ID de plataforma
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.validateAndLoadToken();
  }

  private validateAndLoadToken(): void {
    if (!this.isBrowser) return;

    const storedToken = localStorage.getItem('token');

    // SI NO HAY TOKEN: Limpiamos y salimos. 
    // No disparamos alertas, porque el usuario puede estar entrando por primera vez.
    if (!storedToken) {
      this.token = null;
      this.decodedToken = null;
      return; 
    }

    try {
      const decoded = this.jwtHelper.decodeToken(storedToken);
      
      // Si el token existe pero está malformado o expirado
      if (!decoded || this.jwtHelper.isTokenExpired(storedToken)) {
        throw new Error('Token inválido o expirado');
      }

      // Si todo está bien, cargamos en memoria
      this.token = storedToken;
      this.decodedToken = decoded;

    } catch (error) {
      // Solo aquí, donde el token EXISTÍA pero ya no sirve, limpiamos y avisamos
      this.token = null;
      this.decodedToken = null;
      
      // Solo avisamos si NO estamos en el login
      if (!this.router.url.includes('/login') && !this.router.url.includes('/authprv')) {
        this.handleSessionExpired(storedToken);
      } else {
        this.removeToken(); // Limpiamos el localStorage sucio silenciosamente
      }
    }
  }


  setToken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
      this.validateAndLoadToken();
    }
  }

  getToken(): string | null {
    if (this.token && this.decodedToken && !this.jwtHelper.isTokenExpired(this.token)) {
      return this.token;
    }
    this.validateAndLoadToken();
    return this.token;
  }

  removeToken() {
    this.token = null;
    this.decodedToken = null;
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
  }

  getUsuario(): string | null {
    this.getToken();
    return this.decodedToken ? this.decodedToken.usuario : null;
  }

  getNombre(): string | null {
    this.getToken();
    return this.decodedToken ? this.decodedToken.nombre : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.decodedToken && this.decodedToken.logged_in;
  }

  getTipoU(): string | null {
    this.getToken();
    return this.decodedToken ? this.decodedToken.tipo_u : null;
  }

  getProveed(): string | null {
    return this.decodedToken ? this.decodedToken.proveed : null;
  }

  getAlmacen(): string | null {
    this.getToken();
    return this.decodedToken ? this.decodedToken.almacen : null;
  }

  getTasa(): number {
    this.getToken();
    if (!this.decodedToken || this.decodedToken.tasa === undefined || this.decodedToken.tasa === null) {
      return 0;
    }
    const parsedTasa = parseFloat(this.decodedToken.tasa);
    return isNaN(parsedTasa) ? 0 : parsedTasa;
  }

  getCmatriz(): string | null {
    this.getToken();
    return this.decodedToken ? this.decodedToken.cmatriz : null;
  }

  getApiTime(): number | null {
    this.getToken();
    return this.decodedToken ? this.decodedToken.API_TIME : null;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.clear();
      this.removeToken();
      this.isHandlingSessionExpired = false;
      this.router.navigate(['/authprv']);
    }
  }

  // Modificado para aceptar un token como argumento opcional
  async handleSessionExpired(invalidToken: string | null = null): Promise<void> {
    if (!this.isBrowser || this.isHandlingSessionExpired) {
      return;
    }
    this.isHandlingSessionExpired = true;


    let alertText = 'Tu sesión ha caducado o el token es inválido. Serás redirigido al inicio de sesión.';
    if (invalidToken) {
      // Recorta el token para que no sea excesivamente largo en la alerta
      const displayToken = invalidToken.length > 50 ? invalidToken.substring(0, 50) + '...' : invalidToken;
      alertText += `\n\nToken afectado: ${displayToken}`;
    } else {
      alertText += `\n\nToken no disponible o nulo.`;
    }

    await Swal.fire({
      icon: 'warning',
      title: 'Sesión Expirada',
      text: alertText, 
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    this.logout();
  }

  getCodCli(): string | null {
    if (!this.isBrowser) return null; // Seguridad para SSR

    this._codCli = localStorage.getItem('codCli');
    if (!this._codCli) {
      if (this.isLoggedIn()) {
        this._codCli = this.getUsuario();
        localStorage.setItem('codCli', this._codCli || '');
      } else {
        this._codCli = null;
      }
    }
    return this._codCli;
  }

  setCodCli(codCli: string | null): void {
    this._codCli = codCli;
    if (this.isBrowser) {
      localStorage.setItem('codCli', codCli || '');
    }
  }

  getClientes(): { cliente: string; nombre: string; rifci: string }[] | null {
    this.getToken();
    return this.decodedToken ? this.decodedToken.clientes : null;
  }

  getLgrup(): { grupo: string; nom_grup: string; }[] | null {
    this.getToken();
    return this.decodedToken ? this.decodedToken.lgrup : null;
  }

  getNombreFarmaciaActiva() {
    if (this.isBrowser) {
      return localStorage.getItem('nameFarmaActiva');
    }
    return null;
  }
}
