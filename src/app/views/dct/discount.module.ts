import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountComponent } from './discount/discount.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import { dctRoutingModule } from './discount.routing';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    DiscountComponent
  ],
  imports: [
    CommonModule,NgPersianDatepickerModule,
    FormsModule,ReactiveFormsModule,dctRoutingModule,NgxPaginationModule
  ]
})
export class DiscountModule { }
