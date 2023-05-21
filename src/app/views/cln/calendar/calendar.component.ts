import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgbCalendar,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CKEditorComponent } from 'ng2-ckeditor';
import { Page } from 'src/app/shared/models/Base/page';
import { CalendarModel } from '../models/calendar.model';
import { CountriesModel } from '../models/countries.model';
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
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
