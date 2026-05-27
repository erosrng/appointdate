import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PLATFORM_ID, inject } from '@angular/core';
import { API_URL } from '../../app.config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit, AfterViewInit {
  featuredDoctors = signal<any[]>([]);
  loadingDoctors = signal(false);

  benefits = [
    { icon: 'schedule', title: 'Ahorra tiempo', desc: 'Despídete de las llamadas para confirmar citas. Reserva online 24/7.' },
    { icon: 'trending_down', title: 'Reduce no-shows', desc: 'Recordatorios automáticos y confirmación con un solo clic.' },
    { icon: 'person_add', title: 'Más pacientes', desc: 'Ofrece una experiencia cómoda y capta nuevos clientes.' },
    { icon: 'savings', title: 'Gana más', desc: 'Optimiza tu agenda y maximiza tus ingresos mensuales.' },
  ];

  constructor(
    private title: Title,
    private meta: Meta,
    private el: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient,
  ) {}

  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.title.setTitle('PillaDoc | Sistema de Citas Médicas en Venezuela');
    this.meta.updateTag({ name: 'description', content: 'Reserva citas médicas con los mejores especialistas de Venezuela. Conectamos pacientes con profesionales verificados.' });
    this.meta.updateTag({ name: 'keywords', content: 'citas online, médicos venezuela, agenda médica, salud digital, telemedicina' });
    this.loadFeaturedDoctors();
  }

  loadFeaturedDoctors() {
    this.loadingDoctors.set(true);
    this.http.post(`${API_URL}listar_publico`, { page: 1, limit: 6 }).subscribe({
      next: (res: any) => {
        this.loadingDoctors.set(false);
        if (res.status) this.featuredDoctors.set(res.data || []);
      },
      error: () => this.loadingDoctors.set(false),
    });
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
}
