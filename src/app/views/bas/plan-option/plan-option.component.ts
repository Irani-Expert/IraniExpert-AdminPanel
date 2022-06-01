import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { PlanOptionModel } from './plan-option.model';
import { PlanOptionService } from './plan-option.service';

@Component({
  selector: 'app-plan-option',
  templateUrl: './plan-option.component.html',
  styleUrls: ['./plan-option.component.scss'],
})
export class PlanOptionComponent implements OnInit {
  @Input() addUpdate: PlanOptionModel;
  addForm: FormGroup;
  constructor(
    private _planOptionService: PlanOptionService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}
  ngOnInit(): void {
    this.addForm = this._formBuilder.group({
      title: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2),
        ]),
      ],
      orderID: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.maxLength(500)])],
      isActive: [null],
      price: [null],
      iconPath: [null],
    });
  }
  async addOrUpdate(item: PlanOptionModel) {
    if (item.id === 0) {
      await this._planOptionService
        .create(item, 'PlanOption')
        .toPromise()
        .then(
          (data) => {
            if (data.success) {
              this.toastr.success(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
              this.addForm.reset();
            } else {
              this.toastr.error(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
              this.addForm.reset();
            }
          },
          (_error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            this.addForm.reset();
          }
        );
    } else {
      await this._planOptionService
        .update(item.id, item, 'PlanOption')
        .toPromise()
        .then(
          (data) => {
            if (data.success) {
              this.toastr.success(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
              this.addForm.reset();
            } else {
              this.toastr.error(data.message, null, {
                closeButton: true,
                positionClass: 'toast-top-left',
              });
              this.addForm.reset();
            }
          },
          (_error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            this.addForm.reset();
          }
        );
    }
  }
  close() {
    this.activeModal.close();
  }
  selectType($event: any) {
    if ($event != undefined) {
      this.addUpdate.orderID = parseInt($event);
    }
  }
}
