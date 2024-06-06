import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { SubUserComponent } from './sub-user/sub-user.component';
import { SubListProfitComponent } from './sub-list-profit/sub-list-profit.component';

const routes: Routes = [
  {
    path: 'sub-list-profit',
    component: SubListProfitComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubuserRoutingModule {}
