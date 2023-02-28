import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { DashboadDefaultComponent } from './dashboad-default/dashboad-default.component';
import { ReferralUserComponent } from './referral-user/referral-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: 'v1',
    component: DashboadDefaultComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'referral-user',
  //   component: ReferralUserComponent,
  //   canActivate: [AuthGuard]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
