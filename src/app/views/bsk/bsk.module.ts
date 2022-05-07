import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BskRoutingModule } from './bsk.routing';
import { OrdersComponent } from './orders/orders.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    BskRoutingModule,
    NgxPaginationModule,

  ]
})
export class BskModule { }
