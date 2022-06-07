import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list/products-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AddUpdateComponent } from './addUpdate/addUpdate.component';
import { ProductsRoutingModule } from './prd.routing';
import { FAQComponent } from './faq/faq.component';
import { LearnComponent } from './learn/learn.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BackTestComponent } from './back-test/back-test.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommentComponent } from './comment/comment.component';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { ImageCropperModule } from 'projects/ngx-image-cropper/src/public-api';
import { PlanComponent } from '../bas/plan/plan.component';
import { ProductTypePipe } from 'src/app/shared/pipes/product-type.pipe';
import { PlanOptionComponent } from '../bas/plan-option/plan-option.component';
import { FacilityComponent } from './facility/facility.component';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';

@NgModule({
  declarations: [
    ProductsListComponent,
    AddUpdateComponent,
    FAQComponent,
    LearnComponent,
    BackTestComponent,
    PlanComponent,
    CommentComponent,
    ProductTypePipe,
    PlanOptionComponent,
    FacilityComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    NgxPaginationModule,
    NgbModule,
    ImageCropperModule,
    SharedPipesModule,
  ],

  providers: [FileUploaderService],
})
export class PrdModule {}
