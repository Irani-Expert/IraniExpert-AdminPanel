import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { AuthGuard } from './shared/services/auth/auth.guard';

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
      import('./views/prd/prd.module').then((m) => m.PrdModule),
  },
  {
    path: 'bas',
    loadChildren: () =>
      import('./views/bas/bas.module').then((m) => m.BasModule),
  },

  {
    path: 'cnt',
    loadChildren: () =>
      import('./views/cnt/cnt.module').then((m) => m.CntModule),
  },

  {
    path: 'bsk',
    loadChildren: () =>
      import('./views/bsk/bsk.module').then((m) => m.BskModule),
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
        loadChildren: () => import('./views/prd/prd.module').then(m => m.PrdModule)
      }
    ]
  },

  {
    path: 'bas',
    children: [
      {
        path: 'bas',
        loadChildren: () => import('./views/bsk/bsk.module').then((m) => m.BskModule),
      }
    ]
  },


  {
    path: 'cnt',
    children: [
      {
        path: 'cnt',
        loadChildren: () => import('./views/cnt/cnt.module').then(m => m.CntModule)
      }
    ]
  },

  {
    path: 'bsk',
    children: [
      {
        path: 'bsk',
        loadChildren: () => import('./views/bsk/bsk.module').then(m => m.BskModule)
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
    canActivate: [AuthGuard]
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
