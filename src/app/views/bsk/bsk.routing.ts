import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { InvoiceComponent } from './invoice/invoice.component';
import { LicenseUpdateComponent } from './license-update/license-update.component';
import { LicenseComponent } from './license/license.component';
import { OrderComponent } from './order/order.component';
import { UserOrderComponent } from './user-order/user-order.component';

const routes: Routes = [
  {
    path: 'orders',
    component: OrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-orders',
    component: UserOrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoice/:orderId',
    component: InvoiceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'license',
    component: LicenseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'license/updates',
    component: LicenseUpdateComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BskRoutingModule {}
