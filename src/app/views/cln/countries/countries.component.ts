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
  filter: FilterModel = new FilterModel();
  filterHolder: FilterModel = new FilterModel();
  countries: CountriesModel[] = new Array<CountriesModel>();
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
      this.countries.forEach((item) => {
        item.codeFlag = item.code.toLowerCase();
        if (item.codeFlag == 'ww') {
          item.codeFlag = 'un';
        }
      });
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
}
