import { Component, OnInit } from '@angular/core';
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
  productid: string;
  pageIndex = 1;
  pageSize = 12;
  constructor(
    public _FaqService: FaqService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}

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
        this.productid
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

}
