import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FaqModel } from './faq.model';
import { FaqService } from './faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FAQComponent implements OnInit {
  rows: FaqModel[] = new Array<FaqModel>();
 @Input() productId: number=0;
  @Input() tableType: number=6;
  addForm:FormGroup;
  addUpdate:FaqModel=new FaqModel();
  pageIndex = 1;
  pageSize = 12;
  constructor(
    public _FaqService: FaqService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder:FormBuilder
  ) {
  }

  ngOnInit(): void {

    this.addUpdate.id=0;



    this.addForm = this._formBuilder.group({
      question: [null, Validators.compose([Validators.required])],
      answer: [null, Validators.compose([Validators.required])],
    });

    this.setPage(0);
  }

  setPage(pageInfo:number) {
    this.pageIndex = pageInfo;

    this.getFaqListByProductId(this.pageIndex , this.pageSize);
  }

  async getFaqListByProductId(pageNumber: number, seedNumber: number) {
    await this._FaqService
      .getFaqByProductId(
        pageNumber,
        seedNumber,
        'ID',
        'faq',
        this.productId ,
        this.tableType
      )
      .subscribe(
        (res: Result<FaqModel[]>) => {
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
  deleteFaq(id, modal) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._FaqService.delete(id,"faq").toPromise().then((res) => {
            if(res.success){
              debugger
              this.toastr.success('فرایند حذف موفقیت آمیز بود', 'موفقیت آمیز!', {
                timeOut: 3000,
              positionClass: 'toast-top-left',

              });
            }else{
              debugger

              this.toastr.error('خطا در حذف',res.message, {
                timeOut: 3000,
              positionClass: 'toast-top-left',

              });
            }
            this.getFaqListByProductId(
              this.pageIndex,
              this.pageSize
            );
          }).catch(err=>{
            this.toastr.error('خطا در حذف',err.message, {
              timeOut: 3000,
              positionClass: 'toast-top-left',
            });
          });
          debugger
        },
        (error) => {
          debugger
          this.toastr.error('خطا در حذف',error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',

          });
        }
      );
  }



  async addOrUpdate() {
    this.addUpdate.tableType=6;
    this.addUpdate.rowId=this.productId;
    this.addUpdate.title="تست";
    this.addUpdate.description="";
    this.addUpdate.isActive=true;
      //TODO Order Id Must Fill From Input
      this.addUpdate.orderID=1;
    if(this.addUpdate.id===0){
      debugger
      await this._FaqService.create(this.addUpdate,"FAQ").toPromise()
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
      await this._FaqService.update(this.addUpdate.id,this.addUpdate,"FAQ").toPromise()
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
    this.addForm.reset();
    this.getFaqListByProductId(this.pageIndex,this.pageIndex)
  }
}
