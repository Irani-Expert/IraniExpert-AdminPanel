import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LogRoutingModule } from './log.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowLogsComponent } from './show-logs/show-logs.component';
import { CreateAddlogComponent } from './create-addlog/create-addlog.component';
import { LogsComponent } from './logs/logs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeModule } from 'primeng/tree';
import { NodeService } from './nodeservice';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [ShowLogsComponent, CreateAddlogComponent, LogsComponent],
  imports: [
    NgxPaginationModule,
    CommonModule,
    NgbModule,
    LogRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    FormsModule,
    TreeModule,
  ],
  providers: [NodeService],
})
export class LogModule {}
