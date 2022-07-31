import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { UsersModel } from './users.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-user-mangement',
  templateUrl: './user-mangement.component.html',
  styleUrls: ['./user-mangement.component.scss'],
})
export class UserMangementComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  rows: UsersModel[] = new Array<UsersModel>();
  allSelected: boolean;
  page: Page = new Page();
  addUpdate: UsersModel;
  addForm: FormGroup;
  constructor(
    public _usersService: UsersService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
    this.addForm = this._formBuilder.group({
      userName: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      accountNumber: [null, Validators.compose([Validators.required])],
    });
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getUsersList(this.page.pageNumber, this.page.size);
  }
  async getUsersList(pageNumber: number, seedNumber: number) {
    this._usersService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'aspnetuser'
      )
      .subscribe(
        (res: Result<Paginate<UsersModel[]>>) => {
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
  async usersEdit(content: any, row: UsersModel) {
    if (row === undefined) {
      row = new UsersModel();
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
  async addOrUpdate(row: UsersModel) {
    if (row.id === 0) {
      await this._usersService
        .create(row, 'aspnetuser')
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
      await this._usersService
        .update(row.id, row, 'aspnetuser')
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
    this.getUsersList(this.page.pageNumber, this.page.size);
  }
  deleteUser(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        this._usersService
          .delete(id, 'aspnetuser')
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
    this.getUsersList(this.page.pageNumber, this.page.size);
  }
}
