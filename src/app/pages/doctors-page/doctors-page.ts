import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { API_URL } from '../../app.config';

@Component({
  selector: 'app-doctors-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './doctors-page.html',
  styleUrl: './doctors-page.scss',
})
export class DoctorsPage implements OnInit {
  doctors = signal<any[]>([]);
  specialties = signal<any[]>([]);
  estados = signal<any[]>([]);
  municipios = signal<any[]>([]);

  search = signal('');
  selectedSpecialty = signal('');
  selectedEstado = signal('');
  selectedMunicipio = signal('');
  page = signal(1);
  totalPages = signal(1);
  isLoading = signal(false);
  loadingEstados = signal(false);
  loadingMunicipios = signal(false);

  hasMorePages = computed(() => this.page() < this.totalPages());
  hasPrevPage = computed(() => this.page() > 1);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSpecialties();
    this.loadEstados();
    this.searchDoctors();
  }

  loadSpecialties() {
    this.http.post(`${API_URL}buscagrupoprv`, {}).subscribe({
      next: (res: any) => {
        if (res.status) this.specialties.set(res.data || []);
      },
    });
  }

  loadEstados() {
    this.loadingEstados.set(true);
    this.http.post(`${API_URL}estados`, {}).subscribe({
      next: (res: any) => {
        this.loadingEstados.set(false);
        if (res.status) this.estados.set(res.data || []);
      },
      error: () => this.loadingEstados.set(false),
    });
  }

  onEstadoChange() {
    this.selectedMunicipio.set('');
    this.municipios.set([]);
    const estadoId = this.selectedEstado();
    if (!estadoId) return;
    this.loadingMunicipios.set(true);
    this.http.post(`${API_URL}municipios`, { estado_id: estadoId }).subscribe({
      next: (res: any) => {
        this.loadingMunicipios.set(false);
        if (res.status) this.municipios.set(res.data || []);
      },
      error: () => this.loadingMunicipios.set(false),
    });
  }

  searchDoctors() {
    this.isLoading.set(true);
    this.page.set(1);
    this.executeSearch();
  }

  private executeSearch() {
    const body: any = { page: this.page(), limit: 12 };
    const s = this.search().trim();
    if (s) body.search = s;
    if (this.selectedSpecialty()) body.especialidad = this.selectedSpecialty();
    if (this.selectedEstado()) body.estado = this.selectedEstado();
    if (this.selectedMunicipio()) body.municipio = this.selectedMunicipio();
    this.http.post(`${API_URL}listar_publico`, body).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res.status) {
          this.doctors.set(res.data || []);
          this.totalPages.set(res.totalPages || 1);
        }
      },
      error: () => this.isLoading.set(false),
    });
  }

  prevPage() {
    if (this.hasPrevPage()) {
      this.page.update(p => p - 1);
      this.isLoading.set(true);
      this.executeSearch();
    }
  }

  nextPage() {
    if (this.hasMorePages()) {
      this.page.update(p => p + 1);
      this.isLoading.set(true);
      this.executeSearch();
    }
  }

  clearFilters() {
    this.search.set('');
    this.selectedSpecialty.set('');
    this.selectedEstado.set('');
    this.selectedMunicipio.set('');
    this.municipios.set([]);
    this.searchDoctors();
  }
}
