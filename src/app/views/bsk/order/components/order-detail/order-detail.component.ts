import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Invoice } from './invoice';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { InvoiceService } from '../../services/invoice.service';
import { ToastrService } from 'ngx-toastr';
type DetailHeader = { value: string | number; key: string };

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent {
  firstInvoiceStatus = {
    value: 0,
    title: '',
  };
  invoiceCreated = false;
  invoiceStatusChanged = false;
  invoice: Invoice;
  currentInvoiceStatus = {
    value: 0,
    title: '',
  };
  @Input('data') detailOrderArray = new Array<DetailHeader>();
  @Output('result') actionRes = new EventEmitter<boolean>(false);
  @Input('id') orderID: number;
  constructor(
    private toastr: ToastrService,
    private auth: AuthenticateService,
    private invoiceService: InvoiceService
  ) {}
  async createInvoiceClass() {
    this.invoice = new Invoice(this.invoiceService, this.orderID, this.auth);
    if (await this.invoice.getFromApi()) {
      this.invoice._invoiceItem = this.invoiceService.invoiceValue;
      this.invoice.statusOption.find((status) =>
        status.value == this.invoice._invoiceItem.status
          ? (this.firstInvoiceStatus = {
              title: status.title,
              value: status.value,
            })
          : (this.firstInvoiceStatus = null)
      );
      this.currentInvoiceStatus = this.firstInvoiceStatus;
      this.invoiceCreated = true;
    }
  }
  destroyInvoiceModel() {
    this.invoice = null;
    this.invoiceCreated = false;
    this.invoiceStatusChanged = false;
  }
  changeDropDown(event) {
    if (event.value.value !== this.invoice._invoiceItem.status) {
      this.invoiceStatusChanged = true;
    }
    this.invoice.changeStatus = event.value.value;
  }

  async action(type: string) {
    if (type == 'confirm') {
      const res = await this.invoice.update();
      if (res) {
        if (res.success) {
          this.toastr.success(res.message, null, {
            positionClass: 'toast-top-left',
            closeButton: true,
          });
          this.actionRes.emit(true);
        } else {
          this.toastr.error(res.message, 'خطا !', {
            positionClass: 'toast-top-left',
            closeButton: true,
          });
        }
      } else {
        this.toastr.warning('با مشکل سرور مواجه شد', 'خطا !', {
          positionClass: 'toast-bottom-left',
        });
      }
    }
    // If Type == Deny
    else {
      this.currentInvoiceStatus = this.firstInvoiceStatus;
      this.invoice.changeStatus = this.firstInvoiceStatus.value;
      this.invoiceStatusChanged = false;
    }
  }
}
