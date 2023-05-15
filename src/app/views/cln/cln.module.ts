import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClnRoutingModule } from './cln.routing';
import { CalendarComponent } from './calendar/calendar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FrequencyPipe } from 'src/app/shared/pipes/frequency.pipe';
import { ImportancePipe } from 'src/app/shared/pipes/importance.pipe';
import { EventTypePipe } from 'src/app/shared/pipes/event-type.pipe';
import { SectorPipe } from 'src/app/shared/pipes/sector.pipe';
import { UnitPipe } from 'src/app/shared/pipes/unit.pipe';
import { MultiplierPipe } from 'src/app/shared/pipes/multiplier.pipe';
import { TimeModePipe } from 'src/app/shared/pipes/time-mode.pipe';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    CalendarComponent,
    FrequencyPipe,
    ImportancePipe,
    EventTypePipe,
    SectorPipe,
    UnitPipe,
    MultiplierPipe,
    TimeModePipe,
  ],
  imports: [
    NgxPaginationModule,
    CommonModule,
    ClnRoutingModule,
    NgbModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [FileUploaderService],
})
export class ClnModule {}
