import { Component, Input, OnInit } from '@angular/core';
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
  pageSize = 12;
  constructor(
    public _invoiceService: InvoiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setPage(0);
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
  // openSmall(content: any, row: InvoiceModel) {
  //   this.modalService
  //     .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' })
  //     .result.then(
  //       (result) => {
  //         // if (result) this.acceptComment(row);
  //       },
  //       (reason) => {
  //         console.log('Err!', reason);
  //       }
  //     );
  // }
}
