
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/services/auth.gaurd';
import { GlobalService } from './shared/services/globalService';
import { SelectDropDownModule } from 'ngx-select-dropdown';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    NgxDatatableModule.forRoot({
      messages: {
      emptyMessage: 'داده ای یافت نشد',
      totalMessage: 'مجموع',
      selectedMessage: 'انتخاب شده'
      }
      }),
      NgxSpinnerModule,
      SelectDropDownModule
  ],
  providers: [ AuthService, AuthGuard,GlobalService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
