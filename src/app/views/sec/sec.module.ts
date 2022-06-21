import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecRoutingModule } from './sec.routing';
import { UserMangementComponent } from './user-mangement/user-mangement.component';
import { RoleMangementComponent } from './role-mangement/role-mangement.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    UserMangementComponent,
    RoleMangementComponent,
    UserRoleComponent,
  ],
  imports: [CommonModule, SecRoutingModule, NgbModule],
})
export class SecModule {}
