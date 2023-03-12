import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/shared/models/Base/page';
import { DiscountModel } from './Discount.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'jalali-moment';
import { discountService } from '../discount.service';
import { ToastrService } from 'ngx-toastr';
import { number } from 'echarts';
import { Result } from 'src/app/shared/models/Base/result.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
})
export class DiscountComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  rows: DiscountModel[] = new Array<DiscountModel>();
  page: Page = new Page();
  ShowModel: DiscountModel = new DiscountModel();
  AddList: FormGroup;
  checkbox: boolean = false;

  todayDate: string;

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _discountService: discountService,
    public datepipe: DatePipe
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit(): void {
    this.AddList = this._formBuilder.group({
      expireDate: [null, Validators.compose([Validators.required])],
      percent: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
      count: [null, Validators.compose([Validators.required])],
    });

    this.getDiscountList(this.page.pageNumber);
  }
  deleteDiscount(id: number) {
    this._discountService
      .delete(id, 'Discount')
      .subscribe((res) => {
        if (res.success) {
          this.toastr.success('فرایند حذف موفقیت آمیز بود', 'موفقیت آمیز!', {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error('خطا در حذف', res.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
        this.getDiscountList(this.page.pageNumber);
      });
  }
  setPage(pageInfo: number) {
    this.getDiscountList(pageInfo);
  }
  getDiscountList(pageNumber: number) {
    this.page.pageNumber = pageNumber;
    this._discountService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        12,
        '',
        '',
        'Discount'
      )
      .subscribe((res: Result<Paginate<DiscountModel[]>>) => {
        this.page.totalElements = res.data.totalCount;
        this.page.totalPages = res.data.totalPages - 1;
        this.page.pageNumber = res.data.pageNumber + 1;

        this.rows = res.data.items;
        let counter = 0;
        this.rows.forEach((x) => {
          this.rows[counter].expireDate = moment(
            this.rows[counter].expireDate,
            'YYYY/MM/DD'
          )
            .locale('fa')
            .format('YYYY/MM/DD');
          this.rows[counter].createDate = moment(
            this.rows[counter].createDate,
            'YYYY/MM/DD'
          )
            .locale('fa')
            .format('YYYY/MM/DD');
          counter++;
        });
      });
  }
  changeCheckBox() {
    this.ShowModel.amount=0
    this.ShowModel.percent=0
    this.checkbox = !this.checkbox;
  }
  createDiscount() {
    var dateKeeper = this.ShowModel.expireDate;
    this.ShowModel.expireDate = moment
      .from(this.ShowModel.expireDate, 'fa', 'YYYY-MM-DD')
      .format('YYYY-MM-DD');

    var today = new Date();
    var ChoosenDate = Number(new Date(this.ShowModel.expireDate).getTime());
    var dates = Number(new Date(today).getTime());
    if (ChoosenDate <= dates) {
      this.toastr.error('تاریخ وارده اشتباه است', null, {
        closeButton: true,
        positionClass: 'toast-top-left',
      });
      this.ShowModel.expireDate = dateKeeper;
    } else {
      this.ShowModel.count = Number(this.ShowModel.count);

      if (this.ShowModel.amount != null) {
        this.ShowModel.amount = Number(this.ShowModel.amount);
      }
      if (this.ShowModel.percent != null) {
        this.ShowModel.percent = Number(this.ShowModel.percent);
      }
      this.ShowModel.createDate = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd'
      );
      this.ShowModel.updateDate = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd'
      );
      this._discountService
        .create(this.ShowModel, 'Discount')
        .subscribe(
          (data) => {
            if (data.success) {
              this.toastr.success(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });

              this.modalService.dismissAll();
              this.getDiscountList(0);
            } else {
              this.toastr.error(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            }
          }
        );
      this.ShowModel.expireDate = dateKeeper;

      this.AddList.reset();
    }
  }
  OpenModal(modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((_result) => {});
  }
}
