import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClnRoutingModule } from './cln.routing';
import { CalendarComponent } from './calendar/calendar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [CalendarComponent],
  imports: [CommonModule, ClnRoutingModule, NgbModule],
})
export class ClnModule {}
