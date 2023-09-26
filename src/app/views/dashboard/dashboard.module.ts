import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboadDefaultComponent } from './dashboad-default/dashboad-default.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginAsUserComponent } from './login-as-user/login-as-user.component';

@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'داده ای یافت نشد',
        totalMessage: 'مجموع',
        selectedMessage: 'انتخاب شده',
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DashboardRoutingModule,
  ],
  declarations: [
    DashboadDefaultComponent,
    UserProfileComponent,
    LoginAsUserComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
