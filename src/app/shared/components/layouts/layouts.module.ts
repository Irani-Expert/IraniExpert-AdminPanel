import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutSidebarLargeComponent } from './admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { HeaderSidebarLargeComponent } from './admin-layout-sidebar-large/header-sidebar-large/header-sidebar-large.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './blank-layout/blank-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { SearchModule } from '../search/search.module';
import { SidebarLargeComponent } from './admin-layout-sidebar-large/sidebar-large/sidebar-large.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FooterComponent } from '../footer/footer.component';
import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../loading/loading.component';
import { NgxSpinnerModule } from 'ngx-spinner';

const components = [
  HeaderSidebarLargeComponent,
  SidebarLargeComponent,
  FooterComponent,
  AdminLayoutSidebarLargeComponent,
  AuthLayoutComponent,
  BlankLayoutComponent,
  LoadingComponent,
];

@NgModule({
  imports: [
    NgbModule,
    RouterModule,
    FormsModule,
    SearchModule,
    SharedPipesModule,
    SharedDirectivesModule,
    PerfectScrollbarModule,
    NgxSpinnerModule,
    CommonModule,
  ],
  declarations: components,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: components,
})
export class LayoutsModule {}
