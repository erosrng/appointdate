import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../app/pages/home-page/home-page').then(m => m.HomePage)
  },
  {
    path: 'home',
    loadComponent: () => import('../app/pages/home-page/home-page').then(m => m.HomePage)
  },
  {
    path: 'servicios',
    loadComponent: () => import('../app/pages/services-page/services-page').then(m => m.ServicesPage)
  },
  {
    path: 'authprv',
    loadComponent: () => import('../app/pages/authprv-page/authprv-page').then(m => m.AuthprvPage)
  },
  {
    path: 'dashboardprv',
    loadComponent: () => import('../app/pages/dashboardprv-page/dashboardprv-page').then(m => m.DashboardprvPage),
    children: [
      {
        // Vinculado a "Mis Servicios" en el Sidebar
        path: 'servicios', 
        loadComponent: () => import('../app/pages/dashboardprv-page/itemsprv/itemsprv').then(m => m.Itemsprv)
      },
       {
        // Vinculado a "Horarios de Atención"
        path: 'perfilprv',
        loadComponent: () => import('../app/pages/dashboardprv-page/perfilprv/perfilprv').then(m => m.Perfilprv)
      },
      /*{
        // Vinculado a "Mis Artículos"
        path: 'articulos',
        loadComponent: () => import('../pages/dashboardprv-page/articulosprv/articulosprv').then(m => m.Articulosprv)
      },
      {
        // Vinculado a "Vista Pública" (Perfil del proveedor)
        path: 'perfil',
        loadComponent: () => import('../pages/dashboardprv-page/perfilprv/perfilprv').then(m => m.Perfilprv)
      }, */
      { 
        path: '', 
        redirectTo: 'servicios', 
        pathMatch: 'full' 
      }
    ]
  },
  {
    path: ':slug', // Para que funcione apoint.io/dr-eros
    loadComponent: () => import('../app/pages/perfil-page/perfil-page').then(m => m.PerfilPage)
  },
];