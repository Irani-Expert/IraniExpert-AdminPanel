import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumpComponent } from './breadcrump.component';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        PerfectScrollbarModule
    ],
    declarations: [BreadcrumpComponent],
    exports: [BreadcrumpComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class BreadcrumbModule {

}
