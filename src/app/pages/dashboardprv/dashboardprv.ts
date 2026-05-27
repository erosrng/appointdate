import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../auth.service';
import { MedicalDashboardService } from './services/medical-dashboard';

@Component({
  selector: 'app-dashboardprv',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './dashboardprv.html',
  styleUrl: './dashboardprv.scss',
})
export class DashboardprvPage implements OnInit {
  constructor(
    public authService: AuthService,
    public dashboardService: MedicalDashboardService,
  ) {}

  ngOnInit(): void {
    this.dashboardService.loadSampleData();
  }

  logout() {
    this.authService.logout();
  }
}
