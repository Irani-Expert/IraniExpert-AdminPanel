import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BrokersService } from '../brokers.service';
import { BrokerItem } from '../models/broker-item.model';
import { lastValueFrom, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
class FilterBrokerItem {
  accending: boolean = true;
  title: string;
  brokerItemType: number;
}

@Component({
  selector: 'app-broker-items-rel',
  templateUrl: './broker-items-rel.component.html',
  styleUrls: ['./broker-items-rel.component.scss'],
})
export class BrokerItemsRelComponent implements OnInit {
  filter = new FilterBrokerItem();
  showDiv = false;
  @Input('brokerId') brokerId: number = 0;
  @Input('selectedTargets') targetItems: BrokerItem[];

  sourceItems = new Array<BrokerItem>();
  constructor(
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private _brokerService: BrokersService
  ) {}

  async ngOnInit() {
    if (this.targetItems == null) {
      this.targetItems = new Array<BrokerItem>();
    }
    this.cdr.markForCheck();

    let get = await this.get();
    if (get.res) {
      this.showDiv = true;
    } else {
      console.log('No Items');
    }
  }

  async get() {
    const res = this._brokerService.getBrokerItems(this.filter).pipe(
      map((result) => {
        if (result.success) {
          this.sourceItems = result.data.items;
        }
        return { res: result.success, message: result.message };
      })
    );

    const sourceItemsRes = await lastValueFrom(res);
    return sourceItemsRes;
  }
  async post() {
    let postItem: Array<{
      brokerID: number;
      itemID: number;
    }>;
    postItem = new Array<{
      brokerID: number;
      itemID: number;
    }>();

    this.targetItems.forEach((item) => {
      postItem.push({
        brokerID: this.brokerId,
        itemID: item.id,
      });
    });
    let route =
      postItem.length == 0
        ? 'DeleteBrokerItemRelation'
        : 'AddUpdateBrokerItemRel';
    let itemToSend = {
      relations: postItem,
    };
    this._brokerService
      .create(itemToSend, `BrokerItemRelation/${route}`)
      .subscribe((it) => this.showToast(it.success, it.message));
  }
  showToast(res: boolean, message: string) {
    res
      ? this.toastr.success(message, 'موفق !', {
          closeButton: true,
          positionClass: 'toast-top-left',
        })
      : this.toastr.error(message, 'خطا !', {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
  }
}
