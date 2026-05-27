import { Injectable, signal } from '@angular/core';

export interface ProfileData {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  description: string;
  photoUrl: string;
  rating: number;
  totalReviews: number;
  location: string;
}

@Injectable({
  providedIn: 'root',
})
export class DoctorProfileService {
  private profileSignal = signal<ProfileData | null>(null);
  public profile = this.profileSignal.asReadonly();

  loadSampleData() {
    this.profileSignal.set({
      name: 'Dr. Alejandro Rangel',
      specialty: 'Medicina General / Cardiología',
      email: 'alejandro@apoint.io',
      phone: '+58 414-1234567',
      description: 'Profesional con más de 15 años de experiencia en el sector salud...',
      photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
      rating: 4.8,
      totalReviews: 124,
      location: 'Caracas, Venezuela',
    });
  }

  updateProfile(data: Partial<ProfileData>) {
    const current = this.profileSignal();
    if (current) {
      this.profileSignal.set({ ...current, ...data });
    }
  }
}
