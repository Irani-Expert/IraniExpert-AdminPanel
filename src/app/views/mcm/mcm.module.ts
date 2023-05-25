import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McmRoutingModule } from './mcm.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { UploadCenterComponent } from './upload-center/upload-center.component';
// import { MediaListComponent } from './media-list/media-list.component';

@NgModule({
  declarations: [
    // MediaListComponent
    UploadCenterComponent,
  ],
  imports: [
    CommonModule,
    McmRoutingModule,
    NgxPaginationModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class McmModule {}
