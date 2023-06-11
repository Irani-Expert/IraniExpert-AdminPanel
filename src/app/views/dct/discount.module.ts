import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountComponent } from './discount/discount.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import { dctRoutingModule } from './discount.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';

@NgModule({
  declarations: [DiscountComponent],
  imports: [
    CommonModule,
    NgPersianDatepickerModule,
    SharedDirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    dctRoutingModule,
    NgxPaginationModule,
    DatePipe,
  ],
})
export class DiscountModule {}
