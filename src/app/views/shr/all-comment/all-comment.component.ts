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
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-all-comment',
  templateUrl: './all-comment.component.html',
  styleUrls: ['./all-comment.component.scss'],
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
export class AllCommentComponent implements OnInit {
  tableTypeTitles = [
    { title: 'مقالات', id: 1 },
    { title: 'محصولات', id: 6 },
  ];
  dropDownTitleHolder: string = 'مقالات';
  ExpDate: any;
  CrtDate: any;
  filterHolder: FilterModel=new FilterModel;
  rateNumber: number[] = [1,2,3,4,5]; 
  rateText:string='همه';   
  isDivExpanded: boolean = false;
   newFilterModel: FilterModel = new FilterModel();
  tableType: number;
  filter: FilterModel = new FilterModel();
  rows: CommentModel[] = new Array<CommentModel>();
  page: Page = new Page();
  stateOfChevron: string = 'default';
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
    this.page.size = 6;
  }


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
    
// if( !(Object.keys(filter).length === 0)){
// }
    
    this.tableType = tableType;
    let finder = this.tableTypeTitles.findIndex((item) => item.id == tableType);
    if(finder!=-1){
      this.dropDownTitleHolder = this.tableTypeTitles[finder].title;
    }
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
          this.sendFilter()

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


  sendFilter(){
this.filterModel=this.newFilterModel;
 
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
 
    this.getCommentList(0, this.tableType, this.filterModel);
    this.filteredItems(this.filterModel)
    this.filter = new FilterModel();
  }
 
  setRate(rate:number){
    this.filterModel.rate=rate
    if (this.filterModel.rate != null) {
      this.filterModel.rate = Number(this.filterModel.rate);
    }

    if(rate!=null){
      this.rateText=String(rate)

    }
    else{
      this.rateText='همه'
    }
    this.getCommentList(0, this.tableType, this.filterModel);
    }
    toggleFilters() {
      this.isDivExpanded = !this.isDivExpanded;
      this.stateOfChevron =
        this.stateOfChevron === 'default' ? 'rotated' : 'default';
    }
    filteredItems(filter: FilterModel) {
      
      this.filterHolder = { ...filter };
    }
}
