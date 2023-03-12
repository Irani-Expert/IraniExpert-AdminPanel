import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';

import { RoleService } from '../role-mangement/role.service';
import { PrivilegeModel } from './privilege.model';
import { PrivilegeService } from './privilege.service';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.scss'],
})
export class PrivilegeComponent implements OnInit {
  keys = [
    'Watch',
    'Delete',
    'Add',
    'Edit',
    'Full Premission',
    'Special-Premission',
  ];
  rows: PrivilegeModel[] = new Array<PrivilegeModel>();
  allSelected: boolean;
  page: Page = new Page();
  addUpdate: PrivilegeModel = new PrivilegeModel();
  addForm: FormGroup;
  keyValue: string;
  keyType: string;
  allPrivilageData: PrivilegeModel[] = new Array<PrivilegeModel>();
  constructor(
    public _roleService: RoleService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _privilegeService: PrivilegeService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit(): void {
    this.allPrivilage();
    this.setPage(this.page.pageNumber);
    this.addForm = this._formBuilder.group({
      keyValue: [null, Validators.required],
      keyType: [null, Validators.required],
      parentID: [null],
      title: [null, Validators.required],
      isActive: [null, Validators.required],
    });
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getPrivilegeList(this.page.pageNumber, this.page.size);
  }

  async getPrivilegeList(pageNumber: number, seedNumber: number) {
    this._privilegeService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'Privilege'
      )
      .subscribe(
        (res: Result<Paginate<PrivilegeModel[]>>) => {
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
  ///// -------------Delete A Privilege--------- //////
  deletePrivilege(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (_result) => {
          this._privilegeService
            .delete(id, 'Privilege')
            .subscribe((res) => {
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
              this.getPrivilegeList(this.page.pageNumber, this.page.size);
            
            });
        },
        (error) => {
          this.toastr.error('انصراف از حذف', error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }
  ///// -------------Add A Privilege--------- //////
  ///// -------------Open Modal
  addorEdit(content: any, row: PrivilegeModel) {
    if (row === undefined) {
      row = new PrivilegeModel();
      row.id = 0;
      row.parentID = null;
    }
    this.addUpdate = row;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result: boolean) => {
          if (result == true) {
            this.addUpdate.key = this.keyValue + this.keyType;
            this.addOrUpdate(this.addUpdate);
          }
        },
        (_error) => {}
      );
  }
  async addOrUpdate(row: PrivilegeModel) {
    if (row.id === 0) {
      await this._privilegeService
        .create(row, 'Privilege')
        .subscribe(
          (data) => {
            if (data.success) {
              this.toastr.success(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });

              row.id = this.rows[0].id + 1;
              this.rows.unshift(row);
              this.addForm.reset();
            } else {
              this.toastr.error(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            }
          },
        );
    } else {
      await this._privilegeService
        .update(row.id, row, 'Privilege')
        .subscribe(
          (data) => {
            if (data.success) {
              this.toastr.success(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });

              let rowIndexForUpdate = this.rows.findIndex(
                (item) => item.id === row.id
              );
              this.rows[rowIndexForUpdate] = row;
            } else {
              this.toastr.error(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            }
          }
        );
    }

    // this.getPrivilegeList(this.page.pageNumber, this.page.size);
  }
  allPrivilage() {
    this._privilegeService.get(0, 500, 'ID', null, 'Privilege').subscribe(
      (res: Result<Paginate<PrivilegeModel[]>>) => {
        this.allPrivilageData = res.data.items;
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
}
