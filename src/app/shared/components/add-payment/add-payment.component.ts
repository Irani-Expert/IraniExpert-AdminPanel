import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvoiceModel } from 'src/app/views/bsk/invoice/invoice.model';
import { InvoiceService } from 'src/app/views/bsk/invoice/invoice.service';
import { OrderModel } from 'src/app/views/bsk/order/order.model';
import { OrderService } from 'src/app/views/bsk/order/order.service';
import { Result } from '../../models/Base/result.model';
import { UserOrderComponent } from 'src/app/views/bsk/user-order/user-order.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss'],
})
export class AddPaymentComponent implements OnInit {
  @Input() public order: OrderModel;
  invoiceDetail!: InvoiceModel;

  constructor(
    public _invoiceService: InvoiceService,
    public _orderService: OrderService,
    public _activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.order);
    this.getInvoiceListByOrderId();
  }
  async getInvoiceListByOrderId() {
    this._invoiceService
      .GetByTableTypeAndRowId(0, 1000, 'ID', 'invoice', this.order.id, 8)
      .subscribe(
        (res: Result<InvoiceModel[]>) => {
          this.invoiceDetail = res.data[0];
          // this.page.totalElements = res.data.totalCount;
          // this.page.totalPages = res.data.totalPages - 1;
          // this.page.pageNumber = res.data.pageNumber;
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
  updateOrder(code: string) {
    this.order.transactionStatus = 1;

    this.addOrUpdateOrder(this.order, code);
  }
  async addOrUpdate(item: InvoiceModel, code: string) {
    item.bankResponse = code;
    item.status = 4;
    await this._invoiceService
      .update(item.id, item, 'invoice')
      .toPromise()
      .then(
        (data) => {
          if (data.success) {
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            this._activeModal.close(true);
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
  async addOrUpdateOrder(order: OrderModel, code: string) {
    await this._orderService
      .update(order.id, order, 'Orders')
      .toPromise()
      .then(
        (data) => {
          if (data.success) {
            this.addOrUpdate(this.invoiceDetail, code);
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
}
