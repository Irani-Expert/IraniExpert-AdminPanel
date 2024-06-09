import { Component, HostListener, OnInit } from '@angular/core';
import { Page } from 'src/app/shared/models/Base/page';
import { DiscountModel } from '../discount/discount.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'jalali-moment';
import { DiscountService } from '../discount.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Utils } from 'src/app/shared/utils';
import { Subject, debounceTime } from 'rxjs';
import { FilterDiscount } from './discount-filter.interface';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
})
export class DiscountComponent implements OnInit {
  amountValues: number[] = [1, 9999];
  percentValues: number[] = [1, 100];
  filterModel = {} as FilterDiscount;
  viewMode: 'list' | 'grid' = 'list';
  rows: DiscountModel[] = new Array<DiscountModel>();
  page: Page = new Page();
  ShowModel: DiscountModel = new DiscountModel();
  AddList: FormGroup;
  checkbox: boolean = false;
  search$ = new Subject<{
    value: string;
    target: keyof FilterDiscount | string;
  }>();
  todayDate: string;

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _discountService: DiscountService,
    public datepipe: DatePipe
  ) {
    this.search$.pipe(debounceTime(1500)).subscribe({
      next: (data) => {
        if (data.value) {
          this.filterModel[data.target] = data.value;
          this.setFilter();
        }
      },
    });
  }

  ngOnInit(): void {
    this.checkDevice();

    this.AddList = this._formBuilder.group({
      expireDate: [null, Validators.compose([Validators.required])],
      percent: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
      count: [null, Validators.compose([Validators.required])],
    });

    this.getDiscountList(this.page.pageNumber);
  }
  deleteDiscount(id: number) {
    this._discountService.delete(id, 'Discount').subscribe((res) => {
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
    this.page.pageNumber = pageInfo;
    this.getDiscountList(pageInfo);
  }
  async getDiscountList(pageNumber: number) {
    const res = await this._discountService.getAll(
      pageNumber,
      this.filterModel
    );
    if (res.success) {
      this.page.currentPage = res.data.pageNumber;

      this.rows = res.data.items;
    }
  }
  changeCheckBox() {
    this.ShowModel.amount = 0;
    this.ShowModel.percent = 0;
    this.checkbox = !this.checkbox;
  }
  createDiscount() {
    let dateKeeper = this.ShowModel.expireDate;
    this.ShowModel.expireDate = moment
      .from(this.ShowModel.expireDate, 'fa', 'YYYY-MM-DD')
      .format('YYYY-MM-DD');

    let today = new Date();
    let ChoosenDate = Number(new Date(this.ShowModel.expireDate).getTime());
    let dates = Number(today.getTime());
    if (ChoosenDate <= dates) {
      this.toastr.error('تاریخ وارد شده اشتباه است', null, {
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
      this.ShowModel.createDate = this.datepipe.transform(today, 'yyyy-MM-dd');
      this.ShowModel.updateDate = this.datepipe.transform(today, 'yyyy-MM-dd');
      this._discountService
        .create(this.ShowModel, 'Discount')
        .subscribe((data) => {
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
        });
      this.ShowModel.expireDate = dateKeeper;

      this.AddList.reset();
    }
  }
  OpenModal(modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((_result) => {});
  }

  filterVisible = false;
  isMobile = false;
  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkDevice();
  }

  checkDevice() {
    if (Utils.isLMonitor()) this.isMobile = true;
    else this.isMobile = false;
  }

  search(value: string, target: keyof FilterDiscount) {
    if (value.trim().length > 0) {
      this.search$.next({ value, target });
    }
    if (value.trim().length == 0 && this.filterModel[target]) {
      this.deleteFilter(target);
      this.setFilter();
    }
  }

  setFilter() {
    this.getDiscountList(0);
  }
  deleteFilter(key: keyof FilterDiscount) {
    delete this.filterModel[key];
  }

  createDate: Date | undefined | Date[];
  changeCreateDate() {
    if (this.createDate[1] !== null) {
      this.filterModel.toCreateDate = moment(this.createDate[1]).format(
        'YYYY-MM-DD'
      );
    } else {
      delete this.filterModel.toCreateDate;
    }
    this.filterModel.fromCreateDate = moment(this.createDate[0]).format(
      'YYYY-MM-DD'
    );

    this.setFilter();
  }

  getWeek() {
    const today = moment(new Date()).toDate();
    const week = moment(new Date()).add(-1, 'week').toDate();

    this.createDate = [week, today];
    this.changeCreateDate();
  }

  getThisMonth() {
    const today = moment(new Date()).toDate();
    const month = moment(new Date()).add(-1, 'month').toDate();
    this.createDate = [month, today];
    this.changeCreateDate();
  }

  getPreviousMonth() {
    const lastMonth = moment(new Date()).add(-1, 'month').toDate();
    const twoMonthAgo = moment(new Date()).add(-2, 'month').toDate();
    this.createDate = [twoMonthAgo, lastMonth];
    this.changeCreateDate();
  }

  changePercent(value: string, target?: keyof FilterDiscount) {
    let intValue = parseInt(value);
    if (target == 'fromPercent') {
      if (intValue >= this.percentValues[1]) {
        intValue = this.percentValues[1] - 1;
      }
      this.percentValues = [intValue, this.percentValues[1]];
    } else if (target == 'toPercent') {
      if (intValue <= this.percentValues[0])
        intValue = this.percentValues[0] + 1;
      this.percentValues = [this.percentValues[0], intValue];
    }
    this.search(intValue.toString(), target);
  }

  changeAmount(value: string, target?: keyof FilterDiscount) {
    let intValue = parseInt(value);
    if (target == 'fromAmount') {
      if (intValue >= this.amountValues[1]) {
        intValue = this.amountValues[1] - 1;
      }
      this.amountValues = [intValue, this.amountValues[1]];
    } else if (target == 'toAmount') {
      if (intValue <= this.amountValues[0]) intValue = this.amountValues[0] + 1;
      this.amountValues = [this.amountValues[0], intValue];
    }
    this.search(intValue.toString(), target);
  }

  slidePercent() {
    this.filterModel['fromPercent'] = this.percentValues[0];
    this.filterModel['toPercent'] = this.percentValues[1];
    this.setFilter();
  }
  slideAmount() {
    this.filterModel['fromAmount'] = this.amountValues[0];
    this.filterModel['toAmount'] = this.amountValues[1];
    this.setFilter();
  }
}
