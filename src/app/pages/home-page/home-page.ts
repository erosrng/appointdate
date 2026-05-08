import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  benefits = [
    { icon: 'schedule', title: 'Ahorra tiempo', desc: 'Despídete de las llamadas para confirmar citas.' },
    { icon: 'trending_down', title: 'Reduce no-shows', desc: 'Los clientes confirmarán con un solo clic.' },
    { icon: 'person_add', title: 'Más clientes', desc: 'Ofrece una experiencia cómoda y moderna.' },
    { icon: 'savings', title: 'Gana más dinero', desc: 'Optimiza tu tiempo y maximiza tus ingresos.' }
  ];

  constructor(
    private title: Title, 
    private meta: Meta,
    private el: ElementRef,
    private renderer: Renderer2,
    
  ) {}

  ngOnInit() {
    this.title.setTitle('Apoint | Sistema de Citas Online en Venezuela');
    this.meta.updateTag({ name: 'description', content: 'Reserva citas médicas, técnicas y de servicios en Venezuela con Apoint. La mejor plataforma para profesionales.' });
    this.meta.updateTag({ name: 'keywords', content: 'citas online, agendamiento, médicos venezuela, software de gestión' });
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
}