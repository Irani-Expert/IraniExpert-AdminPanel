import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { InvoiceComponent } from './invoice/invoice.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  {
    path: 'orders',
    component: OrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoice/:orderId',
    component: InvoiceComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BskRoutingModule {}
