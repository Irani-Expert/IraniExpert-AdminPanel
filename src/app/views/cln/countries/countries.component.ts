import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountriesModel } from '../models/countries.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';

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

  constructor(
    private calendarService: CalendarService,
    private toastr: ToastrService,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.getCountries(undefined);
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
  openDetailModal(content: NgbModal, item: CountriesModel) {
    this.countryDetail = { ...item };

    this.modal.open(content, {
      animation: true,
      centered: true,
      size: 'sm',
    });
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
}
