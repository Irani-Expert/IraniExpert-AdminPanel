import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUpdateComponent } from './addUpdate/addUpdate.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { LearnComponent } from './learn/learn.component';
import { FAQComponent } from './faq/faq.component';
import { PlanComponent } from './plan/plan.component';
import { BackTestComponent } from './back-test/back-test.component';
import { CommentComponent } from './comment/comment.component';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
const routes: Routes = [
  {
    path: 'addUpdate',
    component: AddUpdateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addUpdate/:productId',
    component: AddUpdateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'products-list',
    component: ProductsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lern/:productId',
    component: LearnComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'faq/:tableType/:productId',
    component: FAQComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'plan/:productId',
    component: PlanComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'comment/:tableType/:productId',
    component: CommentComponent,
    canActivate: [AuthGuard]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
