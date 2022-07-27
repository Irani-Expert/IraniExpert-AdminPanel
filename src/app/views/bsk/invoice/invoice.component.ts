import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { InvoiceModel } from './invoice.model';
import { InvoiceService } from './invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  rows: InvoiceModel[] = new Array<InvoiceModel>();
  orderId: number = parseInt(
    this._route.snapshot.paramMap.get('orderId') ?? '0'
  );
  pageIndex = 1;
  pageSize = 10000;
  invoiceDetail: InvoiceModel = new InvoiceModel();
  addForm: FormGroup;
  constructor(
    public _invoiceService: InvoiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setPage(0);
    this.invoiceDetail = new InvoiceModel();
    this.addForm = this._formBuilder.group({
      status: [null],
    });
  }
  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.getInvoiceListByOrderId(this.pageIndex, this.pageSize);
  }
  async getInvoiceListByOrderId(pageNumber: number, seedNumber: number) {
    this._invoiceService
      .GetByTableTypeAndRowId(
        pageNumber,
        seedNumber,
        'ID',
        'invoice',
        this.orderId,
        8
      )
      .subscribe(
        (res: Result<InvoiceModel[]>) => {
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
  openModal(content: any, item: InvoiceModel) {
    this.invoiceDetail = item;
    this.modalService
      .open(content, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then((result: boolean) => {
        if (result != undefined) {
          this.addOrUpdate(this.invoiceDetail);
          this.addForm.reset();
        }
      });
  }
  async addOrUpdate(item: InvoiceModel) {
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
    this.getInvoiceListByOrderId(this.pageIndex, this.pageIndex);
  }
  selectStatus($event: any) {
    if ($event != undefined) {
      this.invoiceDetail.status = parseInt($event);
    }
  }
}
