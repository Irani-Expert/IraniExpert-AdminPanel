import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { OrderModel } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  rows: OrderModel[] = new Array<OrderModel>();
  viewMode: 'list' | 'grid' = 'list';
  page: Page = new Page();
  constructor(
    public _orderService: OrderService,
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

    this.getOrderList(this.page.pageNumber, this.page.size);
  }
  async getOrderList(pageNumber: number, seedNumber: number) {
    this._orderService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'orders'
      )
      .subscribe(
        (res: Result<Paginate<OrderModel[]>>) => {
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
  deleteOrder(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        this._orderService
          .delete(id, 'orders')
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
            this.getOrderList(this.page.pageNumber, this.page.size);
          });
      });
  }
}
