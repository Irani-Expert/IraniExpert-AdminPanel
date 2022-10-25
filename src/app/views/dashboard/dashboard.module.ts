import { BreadcrumpComponent } from './../../shared/components/breadcrump/breadcrump.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboadDefaultComponent } from './dashboad-default/dashboad-default.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './user-profile/user-profile.component';


@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule,
    NgxDatatableModule.forRoot({
      messages: {
      emptyMessage: 'داده ای یافت نشد',
      totalMessage: 'مجموع',
      selectedMessage: 'انتخاب شده'
      }
      }),
    NgbModule,
    DashboardRoutingModule,

  ],
  declarations: [DashboadDefaultComponent, UserProfileComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class DashboardModule { }
