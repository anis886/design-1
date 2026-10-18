import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'brands/bmw' },
  {
    path: 'brands',
    loadComponent: () => import('./pages/pages').then((m) => m.BrandsPageComponent),
  },
  {
    path: 'brands/:brand',
    loadComponent: () =>
      import('./model-collection/model-collection.component').then((m) => m.ModelCollectionComponent),
  },
  {
    path: 'cars/:brand/:slug',
    loadComponent: () => import('./pages/pages').then((m) => m.CarDetailPageComponent),
  },
  {
    path: 'compare',
    loadComponent: () => import('./pages/pages').then((m) => m.ComparePageComponent),
  },
  { path: '**', redirectTo: 'brands' },
];
