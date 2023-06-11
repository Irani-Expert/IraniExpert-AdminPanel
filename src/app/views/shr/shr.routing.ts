import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { AllCommentComponent } from './all-comment/all-comment.component';
import { UserCommentComponent } from './user-comment/user-comment.component';
import { UserNeedComponent } from './user-need/user-need.component';
import { commentComponent } from './writings/comment.component';

const routes: Routes = [
  {
    path: 'user-need',
    component: UserNeedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-Comments',
    component: UserCommentComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'writings',
    component: commentComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShrRoutingModule {}
