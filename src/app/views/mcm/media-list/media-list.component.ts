import { Component, OnInit } from '@angular/core';
import { McmService } from '../mcm.service';
import { FileModel } from '../../prd/gallery/file.model';
import { ToastrService } from 'ngx-toastr';
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
@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss'],
})
export class MediaListComponent implements OnInit {
  folders = new Array<string>();
  files = new Array<FileModel>();
  filterFiles = new FilterFiles();
  constructor(private mcmService: McmService, private toastr: ToastrService) {}
  ngOnInit(): void {
    this.files.push({
      description: '',
      fileExists: true,
      fileInfo: 'nmdn',
      filePath:
        'https://dl.iraniexpert.com//uploads/images/articles/05cd2715d51842aa8f763315ecae3ff9.jpg',
      fileType: 0,
      id: 20,
      isActive: true,
      key: 'top',
      orderID: 0,
      rowID: 1,
      stationID: 1,
      tableType: 1,
      title: 'عکس مقاله',
      type: 0,
    });
    let x = this.mcmService.getFiles(this.filterFiles).subscribe({
      next: (res) => {
        if (res.success) {
          this.files = { ...res.data.files };
          this.folders = res.data.folders;
        } else {
          this.toastr.error(res.message, null, {
            positionClass: 'toast-top-left',
            progressBar: true,
            timeOut: 4000,
          });
          x.unsubscribe();
        }
      },
    });
  }
}
