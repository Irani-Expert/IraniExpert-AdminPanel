import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { UserNeedComponent } from './user-need/user-need.component';

const routes: Routes = [
  {
    path: 'user-need',
    component: UserNeedComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShrRoutingModule {}
