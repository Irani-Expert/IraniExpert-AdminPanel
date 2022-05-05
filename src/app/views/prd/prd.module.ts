import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list/products-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AddUpdateComponent } from './addUpdate/addUpdate.component';
import { ProductsRoutingModule } from './prd.routing';




@NgModule({
  declarations: [
    ProductsListComponent,
    AddUpdateComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule
  ]
})
export class PhrModule { }
