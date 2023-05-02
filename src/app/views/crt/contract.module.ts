import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractListComponent } from './contract-list/contract-list.component';
import { CrtRoutingModule } from './contract.routing';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AllCommissionComponent } from './all-commission/all-commission.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragScrollModule } from 'ngx-drag-scroll';

import { NgxPaginationModule } from 'ngx-pagination';
import { ProfitsComponent } from './profits/profits.component';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';

@NgModule({
  declarations: [ContractListComponent, AllCommissionComponent, ProfitsComponent],
  imports: [
    CrtRoutingModule,
    CommonModule,
    NgPersianDatepickerModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPaginationModule,
    DragScrollModule,
    SharedDirectivesModule,

  ],
})
export class ContractModule {}
