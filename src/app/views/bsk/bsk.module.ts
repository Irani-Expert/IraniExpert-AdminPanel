import { NgModule } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { BskRoutingModule } from './bsk.routing';
import { NgxPaginationModule } from 'ngx-pagination';
// import { OrderComponent } from './order/order.component';
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
// import { TreeModule } from 'primeng/tree';
import { OrdersComponent } from './order/components/orders/orders.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { OrderDetailPipe } from './order/components/order-detail.pipe';
import { TableHeaderPipe } from './order/components/table-header.pipe';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { EditComponent } from 'src/app/shared/components/edit/edit.component';

@NgModule({
  declarations: [
    // OrderComponent,
    TransactionStatusPipe,
    PaymentStatusPipe,
    BankTypePipe,
    BankMethodPipe,
    IsConfirmedPipe,
    OrderDetailPipe,
    UserOrderComponent,
    OrdersComponent,
    TableHeaderPipe,
    EditComponent,
  ],
  imports: [
    InputTextModule,
    DynamicDialogModule,
    ContextMenuModule,
    SidebarModule,
    ButtonModule,
    DragScrollModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BskRoutingModule,
    NgxPaginationModule,
    SharedPipesModule,
    PerfectScrollbarModule,
    SharedDirectivesModule,
    DialogModule,
    TabViewModule,
  ],
  providers: [
    FileUploaderService,
    DecimalPipe,
    TransactionStatusPipe,
    CurrencyPipe,
    DatePipe,
  ],
})
export class BskModule {}
