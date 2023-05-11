import { Component, OnInit, QueryList } from '@angular/core';
import { Calendar } from '../services/calendar.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Utils } from 'src/app/shared/utils';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  constructor(public _calendarService: Calendar, public router: Router) {}
  ngOnInit(): void {}
}
