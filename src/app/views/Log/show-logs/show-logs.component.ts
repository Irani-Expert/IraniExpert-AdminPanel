import { Component, OnInit } from '@angular/core';
import { LogService } from '../log.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { HttpErrorResponse } from '@angular/common/http';
import { LogsModel } from '../models/logs.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { Page } from 'src/app/shared/models/Base/page';
import { TableType } from '../models/table-typeModel';
import {
  NgbCalendar,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'jalali-moment';
import { ToastrService } from 'ngx-toastr';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-show-logs',
  templateUrl: './show-logs.component.html',
  styleUrls: ['./show-logs.component.scss'],
  animations: [
    trigger('rotate90deg', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-90deg)' })),
      transition('rotated => default', animate('300ms ease-in-out')),
      transition('default => rotated', animate('500ms ease-in-out')),
    ]),
    // trigger('pushDown', [
    //   state('default', style({ margin: '0' })),
    //   state('rotated', style({ margin: '2% 0 0 0' })),
    //   transition('rotated => default', animate('100ms ease-in-out')),
    //   transition('default => rotated', animate('300ms ease-in-out')),
    // ]),
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
export class ShowLogsComponent implements OnInit {
  requestType = null;
  dropdownRequestTypeTitle: string = 'همه';
  dropdownPageOrderTitle: string = 'جدیدترین ها';
  pageOrder: string = 'ID';
  toCreateDate: NgbDateStruct;
  fromCreateDate: NgbDateStruct;
  today = this.calendar.getToday();
  stateOfChevron: string = 'default';
  isDivExpanded: boolean = false;
  logDetail: LogsModel = new LogsModel();
  index: number = 0;
  tableTypes: TableType[] = new Array<TableType>();
  filter: FilterModel = new FilterModel();
  filterHolder: FilterModel=new FilterModel;
  page: Page = new Page();
  logRows: LogsModel[] = new Array<LogsModel>();
  isDataFetched: boolean = false;

  constructor(
    private calendar: NgbCalendar,
    private logService: LogService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 15;
  }

  ngOnInit(): void {
    this.filter.isSuccess = true;
    this.setPage(this.page.pageNumber, this.pageOrder, null, null);
  }
  toggleFilters() {
    this.isDivExpanded = !this.isDivExpanded;
    this.stateOfChevron =
      this.stateOfChevron === 'default' ? 'rotated' : 'default';
  }
  setPage(
    pageToSet: number,
    pageOrder: string,
    requestType: number,
    tableTypeToSet: number
  ) {
    this.filterHolder.requestType = requestType;
    if (tableTypeToSet !== null) {
      this.index = tableTypeToSet + 1;
    }
    if (tableTypeToSet == null) {
      this.index = 0;
    }
    this.page.pageNumber = pageToSet;
    this.getLogs(
      pageToSet,
      this.page.size,
      pageOrder,
      tableTypeToSet,
      this.filterHolder
    );
    if (this.tableTypes.length == 0) {
      this.getTableTypes();
    }
  }

  getTableTypes() {
    let allLogs = [
      {
        title: 'همه',
        value: null,
      },
    ];
    this.logService.getAllTableType().subscribe((res: Result<TableType[]>) => {
      if (res.success) {
        this.tableTypes = allLogs.concat(res.data);
      }
    });
  }

  getLogs(
    pageIndex: number,
    pageSize: number,
    pageOrder: string,
    tableType: number,
    filter: FilterModel
  ) {
    this.logService
      .getLogs(
        pageIndex == 0 ? pageIndex : pageIndex - 1,
        pageSize,
        pageOrder,
        tableType,
        filter
      )
      .subscribe((data: Result<Paginate<LogsModel[]>>) => {
        if (data.success && data.data.totalCount !== 0) {
          this.logRows = data.data.items;
          this.page.totalPages = data.data.totalPages;
          this.page.totalElements = data.data.totalCount;
          this.isDataFetched = true;
        }
        if (data.data.totalCount == 0) {
          this.logRows = [];
          this.toastr.show('فعالیتی برای این بخش ثبت نشده است', '', {
            positionClass: 'toast-top-left',
            toastClass: 'btn-details text-small',
          });
          this.isDataFetched = true;
        }
      });
    this.filteredItems(filter);
  }
  openModal(item: LogsModel, modal: NgbModal) {
    this.logDetail = item;
    this.modalService.open(modal, {
      size: 'sm',
    });
    this.logDetail.jalaliDate = moment(this.logDetail.createDate, 'YYYY/MM/DD')
      .locale('fa')
      .format('YYYY/MM/DD');
  }

  sendFilter() {
    this.convertDate()
   
    this.setPage(
      0,
      this.pageOrder,
      this.requestType,
      this.tableTypes[this.index].value
    );
  }
  filterSuccess(){
    this.filterHolder.isSuccess=this.filter.isSuccess
    this.sendFilter()
  }
  removeFilter(item:string){

    delete  this.filterHolder[item]
    delete  this.filter[item]
    this.sendFilter()
  }
  filterButton(){

    this.filteredItems(this.filter);
    this.sendFilter()

  }
  convertDate(){
    if (this.fromCreateDate !== null && this.fromCreateDate !== undefined) {
      this.filterHolder.fromCreateDate =
        this.fromCreateDate.year +
        '-' +
        this.fromCreateDate.month +
        '-' +
        this.fromCreateDate.day;
    }

    if (this.toCreateDate !== null && this.toCreateDate !== undefined) {
      this.filterHolder.toCreateDate =
        this.toCreateDate.year +
        '-' +
        this.toCreateDate.month +
        '-' +
        this.toCreateDate.day;
    }
  }
  filteredItems(filter: FilterModel) {
    this.filterHolder = { ...filter };
  }
}
