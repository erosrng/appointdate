import { Injectable, signal } from '@angular/core';

export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface DashboardStats {
  totalAppointments: number;
  totalPatients: number;
  revenue: number;
  pendingAppointments: number;
}

@Injectable({
  providedIn: 'root',
})
export class MedicalDashboardService {
  private statsSignal = signal<DashboardStats>({
    totalAppointments: 0,
    totalPatients: 0,
    revenue: 0,
    pendingAppointments: 0,
  });
  public stats = this.statsSignal.asReadonly();

  private appointmentsSignal = signal<Appointment[]>([]);
  public appointments = this.appointmentsSignal.asReadonly();

  loadSampleData() {
    this.statsSignal.set({
      totalAppointments: 48,
      totalPatients: 156,
      revenue: 2400,
      pendingAppointments: 12,
    });

    this.appointmentsSignal.set([
      { id: '1', patientName: 'María Pérez', date: '2026-05-27', time: '09:00', status: 'confirmed' },
      { id: '2', patientName: 'Carlos Gómez', date: '2026-05-27', time: '10:30', status: 'pending' },
      { id: '3', patientName: 'Ana Rodríguez', date: '2026-05-28', time: '14:00', status: 'confirmed' },
    ]);
  }
}
