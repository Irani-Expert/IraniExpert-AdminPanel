import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { ProductsListComponent } from './products-list/products-list.component';


const routes: Routes = [
  {
    path: 'products',
    component: ProductComponent
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
