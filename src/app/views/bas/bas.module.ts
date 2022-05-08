import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupComponent } from './group/group.component';
import { BasRoutingModule } from './bas.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    GroupComponent,


  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
       BasRoutingModule,
       NgxPaginationModule,

  ]
})
export class BasModule { }
