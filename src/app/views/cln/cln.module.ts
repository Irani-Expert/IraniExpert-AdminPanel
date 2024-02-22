import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClnRoutingModule } from './cln.routing';
import { CalendarComponent } from './calendar/calendar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CountriesComponent } from './countries/countries.component';
import { EventsComponent } from './events/events.component';
import { ButtonModule } from 'primeng/button';

import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [CalendarComponent, CountriesComponent, EventsComponent],
  imports: [
    SharedDirectivesModule,
    NgxPaginationModule,
    CommonModule,
    ClnRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    NgxSpinnerModule,
  ],
  providers: [FileUploaderService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClnModule {}
