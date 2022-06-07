import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseFilterModel } from 'src/app/shared/models/Base/baseFilter.model';
import { Page } from 'src/app/shared/models/Base/page';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  rows: ProductModel[] = new Array<ProductModel>();
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  pageIndex = 1;
  pageSize = 12;
  constructor(
    private spinner: NgxSpinnerService,
    public _productService: ProductService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.setPage(0);
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }

  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.getProductList(this.pageIndex, this.pageSize);
  }

  async getProductList(pageNumber: number, seedNumber: number) {
    await this._productService
      .get(pageNumber, seedNumber, 'ID', null, 'Product')
      .subscribe(
        (res: Result<ProductModel[]>) => {
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

  deleteProduct(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._productService
            .delete(id, 'Product')
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
              this.getProductList(this.pageIndex, this.pageSize);
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
