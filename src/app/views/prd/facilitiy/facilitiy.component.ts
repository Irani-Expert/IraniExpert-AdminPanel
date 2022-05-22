import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FacilitiyModel } from './facilitiy.model';
import { FacilitiyService } from './facility.service';


@Component({
  selector: 'app-facilitiy',
  templateUrl: './facilitiy.component.html',
  styleUrls: ['./facilitiy.component.scss']
})
export class FacilitiyComponent implements OnInit {
  rows: FacilitiyModel[] = new Array<FacilitiyModel>();
  allSelected: boolean;
  addUpdate: FacilitiyModel;
  addForm: FormGroup;
 @Input() productId:number ;
  pageIndex = 1;
  products: any[] = [];
  pageSize = 12;
  

  constructor(
    public _facilitiyService : FacilitiyService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.setPage(0);
    this.addForm = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required,Validators.maxLength(50),Validators.minLength(2)])],
      orderID: [null, Validators.compose([Validators.required])],
      description: [null , Validators.compose([Validators.maxLength(500)])],
      isActive: [null],
      tableType:[6],
      rowID: [this.productId],
    });
  
  }

  setPage(pageInfo:number) {
    this.pageIndex = pageInfo;

    this.getFacilitiyByProductId(this.pageIndex , this.pageSize);
  }
  async getFacilitiyByProductId(pageNumber: number, seedNumber: number) {
    this._facilitiyService
      .getFacilitiyByProductId(pageNumber, seedNumber, 'ID', 'Facilitiy', this.productId)
      .subscribe(
        (res: Result<FacilitiyModel[]>) => {
          this.rows = res.data;
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

  deleteLearn(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (_result) => {
          this._facilitiyService.delete(id,"facility").toPromise().then((res) => {
            if(res.success){

              this.toastr.success('فرایند حذف موفقیت آمیز بود', 'موفقیت آمیز!', {
                timeOut: 3000,
              positionClass: 'toast-top-left',

              });
            }else{
              this.toastr.error('خطا در حذف',res.message, {
                timeOut: 3000,
              positionClass: 'toast-top-left',

              });
            }
            this.getFacilitiyByProductId(
              this.pageIndex,
              this.pageSize
            );
          })
          .catch(err=>{
            this.toastr.error('خطا در حذف',err.message, {
              timeOut: 3000,
              positionClass: 'toast-top-left',
            });
          });

        },
        (error) => {

          this.toastr.error('خطا در حذف',error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }
  //Add OR Edit!!!!!!!!!!!!!!!
  addorEdit(content: any, row: FacilitiyModel) {
    if (row === undefined) {
      row = new FacilitiyModel();
      row.id = 0;
      row.productId = this.productId;
      row.product = null;
    }
    this.addUpdate = row;
    this.modalService

      .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' })
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

  async addOrUpdate(row: FacilitiyModel) {
    if (row.id === 0) {
      await this._facilitiyService
        .create(row, 'learn')
        .toPromise()
        .then(
          (data) => {
            if (data.success) {
              this.toastr.success(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            } else {
              this.toastr.error(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
            }
          },
          (_error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    } else {
      await this._facilitiyService
        .update(row.id, row, 'learn')
        .toPromise()
        .then(
          (data) => {
            if (data.success) {
              this.toastr.success(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
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

    this.getFacilitiyByProductId(this.pageIndex, this.pageIndex);
  }
  selectType($event:any){
    if ($event != undefined) {
      this.addUpdate.orderID =parseInt($event);
    }
  }
}
