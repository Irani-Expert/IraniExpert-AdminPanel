import { Component, OnInit } from '@angular/core';
import { UrvService } from '../urv.service';
import { lastValueFrom, map } from 'rxjs';
import { UrlModel } from '../models/url-list.model';
import { SingleUrlModel } from '../models/single-url.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeleteComponent } from 'src/app/shared/components/delete/delete.component';
import { TableType } from '../../Log/models/table-typeModel';
class FilterTableModel {
  tableType: number;
  fromUrl: string;
  destUrl: string;
}
@Component({
  selector: 'app-url-list',
  templateUrl: './url-list.component.html',
  styleUrls: ['./url-list.component.scss'],
  providers: [DialogService],
})
export class UrlListComponent implements OnInit {
  tableTypes: TableType[] = [
    {
      title: 'همه',
      value: -1,
    },
    {
      title: 'بروکر ها',
      value: 36,
    },
    {
      title: 'مقالات',
      value: 1,
    },
    {
      title: 'محصولات',
      value: 6,
    },
  ];

  selectedTableType: TableType = this.tableTypes[0];

  items = new Array<UrlModel>();
  page = new Page();
  filter = new FilterTableModel();
  pageHasItems = false;
  constructor(
    private urvService: UrvService,
    private router: Router,
    private toastr: ToastrService,
    public dialogService: DialogService
  ) {}

  async ngOnInit() {
    this.page.pageNumber = 0;
    if ((await this.get(this.page, this.filter)).length !== 0) {
      this.pageHasItems = true;
    }
  }
  async get(page: Page, filter: FilterTableModel) {
    const res = this.urvService.getUrls(page, filter).pipe(
      map((it) => {
        if (it.success) {
          this.items = it.data.items;
          this.page.totalElements = it.data.totalCount;
          this.page.totalPages = it.data.totalPages;
        }
        return it.data.items;
      })
    );
    return await lastValueFrom(res);
  }
  async getOne(id: number) {
    const res = this.urvService.getOneByID(id, 'URLRedirect').pipe(
      map((it) => {
        if (it.success) {
          this.urvService.singelUrlSubject.next(it.data);
        }
        return it.success;
      })
    );
    return await lastValueFrom(res);
  }
  goToDetails(id: number) {
    if (id == -1) {
      this.urvService.singelUrlSubject.next(new SingleUrlModel());
      this.router.navigateByUrl(`urv/detail/${id}`);
    } else {
      if (this.getOne(id)) {
        this.router.navigateByUrl(`urv/detail/${id}`);
      } else {
        this.toastr.error('لطفا دوبار امتحان کنید', 'خطا !!', {
          positionClass: 'toast-top-left',
          timeOut: 3000,
          progressBar: true,
        });
      }
    }
  }

  ref: DynamicDialogRef | undefined;

  deleteItem(item) {
    this.ref = this.dialogService.open(DeleteComponent, {
      data: {
        item: item,
        routeOfAction: 'URLRedirect',
      },
      header: 'حذف',
      draggable: false,
    });
    this.ref.onClose.subscribe((res) => {
      this.modalConfirmed(res);
    });
  }
  modalConfirmed(res) {
    if (res) {
      res.success
        ? this.toastr.success(res.message, '', {
            closeButton: true,
            positionClass: 'toast-top-left',
          })
        : this.toastr.error(
            res.message || 'خطا در برقراری اتصال ! با واحد فناوری تماس بگیرید',
            '',
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
    } else {
      console.log('Denied Or Server Err');
    }
    this.page.pageNumber = 0;
    this.filter = new FilterTableModel();
    this.get(this.page, this.filter);
  }

  // Filter Methods
  setFilter(item: TableType) {
    this.selectedTableType = item;
    if (item.value == -1) {
      this.filter = new FilterTableModel();
    } else {
      this.filter.tableType = item.value;
    }
    this.page.pageNumber = 0;
    this.get(this.page, this.filter);
  }
  getPage(pageNumber: number) {
    this.page.pageNumber = pageNumber - 1;
    this.get(this.page, this.filter);
  }
}
