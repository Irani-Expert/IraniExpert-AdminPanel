import { Component, HostListener, OnInit } from '@angular/core';
import { McmService } from '../mcm.service';
import { ToastrService } from 'ngx-toastr';
import { FileInfoModel } from '../models/file-info.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/shared/utils';
class FilterFiles {
  fileName: string;
  id: number;
  tableType: number;
  rowId: number;
  fileType: number;
  filePath: string;
  stationId: number;
  isActive: boolean;
}
enum ShowMode {
  Menu,
  Detail,
}
type VideoPlayerFile = {
  fileName: string;
  filePath: string;
  size: number;
};
@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss'],
})
export class MediaListComponent implements OnInit {
  isDeviceMobile: boolean = false;
  listModeHeader = ['نام', 'نوع', 'حجم', 'ت.ایجاد', 'ت.بروزرسانی'];
  currentFolderIndex: number = 0;
  videoModalFile: VideoPlayerFile = {
    fileName: '',
    filePath: '',
    size: 0,
  };
  showModel = ShowMode.Menu;
  folderView: Array<string> = [''];
  focusedElement: FileInfoModel | string;
  viewMode: 'list' | 'grid' = 'grid';
  folders = new Array<string>();
  files: FileInfoModel[];
  filterFiles = new FilterFiles();
  constructor(
    private mcmService: McmService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.updateIsMobileValue();
    this.getDirectories();
  }

  changeBg(nthChild: FileInfoModel | string) {
    if (nthChild !== this.focusedElement) {
      this.focusedElement = nthChild;
      return;
    } else {
      if (nthChild) {
        this.showDetailFile(this.focusedElement);
      }
    }
  }
  showDetailFile(selectedElement: FileInfoModel | string) {
    if (typeof selectedElement == 'string') {
      this.folderView.push(selectedElement);
      this.currentFolderIndex = this.folderView.length - 1;
      this.filterFiles.filePath = selectedElement;
      this.getDirectories();
      this.focusedElement = undefined;
    } else {
      this.showModel = ShowMode.Detail;
    }
  }
  showMenu() {
    this.showModel = ShowMode.Menu;
  }
  navigateBack(typeOfNav: number) {
    // 0 == Home
    // 1 == Perv Folder
    switch (typeOfNav) {
      case 0:
        this.filterFiles.filePath = '';
        this.currentFolderIndex = 0;
        this.folderView = [''];
        this.getDirectories();
        break;
      case 1:
        if (this.currentFolderIndex == 0) {
          return;
        }
        if (this.currentFolderIndex !== 0) {
          this.filterFiles.filePath =
            this.folderView[this.currentFolderIndex - 1];
          this.folderView.pop();
          this.getDirectories();
          this.currentFolderIndex -= 1;
        }
        break;
    }
  }

  getDirectories() {
    // var indexOfElement = 0;
    // this.files = new Array<FileInfoModel>();
    // this.folders = new Array<string>();
    // let subscriber = this.mcmService.getFiles(this.filterFiles).subscribe({
    //   next: (res) => {
    //     if (res.success) {
    //       res.data.files.forEach((item) => {
    //         let splitedArray = item.filePath.split('\\').splice(1, 2);
    //         item.fileActualPath =
    //           '/' +
    //           splitedArray[0] +
    //           '/' +
    //           splitedArray[1] +
    //           '/' +
    //           (this.filterFiles.filePath ? this.filterFiles.filePath : '');
    //         this.addFilesToRow(item, indexOfElement);
    //         indexOfElement++;
    //       });
    //       this.folders = res.data.folders;
    //     } else {
    //       this.toastr.error(res.message, null, {
    //         positionClass: 'toast-top-left',
    //         progressBar: true,
    //         timeOut: 4000,
    //       });
    //     }
    //   },
    //   error: (_err) => {
    //     this.toastr.error('مشکل در برقراری ارتباط', null, {
    //       positionClass: 'toast-top-left',
    //       progressBar: true,
    //       timeOut: 4000,
    //     });
    //     subscriber.unsubscribe();
    //   },
    //   complete: () => {},
    // });
  }
  // Add Files Into Row
  async addFilesToRow(item: FileInfoModel, index: number) {
    this.files.push(item);
    // Make Thumbnail Of Item
    let src =
      'https://dl.iraniexpert.com/' + item.fileActualPath + '/' + item.fileName;
    if (
      item.fileType == 'mp4' ||
      item.fileType == 'mkv' ||
      item.fileType == 'avi' ||
      item.fileType == 'wmv'
    ) {
      this.makingThumbnail(index, src, 1.5);
    }
  }
  //Set Player Modal
  async playVideoModal(content: any, videoToShow: FileInfoModel) {
    this.denyShowDetail();
    // Set Video File Ready to Show
    let isFileReady = await this.createVideoModel(videoToShow);
    if (isFileReady) {
      this.modalService
        .open(content, {
          centered: true,
          scrollable: false,
        })
        .result.then(
          (_res) => {},
          (_rej) => {
            this.focusedElement = undefined;
          }
        );
    }
  }
  // Set Video File Ready to Show
  async createVideoModel(videoToShow: FileInfoModel): Promise<boolean> {
    this.videoModalFile.fileName = videoToShow.fileName;
    this.videoModalFile.filePath =
      'https://dl.iraniexpert.com/' +
      videoToShow.fileActualPath +
      '/' +
      videoToShow.fileName;
    this.videoModalFile.size = videoToShow.fileSize;
    return true;
  }

  // Make Thumbnail

  makingThumbnail(elementIndex: number, filePath: string, seekTo = 1.0) {
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('src', filePath);
    videoPlayer.load();
    videoPlayer.addEventListener('error', (ex) => {
      console.log('error when loading video file', ex);
    });
    videoPlayer.addEventListener('loadedmetadata', () => {
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      videoPlayer.addEventListener('seeked', () => {
        setTimeout(() => {
          const canvas = document.getElementById(
            `videoThumbnail${elementIndex}`
          );
          if (canvas instanceof HTMLCanvasElement) {
            // canvas.width = videoPlayer.width;
            // canvas.height = videoPlayer.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
          }
        });
      });
    });
  }
  // Deny Showing Details For Clicking on Play Btn
  denyShowDetail() {
    this.focusedElement = undefined;
  }

  // Notify When We Reach Mobile Responsive
  updateIsMobileValue() {
    if (Utils.isMobile()) {
      this.isDeviceMobile = true;
    } else {
      this.isDeviceMobile = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateIsMobileValue();
  }
}
