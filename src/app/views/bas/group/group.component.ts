import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { GroupModel } from './group.model';
import { GroupService } from './group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  allGroups = new Array<GroupModel>();
  rows: GroupModel[] = new Array<GroupModel>();
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  page: Page = new Page();

  addUpdate: GroupModel;
  addForm: FormGroup;
  constructor(
    public _groupService: GroupService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.getAllGroups();
    this.page.pageNumber = 0;
    this.page.size = 8;
    this._route.params.subscribe((params) => {
      if (
        this.page.pageNumber != params['pageIndex'] ||
        this.rows.length == 0
      ) {
        this.page.pageNumber = params['pageIndex'];
        this.setPage(this.page.pageNumber);
      }
    });
  }

  ngOnInit() {
    this.addForm = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      parentID: [null, Validators.compose([Validators.required])],
      isActive: [null],
    });
  }

  async setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;
    this._router.navigateByUrl(`bas/group/${pageInfo}`);

    this.getGroupList(this.page.pageNumber, this.page.size);
  }
  getAllGroups() {
    const result = this._groupService.get(0, null, 'ID', null, 'Group').pipe(
      map((res) => {
        this.allGroups = res.data.items;
      })
    );
    return lastValueFrom(result);
  }
  getGroupList(pageNumber: number, seedNumber: number) {
    this._groupService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'Group'
      )
      .subscribe((res: Result<Paginate<GroupModel[]>>) => {
        this.rows = res.data.items;
        this.page.totalElements = res.data.totalCount;
        this.page.totalPages = res.data.totalPages - 1;
        this.page.pageNumber = res.data.pageNumber + 1;
      });
  }

  deleteGroup(item: GroupModel, modal: any) {
    let id = item.id;
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((_result) => {
        this._groupService.delete(id, 'Group').subscribe((res) => {
          if (res.success) {
            this.toastr.success('فرایند حذف موفقیت آمیز بود', 'موفقیت آمیز!', {
              timeOut: 3000,
              positionClass: 'toast-top-left',
            });
            // this.rows.forEach((element, index) => {
            //   if (element.id == id) this.rows.splice(index, 1);
            // });
            this.setPage(this.page.pageNumber);
          } else {
            this.toastr.error('خطا در حذف', res.message, {
              timeOut: 3000,
              positionClass: 'toast-top-left',
            });
          }
        });
      });
  }

  addorEdit(content: any, row: GroupModel) {
    if (row === undefined) {
      row = new GroupModel();
      row.id = 0;
      row.type = null;
      row.parentID = null;
    }
    this.addUpdate = row;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result: boolean) => {
        if (result === true) {
          this.addOrUpdate(this.addUpdate);
        }
      });
  }

  addOrUpdate(row: GroupModel) {
    row.type = 0;
    if (row.id === 0) {
      this._groupService.create(row, 'Group').subscribe((data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          //this.rows.unshift(row);
          this.setPage(this.page.pageNumber);

          this.addForm.reset;
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
    } else {
      this._groupService.update(row.id, row, 'Group').subscribe((data) => {
        if (data.success) {
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });

          this.updateArray(row);
          this.addForm.reset;
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
    }
  }
  updateArray(item: any) {
    let rowIndexForUpdate = this.rows.findIndex((row) => row.id === item.id);
    this.rows[rowIndexForUpdate] = item;
  }
  selectParent($event: any) {
    if ($event != undefined) {
      if (parseInt($event) !== 0) this.addUpdate.parentID = parseInt($event);
      else this.addUpdate.parentID = null;
    }
  }
  selectType($event: any) {
    if ($event != undefined) {
      this.addUpdate.type = parseInt($event);
    }
  }
}
