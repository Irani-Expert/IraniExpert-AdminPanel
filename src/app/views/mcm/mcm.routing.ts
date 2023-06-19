import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaComponent } from './media/media.component';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { UploadCenterComponent } from './upload-center/upload-center.component';

const routes: Routes = [
  {
    path: 'media-uploader',
    component: MediaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class McmRoutingModule {}
