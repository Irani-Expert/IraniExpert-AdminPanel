import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { LoginAsUserComponent } from './views/dashboard/login-as-user/login-as-user.component';
import { NotFoundComponent } from './views/session/not-found/not-found.component';

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
  // {
  //   path: 'mrk',
  //   loadChildren: () =>
  //     import('./views/mrk/subuser.module').then((m) => m.SubuserModule),
  // },
  {
    path: 'bsk',
    loadChildren: () =>
      import('./views/bsk/bsk.module').then((m) => m.BskModule),
  },
  {
    path: 'shr',
    loadChildren: () =>
      import('./views/shr/shr.module').then((m) => m.ShrModule),
  },
  {
    path: 'sec',
    loadChildren: () =>
      import('./views/sec/sec.module').then((m) => m.SecModule),
  },
  // {
  //   path: 'crt',
  //   loadChildren: () =>
  //     import('./views/crt/contract.module').then((m) => m.ContractModule),
  // },
  {
    path: 'urv',
    loadChildren: () =>
      import('./views/urv/urv.module').then((m) => m.UrvModule),
  },
  {
    path: 'dct',
    loadChildren: () =>
      import('./views/dct/discount.module').then((m) => m.DiscountModule),
  },
  // {
  //   path: 'log-info',
  //   loadChildren: () =>
  //     import('./views/Log/log.module').then((m) => m.LogModule),
  // },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./views/cln/cln.module').then((m) => m.ClnModule),
  },
  {
    path: 'mcm',
    loadChildren: () =>
      import('./views/mcm/mcm.module').then((m) => m.McmModule),
  },
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/v1',
    pathMatch: 'full',
  },
  {
    path: 'checkUserPermission',
    pathMatch: 'full',
    component: LoginAsUserComponent,
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () =>
          import('./views/session/session.module').then((m) => m.SessionModule),
      },
    ],
  },
  {
    path: 'prd',
    component: NotFoundComponent,
    children: [
      {
        path: 'prd',
        loadChildren: () =>
          import('./views/prd/prd.module').then((m) => m.PrdModule),
      },
      {
        path: 'prd/**',
        component: NotFoundComponent,
      },
    ],
  },

  {
    path: 'bas',
    component: NotFoundComponent,
    children: [
      {
        path: 'bas',
        loadChildren: () =>
          import('./views/bsk/bsk.module').then((m) => m.BskModule),
      },
    ],
  },
  // {
  //   path: 'mrk',
  //   component: NotFoundComponent,
  //   // children: [
  //   //   {
  //   //     path: 'mrk',
  //   //     loadChildren: () =>
  //   //       import('./views/mrk/subuser.module').then((m) => m.SubuserModule),
  //   //   },
  //   // ],
  // },
  {
    path: 'cnt',
    component: NotFoundComponent,
    children: [
      {
        path: 'cnt',
        loadChildren: () =>
          import('./views/cnt/cnt.module').then((m) => m.CntModule),
      },
    ],
  },
  // {
  //   path: 'crt',
  //   component: NotFoundComponent,
  //   children: [
  //     {
  //       path: 'crt',
  //       loadChildren: () =>
  //         import('./views/crt/contract.module').then((m) => m.ContractModule),
  //     },
  //   ],
  // },
  {
    path: 'dct',
    component: NotFoundComponent,
    children: [
      {
        path: 'dct',
        loadChildren: () =>
          import('./views/dct/discount.module').then((m) => m.DiscountModule),
      },
    ],
  },
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   component: NotFoundComponent,
  //   // children: [
  //   //   {
  //   //     path: 'log-info',
  //   //     loadChildren: () =>
  //   //       import('./views/Log/log.module').then((m) => m.LogModule),
  //   //   },
  //   // ],
  // },
  {
    path: 'bsk',
    component: NotFoundComponent,
    children: [
      {
        path: 'bsk',
        loadChildren: () =>
          import('./views/bsk/bsk.module').then((m) => m.BskModule),
      },
    ],
  },
  {
    path: 'shr',
    component: NotFoundComponent,
    children: [
      {
        path: 'shr',
        loadChildren: () =>
          import('./views/shr/shr.module').then((m) => m.ShrModule),
      },
    ],
  },
  {
    path: 'sec',
    component: NotFoundComponent,
    children: [
      {
        path: 'sec',
        loadChildren: () =>
          import('./views/sec/sec.module').then((m) => m.SecModule),
      },
    ],
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
    canActivate: [AuthGuard],
  },

  {
    path: '**',
    component: NotFoundComponent,
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
