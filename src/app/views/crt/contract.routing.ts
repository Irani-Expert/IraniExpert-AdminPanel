import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { AllCommissionComponent } from './all-commission/all-commission.component';
import { ProfitsComponent } from './profits/profits.component';
const routes: Routes = [


  {
    path: 'profits',
    component: ProfitsComponent,
    canActivate: [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrtRoutingModule {}
