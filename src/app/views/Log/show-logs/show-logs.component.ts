import { Component, OnInit } from '@angular/core';
import { LogService } from '../log.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { HttpErrorResponse } from '@angular/common/http';
import { LogsModel } from '../models/logs.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';

@Component({
  selector: 'app-show-logs',
  templateUrl: './show-logs.component.html',
  styleUrls: ['./show-logs.component.scss'],
})
export class ShowLogsComponent implements OnInit {
  res: Result<Object> = new Result<Object>();
  logRows: LogsModel[] = new Array<LogsModel>();
  isDataFetched: boolean = false;
  log = {
    tableType: 0,
  };
  date: Date = new Date();
  indexOfCurrentOperation: number = 0;
  operationType = [
    {
      title: 'ایجاد ',
      key: 2,
    },
    {
      title: 'ویرایش',
      key: 1,
    },
    {
      title: 'حذف',
      key: 0,
    },
  ];
  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.getLogs();
  }

  chOp() {
    if (this.indexOfCurrentOperation++ > 2) {
      this.indexOfCurrentOperation = 0;
    }
  }
  getLogs() {
    this.logService
      .getLogs()
      .subscribe((data: Result<Paginate<LogsModel[]>>) => {
        if (data.success) {
          this.isDataFetched = !this.isDataFetched;
        }
        this.logRows = data.data.items;
        console.log(this.logRows);
      });
  }
}
