import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractListComponent } from './contract-list/contract-list.component';
import { CrtRoutingModule } from './contract.routing';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AllCommissionComponent } from './all-commission/all-commission.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [ContractListComponent, AllCommissionComponent],
  imports: [CrtRoutingModule, CommonModule,NgPersianDatepickerModule,NgMultiSelectDropDownModule,
    FormsModule,ReactiveFormsModule,NgbModule]
    ,
})
export class ContractModule {}
