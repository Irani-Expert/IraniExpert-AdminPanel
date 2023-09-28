import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaListComponent } from './media-list/media-list.component';
import { UploadCenterComponent } from './upload-center/upload-center.component';
import { MediaManagementComponent } from './media-management/media-management.component';
import { StationsComponent } from './stations/stations.component';
const childRoutes: Routes = [
  {
    path: 'media-list',
    component: MediaListComponent,
  },
  {
    path: 'upload-center',
    component: UploadCenterComponent,
  },
  {
    path: 'media-stations',
    component: StationsComponent,
  },
];
const routes: Routes = [
  {
    path: '',
    component: MediaManagementComponent,
    children: childRoutes,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class McmRoutingModule {}
