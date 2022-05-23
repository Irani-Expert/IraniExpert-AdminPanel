import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShrRoutingModule } from './shr-routing.module';
import { UserNeedComponent } from './user-need/user-need.component';


@NgModule({
  declarations: [
    UserNeedComponent
  ],
  imports: [
    CommonModule,
    ShrRoutingModule
  ]
})
export class ShrModule { }
