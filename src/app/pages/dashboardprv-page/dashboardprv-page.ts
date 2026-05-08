import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './../../auth.service';

@Component({
  selector: 'app-dashboardprv-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './dashboardprv-page.html',
  styleUrl: './dashboardprv-page.scss',
})
export class DashboardprvPage implements OnInit, AfterViewInit {
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  public authService = inject(AuthService);
  private router = inject(Router);

  providerName: any;
  businessName = 'Desarrollador tal';
  isSidebarOpen = true; // Controla el estado de la barra

  ngOnInit() {
    this.providerName = this.authService.getNombre();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'visible');
          }
        });
      }, { threshold: 0.1 });

      const elements = this.el.nativeElement.querySelectorAll('[data-reveal]');
      elements.forEach((el: HTMLElement) => observer.observe(el));
    }
  }

  logout() {
    this.authService.logout();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/authprv']);
  }
}