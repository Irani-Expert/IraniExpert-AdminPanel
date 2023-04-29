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

@Component({
  selector: 'app-show-logs',
  templateUrl: './show-logs.component.html',
  styleUrls: ['./show-logs.component.scss'],
})
export class ShowLogsComponent implements OnInit {
  logDetail: LogsModel = new LogsModel();
  index: number;
  tableTypes: TableType[];
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
  constructor(private logService: LogService, private modalService: NgbModal) {
    this.page.pageNumber = 0;
    this.page.size = 12;
    this.tableTypes = new Array<TableType>();
  }

  ngOnInit(): void {
    this.setPage(this.page, null);
  }
  setPage(pageToSet: Page, tableTypeToSet: number) {
    this.getLogs(
      pageToSet.pageNumber,
      pageToSet.size,
      tableTypeToSet,
      this.filter
    );
    if (this.tableTypes.length == 0) {
      this.getTableTypes();
    }
  }

  getTableTypes() {
    this.logService.getAllTableType().subscribe((res: Result<TableType[]>) => {
      if (res.success) this.tableTypes = res.data;
    });
  }

  getLogs(
    pageIndex: number,
    pageSize: number,
    tableType: number,
    filter: FilterModel
  ) {
    this.logService
      .getLogs(pageIndex, pageSize, tableType, filter)
      .subscribe((data: Result<Paginate<LogsModel[]>>) => {
        if (data.success) {
          this.isDataFetched = !this.isDataFetched;
        }

        this.logRows = data.data.items;
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
