import { Component, HostListener, OnInit } from '@angular/core';
import { BannerModel } from '../../cnt/banner/banner.model';

@Component({
  selector: 'app-upload-center',
  templateUrl: './upload-center.component.html',
  styleUrls: ['./upload-center.component.scss'],
})
export class UploadCenterComponent implements OnInit {
  fileHolder;
  file;
  fileOver: boolean = false;
  // DragOver Listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave Listener
  @HostListener('dragleave', ['$event']) public onDragleave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }
  // Drop Listener
  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.file = evt.dataTransfer.files[0];
    console.log(this.file);
    // this.changeFilePath(this.file);
    this.fileOver = false;
  }
  sessionIndetiftier: number = 2;
  session = [
    {
      title: 'Type Choosing',
      id: 1,
    },
    {
      title: 'Inputs',
      id: 2,
    },
    {
      title: 'Upload and Overview',
      id: 3,
    },
  ];
  selectedType: number = 0;
  fileModel: BannerModel;
  constructor() {}

  ngOnInit(): void {}
  nextSession() {
    if (this.sessionIndetiftier !== 3) {
      this.sessionIndetiftier = this.sessionIndetiftier + 1;
    }
  }
  perviousSession() {
    if (this.sessionIndetiftier !== 1) {
      this.sessionIndetiftier = this.sessionIndetiftier - 1;
    }
  }
  // uploadVoice() {
  //   this.fileUploader.uploadVoice(this.voiceFile, 'audio').subscribe((res) => {
  //     if (res.success) {
  //       this.toastr.success(res.message, null, {
  //         timeOut: 1500,
  //         positionClass: 'toast-top-left',
  //       });
  //     }
  //   });
  // }

  // changeFilePath(file: any) {
  //   this.fileHolder = { ...file };
  //   this.file = new Blob([file], {
  //     type: file.type,
  //   });
  //   console.log(this.file);
  // }
}
