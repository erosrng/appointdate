import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: '',
})
export class PerfilPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || '';
      this.router.navigate(['/doctor', slug], { replaceUrl: true });
    });
  }
}
