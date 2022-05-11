import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { LeranModel } from './leran.model';
import { LeranService } from './leran.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit {

  viewMode: 'list' | 'grid' = 'list';
  rows: LeranModel[] = new Array<LeranModel>();
 @Input() productId:number ;
  pageIndex = 1;
  products: any[] = [];
  pageSize = 12;

  constructor(
    public _LeranService : LeranService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.setPage(0);
  }

  setPage(pageInfo:number) {
    this.pageIndex = pageInfo;

    this.getLeranListByProductId(this.pageIndex , this.pageSize);
  }
  async getLeranListByProductId(pageNumber: number, seedNumber: number) {
    await this._LeranService
      .getLeranByProductId(pageNumber, seedNumber, 'ID', 'Learn' , this.productId)
      .subscribe(
        (res: Result<LeranModel[]>) => {
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

  deleteLeran(id, modal) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          this._LeranService.delete(id,"learn").toPromise().then((res) => {
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
            this.getLeranListByProductId(
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
