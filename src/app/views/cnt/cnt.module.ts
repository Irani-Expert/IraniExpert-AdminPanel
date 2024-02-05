import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CntRoutingModule } from './cnt.routing';
import { BannerComponent } from './banner/banner.component';
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
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { TagsComponent } from './tags/tags.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrokersComponent } from './brokers/brokers.component';
import { BrokerItemsComponent } from './brokers/broker-items/broker-items.component';
import { BrokerListComponent } from './brokers/broker-list/broker-list.component';
import { BrokerDetailsComponent } from './brokers/broker-list/broker-details/broker-details.component';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { BenefitsComponent } from './brokers/benefits/benefits.component';
import { BrokerItemsRelComponent } from './brokers/broker-items-rel/broker-items-rel.component';
import { PickListModule } from 'primeng/picklist';
import { ItemType } from './brokers/broker-items-rel/item-type.pipe';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
  declarations: [
    BannerComponent,
    ArticleComponent,
    LinkTypePipe,
    TypePipe,
    FileTypePipe,
    AddUpdateComponent,
    CommentComponent,
    TagsComponent,
    BrokersComponent,
    BrokerItemsComponent,
    BrokerListComponent,
    BrokerDetailsComponent,
    BenefitsComponent,
    BrokerItemsRelComponent,
    ItemType,
  ],
  imports: [
    InputMaskModule,
    CommonModule,
    ColorPickerModule,
    FormsModule,
    CKEditorModule,
    ReactiveFormsModule,
    CntRoutingModule,
    ImageCropperModule,
    PickListModule,
    NgxPaginationModule,
    DropdownModule,
    NgbModule,
    MultiSelectModule,
    SharedPipesModule,
    SharedModule,
    DialogModule,
    SharedDirectivesModule,
    InputSwitchModule
  ],
  providers: [FileUploaderService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CntModule {}
