import { FormProcessesComponent } from './components/processes/form-processes/form-processes.component';
import { Routes } from '@angular/router';
import { authGuard } from './utils/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivateChild: [authGuard],
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'processes',
        loadComponent: () => import('./components/processes/processes.component').then(m => m.ProcessesComponent),
      },
      {
        path: 'processes/:id',
        loadComponent: () => import('./components/processes/form-processes/form-processes.component').then(m => m.FormProcessesComponent),
      },
      {
        path: 'processes/new',
        loadComponent: () => import('./components/processes/form-processes/form-processes.component').then(m => m.FormProcessesComponent),
      },
      {
        path: 'manage',
        loadComponent: () => import('./components/manage/manage-processes.component').then(m => m.ManageProcessesComponent),
      }
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
