import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { RoleModel } from '../../role-mangement/role.model';
import { RoleService } from '../../role-mangement/role.service';
import { PrivilegeModel } from '../privilege.model';
import { PrivilegeService } from '../privilege.service';
import { UserPrivilegeModel } from './user-privilege.model';
import { UserPrivilegeService } from './user-privilege.service';
// import {
//   CdkDragDrop,
//   moveItemInArray,
//   transferArrayItem,
// } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-user-privilege',
  templateUrl: './user-privilege.component.html',
  styleUrls: ['./user-privilege.component.scss'],
})
export class UserPrivilegeComponent implements OnInit {
  roles: RoleModel[] = new Array<RoleModel>();
  rows: UserPrivilegeModel[] = new Array<UserPrivilegeModel>();
  privilages: PrivilegeModel[] = new Array<PrivilegeModel>();
  allSelected: boolean;
  page: Page = new Page();
  addUpdate: UserPrivilegeModel;
  addForm: FormGroup;

  constructor(
    public _roleService: RoleService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _privilegeService: PrivilegeService,
    private _userPrivilageService: UserPrivilegeService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }
  // selectRole(_$event: any) {
  //   if (_$event != undefined) {
  //     this.addUpdate.roleID = parseInt(_$event);
  //   }
  // }
  // selectPrivilage(_$event: any) {
  //   if (_$event != undefined) {
  //     this.addUpdate.privilageID = parseInt(_$event);
  //   }
  // }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
    this.addForm = this._formBuilder.group({
      privilageID: [null, Validators.required],
      userID: [null],
      roleID: [null],
    });
  }

  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getRoleList();
    this.getPrivilageList();
    this.getUserPrivilegeList(this.page.pageNumber, this.page.size);
  }
  async getRoleList() {
    this._roleService.get(0, 100, 'ID', null, 'aspnetrole').subscribe(
      (res: Result<Paginate<RoleModel[]>>) => {
        this.roles = res.data.items;
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
  async getPrivilageList() {
    this._privilegeService.get(0, 100, 'ID', null, 'Privilege').subscribe(
      (res: Result<Paginate<PrivilegeModel[]>>) => {
        this.privilages = res.data.items;
        this.page.totalElements = res.data.totalCount;
        this.page.totalPages = res.data.totalPages - 1;
        this.page.pageNumber = res.data.pageNumber + 1;
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
  async getUserPrivilegeList(pageNumber: number, seedNumber: number) {
    this._userPrivilageService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'UserPrivilege'
      )
      .subscribe(
        (res: Result<Paginate<UserPrivilegeModel[]>>) => {
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
  ///// -------------Delete A User-Privilege--------- //////
  deleteUserPrivilege(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (_result) => {
          this._userPrivilageService
            .delete(id, 'UserPrivilege')
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
              this.getUserPrivilegeList(this.page.pageNumber, this.page.size);
            })
            .catch((err) => {
              this.toastr.error('خطا در حذف', err.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            });
        },
        (error) => {
          debugger;
          this.toastr.error('انصراف از حذف', error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }
  ///// -------------Add A Privilege--------- //////
  ///// -------------Open Modal
  addorEdit(content: any, row: UserPrivilegeModel) {
    if (row === undefined) {
      row = new UserPrivilegeModel();
      row.id = 0;
    }
    this.addUpdate = row;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result: boolean) => {
          if (result != undefined) {
            this.addOrUpdate(this.addUpdate);
            this.addForm.reset();
          }
        },
        (_error) => {
          this.addUpdate = row;
          console.log('Err!', _error);
          this.addForm.reset();
        }
      );
  }
  async addOrUpdate(row: UserPrivilegeModel) {
    if (row.id === 0) {
      await this._userPrivilageService
        .create(row, 'UserPrivilege')
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
          (error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    } else {
      await this._userPrivilageService
        .update(row.id, row, 'UserPrivilege')
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
          (error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    }

    this.getUserPrivilegeList(this.page.pageNumber, this.page.size);
  }
  // todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  // done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }
}
