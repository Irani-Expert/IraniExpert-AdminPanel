import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list/products-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ProductComponent } from './product/product.component';
import { ProductsRoutingModule } from './product-routing.module';
import { BackTestComponent } from './back-test/back-test.component';




@NgModule({
  declarations: [
    ProductsListComponent,
    ProductComponent,
    BackTestComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule
  ]
})
export class PhrModule { }
