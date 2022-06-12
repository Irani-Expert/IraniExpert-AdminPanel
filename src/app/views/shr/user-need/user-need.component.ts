import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { UserNeedModel } from './user-need.model';
import { UserNeedService } from './user-need.service';
@Component({
  selector: 'app-user-need',
  templateUrl: './user-need.component.html',
  styleUrls: ['./user-need.component.scss'],
})
export class UserNeedComponent implements OnInit {
  pageIndex = 1;
  pageSize = 12;
  rows: UserNeedModel[] = new Array<UserNeedModel>();
  constructor(
    public _UserNeedService: UserNeedService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.setPage(0);
  }
  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.GetUserNeedById(this.pageIndex, this.pageSize);
  }
  async GetUserNeedById(pageNumber: number, seedNumber: number) {
    this._UserNeedService
      .get(pageNumber, seedNumber, 'ID', null, 'UserNeed')
      .subscribe(
        (res: Result<UserNeedModel[]>) => {
          this.rows = res.data;
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
              this.GetUserNeedById(this.pageIndex, this.pageSize);
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
