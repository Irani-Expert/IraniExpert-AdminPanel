import { Component, OnInit } from '@angular/core';
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from 'primeng/dynamicdialog';
import { ActionsService } from '../../services/actions.service';
import { lastValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  providers: [DialogService],
})
export class DeleteComponent implements OnInit {
  itemIdToDelete = 0;
  actionRoute = '';
  constructor(
    private actionService: ActionsService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.itemIdToDelete = this.config.data.item.id;
    this.actionRoute = this.config.data.routeOfAction;
  }
  async confirm() {
    const result = this.actionService
      .delete(this.itemIdToDelete, this.config.data.routeOfAction)
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
