import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUpdateComponent } from './addUpdate/addUpdate.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { LearnComponent } from './addUpdate/learn/learn.component';
import { FAQComponent } from './addUpdate/faq/faq.component';
const routes: Routes = [
  {
    path: 'addUpdate',
    component: AddUpdateComponent
  },
  {
    path: 'products-list',
    component: ProductsListComponent
  },
  {
    path: 'learn',
    component: LearnComponent
  },
  {
    path: 'faq',
    component: FAQComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

  ],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
