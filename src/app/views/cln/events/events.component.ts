import {
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { EventEnumsModel } from '../models/eventEnums.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { CalendarModel } from '../models/calendar.model';
import { Page } from 'src/app/shared/models/Base/page';
import { CountriesModel } from '../models/countries.model';
// import { CKEditorComponent } from 'ng2-ckeditor';
import { CalendarService } from '../services/calendar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Utils } from 'src/app/shared/utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { Ckeditor } from 'src/app/shared/ckconfig';
import { UploadAdapter } from 'src/app/shared/upload-adapter';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  animations: [
    trigger('rotate90deg', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-90deg)' })),
      transition('rotated => default', animate('300ms ease-in-out')),
      transition('default => rotated', animate('500ms ease-in-out')),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('fadeOut', [
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-40%)', opacity: 0 }),
        animate(
          '500ms ease-in-out',
          style({ transform: 'translateY(0%)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in-out',
          style({ transform: 'translateY(-40%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class EventsComponent implements OnInit {
  localStorageDate: any = '';
  timeOut: number = 0;
  @ViewChild('warningModal') warningModal!: TemplateRef<any>;
  spinnerIntervalID;
  intervalID;
  remainedTime: BehaviorSubject<number> = new BehaviorSubject(100);
  remainedSec: BehaviorSubject<number> = new BehaviorSubject(0);
  isSendingReq: boolean = false;
  isMessageContainerClosed: boolean = false;
  showTelBtn: boolean = true;
  countryIndexHolder: number = 0;
  sectorIndexHolder: number = 0;
  frequencyIndexHolder: number = 0;
  importanceIndexHolder: number = 0;
  typeIndexHolder: number = 0;
  pageIndex: number;
  eventEnums: EventEnumsModel = new EventEnumsModel();
  isDivExpanded: boolean = false;
  stateOfChevron: string = 'default';
  filter: FilterModel = new FilterModel();
  filterHolder: FilterModel = new FilterModel();
  eventNameHolder: string = '';
  page: Page = new Page();
  eventDetails: CalendarModel;
  eventData: CalendarModel[];
  countriesData: CountriesModel[];
  changing: boolean = false;
  isDataFetched: boolean = false;
  public CkEditor = new Ckeditor();

  // @ViewChild('myckeditor') ckeditor: CKEditorComponent;
  loading: boolean = false;
  constructor(
    private _ngxSpinner: NgxSpinnerService,
    public _calendarService: CalendarService,
    private modal: NgbModal,
    private toastr: ToastrService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._route.queryParams.subscribe((params: Params) => {
      if (params['pageIndex'] != undefined && !isNaN(params['pageIndex'])) {
        this.pageIndex = Number(params['pageIndex']);
        if (this.pageIndex != this.page.pageNumber) {
          this.page.pageNumber = this.pageIndex;
          this.setPage(this.pageIndex);
        }
      }
    });
    if (localStorage.getItem('remainedtimeToTryAgain')) {
      this.localStorageDate = String(
        localStorage.getItem('remainedtimeToTryAgain')
      );
      this.reduceTimer();
    }
  }
  onReady(editor) {
    const rowID = this.eventDetails.id;
    const tableType = 34; // Events Table Type
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader, rowID, tableType);
    };
  }
  async ngOnInit(): Promise<void> {
    this.page.pageNumber = 1;
    await this.setPage(this.page.pageNumber);
    await this.getCountries();
    if (Utils.isLMonitor()) {
      this.isMessageContainerClosed = true;
    }
  }
  async setPage(pageToSet: number) {
    await this.getCalendarEvents(pageToSet, this.page.size, this.filterHolder);
    this.pageIndexParams(pageToSet);
  }
  async getCountries() {
    let allCountries = [
      {
        id: null,
        name: 'همه',
        code: '',
        currency: undefined,
        currencySymbol: undefined,
        codeFlag: '',
      },
    ];
    this._calendarService.getCalendarCountries(undefined).subscribe((res) => {
      this.countriesData = allCountries.concat(res.data.items);
      this.isDataFetched = true;
      this.countriesData.forEach((item) => {
        item.codeFlag = item.code.toLowerCase();
        if (item.codeFlag == 'ww') {
          item.codeFlag = 'un';
        }
      });
    });
  }
  pageIndexParams(pageNumber: number) {
    this._router.navigate([], {
      queryParams: {
        pageIndex: pageNumber,
      },
      queryParamsHandling: 'merge',
    });
  }
  async getCalendarEvents(
    pageIndex: number,
    pageSize: number,
    filter: FilterModel
  ) {
    this.page.pageNumber = pageIndex;
    this._calendarService
      .getCalendarEvent(
        pageIndex == 0 ? pageIndex : pageIndex - 1,
        pageSize,
        filter
      )
      .subscribe((event) => {
        if (event.data.totalCount >= 1) {
          this.eventData = event.data.items;
          this.eventData.forEach((item) => {
            item.source_Url = item.source_Url.slice(
              8,
              item.source_Url.length - 1
            );
            item.codeFlag = item.code.toLowerCase();
            if (item.codeFlag == 'ww') {
              item.codeFlag = 'un';
            }
          });
        }

        if (event.data.totalCount == 0) {
          this.eventData = [];
          this.toastr.show('داده برای نمایش موجود نیست', '', {
            positionClass: 'toast-top-left',
            toastClass: 'bg-light text-small',
          });
        }
        if (!event.success) {
          this.eventData = [];
          this.toastr.error(event.message, '', {
            positionClass: 'toast-top-left',
          });
        }
        this.page.totalPages = event.data.totalPages;
        this.page.totalElements = event.data.totalCount;
      });
  }
  onChangeEditor(): void {
    //this.log += new Date() + "<br />";
  }

  onPasteEditor(): void {
    //this.log += new Date() + "<br />";
  }
  denyOpeningModal() {
    setTimeout(() => {
      this.modal.dismissAll();
    }, 300);
  }
  openModal(
    content: any,
    modalSize: string,
    centered: boolean,
    item: CalendarModel
  ) {
    this.eventDetails = { ...item };
    this.eventNameHolder = item.name;
    let eventName = this.eventNameHolder;
    this.modal
      .open(content, {
        animation: true,
        size: 'lg',
        centered: centered,
        scrollable: true,
        beforeDismiss() {
          if (eventName !== item.name) {
            return false;
          } else {
            return true;
          }
        },
      })
      .result.then(
        (confirm: boolean) => {
          if (confirm) {
          }
        },
        (dismiss) => {
          this.changing = false;
        }
      );
  }

  toggleFilters() {
    this.isDivExpanded = !this.isDivExpanded;
    this.stateOfChevron =
      this.stateOfChevron === 'default' ? 'rotated' : 'default';
  }

  onFocusIn() {
    this.changing = true;
    setTimeout(() => {
      document.getElementById('enabledInput').focus();
    }, 200);
  }
  onFocusOut() {
    if (this.eventNameHolder !== this.eventDetails.name) {
    } else {
      this.changing = false;
    }
  }

  putEvent() {
    let eventToSend = { ...this.eventDetails };
    this._calendarService
      .update(eventToSend.id, eventToSend, 'CalendarEvent')
      .subscribe((result) => {
        if (result.success) {
          this.modal.dismissAll('Put Confirmed');
          this.toastr.success(result.message, null, {
            positionClass: 'toast-top-left',
          });

          this.getCalendarEvents(
            this.page.pageNumber,
            this.page.size,
            this.filterHolder
          );
        } else {
          this.toastr.error(result.message, null, {
            positionClass: 'toast-top-left',
          });
        }
      });
  }
  setFilter() {
    this.setPage(0);
  }

  filterWithEnter(value: any) {
    if (value !== undefined && value.trim().length !== 0) {
      this.setFilter();
    }
  }
  filterButton() {
    this.filteredItems(this.filter);
    this.setFilter();
  }
  filteredItems(filter: FilterModel) {
    this.filterHolder = { ...filter };
  }
  removeFilter(item: string) {
    delete this.filterHolder[item];
    delete this.filter[item];
    this.setFilter();
  }

  // Send News To Telegram
  checkAndSendNews() {
    if (this.remainedTime.value <= 5 && this.remainedTime.value > 0) {
      this.modal.open(this.warningModal, {
        size: 'sm',
        centered: true,
      });

      return;
    }
    if (this.remainedTime.value == 100) {
      this.isSendingReq = true;
      this._ngxSpinner.show('mySpinner', {
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        fullScreen: true,
      });
      this.setTimer();
      this._calendarService.getTelegramStatus().subscribe({
        next: (res) => {
          if (res.success) {
            this.isSendingReq = false;

            this.toastr.success(res.message, null, {
              positionClass: 'toast-top-left',
            });
          } else {
            clearInterval(this.spinnerIntervalID);
            this.isSendingReq = false;

            this.toastr.error(res.message, null, {
              positionClass: 'toast-top-left',
              messageClass: 'text-small',
            });
          }
          this._ngxSpinner.hide('mySpinner');
        },
        error: (err) => {
          (this.isSendingReq = false),
            localStorage.removeItem('remainedtimeToTryAgain');
          clearInterval(this.intervalID);
          clearInterval(this.spinnerIntervalID);
          this.toastr.error('خطا در برقراری ارتباط  ', 'ناموفق', {
            positionClass: 'toast-top-left',
            messageClass: 'text-small',
          });
          this._ngxSpinner.hide('mySpinner');
        },
        complete: () => {
          this.isSendingReq = false;
          this._ngxSpinner.hide('mySpinner');
        },
      });
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let offset = Utils.scrollTracker();
    if (offset > 70) {
      this.showTelBtn = false;
    }
    if (offset < 70) {
      this.showTelBtn = true;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    let isLMonitor = Utils.isLMonitor();
    if (isLMonitor) {
      this.isMessageContainerClosed = true;
    } else {
      this.isMessageContainerClosed = false;
    }
  }
  setTimer() {
    localStorage.setItem('remainedtimeToTryAgain', String(new Date()));
    this.localStorageDate = String(
      localStorage.getItem('remainedtimeToTryAgain')
    );
    // this.remainedTime.next(this.dateNow.getMinutes() + 5);
    this.reduceTimer();
    this.spinnerTimeOut();
  }
  reduceTimer() {
    this.intervalID = setInterval(() => {
      if (this.calculateDiff() >= 5) {
        this.remainedTime.next(100);
        localStorage.removeItem('remainedtimeToTryAgain');
        clearInterval(this.intervalID);
      }
    }, 1000);
  }
  spinnerTimeOut() {
    this.spinnerIntervalID = setInterval(() => {
      if (this.timeOut < 15) {
        this.timeOut++;
      }
      if (this.timeOut == 15) {
        this._ngxSpinner.hide('mySpinner');
        this.toastr.show('اخبار در حال ارسال است', 'موفق', {
          messageClass: 'text-small',
          toastClass: 'bg-primary radius',
          positionClass: 'toast-top-left',
          progressBar: true,
          timeOut: 5000,
        });
        clearInterval(this.spinnerIntervalID);
      }
    }, 1000);
  }
  calculateDiff() {
    let currentDate: any = new Date();
    this.localStorageDate = new Date(this.localStorageDate);
    let diffMs = currentDate - this.localStorageDate;
    let diffMinutes = Math.round(((diffMs % 86400000) % 3600000) / 60000);

    this.remainedTime.next(5 - diffMinutes);
    return diffMinutes;
  }
}
