import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { PlanModel } from './plan.model';
import { PlanService } from './plan.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
})
export class PlanComponent implements OnInit {
  rows: PlanModel[] = new Array<PlanModel>();
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  addUpdate: PlanModel;
  addForm: FormGroup;
  @Input() productId: number;
  pageIndex = 1;
  products: any[] = [];
  pageSize = 12;

  constructor(
    private modalService: NgbModal,
    private _planService: PlanService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.setPage(0);
    this.addForm = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required,Validators.maxLength(50),Validators.minLength(2)])],
      orderID: [null, Validators.compose([Validators.required])],
      description: [null , Validators.compose([Validators.maxLength(500)])],
      isActive: [null],
      expireDate : [null],
      price: [null],
      tableType:[6],
      iconPath: [null],
    });
  }
  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.getPlanListByProductId(this.pageIndex, this.pageSize);
  }

  async getPlanListByProductId(pageNumber: number, seedNumber: number) {
    this._planService
      .getPlanByProductId(pageNumber, seedNumber, 'ID', 'Plan', this.productId)
      .subscribe(
        (res: Result<PlanModel[]>) => {
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
  //____________________Delete Function
  deletePlan(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (_result) => {
          this._planService
            .delete(id, 'plan')
            .toPromise()
            .then((res) => {
              if (res.success) {
                debugger;
                this.toastr.success(
                  'فرایند حذف موفقیت آمیز بود',
                  'موفقیت آمیز!',
                  {
                    timeOut: 3000,
                    positionClass: 'toast-top-left',
                  }
                );
              } else {
                debugger;

                this.toastr.error('خطا در حذف', res.message, {
                  timeOut: 3000,
                  positionClass: 'toast-top-left',
                });
              }
              this.getPlanListByProductId(this.pageIndex, this.pageSize);
            })
            .catch((err) => {
              this.toastr.error('خطا در حذف', err.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            });
          debugger;
        },
        (error) => {
          debugger;
          this.toastr.error('خطا در حذف', error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }
//__________________Add Or Edit
addorEdit(content: any, row: PlanModel) {
  if (row === undefined) {
    row = new PlanModel();
    row.id = 0;
    row.productId = this.productId;
    row.product = null;
    row.expireDate = null;
    row.iconPath = null;
    row.price = null;
  }
  this.addUpdate = row;
  this.modalService
    .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' })
    .result.then(
      (result: boolean) => {
        if (result != undefined) {
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

async addOrUpdate(row: PlanModel) {
  if (row.id === 0) {
    await this._planService
      .create(row, 'plan')
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
    await this._planService
      .update(row.id, row, 'plan')
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

  this.getPlanListByProductId(this.pageIndex, this.pageIndex);
}
}
