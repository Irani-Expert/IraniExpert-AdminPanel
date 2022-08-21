import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ArticleModel } from '../article/article.model';
import { CommentService } from './comment.service';
import { CommentModel } from './comment.model';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Page } from 'src/app/shared/models/Base/page';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  rows: CommentModel[] = new Array<CommentModel>();
  replyText: string = null;
  parentComment: CommentModel = new CommentModel();
  @Input() articleId: number;
  page: Page = new Page();
  constructor(
    public _commentService: CommentService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getCommentListByArticleId(this.page.pageNumber, this.page.size);
  }

  async getCommentListByArticleId(pageNumber: number, seedNumber: number) {
    this._commentService
      .GetByTableTypeAndRowId(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        'comment',
        this.articleId,
        1
      )
      .subscribe(
        (res: Result<Paginate<CommentModel[]>>) => {
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

  deleteComment(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._commentService
            .delete(id, 'comment')
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
              this.getCommentListByArticleId(
                this.page.pageNumber,
                this.page.size
              );
            })
            .catch((err) => {
              this.toastr.error('خطا در حذف', err.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            });
        },
        (error) => {
          this.toastr.error('انصراف از حذف', error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
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
        .toPromise()
        .then(
          (data) => {
            if (data.success) {
            } else {
              this.toastr.error(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            }
          },
          (error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    }
    row.isAccepted = true;
    row.isActive = true;
    this._commentService
      .update(row.id, row, 'comment')
      .toPromise()
      .then(
        (data) => {
          if (data.success) {
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            this.getCommentListByArticleId(
              this.page.pageNumber,
              this.page.size
            );
          } else {
            this.toastr.error(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        },
        (error) => {
          this.toastr.error('خطا مجدد تلاش فرمایید', null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      );
  }
}
