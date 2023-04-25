import { Component, OnInit } from '@angular/core';
import { LogService } from '../log.service';
import { Result } from 'src/app/shared/models/Base/result.model';

@Component({
  selector: 'app-show-logs',
  templateUrl: './show-logs.component.html',
  styleUrls: ['./show-logs.component.scss'],
})
export class ShowLogsComponent implements OnInit {
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
  object: any;
  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.getLogs();
  }

  chOp() {
    this.indexOfCurrentOperation += 1;
    if (this.indexOfCurrentOperation > 2) {
      this.indexOfCurrentOperation = 0;
    }
  }
  getLogs() {
    this.logService.getLogs().subscribe((data) => {
      if (data.success) {
        this.isDataFetched = true;
      }
      this.object = data.data.items;
    });
  }
}
