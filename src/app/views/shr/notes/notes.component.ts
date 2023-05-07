import { Component, OnInit } from '@angular/core';
import { CommentService } from '../all-comment/comment.service';
import { Page } from 'src/app/shared/models/Base/page';
import { Result } from 'src/app/shared/models/Base/result.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { CommentModel } from 'src/app/shared/models/comment.model';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
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
export class NotesComponent implements OnInit {
  tableTypes = [
    { title: 'سفارشات', id: 8 },
    { title: 'درخواست مشتریان', id: 10 },
  ];
  currentTableType: number = 8;
  dropDownTitleHolder: string = null;
  stateOfChevron: string = 'default';
  page: Page = new Page();
  isDivExpanded: boolean = false;
  filterHolder: FilterModel=new FilterModel;
  rows: CommentModel[];
  pageIsLoad: boolean = false;
  filterModel: FilterModel = new FilterModel();

  constructor(
    public _commentService: CommentService,
    private toastr: ToastrService,
    private modalService: NgbModal
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
        this.filterModel
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

  /*
  *
  *
  *
  Filter
  * 
  *
  */


  toggleFilters() {
    this.isDivExpanded = !this.isDivExpanded;
    this.stateOfChevron =
      this.stateOfChevron === 'default' ? 'rotated' : 'default';
  }
  startFilter() {
    this.filteredItems(this.filterModel )
    this._commentService
      .GetAllComment(
        this.page.pageNumber !== 0
          ? this.page.pageNumber - 1
          : this.page.pageNumber,
        this.page.size,
        this.currentTableType,
        this.filterModel
      )
      .subscribe((res) => {
        this.pageIsLoad = true;
        this.rows = res.data.items;
        this.page.totalElements = res.data.totalCount;
        this.page.totalPages = res.data.totalPages - 1;
        this.page.pageNumber = res.data.pageNumber + 1;
      });
  }
  filteredItems(filter: FilterModel) {
    this.filterHolder = { ...filter };
  }
}
