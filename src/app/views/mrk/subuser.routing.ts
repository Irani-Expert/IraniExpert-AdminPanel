import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { SubUserComponent } from './sub-user/sub-user.component';

const routes: Routes = [
{
  path: 'sub-user',
  component: SubUserComponent,
  canActivate: [AuthGuard],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubuserRoutingModule { }
