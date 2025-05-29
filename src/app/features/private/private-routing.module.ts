
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivatePage } from './private.page';
// import { RoleGuard } from 'src/app/core/guards/role/role.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PrivatePage,
    children: [
      {
        path: 'dashboard',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'certificaciones',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/certificaciones/cert.module').then(m => m.CertPageModule)
      },
      {
        path: 'settings',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/settings/setting.module').then(m => m.SettingPageModule)
      },
      {
        path: 'users',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/users/users.module').then(m => m.UsersPageModule)
      },
      {
        path: 'firma',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/firma/firma.module').then(m => m.FirmaPageModule)
      },
      {
        path: 'aceecf',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/aceecf/aceecf.module').then(m => m.AceecfPageModule)
      },
      {
        path: 'simulacion',
        // canActivate: [RoleGuard],
        loadChildren: () => import('./pages/simulacion/simulacion.module').then(m => m.SimulacionPageModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
