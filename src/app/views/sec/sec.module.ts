import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecRoutingModule } from './sec.routing';
import { UserMangementComponent } from './user-mangement/user-mangement.component';
import { RoleMangementComponent } from './role-mangement/role-mangement.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    UserMangementComponent,
    RoleMangementComponent,
    UserRoleComponent,
  ],
  imports: [
    NgxPaginationModule
    CommonModule,
    SecRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SecModule {}
