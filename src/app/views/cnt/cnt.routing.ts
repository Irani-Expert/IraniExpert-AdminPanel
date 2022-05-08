import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddUpdateComponent } from "./article/add-update/add-update.component";
import { ArticleComponent } from "./article/article/article.component";
import { BannerComponent } from "./banner/banner/banner.component";



const routes: Routes = [
  {
    path: 'banner',
    component: BannerComponent
  },
  {
    path: 'article',
    component: ArticleComponent,
  },
  {
    path: 'article/addUpdate-article',
    component: AddUpdateComponent,
  }



];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class CntRoutingModule { }
