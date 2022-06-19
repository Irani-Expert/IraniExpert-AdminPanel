import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ArticleModel } from '../article/article.model';
import { CommentService } from './comment.service';
import { CommentModel } from './comment.model';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  rows: CommentModel[] = new Array<CommentModel>();
  replyText:string=null;
  parentComment : CommentModel = new CommentModel()
  @Input() articleId: number;
  pageIndex = 1;
  pageSize = 12;
  constructor(
    public _commentService: CommentService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.setPage(0);
  }
  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.getCommentListByArticleId(this.pageIndex, this.pageSize);
  }
  async getCommentListByArticleId(pageNumber: number, seedNumber: number) {
    this._commentService
      .GetByTableTypeAndRowId(
        pageNumber,
        seedNumber,
        'ID',
        'comment',
        this.articleId,
        1
      )
      .subscribe(
        (res: Result<CommentModel[]>) => {
          this.rows = res.data;
         
          //  this.page.totalElements = res.data.length;
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
              this.getCommentListByArticleId(this.pageIndex, this.pageSize);
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
    this.parentComment=new CommentModel();
    this.parentComment.parentID=row.id;
    this.parentComment.rate=0;
    this.parentComment.email="admin@iraniexpert.com";
    this.parentComment.name="پشتیبان سایت";
    this.parentComment.isAccepted=true;
    this.parentComment.tableType=row.tableType;
    this.parentComment.rowID=row.rowID;
    this.parentComment.isActive=true;

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
   if(this.replyText!==null && this.replyText.length>0){
    this.parentComment.text=this.replyText;
    this._commentService
    .create(this.parentComment,'comment')
    .toPromise()
    .then(
      (data) => {
        if (data.success) {} else {
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
            this.getCommentListByArticleId(this.pageIndex, this.pageSize);
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
