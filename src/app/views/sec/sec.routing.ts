import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { PrivilegeComponent } from './privilege/privilege.component';
import { UserPrivilegeComponent } from './privilege/user-privilege/user-privilege.component';
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
  {
    path: 'privilege',
    component: PrivilegeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-privilege',
    component: UserPrivilegeComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecRoutingModule {}
