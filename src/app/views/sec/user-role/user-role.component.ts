import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { UserRoleModel } from './user-role.model';
import { UserRoleService } from './user-role.service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  rows: UserRoleModel[] = new Array<UserRoleModel>();
  allSelected: boolean;
  pageIndex = 1;
  pageSize = 12;
  addUpdate: UserRoleModel;
  addForm: FormGroup;
  constructor(
    public _userRoleService: UserRoleService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setPage(0);
    this.addForm = this._formBuilder.group({});
  }
  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;
    this.getUserRoleList(this.pageIndex, this.pageSize);
  }
  async getUserRoleList(pageNumber: number, seedNumber: number) {
    this._userRoleService
      .get(pageNumber, seedNumber, 'ID', null, 'aspnetuserrole')
      .subscribe(
        (res: Result<UserRoleModel[]>) => {
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
  async userRoleEdit(content: any, row: UserRoleModel) {
    if (row === undefined) {
      row = new UserRoleModel();
      row.id = 0;
    }
    this.addUpdate = row;
    this.modalService
      .open(content, {
        size: 'sm',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        (result: boolean) => {
          if (result != undefined) {
            this.addOrUpdate(this.addUpdate);
            this.addForm.reset();
          }
        },
        (reason) => {
          console.log('Err!', reason);
          this.addForm.reset;
        }
      );
  }
  async addOrUpdate(row: UserRoleModel) {
    if (row.id === 0) {
      await this._userRoleService
        .create(row, 'aspnetuserrole')
        .toPromise()
        .then(
          (data) => {
            if (data.success) {
              this.toastr.success(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            } else {
              this.toastr.error(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            }
          },
          (_error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    } else {
      await this._userRoleService
        .update(row.id, row, 'aspnetuserrole')
        .toPromise()
        .then(
          (data) => {
            if (data.success) {
              this.toastr.success(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            } else {
              this.toastr.error(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            }
          },
          (_error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    }
    this.getUserRoleList(this.pageIndex, this.pageIndex);
  }
  deleteUserRole(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        this._userRoleService
          .delete(id, 'aspnetuserrole')
          .toPromise()
          .then((res) => {
            if (res.success) {
              this.toastr.success(
                'فرایند حذف موفقیت آمیز بود',
                'موفقیت آمیز!',
                {
                  timeOut: 3000,
                  positionClass: 'toast-top-left',
                }
              );
            } else {
              this.toastr.error('خطا در حذف', res.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            }
          });
      });
    this.getUserRoleList(this.pageIndex, this.pageIndex);
  }
}
