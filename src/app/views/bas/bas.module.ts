import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupComponent } from './group/group.component';
import { BasRoutingModule } from './bas.routing';
import { NgxPaginationModule } from 'ngx-pagination';




@NgModule({
  declarations: [
    GroupComponent,


  ],
  imports: [
    CommonModule,
       BasRoutingModule,
       NgxPaginationModule,
  ]
})
export class BasModule { }
