import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
  pageIndex = 1;
  pageSize = 12;
  constructor(
    public _orderService: OrderService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.setPage(0);
  }
  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.getOrderList(this.pageIndex, this.pageSize);
  }
  async getOrderList(pageNumber: number, seedNumber: number) {
    this._orderService
      .get(pageNumber, seedNumber, 'ID', null, 'orders')
      .subscribe(
        (res: Result<OrderModel[]>) => {
          this.rows = res.data;
          //  this.page.totalElements = res.data.length;
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
            this.getOrderList(this.pageIndex, this.pageSize);
          });
      });
  }
}
