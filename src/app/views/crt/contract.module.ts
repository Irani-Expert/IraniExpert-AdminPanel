import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractListComponent } from './contract-list/contract-list.component';
import { CrtRoutingModule } from './contract.routing';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [ContractListComponent],
  imports: [CrtRoutingModule, CommonModule,NgPersianDatepickerModule,FormsModule,ReactiveFormsModule]
    ,
})
export class ContractModule {}
