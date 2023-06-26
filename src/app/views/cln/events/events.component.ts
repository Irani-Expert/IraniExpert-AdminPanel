import { Component, OnInit, ViewChild } from '@angular/core';
import { EventEnumsModel } from '../models/eventEnums.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { CalendarModel } from '../models/calendar.model';
import { Page } from 'src/app/shared/models/Base/page';
import { CountriesModel } from '../models/countries.model';
import { CKEditorComponent } from 'ng2-ckeditor';
import { CalendarService } from '../services/calendar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Utils } from 'src/app/shared/utils';

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
  countryIndexHolder: number = 0;
  sectorIndexHolder: number = 0;
  frequencyIndexHolder: number = 0;
  importanceIndexHolder: number = 0;
  typeIndexHolder: number = 0;
  eventEnums: EventEnumsModel = new EventEnumsModel();
  isDivExpanded: boolean = false;
  stateOfChevron: string = 'default';
  filter: FilterModel = new FilterModel();
  filterHolder: FilterModel = new FilterModel();
  // voiceFile: Blob;
  eventNameHolder: string = '';
  page: Page = new Page();
  eventDetails: CalendarModel;
  eventData: CalendarModel[];
  countriesData: CountriesModel[];
  changing: boolean = false;
  isDataFetched: boolean = false;
  ckeConfig: CKEDITOR.config;
  @ViewChild('myckeditor') ckeditor: CKEditorComponent;
  constructor(
    // private calendar: NgbCalendar,
    public _calendarService: CalendarService,
    private modal: NgbModal,
    private toastr: ToastrService,
    private fileUploader: FileUploaderService
  ) {
    this.page.pageNumber = 0;
    this.ckeConfig = {
      filebrowserBrowseUrl: 'dl.iraniexpert.com//uploads/images/articles',
      filebrowserUploadUrl:
        'https://dl.iraniexpert.com/FileUploader/FileUploadCkEditor',
      allowedContent: false,
      forcePasteAsPlainText: true,
      skin: 'moono-lisa',
      defaultLanguage: 'fa',
      language: 'fa',
      readOnly: false,
      removeButtons:
        'Underline,Subscript,Superscript,SpecialChar,Source,Save,NewPage,DocProps,Preview,Print,' +
        'Templates,document,Cut,Copy,Paste,PasteText,PasteFromWord,Replace,SelectAll,Scayt,' +
        'Radio,TextField,Textarea,Select,Button,HiddenField,Strike,RemoveFormat,' +
        'Outdent,Indent,Blockquote,CreateDiv,Anchor,' +
        'Flash,HorizontalRule,SpecialChar,PageBreak,InsertPre,' +
        'UIColor,ShowBlocks,MediaEmbed,About,Language',
      removePlugins:
        'elementspath,save,magicline,exportpdf,pastefromword,forms,blockquote',
      extraPlugins: 'smiley,justify,colordialog,divarea,indentblock',
    };
  }
  async ngOnInit(): Promise<void> {
    await this.setPage(this.page.pageNumber);
    await this.getCountries();
  }
  async setPage(pageToSet: number) {
    this.page.pageNumber = pageToSet;
    await this.getCalendarEvents(pageToSet, this.page.size, this.filterHolder);
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
  async getCalendarEvents(
    pageIndex: number,
    pageSize: number,
    filter: FilterModel
  ) {
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
    console.log('onChange');
    //this.log += new Date() + "<br />";
  }

  onPasteEditor(): void {
    console.log('onPaste');
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
      console.log('hasChanged');
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
            this.filter
          );
        } else {
          this.toastr.error(result.message, null, {
            positionClass: 'toast-top-left',
          });
        }
      });
  }
  setFilter() {
    
    console.log(this.filterHolder)
    this.setPage(0);
  }

  filterWithEnter(value: any) {
    if (value !== undefined && value.trim().length !== 0) {
      this.setFilter();
    }
  }
filterButton(){
  this.filteredItems(this.filter);
  this.setFilter();

}
  filteredItems(filter: FilterModel) {
    this.filterHolder = { ...filter };
  }
removeFilter(item:string){
  delete this.filterHolder[item]
  delete this.filter[item]
  this.setFilter();


}
}
