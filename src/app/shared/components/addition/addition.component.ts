import { Component, OnInit } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ActionsService } from '../../services/actions.service';
import { lastValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-addition',
  templateUrl: './addition.component.html',
  styleUrls: ['./addition.component.scss'],
  providers: [DialogService],
})
export class AdditionComponent implements OnInit {
  itemToAdd;
  actionRoute = '';
  constructor(
    private actionService: ActionsService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.itemToAdd = this.config.data.sendingItem;
    this.actionRoute = this.config.data.routeOfAction;
  }
  async confirm() {
    const result = this.actionService
      .create(this.itemToAdd, this.config.data.routeOfAction)
      .pipe(
        map((res) => {
          return res;
        })
      );
    const finalRes = await lastValueFrom(result);
    return finalRes;
  }
  deny() {
    return;
  }
  async closeModal(res: boolean) {
    if (res) this.ref.close(await this.confirm());
    else this.ref.close(this.deny());
  }
}
