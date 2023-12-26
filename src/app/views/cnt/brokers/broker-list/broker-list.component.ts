import { Component } from '@angular/core';
import { BrokersService } from '../brokers.service';
import { Page } from 'src/app/shared/models/Base/page';
import { BrokerModel } from '../models/broker.model';
import { Subject, Subscription, debounceTime, lastValueFrom, map } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeleteComponent } from 'src/app/shared/components/delete/delete.component';
import { ToastrService } from 'ngx-toastr';
class FilterBrokers {
  title: string;
  items: number[];
}
@Component({
  selector: 'app-broker-list',
  templateUrl: './broker-list.component.html',
  styleUrls: ['./broker-list.component.scss'],
  providers: [DialogService],
})
export class BrokerListComponent {
  _searchInputSubscription: Subscription;
  _searchinput: Subject<string> = new Subject<string>();
  pageHasItems = false;
  page = new Page();
  filter = new FilterBrokers();
  items = new Array<BrokerModel>();
  constructor(
    private _brokerservice: BrokersService,
    private toastr: ToastrService,
    private router: Router,
    public dialogService: DialogService
  ) {
    this.page.size = 10;
    this._searchInputSubscription = this._searchinput
      .pipe(debounceTime(700))
      .subscribe(async (res) => {
        this.filter.title = res;
        this.setFilter();
      });
  }
  async ngOnInit() {
    if ((await this.get(0)).length !== 0) {
      this.pageHasItems = true;
    }
  }

  setPage(pageNumber: number) {
    this.get(pageNumber);
  }

  async get(pageNumber: number) {
    this.page.pageNumber = pageNumber;
    const res = this._brokerservice.getBrokers(this.page, this.filter).pipe(
      map((it) => {
        if (it.success) {
          this.items = it.data.items;
          this.page.totalElements = it.data.totalCount;
          this.page.totalPages = it.data.totalPages;
        }
        return it.data.items;
      })
    );
    return await lastValueFrom(res);
  }
  setFilter() {
    if (this.filter.title.trim().length == 0) {
      this.filter = new FilterBrokers();
    }
    this.setPage(0);
  }
  goToDetails(id: number) {
    this.router.navigateByUrl(`cnt/brokers/${id}`);
  }
  add() {
    this.router.navigateByUrl(`cnt/brokers/add`);
  }

  ref: DynamicDialogRef | undefined;

  deleteItem(item) {
    this.ref = this.dialogService.open(DeleteComponent, {
      data: {
        item: item,
        routeOfAction: 'Broker',
      },
      header: 'حذف',
      draggable: false,
    });
    this.ref.onClose.subscribe((res) => {
      this.modalConfirmed(res);
    });
  }
  modalConfirmed(res) {
    if (res) {
      res.success
        ? this.toastr.success(res.message, '', {
            closeButton: true,
            positionClass: 'toast-top-left',
          })
        : this.toastr.error(
            res.message || 'خطا در برقراری اتصال ! با واحد فناوری تماس بگیرید',
            '',
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
    } else {
      console.log('Denied Or Server Err');
    }
    this.page.pageNumber = 0;
    this.filter = new FilterBrokers();
    this.get(this.page.pageNumber);
  }
}
