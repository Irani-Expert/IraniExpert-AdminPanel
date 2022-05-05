import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUpdateComponent } from './addUpdate/addUpdate.component';
import { ProductsListComponent } from './products-list/products-list.component';


const routes: Routes = [
  {
    path: 'addUpdate',
    component: AddUpdateComponent
  },
  {
    path: 'products-List',
    component: ProductsListComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

  ],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
