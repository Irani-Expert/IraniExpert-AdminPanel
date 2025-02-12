import { BreadcrumbModule } from './breadcrump/breadcrumb.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherIconComponent } from './feather-icon/feather-icon.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { SearchModule } from './search/search.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LayoutsModule } from './layouts/layouts.module';

const components = [
  // BtnLoadingComponent,
  FeatherIconComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    SearchModule,
    BreadcrumbModule,
    PerfectScrollbarModule,
    NgbModule,
  ],
  declarations: [components],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: components,
})
export class SharedComponentsModule {}
