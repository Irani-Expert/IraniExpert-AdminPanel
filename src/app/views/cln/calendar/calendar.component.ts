import { Component, OnInit, ViewChild } from '@angular/core';
import { Calendar } from '../services/calendar.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CKEditorComponent } from 'ng2-ckeditor';
import { Observable, Subscription } from 'rxjs';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { Page } from 'src/app/shared/models/Base/page';
import { CalendarModel } from '../models/calendar.model';
import { Countries } from '../models/countries.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  eventNameHolder: string = '';
  page: Page = new Page();
  eventDetails: CalendarModel;
  eventData: (CalendarModel | Countries)[];
  countriesData: (CalendarModel | Countries)[];
  changing: boolean = false;
  ckeConfig: CKEDITOR.config;
  @ViewChild('myckeditor') ckeditor: CKEditorComponent;
  constructor(
    public _calendarService: Calendar,
    public router: Router,
    private modal: NgbModal,
    private toastr: ToastrService
  ) {
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
    await this.setPage(this.page.pageNumber, null);
  }
  async setPage(pageToSet: number, tableTypeToSet: number) {
    this.page.pageNumber = pageToSet;
    await this.getCalendarEvents(
      pageToSet,
      this.page.size,
      tableTypeToSet,
      null
    );
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

  async getCalendarEvents(
    pageIndex: number,
    pageSize: number,
    tableType: number,
    filter: any
  ) {
    this._calendarService
      .get(
        pageIndex == 0 ? pageIndex : pageIndex - 1,
        pageSize,
        'ID',
        null,
        'CalendarEvent'
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
            null,
            null
          );
        } else {
          this.toastr.error(result.message, null, {
            positionClass: 'toast-top-left',
          });
        }
      });
  }
}
