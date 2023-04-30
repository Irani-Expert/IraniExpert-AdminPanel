import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';

const routes: Routes = [
  {
    path: 'log-info',
    component: LogsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogRoutingModule { }
