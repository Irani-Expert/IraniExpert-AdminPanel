import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractListComponent } from './contract-list/contract-list.component';
import { CrtRoutingModule } from './contract.routing';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';




@NgModule({
  declarations: [ContractListComponent],
  imports: [CrtRoutingModule, CommonModule,NgPersianDatepickerModule]
    ,
})
export class ContractModule {}
