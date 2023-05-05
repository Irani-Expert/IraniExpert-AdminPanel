import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { BskRoutingModule } from './bsk.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderComponent } from './order/order.component';
import { TransactionStatusPipe } from 'src/app/shared/pipes/transaction-status.pipe';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { PaymentStatusPipe } from 'src/app/shared/pipes/payment-status.pipe';
import { BankTypePipe } from 'src/app/shared/pipes/bank-type.pipe';
import { BankMethodPipe } from 'src/app/shared/pipes/bank-method.pipe';
import { IsConfirmedPipe } from 'src/app/shared/pipes/is-confirmed.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { UserOrderComponent } from './user-order/user-order.component';
// import { JalaliPipe } from 'src/app/shared/pipes/jalali-time.pipe';
import { CommissionComponent } from './commission/commission.component';
import { TreeModule } from 'primeng/tree';

@NgModule({
  declarations: [
    OrderComponent,
    // InvoiceComponent, //Deleted
    TransactionStatusPipe,
    PaymentStatusPipe,
    BankTypePipe,
    BankMethodPipe,
    IsConfirmedPipe,
    // LicenseComponent,
    UserOrderComponent,
    
    // LicenseUpdateComponent, //Deleted

    // CommissionComponent,
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
  
    DatePipe,
    TreeModule,
  ],
  providers: [FileUploaderService, DecimalPipe],
})
export class BskModule {}
