import { Component } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableHeaderPipe } from 'src/app/views/bsk/order/components/table-header.pipe';
import { lastValueFrom, map } from 'rxjs';
import { ActionsService } from '../../services/actions.service';
type FormControl = {
  model: any;
  isEnable: boolean;
  label: string;
  engLabel: string;
  type:
    | 'string'
    | 'number'
    | 'bigint'
    | 'boolean'
    | 'symbol'
    | 'undefined'
    | 'object'
    | 'function';
};

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [DialogService, TableHeaderPipe],
})
export class EditComponent {
  private readonly actionRoute: string;
  private _sendingItem: any;
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
    this._sendingItem = this.config.data.sendingItem;
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
          type: typeof this.item[arrayOfControls[counter]],
        });
      } else {
        this.formGroup.push({
          engLabel: arrayOfControls[counter],
          model: this.item[arrayOfControls[counter]],
          isEnable: true,
          label: this.tranlate.changeNameAlone(arrayOfControls[counter]),
          type: typeof this.item[arrayOfControls[counter]],
        });
      }
    }
  }
  updateFormControl(item) {
    Object.keys(item).forEach((label) => {
      this.formGroup.find((it) => {
        if (it.engLabel == label) {
          if (it.type == 'number') {
            it.model = item[label];
          }
          it.model = item[label];
          return;
        }
      });
    });
    this.item = { ...item };
  }
  onChangeInput(value, label) {
    if (typeof this.item[label] == 'number') this.item[label] = parseInt(value);
    else this.item[label] = value;

    const command = this.config.data.command;
    this.updateFormControl(command(this.item));
  }
  async confirm() {
    let itemToSend = { ...this._sendingItem, ...this.item };
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
