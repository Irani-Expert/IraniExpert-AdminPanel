import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { GroupModel } from './group.model';
import { GroupService } from './group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  rows: GroupModel[] = new Array<GroupModel>();
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  pageIndex = 1;
  pageSize = 12;
  addUpdate:GroupModel;
  addForm: FormGroup;
  constructor(
    public _groupService: GroupService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder

  ) {}

  ngOnInit() {
    this.setPage(0);
    this.addForm = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      parentID: [null, Validators.compose([Validators.required])],
      type: [null, Validators.compose([Validators.required])],
      isActive: [null],
    });
  }

  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.getGroupList(this.pageIndex, this.pageSize);
  }

   getGroupList(pageNumber: number, seedNumber: number) {
     this._groupService
      .get(pageNumber, seedNumber, 'ID', null, 'Group')
      .subscribe(
        (res: Result<GroupModel[]>) => {
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

  deleteGroup(id, modal) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._groupService
            .delete(id, 'Group')
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
              this.getGroupList(this.pageIndex, this.pageSize);
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

  addorEdit(content, row: GroupModel) {

    debugger
    if (row === undefined) {
      row = new GroupModel();
      row.id = 0;
      row.type=null;
      row.parentID=null;
    }
    this.addUpdate = row;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result: boolean) => {
          if (result != undefined) {
              this.addOrUpdate(this.addUpdate);
              this.addForm.reset();

          }
        },
        (reason) => {
          console.log('Err!', reason);
          this.addForm.reset();
        }
      );
  }

  async addOrUpdate(row: GroupModel) {
    if(row.id===0){
      await this._groupService.create(row,"Group").toPromise()
      .then(data => {
        if (data.success) {
          this.toastr.success(data.message, null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',

            });
        } else {
          this.toastr.error(data.message, null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
        }
      },
        error => {
          this.toastr.error("خطا مجدد تلاش فرمایید", null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
        }
      );
    }else{
      await this._groupService.update(row.id,row,"Group").toPromise()
      .then(data => {
        if (data.success) {
          this.toastr.success(data.message, null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',

            });

        } else {
          this.toastr.error(data.message, null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
        }
      },
        error => {
          this.toastr.error("خطا مجدد تلاش فرمایید", null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
        }
      );
    }

    this.getGroupList(this.pageIndex,this.pageIndex)

  }

  selectParent($event:any){
    debugger
    if ($event != undefined) {
      this.addUpdate.parentID =parseInt($event);
    }
  }
  selectType($event:any){
    debugger
    if ($event != undefined) {
      this.addUpdate.type =parseInt($event);
    }
  }
}
