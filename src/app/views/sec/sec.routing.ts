import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { PrivilegeComponent } from './privilege/privilege.component';
import { UserPrivilegeComponent } from './privilege/user-privilege/user-privilege.component';
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
