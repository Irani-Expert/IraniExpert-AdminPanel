import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { AllCommissionComponent } from './all-commission/all-commission.component';
import { ContractListComponent } from './contract-list/contract-list.component';
const routes: Routes = [
  {
    path: 'list',
    component: ContractListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'all-comission',
    component: AllCommissionComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrtRoutingModule {}
