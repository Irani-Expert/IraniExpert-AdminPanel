import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecRoutingModule } from './sec.routing';
import { UserMangementComponent } from './user-mangement/user-mangement.component';
import { RoleMangementComponent } from './role-mangement/role-mangement.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { PrivilegeComponent } from './privilege/privilege.component';
import { UserPrivilegeComponent } from './privilege/user-privilege/user-privilege.component';

@NgModule({
  declarations: [
    UserMangementComponent,
    RoleMangementComponent,
    UserRoleComponent,
    PrivilegeComponent,
    UserPrivilegeComponent,
  ],
  imports: [
    NgxPaginationModule,
    CommonModule,
    SecRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPipesModule,
  ],
})
export class SecModule {}
