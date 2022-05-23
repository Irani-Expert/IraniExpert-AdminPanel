import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FacilityModel } from './facility.model';
import { FacilityService } from './facility.service';



@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.scss']
})
export class FacilityComponent implements OnInit {
  rows: FacilityModel[] = new Array<FacilityModel>();
  allSelected: boolean;
  addUpdate: FacilityModel;
  addForm: FormGroup;
 @Input() productId:number ;
  pageIndex = 1;
  products: any[] = [];
  pageSize = 12;
  

  constructor(
    public _facilityService : FacilityService,
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

    this.getFacilityByProductId(this.pageIndex , this.pageSize);
  }
  async getFacilityByProductId(pageNumber: number, seedNumber: number) {
    this._facilityService
      .getFacilityByProductId(pageNumber, seedNumber, 'ID', 'Facilitiy', this.productId)
      .subscribe(
        (res: Result<FacilityModel[]>) => {
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

  deleteFacility(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (_result) => {
          this._facilityService.delete(id,"Facility").toPromise().then((res) => {
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
            this.getFacilityByProductId(
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
  addorEdit(content: any, row: FacilityModel) {
    if (row === undefined) {
      row = new FacilityModel();
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

  async addOrUpdate(row: FacilityModel) {
    if (row.id === 0) {
      await this._facilityService
        .create(row, 'Facility')
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
      await this._facilityService
        .update(row.id, row, 'Facility')
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

    this.getFacilityByProductId(this.pageIndex, this.pageIndex);
  }
  selectType($event:any){
    if ($event != undefined) {
      this.addUpdate.orderID =parseInt($event);
    }
  }
}
