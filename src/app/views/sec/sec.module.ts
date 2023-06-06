import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecRoutingModule } from './sec.routing';
import { UserMangementComponent } from './user-mangement/user-mangement.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { PrivilegeComponent } from './privilege/privilege.component';
import { UserPrivilegeComponent } from './privilege/user-privilege/user-privilege.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PermissionsComponent } from './permissions/permissions.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [
    UserMangementComponent,
    PrivilegeComponent,
    UserPrivilegeComponent,
    PermissionsComponent,
  ],
  imports: [
    NgxPaginationModule,
    DragDropModule,
    CommonModule,
    SecRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    NgMultiSelectDropDownModule,
    PerfectScrollbarModule,

  ],
})
export class SecModule {}
