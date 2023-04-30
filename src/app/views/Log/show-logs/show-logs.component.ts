import { Component, OnInit } from '@angular/core';
import { LogService } from '../log.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { HttpErrorResponse } from '@angular/common/http';
import { LogsModel } from '../models/logs.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { Page } from 'src/app/shared/models/Base/page';
import { TableType } from '../models/table-typeModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'jalali-moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-show-logs',
  templateUrl: './show-logs.component.html',
  styleUrls: ['./show-logs.component.scss'],
})
export class ShowLogsComponent implements OnInit {
  logDetail: LogsModel = new LogsModel();
  index: number = 0;
  tableTypes: TableType[] = new Array<TableType>();
  filteredItems: Array<{
    id: string;
    label: string;
    title: string | number | boolean;
    isFilled: boolean;
  }>;
  filter: FilterModel = new FilterModel();
  filterHolder: FilterModel;
  page: Page = new Page();
  logRows: LogsModel[] = new Array<LogsModel>();
  isDataFetched: boolean = false;
  constructor(
    private logService: LogService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 15;
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber, null);
  }
  setPage(pageToSet: number, tableTypeToSet: number) {
    this.getLogs(pageToSet, this.page.size, tableTypeToSet, this.filter);
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
    tableType: number,
    filter: FilterModel
  ) {
    if (tableType !== null) {
      this.index = tableType + 1;
    }
    if (tableType == null) {
      this.index = 0;
    }
    this.page.pageNumber = pageIndex;
    this.logService
      .getLogs(
        pageIndex == 0 ? pageIndex : pageIndex - 1,
        pageSize,
        tableType,
        filter
      )
      .subscribe((data: Result<Paginate<LogsModel[]>>) => {
        if (data.success) {
          this.page.totalPages = data.data.totalPages;
          this.page.totalElements = data.data.totalCount;
          this.logRows = data.data.items;
          this.isDataFetched = true;
        }
        if (data.data.totalCount == 0) {
          this.toastr.error('فعالیتی برای این بخش ثبت نشده است', 'خطا !!', {
            positionClass: 'toast-top-left',
          });
          this.isDataFetched = true;
        }
      });
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
}
