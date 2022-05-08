import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list/products-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AddUpdateComponent } from './addUpdate/addUpdate.component';
import { ProductsRoutingModule } from './prd.routing';
import { FAQComponent } from './addUpdate/faq/faq.component';
import { LearnComponent } from './addUpdate/learn/learn.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BackTestComponent } from './back-test/back-test.component';
import { PlanComponent } from './plan/plan.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommentComponent } from './comment/comment.component';




@NgModule({
  declarations: [
    ProductsListComponent,
    AddUpdateComponent,
    FAQComponent,
    LearnComponent,
    BackTestComponent,
    PlanComponent,
    CommentComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    NgxPaginationModule,
    NgbModule

  ]
})
export class PrdModule { }
