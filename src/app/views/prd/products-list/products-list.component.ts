import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseFilterModel } from 'src/app/shared/models/Base/baseFilter.model';
import { Page } from 'src/app/shared/models/Base/page';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  rows: ProductModel[] = new Array<ProductModel>();
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  page: Page = new Page();
  constructor(
    public _productService: ProductService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
  }

  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getProductList(this.page.pageNumber, this.page.size);
  }

  async getProductList(pageNumber: number, seedNumber: number) {
    this._productService
      .get(pageNumber, seedNumber, 'ID', null, 'Product')
      .subscribe(
        (res: Result<Paginate<ProductModel[]>>) => {
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

  deleteProduct(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((_result) => {
        this._productService.delete(id, 'Product').subscribe((res) => {
          if (res.success) {
            this.toastr.success('فرایند حذف موفقیت آمیز بود', 'موفقیت آمیز!', {
              timeOut: 3000,
              positionClass: 'toast-top-left',
            });
            var finder = this.rows.findIndex((row) => row.id === id);
            this.rows.splice(finder, 1);
          } else {
            this.toastr.error('خطا در حذف', res.message, {
              timeOut: 3000,
              positionClass: 'toast-top-left',
            });
          }
        });
      });
  }
}
