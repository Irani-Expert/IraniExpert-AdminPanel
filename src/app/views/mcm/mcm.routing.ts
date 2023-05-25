import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaListComponent } from './media-list/media-list.component';
import { AuthGuard } from 'src/app/shared/services/auth/auth.guard';
import { UploadCenterComponent } from './upload-center/upload-center.component';

const routes: Routes = [
  // {
  //   path: 'media-list',
  //   component: MediaListComponent,
  // },
  {
    path: 'upload-center',
    component: UploadCenterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class McmRoutingModule {}
