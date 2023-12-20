import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlListComponent } from './url-list/url-list.component';
import { SingleUrlComponent } from './singel-url/single-url.component';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UrlListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'detail/:id',
    component: SingleUrlComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UrvRoutingModule {}
