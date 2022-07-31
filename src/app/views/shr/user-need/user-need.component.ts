import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { UserNeedModel } from './user-need.model';
import { UserNeedService } from './user-need.service';
@Component({
  selector: 'app-user-need',
  templateUrl: './user-need.component.html',
  styleUrls: ['./user-need.component.scss'],
})
export class UserNeedComponent implements OnInit {
  rows: UserNeedModel[] = new Array<UserNeedModel>();
  page: Page = new Page();
  constructor(
    public _UserNeedService: UserNeedService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getUserNeedById(this.page.pageNumber, this.page.size);
  }
  async getUserNeedById(pageNumber: number, seedNumber: number) {
    this._UserNeedService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'UserNeed'
      )
      .subscribe(
        (res: Result<Paginate<UserNeedModel[]>>) => {
          this.rows = res.data.items;
          this.page.totalElements = res.data.totalCount;
          this.page.totalPages = res.data.totalPages - 1;
          this.page.pageNumber = res.data.pageNumber;
        },
        (_error) => {
          this.toastr.error(
            'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
            null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
        }
      );
  }
  deleteUserNeed(id: any, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._UserNeedService
            .delete(id, 'UserNeed')
            .toPromise()
            .then((res) => {
              if (res.success) {
                this.toastr.success(
                  'فرآیند حذف موفقیت آمیز بود',
                  'موفقیت آمیز!',
                  {
                    timeOut: 2000,
                    positionClass: 'toast-top-left',
                  }
                );
              } else {
                this.toastr.error('خطا در حذف', res.message, {
                  timeOut: 2000,
                  positionClass: 'toast-top-left',
                });
              }
              this.getUserNeedById(this.page.pageNumber, this.page.size);
            })
            .catch((err) => {
              this.toastr.error('خطا در حذف', err.message, {
                timeOut: 2000,
                positionClass: 'toast-top-left',
              });
            });
        },
        (error) => {
          this.toastr.error('خطا در حذف', error.message, {
            timeOut: 2000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }
}
