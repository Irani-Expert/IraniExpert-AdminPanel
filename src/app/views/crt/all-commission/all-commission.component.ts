import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Result } from 'src/app/shared/models/Base/result.model';
import { allcommissionService } from 'src/app/views/crt/allcommission.service';
import { ReceiptModel } from '../../bsk/order/models/Receipt.model';
import { allComissionModel } from './allComission.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Page } from 'src/app/shared/models/Base/page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { number } from 'echarts';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-commission',
  templateUrl: './all-commission.component.html',
  styleUrls: ['./all-commission.component.scss'],
})
export class AllCommissionComponent implements OnInit {
  contractId: number;
  modalKeeper: any;
  mainModalKeeper: any;
  contractIdKeeper: number;
  expireDate: any;
  rows: allComissionModel[] = new Array<allComissionModel>();
  Receipt: ReceiptModel[] = new Array<ReceiptModel>();
  addReceiptModel: ReceiptModel = new ReceiptModel();
  descriptionText: string;
  addDate: any;
  price: string;
  addRedeiptForm: FormGroup;
  page: Page = new Page();
  ChangeBackdrop: boolean = false;
  constructor(
    // private activeModal : NgbActiveModal,
    private modalService: NgbModal,
    private _allcommissionService: allcommissionService,
    private _formBuilder: FormBuilder,
    private clipboard: Clipboard,
    private toastr: ToastrService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }
  toast$: {
    type: 'warning';
    title: 'Check it out!';
    body: 'This is a warning alert';
    delay: 3000;
  };
  toasts: [
    {
      type: 'warning';
      title: 'Check it out!';
      body: 'This is a warning alert';
      delay: 3000;
    }
  ];
  ngOnInit(): void {
    this.getAllCommission(3);
    debugger;
    this.page.pageNumber = 0;

    this.addRedeiptForm = this._formBuilder.group({
      price: [null, Validators.compose([Validators.required])],
      paymentDate: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
    });
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;
    this.getReceiptByContractId(this.contractId);
  }
  getReceiptByContractId(contractId: number) {
    this.contractId = contractId;

    this._allcommissionService
      .getReceipt(
        this.contractId,
        30,
        this.page.pageNumber !== 0
          ? this.page.pageNumber - 1
          : this.page.pageNumber
      )
      .subscribe((res: Result<Paginate<ReceiptModel[]>>) => {
        this.Receipt = res.data.items;
        this.page.totalElements = res.data.totalCount;
        this.page.totalPages = res.data.totalPages - 1;
        this.page.pageNumber = res.data.pageNumber + 1;
      });
  }
  getAllCommission(page: number) {
    this._allcommissionService
      .getCommissionAllUser(page)
      .subscribe((commission) => {
        this.rows = commission.data;
      });
  }
  descriptionfunc(content: any, description: string) {
    this.descriptionText = description;
    console.log(description);
    console.log(this.descriptionText);

    if (this.descriptionText == null) {
      this.toastr.warning('متنی برای نمایش وجود ندارد', '', {
        closeButton: true,
        positionClass: 'toast-top-left',
        titleClass: 'text--primary text--smaller text-white',
        messageClass: 'text--primary text--smaller text-white',
      });
    } else {
      this.openModal(content, 'md', this.contractIdKeeper);
    }
  }
  openModal(content: any, modalsize: string, contractId: number) {
    if (modalsize != 'lg') {
      this.ChangeBackdrop = true;

      this.modalKeeper = this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        size: modalsize,
        backdrop: true,
        animation: true,
        windowClass: 'window-z-index',
      });
    } else {
      this.getReceiptByContractId(contractId);
      this.modalKeeper = this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        size: modalsize,
        backdrop: true,
        animation: true,
      });
    }
    if (contractId != null) {
      this.contractIdKeeper = contractId;
    }

    this.modalKeeper.result.then(
      (result) => {
        this.ChangeBackdrop = false;
      },
      (result) => {
        this.ChangeBackdrop = false;
      }
    );
  }
  addNewReceipt() {
    if (this.addDate.month < 10 || this.addDate.day < 10) {
      this.addDate.month = '0' + this.addDate.month;
      this.addDate.day = '0' + this.addDate.day;
    } else {
      this.addDate.month = this.addDate.month;
      this.addDate.day = this.addDate.day;
    }
    this.addReceiptModel.companyPaid = true;
    this.addReceiptModel.contractID = this.contractIdKeeper;
    this.addReceiptModel.price = parseInt(this.price);
    this.addReceiptModel.paymentStep = 0;
    this.addReceiptModel.paymentDate =
      this.addDate.year +
      '-' +
      this.addDate.month.slice(-2) +
      '-' +
      this.addDate.day.slice(-2);
    this._allcommissionService
      .addReceipt(this.addReceiptModel)
      .subscribe((result) => {
        if (result.success) {
          this.openModal(this.mainModalKeeper, 'lg', this.contractIdKeeper);
        }
      });
  }

  copyText(textToCopy: string) {
    this.clipboard.copy(textToCopy);
    this.toastr.info('کپی شد', '', {
      closeButton: true,
      positionClass: 'toast-top-left',
      titleClass: 'text--primary text--smaller text-white',
      messageClass: 'text--primary text--smaller text-white',
    });
  }
}
