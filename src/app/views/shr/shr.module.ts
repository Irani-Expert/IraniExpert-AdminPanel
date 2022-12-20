import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNeedComponent } from './user-need/user-need.component';
import { ShrRoutingModule } from './shr.routing';
import { UserWantsPipe } from 'src/app/shared/pipes/user-wants.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { CommentComponent } from './comment/comment.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { UserCommentComponent } from './user-comment/user-comment.component';
import { AllCommentComponent } from './all-comment/all-comment.component';

@NgModule({
  declarations: [UserNeedComponent, UserWantsPipe, CommentComponent, UserCommentComponent, AllCommentComponent],
  imports: [
    CommonModule,
    ShrRoutingModule,
    NgbModule,
    NgxPaginationModule,
    SharedPipesModule,
    PerfectScrollbarModule,
  ],
})
export class ShrModule {}
