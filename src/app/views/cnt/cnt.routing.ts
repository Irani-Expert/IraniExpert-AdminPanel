import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { AddUpdateComponent } from './article/add-update/add-update.component';
import { ArticleComponent } from './article/article/article.component';
import { CommentComponent } from './article/comment/comment.component';
import { BannerComponent } from './banner/banner.component';
import { TagsComponent } from './tags/tags.component';
import { BrokersComponent } from './brokers/brokers.component';
import { BrokerListComponent } from './brokers/broker-list/broker-list.component';
import { BrokerItemsComponent } from './brokers/broker-items/broker-items.component';
import { BrokerDetailsComponent } from './brokers/broker-list/broker-details/broker-details.component';

const brokersChilds: Routes = [
  {
    path: '',
    redirectTo: 'broker-list',
    pathMatch: 'full',
  },
  {
    path: 'broker-list',
    component: BrokerListComponent,
  },
  {
    path: 'broker-items',
    component: BrokerItemsComponent,
  },
];

const routes: Routes = [
  {
    path: 'banner',
    component: BannerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tags',
    component: TagsComponent,
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
    path: 'brokers',
    component: BrokersComponent,
    children: brokersChilds,
    // canActivate: [AuthGuard],
  },
  { path: 'brokers/:id', pathMatch: 'full', component: BrokerDetailsComponent },
  {
    path: 'addUpdate-article',
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
