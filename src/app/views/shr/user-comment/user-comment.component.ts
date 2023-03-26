import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { CommentModel } from 'src/app/shared/models/comment.model';
import { CommentService } from '../all-comment/comment.service';

@Component({
  selector: 'app-user-comment',
  templateUrl: './user-comment.component.html',
  styleUrls: ['./user-comment.component.scss'],
})
export class UserCommentComponent implements OnInit {
  rows: CommentModel[] = new Array<CommentModel>();
  page: Page = new Page();
  constructor(
    private _commentService: CommentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setPage(this.page.pageNumber);
  }

  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getCommentList(this.page.pageNumber, this.page.size);
  }
  async getCommentList(pageNumber: number, seedNumber: number) {
    this._commentService
      .GetByTableTypeAndRowIdAndUserId(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber
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
}
