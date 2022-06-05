import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { CommentService } from './comment.service';
import { CommentModel } from './commnet.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  rows: CommentModel[] = new Array<CommentModel>();
  @Input() productId: number;
  @Input() tableType: number;

  pageIndex = 1;
  pageSize = 12;

  constructor(
    public _CommentService: CommentService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.setPage(0);

  }

  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.getCommentListByProductId(this.pageIndex, this.pageSize);
  }
  async getCommentListByProductId(pageNumber: number, seedNumber: number) {
    await this._CommentService
      .GetByTableTypeAndRowId(
        pageNumber,
        seedNumber,
        'ID',
        'comment',
        this.productId,
        this.tableType
      )
      .subscribe(
        (res: Result<CommentModel[]>) => {
          this.rows = res.data;
          //  this.page.totalElements = res.data.length;
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

  deleteComment(id, modal) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._CommentService
            .delete(id, 'comment')
            .toPromise()
            .then((res) => {
              if (res.success) {
                debugger;
                this.toastr.success(
                  'فرایند حذف موفقیت آمیز بود',
                  'موفقیت آمیز!',
                  {
                    timeOut: 3000,
                    positionClass: 'toast-top-left',
                  }
                );
              } else {
                debugger;

                this.toastr.error('خطا در حذف', res.message, {
                  timeOut: 3000,
                  positionClass: 'toast-top-left',
                });
              }
              this.getCommentListByProductId(this.pageIndex, this.pageSize);
            })
            .catch((err) => {
              this.toastr.error('خطا در حذف', err.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            });
          debugger;
        },
        (error) => {
          debugger;
          this.toastr.error('خطا در حذف', error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }

  openSmall(content,row) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' })
      .result.then(
        (result) => {
          if(result)
          debugger
             this.acceptComment(row)
        },
        (reason) => {
          console.log('Err!', reason);
        }
      );
  }


  acceptComment(row:CommentModel){
    row.isAccepted=true;
    row.isActive=true;
    this._CommentService
    .update(row.id,row, 'Comment')
    .toPromise()
    .then(
      (data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
                        this.getCommentListByProductId(this.pageIndex, this.pageSize);
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
