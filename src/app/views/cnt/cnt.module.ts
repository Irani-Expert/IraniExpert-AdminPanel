import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CntRoutingModule } from './cnt.routing';
import { BannerComponent } from './banner/banner/banner.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ArticleComponent } from './article/article/article.component';



@NgModule({
  declarations: [
    BannerComponent,
    ArticleComponent,
  ],
  imports: [
    CommonModule,
    CntRoutingModule,
    NgxPaginationModule
  ]
})
export class CntModule { }
