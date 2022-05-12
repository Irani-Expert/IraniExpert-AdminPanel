import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUpdateComponent } from './addUpdate/addUpdate.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { LearnComponent } from './learn/learn.component';
import { FAQComponent } from './faq/faq.component';
import { PlanComponent } from './plan/plan.component';
import { BackTestComponent } from './back-test/back-test.component';
import { CommentComponent } from './comment/comment.component';
const routes: Routes = [
  {
    path: 'addUpdate',
    component: AddUpdateComponent,
  },
  {
    path: 'addUpdate/:productId',
    component: AddUpdateComponent,
  },
  {
    path: 'products-list',
    component: ProductsListComponent,
  },
  {
    path: 'lern/:productId',
    component: LearnComponent,
  },
  {
    path: 'faq/:tableType/:productId',
    component: FAQComponent,
  },
  {
    path: 'plan/:productId',
    component: PlanComponent,
  },

  {
    path: 'comment/:tableType/:productId',
    component: CommentComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
