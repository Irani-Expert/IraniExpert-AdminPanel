import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { CommentModel } from 'src/app/shared/models/comment.model';
import { CommentService } from 'src/app/views/prd/comment/comment.service';

@Component({
  selector: 'app-all-comment',
  templateUrl: './all-comment.component.html',
  styleUrls: ['./all-comment.component.scss'],
})
export class AllCommentComponent implements OnInit {
  tableType: number;
  filter: FilterModel = new FilterModel();
  rows: CommentModel[] = new Array<CommentModel>();
  page: Page = new Page();
  parentComment: CommentModel = new CommentModel();
  replyText: string = null;

  constructor(
    public _commentService: CommentService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber, 8);
  }

  setPage(pageInfo: number, tableType: number) {
    this.page.pageNumber = pageInfo;

    this.getCommentList(this.page.pageNumber, tableType, this.filter);
  }
  async getCommentList(
    pageNumber: number,
    tableType: number,
    filter: FilterModel
  ) {
    this._commentService
      .GetAllComment(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        this.page.size,
        tableType,
        filter
      )
      .subscribe(
        (res: Result<Paginate<CommentModel[]>>) => {
          this.rows = res.data.items;
          this.page.totalElements = res.data.totalCount;
          this.page.totalPages = res.data.totalPages - 1;
          this.page.pageNumber = res.data.pageNumber + 1;
        },
        (error) => {
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
  openSmall(content: any, row: CommentModel) {
    this.parentComment = new CommentModel();
    this.parentComment.parentID = row.id;
    this.parentComment.rate = 0;
    this.parentComment.email = 'admin@iraniexpert.com';
    this.parentComment.name = 'پشتیبان سایت';
    this.parentComment.isAccepted = true;
    this.parentComment.tableType = row.tableType;
    this.parentComment.rowID = row.rowID;
    this.parentComment.isActive = true;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' })
      .result.then(
        (result) => {
          if (result) this.acceptComment(row);
        },
        (reason) => {
          console.log('Err!', reason);
        }
      );
  }
  acceptComment(row: CommentModel) {
    if (this.replyText !== null && this.replyText.length > 0) {
      this.parentComment.text = this.replyText;
      this._commentService
        .create(this.parentComment, 'comment')
        .subscribe((data) => {
          if (data.success) {
          } else {
            this.toastr.error(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        });
    }

    row.isAccepted = true;
    row.isActive = true;
    this._commentService
      .update(row.id, row, 'comment')

      .subscribe((data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          this.getCommentList(
            this.page.pageNumber,
            this.tableType,
            this.filter
          );
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
  }
  deleteComment(id: number, modal: NgbModal) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (_result) => {
          this._commentService.delete(id, 'Comment').subscribe((res) => {
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
            this.getCommentList(
              this.page.pageNumber,
              this.tableType,
              this.filter
            );
          });
        },
        (_error) => {}
      );
  }
  clearFilter() {
    this.filter = new FilterModel();
    this.getCommentList(this.page.pageNumber, this.tableType, this.filter);
  }
}
