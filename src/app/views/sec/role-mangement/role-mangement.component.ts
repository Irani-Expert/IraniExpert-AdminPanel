import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { RoleModel } from './role.model';
import { RoleService } from './role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';

@Component({
  selector: 'app-role-mangement',
  templateUrl: './role-mangement.component.html',
  styleUrls: ['./role-mangement.component.scss'],
})
export class RoleMangementComponent implements OnInit {
  rows: RoleModel[] = new Array<RoleModel>();
  allSelected: boolean;
  page: Page = new Page();
  addUpdate: RoleModel = new RoleModel();
  addForm: FormGroup;
  constructor(
    public _roleService: RoleService,
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
      name: [null],
    });
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getRoleList(this.page.pageNumber, this.page.size);
  }
  async getRoleList(pageNumber: number, seedNumber: number) {
    this._roleService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'aspnetrole'
      )
      .subscribe(
        (res: Result<Paginate<RoleModel[]>>) => {
          this.rows = res.data.items;
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
  roleEdit(content: any, row: RoleModel) {
    if (row === undefined) {
      row = new RoleModel();
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
          if (result) {
            debugger;
            this.addOrUpdate(this.addUpdate);
            this.addForm.reset();
          }
        },
        (reason) => {
          console.log('Err!', reason);
          this.addForm.reset();
        }
      );
  }
  async addOrUpdate(row: RoleModel) {
    if (row.id === 0) {
      await this._roleService
        .create(row, 'aspnetrole')
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
            this.getRoleList(this.page.pageNumber, this.page.size);
          },
          (_error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    } else {
      await this._roleService
        .update(row.id, row, 'aspnetrole')
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
            this.getRoleList(this.page.pageNumber, this.page.size);
          },
          (_error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    }
  }
  deleteRole(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        this._roleService
          .delete(id, 'aspnetrole')
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
            this.getRoleList(this.page.pageNumber, this.page.size);
          });
      });
  }
}
// export class RoleMangementComponent implements OnInit {
//   rows: RoleModel[] = new Array<RoleModel>();
//   pageIndex = 1;
//   pageSize = 1000;
//   addUpdate: RoleModel;
//   addForm: FormGroup;
//   constructor(
//     public _roleService: RoleService,
//     private toastr: ToastrService,
//     private modalService: NgbModal,
//     private _formBuilder: FormBuilder
//   ) {}
//   ngOnInit(): void {
//     this.setPage(0);
//     this.addForm = this._formBuilder.group({
//       name: [null],
//     });
//   }
//   setPage(pageInfo: number) {
//     this.pageIndex = pageInfo;

//     this.getRoleList(this.pageIndex, this.pageSize);
//   }
//   async getRoleList(pageNumber: number, seedNumber: number) {
//     this._roleService
//       .get(pageNumber, seedNumber, 'ID', null, 'aspnetrole')
//       .subscribe(
//         (res: Result<RoleModel[]>) => {
//           this.rows = res.data;
//         },
//         (_error) => {
//           this.toastr.error(
//             'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
//             null,
//             {
//               closeButton: true,
//               positionClass: 'toast-top-left',
//             }
//           );
//         }
//       );
//   }
//   deleteRole(id: any, modal: any) {
//     this.modalService
//       .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
//       .result.then(
//         (result) => {
//           this._roleService
//             .delete(id, 'aspnetrole')
//             .toPromise()
//             .then((res) => {
//               if (res.success) {
//                 this.toastr.success(
//                   'فرایند حذف موفقیت آمیز بود',
//                   'موفقیت آمیز!',
//                   {
//                     timeOut: 3000,
//                     positionClass: 'toast-top-left',
//                   }
//                 );
//               } else {
//                 this.toastr.error('خطا در حذف', res.message, {
//                   timeOut: 3000,
//                   positionClass: 'toast-top-left',
//                 });
//               }
//               this.getRoleList(this.pageIndex, this.pageSize);
//             })
//             .catch((err) => {
//               this.toastr.error('خطا در حذف', err.message, {
//                 timeOut: 3000,
//                 positionClass: 'toast-top-left',
//               });
//             });
//         },
//         (error) => {
//           this.toastr.error('خطا در حذف', error.message, {
//             timeOut: 3000,
//             positionClass: 'toast-top-left',
//           });
//         }
//       );
//   }
// }
