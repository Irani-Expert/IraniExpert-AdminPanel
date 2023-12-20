import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlListComponent } from './url-list/url-list.component';
import { SingleUrlComponent } from './singel-url/single-url.component';

const routes: Routes = [
  {
    path: '',
    component: UrlListComponent,
  },
  {
    path: 'detail/:id',
    component: SingleUrlComponent,
  },
  {
    path: 'add',
    component: SingleUrlComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UrvRoutingModule {}
