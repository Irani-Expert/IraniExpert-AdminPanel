import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNeedComponent } from './user-need/user-need.component';
import { ShrRoutingModule } from './shr.routing';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [UserNeedComponent],
  imports: [CommonModule, ShrRoutingModule, ToastrModule],
})
export class ShrModule {}
