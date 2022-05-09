import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ProductModel } from '../products-list/product.model';
import { BackTestModel } from './back-test.model';
import { BackTestService } from './back-test.service';

@Component({
  selector: 'app-back-test',
  templateUrl: './back-test.component.html',
  styleUrls: ['./back-test.component.scss'],
})
export class BackTestComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  rows: BackTestModel[] = new Array<BackTestModel>();
  productId: number;
  pageIndex = 1;
  pageSize = 12;

  constructor(
    public _backtestService: BackTestService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {
    this.productId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('productId')
    );
  }

  ngOnInit(): void {
    this.setPage(0);
  }
  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.getBackTestListByProductId(this.pageIndex, this.pageSize);
  }

  async getBackTestListByProductId(pageNumber: number, seedNumber: number) {
    await this._backtestService
      .getBackTestByProductId(
        pageNumber,
        seedNumber,
        'ID',
        'backtest',
        this.productId
      )
      .subscribe(
        (res: Result<BackTestModel[]>) => {
          this.rows = res.data;
          //  this.page.totalElements = res.data.length;
        },
        (error) => {
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

  deleteBackTest(id, modal) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._backtestService
            .delete(id, 'backtest')
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
              this.getBackTestListByProductId(this.pageIndex, this.pageSize);
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
}
