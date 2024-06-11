import { NgModule } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { BskRoutingModule } from './bsk.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { TransactionStatusPipe } from 'src/app/shared/pipes/transaction-status.pipe';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { PaymentStatusPipe } from 'src/app/shared/pipes/payment-status.pipe';
import { BankTypePipe } from 'src/app/shared/pipes/bank-type.pipe';
import { BankMethodPipe } from 'src/app/shared/pipes/bank-method.pipe';
import { IsConfirmedPipe } from 'src/app/shared/pipes/is-confirmed.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { UserOrderComponent } from './user-order/user-order.component';
import { OrdersComponent } from './order/components/orders/orders.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TabViewModule } from 'primeng/tabview';
import { OrderDetailPipe } from './order/components/order-detail.pipe';
import { TableHeaderPipe } from './order/components/table-header.pipe';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { EditComponent } from 'src/app/shared/components/edit/edit.component';
import { OrderDetailComponent } from './order/components/order-detail/order-detail.component';
import { ItemsBasketComponent } from './order/components/items-basket/items-basket.component';
import { DeleteComponent } from 'src/app/shared/components/delete/delete.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { AdditionComponent } from 'src/app/shared/components/addition/addition.component';
import { LicenseComponent } from './order/components/license/license.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AddOrderComponent } from './order/components/add-order/add-order.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PlanTypePipe } from 'src/app/shared/pipes/planType.pipe';
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    // OrderComponent,
    TransactionStatusPipe,
    PaymentStatusPipe,
    BankTypePipe,
    BankMethodPipe,
    IsConfirmedPipe,
    OrderDetailPipe,
    PlanTypePipe,
    UserOrderComponent,
    OrdersComponent,
    TableHeaderPipe,
    EditComponent,
    DeleteComponent,
    OrderDetailComponent,
    ItemsBasketComponent,
    AdditionComponent,
    AddOrderComponent,
    LicenseComponent,
  ],
  imports: [
    SelectButtonModule,
    SharedModule,
    CalendarModule,
    InputNumberModule,
    DropdownModule,
    InputTextModule,
    RadioButtonModule,
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
    SharedDirectivesModule,
    DialogModule,
    TabViewModule,
    NgxSpinnerModule,
    TooltipModule,
    MultiSelectModule,
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
