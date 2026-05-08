import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core'; // Importa Inject y PLATFORM_ID
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser
import { RouterModule } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  isDarkMode = false;
  private isBrowser: boolean; // Variable para saber si estamos en el cliente

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId); // Inicializa la verificación
  }

  ngOnInit() {
    // Solo ejecutamos esto si estamos en el navegador
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.setDark();
      }
    }
  }

  toggleTheme() {
    this.isDarkMode ? this.setLight() : this.setDark();
  }

  private setDark() {
    this.isDarkMode = true;
    if (this.isBrowser) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  private setLight() {
    this.isDarkMode = false;
    if (this.isBrowser) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }
}