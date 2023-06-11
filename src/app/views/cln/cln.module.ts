import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClnRoutingModule } from './cln.routing';
import { CalendarComponent } from './calendar/calendar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CountriesComponent } from './countries/countries.component';
import { EventsComponent } from './events/events.component';

import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';

@NgModule({
  declarations: [CalendarComponent, CountriesComponent, EventsComponent],
  imports: [
    SharedDirectivesModule,
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
