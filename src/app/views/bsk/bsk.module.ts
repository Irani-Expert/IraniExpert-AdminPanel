import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BskRoutingModule } from './bsk.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderComponent } from './order/order.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { TransactionStatusPipe } from 'src/app/shared/pipes/transaction-status.pipe';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { PaymentStatusPipe } from 'src/app/shared/pipes/payment-status.pipe';
import { BankTypePipe } from 'src/app/shared/pipes/bank-type.pipe';
import { BankMethodPipe } from 'src/app/shared/pipes/bank-method.pipe';
import { IsConfirmedPipe } from 'src/app/shared/pipes/is-confirmed.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OrderComponent,
    InvoiceComponent,
    TransactionStatusPipe,
    PaymentStatusPipe,
    BankTypePipe,
    BankMethodPipe,
    IsConfirmedPipe,
  ],
  imports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BskRoutingModule,
    NgxPaginationModule,
    SharedPipesModule,
  ],
})
export class BskModule {}
