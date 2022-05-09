import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { GroupModel } from 'src/app/views/bas/group/group.model';
import { CntModule } from '../../cnt.module';
import { BannerModel } from './banner.model';
import { BannerService } from './banner.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  rows: BannerModel[] = new Array<BannerModel>();
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  pageIndex = 1;
  pageSize = 12;
  addUpdate:GroupModel;
  addForm: FormGroup;
  constructor(
    public _bannerService: BannerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder

  ) {}

  ngOnInit(): void {
    this.setPage(0);
    this.addForm = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      type: [null, Validators.compose([Validators.required])],
      LinkType: [null, Validators.compose([Validators.required])],
      FileType: [null, Validators.compose([Validators.required])],
      isActive: [null],
    });
  }





  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;

    this.getBannerList(this.pageIndex, this.pageSize);
  }

  async getBannerList(pageNumber: number, seedNumber: number) {
    await this._bannerService
      .get(pageNumber, seedNumber, 'ID', null, 'Banner')
      .subscribe(
        (res: Result<BannerModel[]>) => {
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

  deleteBanner(id, modal) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._bannerService
            .delete(id, 'Banner')
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
              this.getBannerList(this.pageIndex, this.pageSize);
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


  addorEdit(content,row:GroupModel){
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
              // this.addOrUpdate(this.addUpdate);
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
  debugger
  if(row.id===0){
    await this._bannerService.create(row,"Banner").toPromise()
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
    await this._bannerService.update(row.id,row,"Banner").toPromise()
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

  this.getBannerList(this.pageIndex,this.pageIndex)

}


}
