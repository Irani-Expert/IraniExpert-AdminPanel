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
      discountPrice : [0],
    });
  }
  async addOrUpdate(item: PlanOptionModel) {
    if(this.addUpdate.discountPrice == null){
      this.addUpdate.discountPrice = 0;
    }
    console.log(this.addUpdate.discountPrice);
    
    if (item.id === 0) {
      this._planOptionService.create(item, 'PlanOption').subscribe((data) => {
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
      });
    } else {
      this._planOptionService
        .update(item.id, item, 'PlanOption')
        .subscribe((data) => {
          if (data.success) {
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            // this.addForm.reset();
          } else {
            this.toastr.error(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            // this.addForm.reset();
          }
        });
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
