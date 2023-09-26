import { Component, HostListener } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableHeaderPipe } from 'src/app/views/bsk/order/components/table-header.pipe';
import { BaseService } from '../../services/baseService/baseService';
import { lastValueFrom, map } from 'rxjs';
import { ActionsService } from '../../services/actions.service';
type FormControl = {
  model: any;
  isEnable: boolean;
  label: string;
  engLabel: string;
};

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [DialogService, TableHeaderPipe],
})
export class EditComponent {
  private readonly actionRoute: string;
  dialogData: any;
  formGroup: Array<FormControl> = new Array<FormControl>();
  item: any;
  disabledItem: string[] | undefined = [''];
  constructor(
    private actionService: ActionsService,
    public tranlate: TableHeaderPipe,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.actionRoute = this.config.data.routeOfAction;
    this.dialogData = this.config.data;
  }
  ngOnInit() {
    this.getReadyToEdit();
  }
  getReadyToEdit() {
    this.item = { ...this.dialogData?.item };
    this.disabledItem = this.dialogData?.disabledItems;

    this.makeFormControl();
  }
  makeFormControl() {
    let arrayOfControls = Object.keys(this.item);
    for (let counter = 0; counter < arrayOfControls?.length; counter++) {
      if (
        this.disabledItem.findIndex((key) => key == arrayOfControls[counter]) ==
        -1
      ) {
        this.formGroup.unshift({
          engLabel: arrayOfControls[counter],
          model: this.item[arrayOfControls[counter]],
          isEnable: false,
          label: this.tranlate.changeNameAlone(arrayOfControls[counter]),
        });
      } else {
        this.formGroup.push({
          engLabel: arrayOfControls[counter],
          model: this.item[arrayOfControls[counter]],
          isEnable: true,
          label: this.tranlate.changeNameAlone(arrayOfControls[counter]),
        });
      }
    }
  }
  updateFormControl(item) {
    Object.keys(item).forEach((label) => {
      this.formGroup.find((it) => {
        if (it.engLabel == label) {
          it.model = item[label];
          return;
        }
      });
    });
    this.item = { ...item };
  }
  onChangeInput(value, label) {
    this.item[label] = value;
    const command = this.config.data.command;
    this.updateFormControl(command(this.item));
  }
  async confirm() {
    let itemToSend = {
      id: this.item.id,
      count: this.item.count,
      accountNumber: ' ',
      discountPrice: parseInt(this.item.discountPrice),
    };
    const result = this.actionService
      .update(itemToSend.id | 0, itemToSend, this.actionRoute)
      .pipe(
        map((res) => {
          return res;
        })
      );

    const finalRes = await lastValueFrom(result);
    return finalRes;
  }
  async closeModal() {
    this.ref.close(await this.confirm());
  }
}
