
import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

@Component({
  selector: 'app-services-page',
    imports: [
      CommonModule,
      MatIconModule,
      MatButtonModule 
    ],
    templateUrl: './services-page.html',
  styleUrl: './services-page.scss',
})
export class ServicesPage implements OnInit {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}
  // Mock data: Esto vendría de tu API de PHP/MySQL
  servicios = [
    { 
      id: 1, 
      name: 'Consulta de Control Anual', 
      category: 'Salud', 
      price: 50, 
      duration: 30, 
      description: 'Chequeo completo de signos vitales, revisión de exámenes y prescripción médica.' 
    },
    { 
      id: 2, 
      name: 'Evaluación Cardiovascular', 
      category: 'Salud', 
      price: 80, 
      duration: 45, 
      description: 'Estudio profundo del sistema circulatorio con electrocardiograma básico incluido.' 
    },
    { 
      id: 3, 
      name: 'Telemedicina / Consulta Online', 
      category: 'Salud', 
      price: 35, 
      duration: 20, 
      description: 'Atención remota para dudas rápidas, lectura de resultados o renovación de recetas.' 
    }
  ];

  ngOnInit(): void {
    // Aquí llamarías a tu servicio inyectado: this.apiService.getServicesByProvider(id)
  }

  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    // Solo ejecuta esto si estamos en el navegador
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

  agendar(servicio: any) {
    console.log('Iniciando proceso de reserva para:', servicio.name);
    // Redirigir al calendario o abrir modal de fecha
  }
}