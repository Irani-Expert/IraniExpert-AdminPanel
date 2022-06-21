import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CntRoutingModule } from './cnt.routing';
import { BannerComponent } from './banner/banner/banner.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ArticleComponent } from './article/article/article.component';
import { AddUpdateComponent } from './article/add-update/add-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { ImageCropperModule } from 'projects/ngx-image-cropper/src/public-api';
import { LinkTypePipe } from 'src/app/shared/pipes/link-type.pipe';
import { TypePipe } from 'src/app/shared/pipes/type.pipe';
import { FileTypePipe } from 'src/app/shared/pipes/file-type.pipe';
import { CommentComponent } from './article/comment/comment.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
@NgModule({
  declarations: [
    BannerComponent,
    ArticleComponent,
    LinkTypePipe,
    TypePipe,
    FileTypePipe,
    AddUpdateComponent,
    CommentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule,
    ReactiveFormsModule,
    CntRoutingModule,
    ImageCropperModule,
    NgxPaginationModule,
    NgbModule,
    SharedPipesModule,
  ],
  providers: [FileUploaderService],
})
export class CntModule {}
