import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { CommentModel } from 'src/app/shared/models/comment.model';
import { CommentService } from 'src/app/views/prd/comment/comment.service';

@Component({
  selector: 'app-all-comment',
  templateUrl: './all-comment.component.html',
  styleUrls: ['./all-comment.component.scss']
})
export class AllCommentComponent implements OnInit {
  rows: CommentModel[] = new Array<CommentModel>();
  page: Page = new Page();
  parentComment: CommentModel = new CommentModel();
  replyText: string = null;

  constructor(public _commentService: CommentService,
    private toastr: ToastrService,
    private modalService: NgbModal
    ) {   this.page.pageNumber = 0;
    this.page.size = 12;}

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);

  }

  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getCommentListByProductId(this.page.pageNumber, this.page.size);
  }
  async getCommentListByProductId(pageNumber: number, seedNumber: number) {
    await this._commentService
      .GetAllComment(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
    
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
          debugger
          if (result)
          this.acceptComment(row);
        },
        (reason) => {
          debugger
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
    debugger
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
            this.getCommentListByProductId(
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
