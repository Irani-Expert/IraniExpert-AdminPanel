import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { AddUpdateComponent } from './article/add-update/add-update.component';
import { ArticleComponent } from './article/article/article.component';
import { CommentComponent } from './article/comment/comment.component';
import { BannerComponent } from './banner/banner.component';

const routes: Routes = [
  {
    path: 'banner',
    component: BannerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'article/:pageIndex',
    component: ArticleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'comment',
    component: CommentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'article/addUpdate-article',
    component: AddUpdateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'article/addUpdate-article/:articleId',
    component: AddUpdateComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CntRoutingModule {}
