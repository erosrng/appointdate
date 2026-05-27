import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { API_URL } from '../../app.config';

interface TimeSlot { desde: string; hasta: string; }
interface DiaHorario { dia: number; slots: TimeSlot[]; }
interface Clinica { id: string; nombre: string; horarios: DiaHorario[]; }
interface Redes { instagram: string; whatsapp: string; website: string; youtube: string; tiktok: string; }

interface DoctorProfile {
  proveed: string;
  nombre: string;
  rif: string;
  email: string;
  telefono: string;
  ciudad: string;
  estado: string;
  especialidad: string;
  foto: string | null;
  foto_filename: string | null;
  banner: string | null;
  banner_filename: string | null;
  about: string;
  clinicas: Clinica[];
  horarios: DiaHorario[];
  redes: Redes;
  color_theme: string;
  telefono_publico: string | null;
  website: string | null;
}

@Component({
  selector: 'app-doctor-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './doctor-profile-page.html',
  styleUrl: './doctor-profile-page.scss',
})
export class DoctorProfilePage implements OnInit {
  profile = signal<DoctorProfile | null>(null);
  isLoading = signal(true);
  notFound = signal(false);
  slug = '';

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  defaultBanner = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200';
  defaultAvatar = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') || '';
      this.loadProfile();
    });
  }

  loadProfile() {
    this.isLoading.set(true);
    this.notFound.set(false);
    const body = { proveed: this.slug, slug: this.slug };
    this.http.post(`${API_URL}perfil_publico`, body).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res?.status && res?.data) {
          const d = res.data.doctor || {};
          const p = res.data.profile || {};
          this.profile.set({
            proveed: d.proveed || '',
            nombre: d.nombre || '',
            rif: d.rif || '',
            email: d.email || '',
            telefono: d.telefono || d.telefono_publico || '',
            ciudad: d.ciudad || '',
            estado: d.estado || '',
            especialidad: p.especialidad || d.especialidad || '',
            foto: p.foto || null,
            foto_filename: p.foto_filename || null,
            banner: p.banner || null,
            banner_filename: p.banner_filename || null,
            about: p.about || '',
            clinicas: this.combinarClinicas(p.clinicas || [], p.horarios || []),
            horarios: p.horarios || [],
            redes: this.normalizarRedes(p.redes, p.website),
            color_theme: p.color_theme || '#0A6E6E',
            telefono_publico: p.telefono_publico || null,
            website: p.website || null,
          });
        } else {
          this.notFound.set(true);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.notFound.set(true);
      },
    });
  }

  private normalizarRedes(redes: any, website?: string): Redes {
    const base: Redes = { instagram: '', whatsapp: '', website: '', youtube: '', tiktok: '' };
    if (redes && typeof redes === 'object') Object.assign(base, redes);
    if (website && !base.website) base.website = website;
    return base;
  }

  private combinarClinicas(clinicasApi: any[], horariosApi: any[]): Clinica[] {
    if (!clinicasApi.length && !horariosApi.length) return [];

    return clinicasApi.map((cl: any) => {
      const id = cl.id || cl.nombre?.toLowerCase().replace(/\s+/g, '-');
      const related = horariosApi.filter((h: any) =>
        h.clinica_id === id || h.clinica_id === cl.id
      );
      return {
        id: id || `c${Date.now()}`,
        nombre: cl.nombre || '',
        horarios: related.length
          ? related.map((h: any) => ({
              dia: h.dia ?? 0,
              slots: (h.slots || []).sort((a: any, b: any) => a.desde.localeCompare(b.desde)),
            })).sort((a, b) => a.dia - b.dia)
          : [],
      };
    });
  }

  getInitiales(nombre: string): string {
    return nombre
      .split(' ')
      .map(p => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  hasRedes(): boolean {
    const p = this.profile();
    if (!p) return false;
    const r = p.redes;
    return !!(r.instagram || r.whatsapp || r.website || r.youtube || r.tiktok);
  }

  trackClinica(_: number, item: Clinica) { return item.id; }
}
