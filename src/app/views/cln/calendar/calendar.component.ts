import { Component, OnInit, ViewChild } from '@angular/core';
import { Calendar } from '../services/calendar.service';
import { Router } from '@angular/router';
import {
  NgbCalendar,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CKEditorComponent } from 'ng2-ckeditor';
import { Page } from 'src/app/shared/models/Base/page';
import { CalendarModel } from '../models/calendar.model';
import { Countries } from '../models/countries.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { EventEnumsModel } from '../models/eventEnums.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
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
export class CalendarComponent implements OnInit {
  sectorIndexHolder: number = 0;
  timeModeIndexHolder: number = 0;
  unitIndexHolder: number = 0;
  frequencyIndexHolder: number = 0;
  importanceIndexHolder: number = 0;
  multiplierIndexHolder: number = 0;
  typeIndexHolder: number = 0;
  eventEnums: EventEnumsModel = new EventEnumsModel();
  isDivExpanded: boolean = false;
  stateOfChevron: string = 'default';
  // toCreateDate: NgbDateStruct;
  // fromCreateDate: NgbDateStruct;
  // today = this.calendar.getToday();
  filter: FilterModel = new FilterModel();
  filterHolder: FilterModel = new FilterModel();
  // voiceFile: Blob;
  eventNameHolder: string = '';
  page: Page = new Page();
  eventDetails: CalendarModel;
  eventData: CalendarModel[];
  countriesData: (CalendarModel | Countries)[];
  changing: boolean = false;
  isDataFetched: boolean = false;
  ckeConfig: CKEDITOR.config;
  @ViewChild('myckeditor') ckeditor: CKEditorComponent;
  constructor(
    // private calendar: NgbCalendar,
    public _calendarService: Calendar,
    public router: Router,
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
  }
  async setPage(pageToSet: number) {
    this.page.pageNumber = pageToSet;
    await this.getCalendarEvents(pageToSet, this.page.size, this.filter);
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
        this.eventData = event.data.items;

        this.page.totalPages = event.data.totalPages;
        this.page.totalElements = event.data.totalCount;
        if (event.data.totalCount == 0) {
          this.toastr.show('داده برای نمایش موجود نیست', '', {
            positionClass: 'toast-top-left',
            toastClass: 'bg-light text-small',
          });
        }
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
    this.filteredItems(this.filter);

    this.setPage(0);
  }

  filterWithEnter(value: any) {
    console.log(value);

    if (value !== undefined && value.trim().length !== 0) {
      this.setFilter();
    }
  }
  // uploadVoice() {
  //   this.fileUploader.uploadVoice(this.voiceFile, 'audio').subscribe((res) => {
  //     if (res.success) {
  //       this.toastr.success(res.message, null, {
  //         timeOut: 1500,
  //         positionClass: 'toast-top-left',
  //       });
  //     }
  //   });
  // }

  // changeVoicePath(file: any) {
  //   this.voiceFile = new Blob([file], {
  //     type: 'audio/mpeg',
  //   });
  // }
  filteredItems(filter: FilterModel) {
    this.filterHolder = { ...filter };
  }
}
