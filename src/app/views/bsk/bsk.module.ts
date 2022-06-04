import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BskRoutingModule } from './bsk.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderComponent } from './order/order.component';

@NgModule({
  declarations: [OrderComponent],
  imports: [CommonModule, BskRoutingModule, NgxPaginationModule],
})
export class BskModule {}
