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

@Component({
  selector: 'app-all-commission',
  templateUrl: './all-commission.component.html',
  styleUrls: ['./all-commission.component.scss'],
})
export class AllCommissionComponent implements OnInit {
  addReceiptModal: any;
  modalKeeper: any;
  mainModalKeeper: any;
  contractIdKeeper: number;
  expireDate: any;
  rows: allComissionModel[] = new Array<allComissionModel>();
  Receipt: ReceiptModel[] = new Array<ReceiptModel>();
  addReceiptModel: ReceiptModel = new ReceiptModel();
  descriptionContent: any;
  descriptionText: string;
  addDate: any;
  price: string;
  addRedeiptForm: FormGroup;
  page: Page = new Page();

  constructor(
    // private activeModal : NgbActiveModal,
    private modalService: NgbModal,
    private _allcommissionService: allcommissionService,
    private _formBuilder: FormBuilder
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit(): void {
    this.getAllCommission(3);
    this.setPage(this.page.pageNumber - 1);
    this.addRedeiptForm = this._formBuilder.group({
      price: [null, Validators.compose([Validators.required])],
      paymentDate: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
    });
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo - 1;
  }
  getReceiptByContractId(contractId: number) {
    this._allcommissionService
      .getReceipt(2, 0, 100)
      .subscribe((res: Result<Paginate<ReceiptModel[]>>) => {});
    this._allcommissionService
      .getReceipt(contractId, 0, 100)
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
    this.descriptionContent = content;
    this.openModal(this.descriptionContent, 'md', this.contractIdKeeper);
  }
  openModal(content: any, modelsize: string, contractId: number) {
    if (contractId != undefined) {
      this.contractIdKeeper = contractId;
    }
    this.getReceiptByContractId(contractId);
    if (modelsize != 'lg') {
      this.modalKeeper.close();
    } else {
      this.mainModalKeeper = content;
    }

    this.modalKeeper = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: modelsize,
    });

    this.modalKeeper.result.then(
      (result) => {},
      (result) => {
        if (modelsize != 'lg') {
          this.addReceipt();
        }
      }
    );

    //  .result.then(function() {

    //  });
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
      this.addDate.year + '-' + this.addDate.month.slice(-2) + '-' + this.addDate.day.slice(-2);
    this._allcommissionService
      .addReceipt(this.addReceiptModel)
      .subscribe((result) => {
        if (result.success) {
          this.addReceipt();
        }
      });
  }
  addReceipt() {
    this.modalKeeper.close();
    this.openModal(this.mainModalKeeper, 'lg', this.contractIdKeeper);
  }
}
