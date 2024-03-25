import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountriesModel } from '../models/countries.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { tagModel } from '../../cnt/tags/tagModel/tag.model';
import { tagRelationModel } from '../../cnt/article/tagModel/tagRelation.model';
import { Ckeditor } from 'src/app/shared/ckconfig';
import { IndicatorValueService } from '../services/indicator-value.service';
import { CalendarDetailService } from '../services/calendar-detail.service';
import { lastValueFrom, map } from 'rxjs';
import { CalendarDetailModel } from '../models/calendardetail.model';

interface Tag {
  name: string;
  code: number;
}

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit {
  openCountryDetailIndex: number = 0;
  filter: FilterModel = new FilterModel();
  filterHolder: FilterModel = new FilterModel();
  countries: CountriesModel[] = new Array<CountriesModel>();
  countryDetail: CountriesModel;

  calendarDetail: CalendarDetailModel = new CalendarDetailModel();
  loadMultiSelect: boolean;

  public CkEditor = new Ckeditor();

  constructor(
    private calendarService: CalendarService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private _indicatorValueService: IndicatorValueService,
    private _calendarDetail: CalendarDetailService
  ) {}

  async ngOnInit() {
    this.getCountries(undefined);
    await this.getTags();
    // this.getTags();
  }

  getCountries(name: string) {
    this.calendarService.getCalendarCountries(name).subscribe((res) => {
      this.countries = res.data.items;
      if (res.data.totalCount == 0) {
        this.countries = [];
        this.toastr.show('داده برای نمایش موجود نیست', '', {
          positionClass: 'toast-top-left',
          toastClass: 'bg-light text-small',
        });
      }
      if (!res.success) {
        this.countries = [];
        this.toastr.error(res.message, null, {
          positionClass: 'toast-top-left',
          timeOut: 1500,
        });
      }

      if (res.data.totalCount >= 1) {
        this.countries.forEach((item) => {
          item.codeFlag = item.code.toLowerCase();
          if (item.codeFlag == 'ww') {
            item.codeFlag = 'un';
          }
        });
      }
    });
  }

  async openDetailModal(content: NgbModal, item: CountriesModel) {
    this.loadMultiSelect = false;

    this.tags = [];
    this.selectedTags = [];
    this.countryDetail = { ...item };

    this.modal.open(content, {
      animation: true,
      centered: true,
      size: 'lg',
    });

    if (this.countryDetail.id == 999 || this.countryDetail.id == 0) {
      this.hideUpdateBtn = false;
    } else {
      this.hideUpdateBtn = true;
    }

    await this.getCountriesDetail();

    this.pushSectionItem();
  }

  setFilter() {
    this.filterHolder = { ...this.filter };
    this.getCountries(this.filter.name);
  }
  filterWithEnter(value: any) {
    if (value !== undefined && value.trim().length !== 0) {
      this.setFilter();
    }
  }
  putCountry() {
    let itemToSend = { ...this.countryDetail };
    this.calendarService
      .update(itemToSend.id, itemToSend, 'CalendarCountry')
      .subscribe((res) => {
        if (res.success) {
          this.modal.dismissAll('Put-Succeed');
          this.toastr.success(res.message, null, {
            positionClass: 'toast-top-left',
            timeOut: 1500,
          });
          this.getCountries(undefined);
        } else {
          this.toastr.error(res.message, null, {
            positionClass: 'toast-top-left',
            timeOut: 1500,
          });
        }
      });
  }
  changeValue(key: string, value: any) {
    this.countryDetail[key] = value;
  }
  // ==========[هشتگ ها]====
  // ==========[new get]========
  async getCountriesDetail() {
    const req = this._calendarDetail.GetDetailsAndHistory(
      this.countryDetail.id
    );
    const res = await lastValueFrom(req);
    this.calendarDetail = res.data;
  }
  // ==========[]========
  addTagsData: tagRelationModel[] = new Array<tagRelationModel>();
  tags: Tag[] = new Array<Tag>();
  tagItems: tagModel[] = new Array<tagModel>();
  selectedTags: Tag[] = new Array<Tag>();

  async getTags() {
    const res = this._calendarDetail.getTags().pipe(
      map((it) => {
        this.tagItems = it.data.items;

        return { res: it.success, message: it.message };
      })
    );
    const tagsRes = await lastValueFrom(res);
    return tagsRes;
  }

  pushSectionItem() {
    this.tagItems.forEach((x) => {
      let index = this.calendarDetail.linkTags.findIndex(
        (i) => i.value == x.id
      );
      if (index != -1) {
        this.selectedTags.unshift({ name: x.title, code: x.id });
        this.tags.unshift({ name: x.title, code: x.id });
      } else {
        this.tags.push({ name: x.title, code: x.id });
      }
    });
    this.loadMultiSelect = true;
  }

  setTags() {
    this.selectedTags.forEach((x) => {
      this.addTagsData.push({
        linkTagID: x.code,
        rowID: this.calendarDetail.details.id,
        tableType: 33,
      });
    });
    if (this.selectedTags.length == 0) {
      this.deleteTags();
    } else {
      this.addTags();
    }
  }

  addTags() {
    this._calendarDetail
      .create(this.addTagsData, 'LinkTagRelation/AddUpdateLinkTagRelations')
      .subscribe((data) => {
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
      });
  }

  deleteTags() {
    this._calendarDetail
      .create(
        { rowID: this.calendarDetail.details.id, tableType: 33 },
        'LinkTagRelation/DeleteLinkTagRelations'
      )
      .subscribe((data) => {
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
      });
  }
  // <!-- =========[مدال به روز رسانی]====== -->

  updateId: number;
  hideUpdateBtn: boolean;

  openUpdateModal(content: NgbModal, indicatorId: number) {
    this.updateId = indicatorId;

    this.modal.open(content, {
      animation: true,
      centered: true,
      size: 'md',
      backdrop: 'static',
    });

    this.addUpdate();
  }

  addUpdate() {
    this._indicatorValueService
      .getIndicatorValue(this.updateId)
      .subscribe((res) => {
        if (res.success) {
          this.toastr.success(res.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.modal.dismissAll();
        } else {
          this.toastr.error(res.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.modal.dismissAll();
        }
      });
  }
}
