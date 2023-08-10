import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { CommissionComponent } from './commission/commission.component';
import { OrderComponent } from './order/order.component';
import { UserOrderComponent } from './user-order/user-order.component';

const routes: Routes = [
  {
    path: 'orders/:pageIndex',
    component: OrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-orders',
    component: UserOrderComponent,
    canActivate: [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BskRoutingModule {}
