import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { Utils } from 'src/app/shared/utils';
import { OrderModel } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  toggled = false;
  rows: OrderModel[] = new Array<OrderModel>();
  viewMode: 'list' | 'grid' = 'list';
  page: Page = new Page();
  @ViewChildren(PerfectScrollbarDirective)
  psContainers: QueryList<PerfectScrollbarDirective>;
  psContainerSecSidebar: PerfectScrollbarDirective;
  note: OrderModel;
  constructor(
    public router: Router,
    public _orderService: OrderService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
    setTimeout(() => {
      this.psContainerSecSidebar = this.psContainers.toArray()[1];
    });
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
    this.updateNotebar();
    // CLOSE SIDENAV ON ROUTE CHANGE
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange) => {
        if (Utils.isMobile()) {
          this._orderService.sidebarState.sidenavOpen = false;
        }
      });
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getOrderList(this.page.pageNumber, this.page.size);
  }
  async getOrderList(pageNumber: number, seedNumber: number) {
    this._orderService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'orders'
      )
      .subscribe(
        (res: Result<Paginate<OrderModel[]>>) => {
          this.rows = res.data.items;
          this.page.totalElements = res.data.totalCount;
          this.page.totalPages = res.data.totalPages - 1;
          this.page.pageNumber = res.data.pageNumber + 1;
        },
        (_error) => {
          this.toastr.error(
            'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
            null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
        }
      );
  }
  deleteOrder(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        this._orderService
          .delete(id, 'orders')
          .toPromise()
          .then((res) => {
            if (res.success) {
              this.toastr.success(
                'فرایند حذف موفقیت آمیز بود',
                'موفقیت آمیز!',
                {
                  timeOut: 3000,
                  positionClass: 'toast-top-left',
                }
              );
            } else {
              this.toastr.error('خطا در حذف', res.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            }
            this.getOrderList(this.page.pageNumber, this.page.size);
          });
      });
  }
  getNoteList(row: OrderModel) {
    this.note = row;
  }
  toggleNotebar(item: OrderModel) {
    this.getNoteList(item);
    this.toggled = true;
    const state = this._orderService.sidebarState;

    if (state.sidenavOpen) {
      return (state.sidenavOpen = false);
    }
    if (!state.sidenavOpen) {
      state.sidenavOpen = true;
    }
  }
  updateNotebar() {
    this.toggled = false;
    if (Utils.isMobile()) {
      this._orderService.sidebarState.sidenavOpen = false;
    } else {
      this._orderService.sidebarState.sidenavOpen = false;
    }
  }
}
