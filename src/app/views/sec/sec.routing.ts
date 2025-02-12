import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { UserMangementComponent } from './user-mangement/user-mangement.component';
import { PermissionsComponent } from './permissions/permissions.component';

const routes: Routes = [
  {
    path: 'user-management/:pageNumber',
    component: UserMangementComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'permissions',
    component: PermissionsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecRoutingModule {}
