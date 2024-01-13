import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FaqModel } from './faq.model';
import { FaqService } from './faq.service';
import { ckeConfig } from 'src/app/shared/ckconfig';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FAQComponent implements OnInit {
  ckeConfig = ckeConfig;

  rows: FaqModel[] = new Array<FaqModel>();
  @Input() productId: number = 0;
  @Input() tableType: number = 6;
  addForm: FormGroup;
  addUpdate: FaqModel = new FaqModel();
  pageIndex = 1;
  pageSize = 12;
  constructor(
    public _FaqService: FaqService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {
    // this.ckeConfig.
  }

  ngOnInit(): void {
    this.addUpdate.id = 0;

    this.addForm = this._formBuilder.group({
      question: [null, Validators.compose([Validators.required])],
      answer: [null],
    });

    this.setPage();
  }

  setPage() {
    this.getFaqListByProductId();
  }

  getFaqListByProductId() {
    this._FaqService
      .getFaqByProductId(this.productId, this.tableType)
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
          this._FaqService.delete(id, 'faq').subscribe((res) => {
            if (res.success) {
              this.toastr.success(
                'فرایند حذف موفقیت آمیز بود',
                'موفقیت آمیز!',
                {
                  timeOut: 3000,
                  positionClass: 'toast-top-left',
                }
              );
            } else {
              this.toastr.error('خطا در حذف', res.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            }
            this.getFaqListByProductId();
          });
        },
        (error) => {
          this.toastr.error('خطا در حذف', error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }

  addOrUpdate() {
    this.addUpdate.tableType = this.tableType;
    this.addUpdate.rowId = this.productId;
    this.addUpdate.title = 'تست';
    this.addUpdate.description = '';
    this.addUpdate.isActive = true;
    //TODO Order Id Must Fill From Input
    this.addUpdate.orderID = 1;
    if (this.addUpdate.id === 0) {
      this._FaqService.create(this.addUpdate, 'FAQ').subscribe({
        next: (data) => {
          if (data.success) {
            this.rows.push(this.addUpdate);
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            this.addUpdate = new FaqModel();
            this.addForm.reset();
            this.getFaqListByProductId();
          } else {
            this.toastr.error(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            this.getFaqListByProductId();
          }
        },
        error: (err) => {
          console.log(err);

          this.getFaqListByProductId();
        },
      });
    } else {
      this._FaqService
        .update(this.addUpdate.id, this.addUpdate, 'FAQ')
        .subscribe({
          next: (data) => {
            if (data.success) {
              this.rows.push(this.addUpdate);
              this.toastr.success(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
              this.addUpdate = new FaqModel();
              this.addForm.reset();
              this.getFaqListByProductId();
            } else {
              this.toastr.error(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
              this.getFaqListByProductId();
            }
          },
          error: (err) => {
            console.log(err);

            this.getFaqListByProductId();
          },
        });
    }
  }
}
