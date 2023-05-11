import { Component, OnInit } from '@angular/core';
import { Calendar } from '../services/calendar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  constructor(public _calendarService: Calendar, public router: Router) {}
  ngOnInit(): void {}
}
