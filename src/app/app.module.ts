import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GlobalService } from './shared/services/globalService';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { JwtInterceptor } from './shared/services/auth/jwt.interceptor';
import { ErrorInterceptor } from './shared/services/auth/error.interceptor';
import { LoaderInterceptor } from './shared/loader.interceptor';
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [AppComponent],
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
        selectedMessage: 'انتخاب شده',
      },
    }),
    NgxSpinnerModule,
    SelectDropDownModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    GlobalService,
    DatePipe,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
