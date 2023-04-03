import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { number } from 'echarts';
import * as moment from 'jalali-moment';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { CommentModel } from 'src/app/shared/models/comment.model';
import { CommentService } from 'src/app/views/shr/all-comment/comment.service';

@Component({
  selector: 'app-all-comment',
  templateUrl: './all-comment.component.html',
  styleUrls: ['./all-comment.component.scss'],
})
export class AllCommentComponent implements OnInit {
  tableTypeTitles = [
    { title: 'مقالات', id: 1 },
    { title: 'محصولات', id: 6 },
    { title: 'سفارشات', id: 8 },
    { title: 'درخواست مشتریان', id: 10 },
  ];
  dropDownTitleHolder: string = 'مقالات';
  ExpDate: any;
  CrtDate: any;

  tableType: number;
  filter: FilterModel = new FilterModel();
  rows: CommentModel[] = new Array<CommentModel>();
  page: Page = new Page();
  parentComment: CommentModel = new CommentModel();
  replyText: string = null;
  currentRate: number = 2;
  filterModel: FilterModel = new FilterModel();
  filterForm: FormGroup;
  constructor(
    public _commentService: CommentService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }
  setRate(contnt: any) {}
  ngOnInit(): void {
    this.setPage(this.page.pageNumber, 1);
    this.filterForm = this._formBuilder.group({
      userID: [null, Validators.compose([Validators.required])],
      ID: [null, Validators.compose([Validators.required])],
      rowID: [null, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      isAccepted: [null, Validators.compose([Validators.required])],
      rate: [null, Validators.compose([Validators.required])],
    });
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
    this.tableType = tableType;
    let finder = this.tableTypeTitles.findIndex((item) => item.id == tableType);
    this.dropDownTitleHolder = this.tableTypeTitles[finder].title;
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
  openFilterModal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' })
      .result.then(
        (result) => {
          if (this.filterModel.rate != null) {
            this.filterModel.rate = Number(this.filterModel.rate);
          }

          if (this.ExpDate != null) {
            this.filterModel.toCreateDate =
              this.ExpDate.year +
              '-' +
              this.ExpDate.month +
              '-' +
              this.ExpDate.day;
          }
          if (this.CrtDate != null) {
            this.filterModel.fromCreateDate =
              this.CrtDate.year +
              '-' +
              this.CrtDate.month +
              '-' +
              this.CrtDate.day;
          }
          this.getCommentList(0, 10, this.filterModel);
          this.filter = new FilterModel();
        },
        (reason) => {
          this.filter = new FilterModel();
        }
      );
  }
}
