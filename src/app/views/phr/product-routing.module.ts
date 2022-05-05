import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackTestComponent } from './back-test/back-test.component';
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
  },  {
    path: 'back-test',
    component: BackTestComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

  ],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
