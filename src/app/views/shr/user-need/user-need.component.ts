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
import { UserNeedModel } from './user-need.model';
import { UserNeedService } from './user-need.service';
@Component({
  selector: 'app-user-need',
  templateUrl: './user-need.component.html',
  styleUrls: ['./user-need.component.scss'],
})
export class UserNeedComponent implements OnInit {
  @ViewChildren(PerfectScrollbarDirective)
  psContainers: QueryList<PerfectScrollbarDirective>;
  psContainerSecSidebar: PerfectScrollbarDirective;
  toggled = false;
  note: UserNeedModel;
  rows: UserNeedModel[] = new Array<UserNeedModel>();
  page: Page = new Page();
  constructor(
    public router: Router,
    public _UserNeedService: UserNeedService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
    this.updateNotebar();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange) => {
        if (Utils.isMobile()) {
          this._UserNeedService.sidebarState.sidenavOpen = false;
        }
      });
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getUserNeedById(this.page.pageNumber, this.page.size);
  }
  async getUserNeedById(pageNumber: number, seedNumber: number) {
    this._UserNeedService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'UserNeed'
      )
      .subscribe(
        (res: Result<Paginate<UserNeedModel[]>>) => {
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
  deleteUserNeed(id: any, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._UserNeedService
            .delete(id, 'UserNeed')
            .toPromise()
            .then((res) => {
              if (res.success) {
                this.toastr.success(
                  'فرآیند حذف موفقیت آمیز بود',
                  'موفقیت آمیز!',
                  {
                    timeOut: 2000,
                    positionClass: 'toast-top-left',
                  }
                );
              } else {
                this.toastr.error('خطا در حذف', res.message, {
                  timeOut: 2000,
                  positionClass: 'toast-top-left',
                });
              }
              this.getUserNeedById(this.page.pageNumber, this.page.size);
            })
            .catch((err) => {
              this.toastr.error('خطا در حذف', err.message, {
                timeOut: 2000,
                positionClass: 'toast-top-left',
              });
            });
        },
        (error) => {
          this.toastr.error('خطا در حذف', error.message, {
            timeOut: 2000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }
  getNoteList(row: UserNeedModel) {
    this.note = row;
  }
  toggleNotebar(item: UserNeedModel) {
    this.getNoteList(item);
    this.toggled = true;
    const state = this._UserNeedService.sidebarState;

    if (state.sidenavOpen) {
      return (state.sidenavOpen = false);
    }
    if (!state.sidenavOpen) {
      state.sidenavOpen = true;
    }
  }
  updateNotebar() {
    this.toggled = false;
    this._UserNeedService.sidebarState.sidenavOpen = false;
  }
}
