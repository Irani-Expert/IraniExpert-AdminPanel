import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { CommentComponent } from './comment/comment.component';
import { UserCommentComponent } from './user-comment/user-comment.component';
import { UserNeedComponent } from './user-need/user-need.component';

const routes: Routes = [
  {
    path: 'user-need',
    component: UserNeedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'comment',
    component: CommentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-Comments',
    component: UserCommentComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShrRoutingModule {}
