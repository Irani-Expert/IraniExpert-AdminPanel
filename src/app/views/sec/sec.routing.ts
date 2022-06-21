import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { RoleMangementComponent } from './role-mangement/role-mangement.component';
import { UserMangementComponent } from './user-mangement/user-mangement.component';
import { UserRoleComponent } from './user-role/user-role.component';

const routes: Routes = [
  {
    path: 'user-role',
    component: UserRoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-management',
    component: UserMangementComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'role-management',
    component: RoleMangementComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecRoutingModule {}
