import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { PlanOptionComponent } from '../plan-option/plan-option.component';
import { PlanOptionModel } from '../plan-option/plan-option.model';
import { PlanOptionService } from '../plan-option/plan-option.service';
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
  products: any[] = [];
  page: Page = new Page();

  constructor(
    private _planOptionService: PlanOptionService,
    private modalService: NgbModal,
    private _planService: PlanService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder
  ) {
    this.page.pageNumber = 0;
    this.page.size = 100;
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
    this.addForm = this._formBuilder.group({
      title: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2),
        ]),
      ],
      orderID: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.maxLength(500)])],
      isActive: [null],
      expireDate: [null],
      price: [null],
      tableType: [6],
      iconPath: [null],
      isFirstBuy: [null],
    });
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getPlanListByProductId();
  }

  async getPlanListByProductId() {
    this._planService.getPlanByProductId(this.productId).subscribe(
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
          this._planService.delete(id, 'plan').subscribe((res) => {
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
            this.getPlanListByProductId();
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
  // Delete Option
  deletePlanOption(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (_result) => {
          this._planOptionService
            .delete(id, 'planOption')
            .subscribe((res: { success: any; message: string }) => {
              if (res.success) {
                var finder = this.rows.findIndex((rows) => rows.id === id);
                this.rows.splice(finder, 1);
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
        },
        (error) => {
          this.toastr.error('انصراف از حذف', error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }
  //__________________Add Or Edit
  addorEdit(content: any, row: PlanModel) {
    this.addForm.reset();

    if (row === undefined) {
      row = new PlanModel();
      row.id = 0;
      row.productId = this.productId;
      row.product = null;
      row.expireDate = null;
      row.iconPath = null;
      row.price = null;
      row.isFirstBuy = null;
    }
    this.addUpdate = { ...row };
    this.modalService
      .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result: boolean) => {
          if (result != undefined) {
            this.addOrUpdate(this.addUpdate);
          }
        },
        (reason) => {}
      );
  }

  async addOrUpdate(row: PlanModel) {
    if (row.id === 0) {
      await this._planService
        .create(row, 'plan')

        .subscribe((data) => {
          if (data.success) {
            this.rows;
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            this.addForm.reset();
          } else {
            this.toastr.error(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            this.addForm.reset();
          }
        });
    } else {
      await this._planService.update(row.id, row, 'plan').subscribe((data) => {
        if (data.success) {
          var finder = this.rows.findIndex((rows) => rows.id === row.id);
          this.rows[finder] = row;

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
      });
    }
  }
  selectType($event: any) {
    if ($event != undefined) {
      this.addUpdate.orderID = parseInt($event);
    }
  }

  openPlanOptionModal(item: PlanOptionModel, planId: number) {
    const modalRef = this.modalService.open(PlanOptionComponent, {
      size: 'md',
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });

    if (item === undefined) {
      item = new PlanOptionModel();
      item.planID = planId;
      item.id = 0;
    }

    modalRef.componentInstance.addUpdate = item;

    modalRef.result.then(
      (result: boolean) => {
        if (result != undefined) {
          this.addOrUpdate(this.addUpdate);
          this.addForm.reset();
          this.setPage(this.page.pageNumber);
        }
      },
      (reason) => {
        console.log('Err!', reason);
        this.addForm.reset();
      }
    );
  }
}
