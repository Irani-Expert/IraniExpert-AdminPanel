import { Component, OnInit } from '@angular/core';
import { CommentService } from '../all-comment/comment.service';
import { Page } from 'src/app/shared/models/Base/page';
import { Result } from 'src/app/shared/models/Base/result.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { CommentModel } from 'src/app/shared/models/comment.model';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  tableTypes = [
    { title: 'سفارشات', id: 8 },
    { title: 'درخواست مشتریان', id: 10 },
  ];
  currentTableType: number = 8;
  dropDownTitleHolder: string = null;

  page: Page = new Page();

  rows: CommentModel[];
  pageIsLoad: boolean = false;
  filter: FilterModel = new FilterModel();

  constructor(
    public _commentService: CommentService,
    private toastr: ToastrService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 6;
  }

  ngOnInit(): void {
    this.setPage(0, this.currentTableType);
  }
  setPage(pageNumber: number, tableType: number) {
    this.page.pageNumber = pageNumber;
    this.getCommnetOfspecificTableTypes(tableType);
  }
  getCommnetOfspecificTableTypes(tableTypeId: number) {
    this.currentTableType = tableTypeId;
    this.tableTypes.forEach((item) => {
      if (item.id === tableTypeId) {
        this.dropDownTitleHolder = item.title;
      }
    });
    this._commentService
      .GetAllComment(
        this.page.pageNumber !== 0
          ? this.page.pageNumber - 1
          : this.page.pageNumber,
        this.page.size,
        tableTypeId,
        this.filter
      )
      .subscribe(
        (res: Result<Paginate<CommentModel[]>>) => {
          this.pageIsLoad = true;
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
}
