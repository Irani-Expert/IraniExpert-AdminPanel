import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UrvRoutingModule } from './urv.routing';
import { UrlListComponent } from './url-list/url-list.component';
import { SingleUrlComponent } from './singel-url/single-url.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [UrlListComponent, SingleUrlComponent],
  imports: [
    CommonModule,
    UrvRoutingModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    DynamicDialogModule,
    DialogModule,
    DropdownModule,
    NgxPaginationModule,
  ],
})
export class UrvModule {}
