import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McmRoutingModule } from './mcm.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { UploadCenterComponent } from './upload-center/upload-center.component';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { ImageCropperModule } from 'projects/ngx-image-cropper/src/public-api';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { VideoPlayerComponent } from 'src/app/shared/components/video-player/video-player.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileSizePipe } from 'src/app/shared/pipes/file-size.pipe';
import { AudioPlayerComponent } from 'src/app/shared/components/audio-player/audio-player.component';
import { MediaListComponent } from './media-list/media-list.component';
import { StationsComponent } from './stations/stations.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { DropdownModule } from 'primeng/dropdown';
import { MediaManagementComponent } from './media-management/media-management.component';

@NgModule({
  declarations: [
    MediaListComponent,
    UploadCenterComponent,
    VideoPlayerComponent,
    FileSizePipe,
    AudioPlayerComponent,
    StationsComponent,
    MediaManagementComponent,
  ],
  imports: [
    DropdownModule,
    CommonModule,
    DragScrollModule,
    ImageCropperModule,
    McmRoutingModule,
    NgxPaginationModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    NgxSpinnerModule,
  ],
  providers: [FileUploaderService],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class McmModule {}
