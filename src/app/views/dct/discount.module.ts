import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountComponent } from './discount/discount.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import { dctRoutingModule } from './discount.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [DiscountComponent],
  imports: [
    CommonModule,
    NgPersianDatepickerModule,
    InputNumberModule,
    SharedDirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    dctRoutingModule,
    InputTextModule,
    SliderModule,
    CalendarModule,
    NgxPaginationModule,
    DatePipe,
  ],
})
export class DiscountModule {}
