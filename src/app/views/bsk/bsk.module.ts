import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BskRoutingModule } from './bsk.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderComponent } from './order/order.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { TransactionStatusPipe } from 'src/app/shared/pipes/transaction-status.pipe';

@NgModule({
  declarations: [OrderComponent, InvoiceComponent, TransactionStatusPipe],
  imports: [CommonModule, BskRoutingModule, NgxPaginationModule],
})
export class BskModule {}
