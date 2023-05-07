import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  HostListener,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { CommentModel } from 'src/app/shared/models/comment.model';
import { UserInfoModel } from 'src/app/shared/models/userInfoModel';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { Utils } from 'src/app/shared/utils';
import { UserNeedModel } from './user-need.model';
import { UserNeedService } from './user-need.service';
import * as moment from 'jalali-moment';
import { CommentService } from '../all-comment/comment.service';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
@Component({
  selector: 'app-user-need',
  templateUrl: './user-need.component.html',
  styleUrls: ['./user-need.component.scss'],
  animations: [
    trigger('rotate90deg', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-90deg)' })),
      transition('rotated => default', animate('300ms ease-in-out')),
      transition('default => rotated', animate('500ms ease-in-out')),
    ]),
    // trigger('pushDown', [
    //   state('default', style({ margin: '0' })),
    //   state('rotated', style({ margin: '2% 0 0 0' })),
    //   transition('rotated => default', animate('100ms ease-in-out')),
    //   transition('default => rotated', animate('300ms ease-in-out')),
    // ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-40%)', opacity: 0 }),
        animate(
          '500ms ease-in-out',
          style({ transform: 'translateY(0%)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in-out',
          style({ transform: 'translateY(-40%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class UserNeedComponent implements OnInit {
  filterModel: FilterModel = new FilterModel();
  fromCreateDate: { year: number; month: number; day: number };
  toCreateDate: { year: number; month: number; day: number };
  filterExecutedModel: FilterModel = new FilterModel();
  stateOfChevron: string = 'default';
  filterHolder: FilterModel=new FilterModel;

  filterValues: Array<{
    title: string;
    value: string | number | boolean;
    key: string;
  }> = [];

  dropDownTitleHolder: string = null;

  statusTitles = [
    { title: 'آخرین درخواست ها', id: null },
    { title: 'دمو', id: 0 },
    { title: 'مشاوره', id: 1 },
    { title: 'مشارکت در سود', id: 2 },
    { title: 'نمایشگاه', id: 3 },
    { title: 'تغییر معرف', id: 4 },
  ];

  note: CommentModel = new CommentModel();
  notes: CommentModel[] = new Array<CommentModel>();
  noteRowID: number;
  // @ViewChild('addNoteElement') MyProp: HTMLElement;
  @ViewChildren(PerfectScrollbarDirective)
  psContainers: QueryList<PerfectScrollbarDirective>;
  psContainerSecSidebar: PerfectScrollbarDirective;
  toggled = false;
  isDivExpanded: boolean = false;
  userWant: number;
  userInfo: UserInfoModel;
  rows: UserNeedModel[] = new Array<UserNeedModel>();
  page: Page = new Page();
  constructor(
    public router: Router,
    public _UserNeedService: UserNeedService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private auth: AuthenticateService,
    private _commentService: CommentService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
    setTimeout(() => {
      this.psContainerSecSidebar = this.psContainers.toArray()[1];
    });
  }

  ngOnInit(): void {
    this.userInfo = this.auth.currentUserValue;
    this.setPage(this.page.pageNumber, null);
    this.updateNotebar();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((_routeChange) => {
        if (Utils.isMobile()) {
          this._UserNeedService.sidebarState.sidenavOpen = false;
        }
      });
  }

  setPage(pageInfo: number, userWant: number) {
    this.page.pageNumber = pageInfo;
    this.getUserNeedByUserWant(userWant, pageInfo);
  }

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   var scroller = document.getElementById('scrollPart');

  //   if (document.documentElement.scrollTop > 150) {
  //     scroller?.classList.add('afterScroll');
  //     scroller?.classList.remove('auther-start');
  //   } else {
  //     scroller?.classList.add('auther-start');

  //     scroller?.classList.remove('afterScroll');
  //   }
  //   var comments = document.getElementById('comments');

  //   if (document.documentElement.scrollTop + 400 > comments!.offsetHeight) {
  //     scroller?.classList.remove('afterScroll');
  //     scroller?.classList.remove('auther-start');
  //     scroller?.classList.add('auther-end');
  //   } else {
  //     scroller?.classList.remove('auther-end');
  //   }
  // }

  getUserNeedByUserWant(userWant: number, pageNumber: number) {
    this.userWant = userWant;

    this.statusTitles.forEach((item) => {
      if (item.id === userWant) {
        this.dropDownTitleHolder = item.title;
      }
    });

    this._UserNeedService
      .getByStatus(12, pageNumber !== 0 ? pageNumber - 1 : pageNumber, userWant)
      .subscribe(
        (res: Result<Paginate<UserNeedModel[]>>) => {
          this.rows = res.data.items;
          // var scrollPart = document.getElementById('scrollPart');

          var counter = 0;
          this.rows.forEach((x) => {
            this.rows[counter].createDate = moment(
              this.rows[counter].createDate,
              'YYYY/MM/DD'
            )
              .locale('fa')
              .format('YYYY/MM/DD');

            counter++;
          });
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

  async getUserNeedById(pageNumber: number, seedNumber: number) {
    this._UserNeedService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'UserNeed'
      )
      .subscribe((res: Result<Paginate<UserNeedModel[]>>) => {
        this.rows = res.data.items;
        this.page.totalElements = res.data.totalCount;
        this.page.totalPages = res.data.totalPages - 1;
        this.page.pageNumber = res.data.pageNumber + 1;
      });
  }

  deleteUserNeed(id: any, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._UserNeedService.delete(id, 'UserNeed').subscribe((res) => {
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
          });
        },
        (error) => {
          this.toastr.error('انصراف از حذف', error.message, {
            timeOut: 2000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }

  // addComent(item: CommentModel, content: any) {
  //   this.user = this.auth.currentUserValue;
  //   this.addCommentRows.text = this.addComentText;
  //   this.addCommentRows.rate = 0;
  //   this.addCommentRows.email = this.userInfo.subject;
  //   this.addCommentRows.name =
  //     this.userInfo.firstName + ' ' + this.userInfo.lastName;
  //   this.addCommentRows.rowID = this.rowIdKeeper;
  //   this.addCommentRows.isAccepted = true;
  //   this.addCommentRows.tableType = 10;
  //   this.addCommentRows.parentID = null;
  //   this.addCommentRows.createDate = new Date();

  //   this._UserNeedService
  //     .create(this.addCommentRows, 'Comment')

  //     .subscribe((data) => {
  //       if (data.success) {
  //         this.addCommentRows.jalaliDate = moment(
  //           this.addCommentRows.createDate,
  //           'YYYY/MM/DD'
  //         )
  //           .locale('fa')
  //           .format('YYYY/MM/DD');
  //         this.commentRows.unshift(this.addCommentRows);
  //         this.toastr.success(data.message, null, {
  //           closeButton: true,
  //           positionClass: 'toast-top-left',
  //         });
  //       } else {
  //         this.toastr.error(data.message, null, {
  //           closeButton: true,
  //           positionClass: 'toast-top-left',
  //         });
  //       }
  //     });
  // }

  // Note List / / / / / / / / / / / / /
  getNoteList(rowID: number) {
    this.notes = new Array<CommentModel>();
    this._commentService
      .GetByTableTypeAndRowId(0, 20, rowID, 10)
      .subscribe((res: Result<Paginate<CommentModel[]>>) => {
        this.notes = res.data.items;
        var counter = 0;
        this.notes.forEach((_x) => {
          this.notes[counter].jalaliDate = moment(
            this.notes[counter].createDate,
            'YYYY/MM/DD'
          )
            .locale('fa')
            .format('YYYY/MM/DD');
          counter++;
        });
      });
  }

  toggleNotebar(rowID: number) {
    this.noteRowID = rowID;
    this.getNoteList(rowID);
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
    if (Utils.isMobile()) {
      this._UserNeedService.sidebarState.sidenavOpen = false;
    } else {
      this._UserNeedService.sidebarState.sidenavOpen = false;
    }
  }

  // ConfirmModal and Add Note

  clearNote() {
    this.note = new CommentModel();
  }

  openConfirmationModal(item: CommentModel, content: NgbModal) {
    this.userInfo = this.auth.currentUserValue;
    item.rate = 1;
    item.email = this.userInfo.subject;
    item.name = this.userInfo.firstName + ' ' + this.userInfo.lastName;
    item.isActive = true;
    item.rowID = this.noteRowID;
    item.isAccepted = true;
    item.tableType = 8;
    item.parentID = null;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then((_result: boolean) => {
        if (_result === true) {
          this._commentService.create(item, 'Comment').subscribe((res) => {
            if (res.success) {
              this.toastr.success('یادداشت ایجاد شد', 'موفقیت آمیز!', {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
              let date = new Date();
              item.createDate = date;
              item.jalaliDate = moment(item.createDate, 'YYYY/MM/DD')
                .locale('fa')
                .format('YYYY/MM/DD');
              this.notes.unshift(item);

              this.note = new CommentModel();
            } else {
              this.toastr.error('خطا در ایجاد ', res.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            }
          });
        }
      });
  }

  /*
  *
  *
  * 
  filter 
  * 
  * 
  * 
  */

  startFilter() {
    if (this.fromCreateDate!=null) {
      this.filterModel.fromCreateDate =
        this.fromCreateDate.year +
        '-' +
        this.fromCreateDate.month +
        '-' +
        this.fromCreateDate.day;
    }
    if (this.toCreateDate!=null) {
      this.filterModel.toCreateDate =
        this.toCreateDate.year +
        '-' +
        this.toCreateDate.month +
        '-' +
        this.toCreateDate.day;
    }
    this.filteredItems(this.filterModel)

    this._UserNeedService
      .getUserNeed(
        this.filterModel,
        this.page.pageNumber !== 0
          ? this.page.pageNumber - 1
          : this.page.pageNumber,
        this.page.size,
        this.userWant
      )
      .subscribe(
        (res: Result<Paginate<UserNeedModel[]>>) => {
          this.rows = res.data.items;
          this.filterExecutedModel = { ...this.filterModel };

          /*
          *
          *
          Filter Values
          *
          */

          this.filterValues = [];

          if (this.filterExecutedModel.iD) {
            this.filterValues.push({
              title: 'شناسه',
              value: this.filterExecutedModel.iD,
              key: 'iD',
            });
          }

          if (this.filterExecutedModel.firstName) {
            this.filterValues.push({
              title: 'نام',
              value: this.filterExecutedModel.firstName,
              key: 'firstName',
            });
          }

          if (this.filterExecutedModel.lastName) {
            this.filterValues.push({
              title: 'نام خانوادگی',
              value: this.filterExecutedModel.lastName,
              key: 'lastName',
            });
          }

          if (this.filterExecutedModel.phoneNumber) {
            this.filterValues.push({
              title: 'شماره تلفن',
              value: this.filterExecutedModel.phoneNumber,
              key: 'phoneNumber',
            });
          }

          if (this.filterExecutedModel.email) {
            this.filterValues.push({
              title: 'ایمیل',
              value: this.filterExecutedModel.email,
              key: 'email',
            });
          }

          if (this.filterExecutedModel.amount) {
            this.filterValues.push({
              title: 'میزان',
              value: this.filterExecutedModel.amount,
              key: 'amount',
            });
          }

          if (this.filterExecutedModel.fromCreateDate) {
            this.filterValues.push({
              title: 'از تاریخ ایجاد',
              value: this.filterExecutedModel.fromCreateDate,
              key: 'fromCreateDate',
            });
          }

          if (this.filterExecutedModel.toCreateDate) {
            this.filterValues.push({
              title: 'تا تاریخ ایجاد',
              value: this.filterExecutedModel.toCreateDate,
              key: 'toCreateDate',
            });
          }

          if (this.filterExecutedModel.financialActivity) {
            this.filterValues.push({
              title: 'فعالیت مالی',
              value: this.filterExecutedModel.financialActivity,
              key: 'financialActivity',
            });
          }

          if (this.filterExecutedModel.robotUsage) {
            this.filterValues.push({
              title: 'استفاده از ربات',
              value: this.filterExecutedModel.robotUsage,
              key: 'robotUsage',
            });
          }
        },
        (error) => {
          this.toastr.error('رد خواست شما انجام نشد', error.message, {
            timeOut: 2000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }
  toggleFilters() {
    this.isDivExpanded = !this.isDivExpanded;
    this.stateOfChevron =
      this.stateOfChevron === 'default' ? 'rotated' : 'default';
  }
  deleteAllFilter() {
    this.filterValues = [];
    this.filterExecutedModel = new FilterModel();
    this.setPage(0, null);
  }

  deleteFilter(value: string) {
    let temporaryIndex = this.filterValues.findIndex((item) => {
      return item.value === value;
    });

    this.filterValues.splice(temporaryIndex, 1);

    this.filterExecutedModel[value] = null;

    this.filterModel = { ...this.filterExecutedModel };

    this.startFilter();
  }
  filteredItems(filter: FilterModel) {
    this.filterHolder = { ...filter };
  }
}
