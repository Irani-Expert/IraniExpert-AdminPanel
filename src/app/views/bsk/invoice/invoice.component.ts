import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
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
  page: Page = new Page();
  invoiceDetail: InvoiceModel = new InvoiceModel();
  addForm: FormGroup;
  toPayPrice:number=0;
  discountPrice:number=3
  constructor(
    public _invoiceService: InvoiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
    this.invoiceDetail = new InvoiceModel();
    this.addForm = this._formBuilder.group({
      status: [null],
    });
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getInvoiceListByOrderId(this.page.pageNumber, this.page.size);
  }
  async getInvoiceListByOrderId(pageNumber: number, seedNumber: number) {
    this._invoiceService
      .GetByTableTypeAndRowId(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        'invoice',
        this.orderId,
        8
      )
      .subscribe(
        (res: Result<InvoiceModel[]>) => {
          this.rows = res.data;
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
  openModal(content: any, item: InvoiceModel) {
    this.invoiceDetail = item;
    this.toPayPrice=this.invoiceDetail.toPayPrice-this.invoiceDetail.discountPrice 
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
   item.toPayPrice=this.toPayPrice
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
    this.getInvoiceListByOrderId(this.page.pageNumber, this.page.size);
  }
  selectStatus($event: any) {
    if ($event != undefined) {
      this.invoiceDetail.status = parseInt($event);
    }
  }
  changeFinalPrice(discount:string){
    var number = Number(discount.replace(/[^0-9.-]+/g,""));
    this.toPayPrice=this.invoiceDetail.toPayPrice-number
  }
}
