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




@NgModule({
  declarations: [
    ProductsListComponent,
    AddUpdateComponent,
    FAQComponent,
    LearnComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    NgxPaginationModule,
  ]
})
export class PrdModule { }
