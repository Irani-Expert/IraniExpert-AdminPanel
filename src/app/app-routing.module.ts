import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { AuthGaurd } from './shared/services/auth.gaurd';

const adminRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./views/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'prd',
    loadChildren: () =>
      import('./views/prd/prd.module').then((m) => m.PhrModule),
  },
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/v1',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./views/session/session.module').then(m => m.SessionModule)
      }
    ]
  },
  {
    path: 'prd',
    children: [
      {
        path: 'prd',
        loadChildren: () => import('./views/prd/prd.module').then(m => m.PhrModule)
      }
    ]
  },
  // {
  //   path: '',
  //   component: BlankLayoutComponent,
  //   children: [
  //     {
  //       path: 'others',
  //       loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule)
  //     }
  //   ]
  // },
  {
    path: '',
    component: AdminLayoutSidebarLargeComponent,
    children: adminRoutes,
    canActivate: [AuthGaurd],

  },

  {
    path: '**',
    redirectTo: 'session/404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
