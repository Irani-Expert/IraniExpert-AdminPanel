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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [CalendarComponent, CountriesComponent, EventsComponent],
  imports: [
    SharedDirectivesModule,
    NgxPaginationModule,
    CommonModule,
    ClnRoutingModule,
    MultiSelectModule,
    NgbModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    NgxSpinnerModule,
    ProgressSpinnerModule
  ],
  providers: [FileUploaderService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClnModule {}
