import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  HostListener,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

@Component({
  selector: 'app-user-need',
  templateUrl: './user-need.component.html',
  styleUrls: ['./user-need.component.scss'],
})
export class UserNeedComponent implements OnInit {
  filterModel: FilterModel = new FilterModel();

  note: CommentModel = new CommentModel();
  notes: CommentModel[] = new Array<CommentModel>();
  noteRowID: number;
  // @ViewChild('addNoteElement') MyProp: HTMLElement;
  @ViewChildren(PerfectScrollbarDirective)
  psContainers: QueryList<PerfectScrollbarDirective>;
  psContainerSecSidebar: PerfectScrollbarDirective;
  toggled = false;
  userWant: any = null;
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
  setPage(pageInfo: number, userWant: any) {
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
  //   console.log(window.innerHeight);

  //   if (document.documentElement.scrollTop + 400 > comments!.offsetHeight) {
  //     scroller?.classList.remove('afterScroll');
  //     scroller?.classList.remove('auther-start');
  //     scroller?.classList.add('auther-end');
  //   } else {
  //     scroller?.classList.remove('auther-end');
  //   }
  // }

  getUserNeedByUserWant(userWant: any, pageNumber: number) {
    this.userWant = userWant;
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

  openFilterModal(content: any) {
    this.modalService
      .open(content, {
        size: 'lg',
      })
      .result.then((result) => {
        this._UserNeedService.getUserNeed(this.filterModel).subscribe(
          (res: Result<Paginate<UserNeedModel[]>>) => {
            console.log(res);
          },
          (_error) => {
            console.log('error baby ');
          }
        );
      });
  }

  start(firstName: string) {
    this.filterModel.firstName = firstName;
    this._UserNeedService.getUserNeed(this.filterModel).subscribe(
      (res: Result<Paginate<UserNeedModel[]>>) => {
        this.rows = res.data.items;
      },
      (_error) => {
        console.log('error baby');
      }
    );
  }
}
