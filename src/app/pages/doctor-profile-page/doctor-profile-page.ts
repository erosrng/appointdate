import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { API_URL } from '../../app.config';

@Component({
  selector: 'app-doctor-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './doctor-profile-page.html',
  styleUrl: './doctor-profile-page.scss',
})
export class DoctorProfilePage implements OnInit {
  profile: any = null;
  isLoading = true;
  slug = '';

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
    this.isLoading = true;
    const body = { proveed: this.slug, slug: this.slug };
    this.http.post(`${API_URL}perfil_publico`, body).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status) this.profile = res.data;
      },
      error: () => (this.isLoading = false),
    });
  }
}
