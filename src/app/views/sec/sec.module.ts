import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecRoutingModule } from './sec.routing';
import { UserMangementComponent } from './user-mangement/user-mangement.component';
import { RoleMangementComponent } from './role-mangement/role-mangement.component';
import { UserRoleComponent } from './user-role/user-role.component';


@NgModule({
  declarations: [
    UserMangementComponent,
    RoleMangementComponent,
    UserRoleComponent
  ],
  imports: [
    CommonModule,
    SecRoutingModule
  ]
})
export class SecModule { }
