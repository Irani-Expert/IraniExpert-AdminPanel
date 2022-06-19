import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNeedComponent } from './user-need/user-need.component';
import { ShrRoutingModule } from './shr.routing';
import { UserWantsPipe } from 'src/app/shared/pipes/user-wants.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';

@NgModule({
  declarations: [UserNeedComponent, UserWantsPipe],
  imports: [CommonModule, ShrRoutingModule, NgbModule],
})
export class ShrModule {}
