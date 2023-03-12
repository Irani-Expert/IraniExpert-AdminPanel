import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { UserInfoModel } from 'src/app/shared/models/userInfoModel';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { OrderModel } from '../order/order.model';
import { OrderService } from '../order/order.service';
import { AddPaymentComponent } from 'src/app/shared/components/add-payment/add-payment.component';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss'],
})
export class UserOrderComponent implements OnInit {
  toggled = false;
  rows: OrderModel[] = new Array<OrderModel>();
  viewMode: 'list' | 'grid' = 'list';
  page: Page = new Page();
  @ViewChildren(PerfectScrollbarDirective)
  psContainers: QueryList<PerfectScrollbarDirective>;
  psContainerSecSidebar: PerfectScrollbarDirective;
  note: OrderModel;
  user: UserInfoModel;
  userOrderDetail: OrderModel = new OrderModel();
  constructor(
    public router: Router,
    public _orderService: OrderService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private auth: AuthenticateService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
    setTimeout(() => {
      this.psContainerSecSidebar = this.psContainers.toArray()[1];
    });
  }

  ngOnInit(): void {
    this.user = this.auth.currentUserValue;
    this.setPage(this.page.pageNumber);
  }

  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;
    this.getOrderList(this.page.pageNumber, this.page.size);
  }
  async getOrderList(pageNumber: number, seedNumber: number) {
    this._orderService
      .getMyOrder(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null
      )
      .subscribe(
        (res: Result<Paginate<OrderModel[]>>) => {
          
          this.rows = res.data.items;
          this.page.totalElements = res.data.totalCount;
          this.page.totalPages = res.data.totalPages - 1;
          this.page.pageNumber = res.data.pageNumber + 1;
        },
        (_error) => {
          this.toastr.error(
            'خطاارتباط با سرور! لطفا با پشتیبانی تماس بگیرید.',
            null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
        }
      );
  }
  showDetails(item: OrderModel, content: any) {
    this.userOrderDetail = item;

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });
  }
  addPay(order: OrderModel) {
    let ref = this.modalService.open(AddPaymentComponent, {
      windowClass: 'radius-sm border-0 ',
      size: 'sm',
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      backdropClass: 'bg-dark',
    });

    ref.componentInstance.order = order;

    ref.result.then((result) => {
      if (result) {
        this.setPage(0);
      }
    });
  }
  cancelOrder(order: OrderModel, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((_result) => {
        this._orderService
          .update(order.id, order, 'orders')
          .subscribe((res) => {
            if (res.success) {
              this.toastr.success('فرایند  موفقیت آمیز بود', 'موفقیت آمیز!', {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            } else {
              this.toastr.error('خطا در کنسل کردن', res.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            }
            this.getOrderList(this.page.pageNumber, this.page.size);
          });
      });
  }
}
