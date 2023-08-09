import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-media-management',
  templateUrl: './media-management.component.html',
  styleUrls: ['./media-management.component.scss'],
})
export class MediaManagementComponent implements OnInit {
  navigations = [
    {
      id: 1,
      title: 'لیست فایل ها',
      urlPath: 'media-list',
      isActive: true,
      icon: 'pi-list',
    },
    {
      id: 2,
      title: 'آپلود فایل',
      urlPath: 'upload-center',
      isActive: true,
      icon: 'pi-upload',
    },
    {
      id: 3,
      title: 'جایگاه ها',
      urlPath: 'media-stations',
      isActive: true,
      icon: 'pi-map-marker',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
