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
import { LicenseComponent } from './license/license.component';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from 'ngx-perfect-scrollbar';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { UserOrderComponent } from './user-order/user-order.component';
import { LicenseUpdateComponent } from './license-update/license-update.component';
import { JalaliPipe } from 'src/app/shared/pipes/jalali-time.pipe';

@NgModule({
  declarations: [
    OrderComponent,
    InvoiceComponent,
    TransactionStatusPipe,
    PaymentStatusPipe,
    BankTypePipe,
    BankMethodPipe,
    IsConfirmedPipe,
    LicenseComponent,
    UserOrderComponent,
    LicenseUpdateComponent,
    JalaliPipe,
  ],
  imports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BskRoutingModule,
    NgxPaginationModule,
    SharedPipesModule,
    PerfectScrollbarModule,
    SharedDirectivesModule,
  ],
  providers: [
    FileUploaderService,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: PERFECT_SCROLLBAR_CONFIG },
  ],
})
export class BskModule {}
