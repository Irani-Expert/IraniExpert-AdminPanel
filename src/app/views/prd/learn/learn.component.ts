import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { LearnModel } from './learn.model';
import { LearnService } from './learn.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit {
  rows: LearnModel[] = new Array<LearnModel>();
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  addUpdate: LearnModel;
  addForm: FormGroup;
 @Input() productId:number ;
  pageIndex = 1;
  products: any[] = [];
  pageSize = 12;
  rowId: number;

  constructor(
    public _learnService : LearnService,
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
      fileUrl: [null],
      videoUrl: [null],
      tableType:[6],
      rowID: [this.productId],
    });
  
  }

  setPage(pageInfo:number) {
    this.pageIndex = pageInfo;

    this.getLearnByProductId(this.pageIndex , this.pageSize);
  }
  async getLearnByProductId(pageNumber: number, seedNumber: number) {
    this._learnService
      .getLearnByProductId(pageNumber, seedNumber, 'ID', 'Learn', this.productId)
      .subscribe(
        (res: Result<LearnModel[]>) => {
          this.rows = res.data;
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

  deleteLearn(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (_result) => {
          this._learnService.delete(id,"learn").subscribe((res) => {
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
            this.getLearnByProductId(
              this.pageIndex,
              this.pageSize
            );
        
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
  addorEdit(content: any, row: LearnModel) {
    if (row === undefined) {
      row = new LearnModel();
      row.id = 0;
      row.productId = this.productId;
      row.product = null;
      row.videoUrl = null;
      row.fileUrl = null;
    }
    this.addUpdate = row;
    this.modalService
      .open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
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

  async addOrUpdate(row: LearnModel) {
    if (row.id === 0) {
      await this._learnService
        .create(row, 'learn')
        .subscribe(
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
          }
        );
    } else {
      await this._learnService
        .update(row.id, row, 'learn')
        .subscribe(
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
          }
        );
    }

    this.getLearnByProductId(this.pageIndex, this.pageIndex);
  }
  selectType($event:any){
    if ($event != undefined) {
      this.addUpdate.orderID =parseInt($event);
    }
  }
}
