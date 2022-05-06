import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list/products-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ProductComponent } from './product/product.component';
import { ProductsRoutingModule } from './product-routing.module';
import { BackTestComponent } from './back-test/back-test.component';
import { PlansComponent } from './plans/plans.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  declarations: [
    ProductsListComponent,
    ProductComponent,
    BackTestComponent,
    PlansComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    NgbModule
  ]
})
export class PhrModule { }
