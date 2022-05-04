import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';

const adminRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./views/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'session',
    loadChildren: () =>
      import('./views/session/session.module').then((m) => m.SessionModule),
  },
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/v1',
    pathMatch: 'full',
  },
  // {
  //   path: '',
  //   component: AuthLayoutComponent,
  //   children: [
  //     {
  //       path: 'sessions',
  //       loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule)
  //     }
  //   ]
  // },
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
