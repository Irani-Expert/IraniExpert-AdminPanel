import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  C_E_OrderDetailItem,
  SingleOrderModel,
  TableModel,
} from '../../models/orders-new.model';

import { BehaviorSubject, Observable, lastValueFrom, map } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ToastrService } from 'ngx-toastr';
import { EditComponent } from 'src/app/shared/components/edit/edit.component';
import { DeleteComponent } from 'src/app/shared/components/delete/delete.component';
import { AdditionComponent } from 'src/app/shared/components/addition/addition.component';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { Utils } from 'src/app/shared/utils';
import { OrderService } from '../../services/order.service';
import { PlanService } from 'src/app/views/bas/plan/plan.service';

type DetailHeader = { value: string | number; key: string };
type OrderDetailItem = {
  id: number;
  tableType: number;
  rowID: number;
  count: number;
  unitPrice: number;
  totalPrice: number;
  discountPrice: number;
  toPayPrice: number;
};
const itemToChangeInit: OrderDetailItem = {
  id: 0,
  tableType: 0,
  rowID: 0,
  count: 0,
  unitPrice: 0,
  totalPrice: 0,
  discountPrice: 0,
  toPayPrice: 0,
};
enum ActionTypes {
  EDIT = 'PUT',
  DELETE = 'DELETE',
  ADD = 'ADD',
}
enum Sessions {
  WatchAndEdit = 'Watch and Edit',
  ADD = 'Addition',
}
class PlanOption {
  title = '';
  id = 0;
  price = 0;
}
const Action = ActionTypes;
@Component({
  selector: 'app-items-basket',
  templateUrl: './items-basket.component.html',
  styleUrls: ['./items-basket.component.scss'],
  providers: [DialogService],
})
export class ItemsBasketComponent implements OnDestroy {
  selectedPlanOption = new PlanOption();
  isPlanOptionsExist = false;
  productID = 0;
  planId = 0;
  planOptions = new Array<PlanOption>();
  selectedAddType: any = null;
  addTypes = [
    {
      tableType: 6,
      name: 'پلن',
      key: 'plan',
      disabled: true,
    },
    {
      tableType: 17,
      name: 'پلن آپشن',
      key: 'planOption',
      disabled: false,
    },
  ];
  session = Sessions.WatchAndEdit;
  @Output() result = new EventEmitter<boolean>(false);
  isTableCreated: boolean = false;
  @Input('id') openedModalID = 0;
  data: SingleOrderModel = new SingleOrderModel();
  isDeviceMedium: boolean = false;
  constructor(
    private planService: PlanService,
    private orderService: OrderService,
    public dialogService: DialogService,
    private toastr: ToastrService,
    private auth: AuthenticateService
  ) {
    this.selectedAddType = this.addTypes[1];
  }

  updateIsMobileValue() {
    if (Utils.isLMonitor()) {
      this.isDeviceMedium = true;
    } else {
      this.isDeviceMedium = false;
    }
  }

  private _actionRoute: string = '';
  basketFinalPrices: DetailHeader[];

  menuItems: MenuItem[] = [
    {
      label: 'ویرایش',
      icon: 'pi pi-pencil',
      iconClass: 'text-danger',
      command: (event) => {
        this.openActionsDialog(event.item.label, Action.EDIT);
      },
    },
    {
      label: 'حذف',
      icon: 'pi pi-trash',
      iconClass: 'text-danger',
      command: () => {
        this.openActionsDialog(this.menuItems[1].label, Action.DELETE);
      },
    },
  ];

  itemToChange = new BehaviorSubject<OrderDetailItem>(itemToChangeInit);

  basketTable = new TableModel<Array<OrderDetailItem>>();

  async ngOnInit() {
    // this.makeTable(this.data.items);
    this.updateIsMobileValue();
  }
  get selectedBskItem() {
    return this.itemToChange.value;
  }

  basketCardMaker() {
    this.basketFinalPrices = new Array<DetailHeader>();
    this.basketFinalPrices.push(
      {
        key: 'totalPrice',
        value: this.orderService.singleOrderValue.orderDetails.totalPrice,
      },
      {
        key: 'discountPrice',
        value: this.orderService.singleOrderValue.orderDetails.discountPrice,
      },
      {
        key: 'toPayPrice',
        value: this.orderService.singleOrderValue.orderDetails.toPayPrice,
      }
    );
    this.isTableCreated = true;
  }
  async makeTable(tableItems: Array<OrderDetailItem>) {
    let findProductIndex = tableItems.findIndex((it) => it.tableType == 6);
    let findPlanIndex = tableItems.findIndex((it) => it.tableType == 17);
    if (findPlanIndex >= 0) {
      this.planId = tableItems[findPlanIndex].rowID;
    }
    if (findProductIndex >= 0) {
      this.productID = tableItems[findProductIndex].rowID;
    }
    this.basketTable = {
      data: tableItems,
      headers: Object.keys(tableItems[0]),
    };
    this.basketCardMaker();
    if (this.planId > 0) {
      if (await this.getPlans()) {
        await this.getPlanOptions();
      }
    }

    return true;
  }
  setSelectingItem(item: OrderDetailItem) {
    this.itemToChange.next(item);
  }

  // Actions Modal
  ref: DynamicDialogRef | undefined;
  async openActionsDialog(label: string, action: string) {
    let details = this.orderService.singleOrderValue.orderDetails;
    let _itemToChange = new C_E_OrderDetailItem(
      this.selectedBskItem,
      this.getArgsToC_E(details)
    );
    this.ref = this.dialogService.open(this.getActionComponent(action), {
      data: {
        item: this.selectedBskItem,
        disabledItems:
          action == 'PUT'
            ? [
                'tableType',
                'rowID',
                'id',
                'totalPrice',
                'unitPrice',
                'toPayPrice',
              ]
            : undefined,
        sendingItem: _itemToChange.workingItem,
        routeOfAction: this._actionRoute,
        command: (item) => {
          return this.calculatePrice(item);
        },
      },
      header: label,
      draggable: false,
    });
    this.ref.onClose.subscribe((res) => {
      this.modalConfirmed(res);
    });
  }
  async modalConfirmed(result: Result<any>) {
    if (result) {
      result.success
        ? this.toastr.success(result.message, '', {
            closeButton: true,
            positionClass: 'toast-top-left',
          })
        : this.toastr.error(
            result.message ||
              'خطا در برقراری اتصال ! با واحد فناوری تماس بگیرید',
            '',
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
      this.result.emit(true);
    } else {
      console.log('Denied Or Server Err');
    }
  }
  getActionComponent(action: string) {
    if (action == 'PUT') {
      this._actionRoute = 'OrderItemNew';
      return EditComponent;
    }
    if (action == 'DELETE') {
      this._actionRoute = 'OrderItemNew';
      return DeleteComponent;
    }
    if (action == 'ADD') {
      this._actionRoute = 'OrderItemNew/InsertOrderItemAdminAccess';
      return AdditionComponent;
    }
  }
  calculatePrice(item: OrderDetailItem) {
    if (item.count !== this.selectedBskItem.count) {
      item = this.calculateCount(item);
    }
    if (item.discountPrice !== this.selectedBskItem.discountPrice) {
      item = this.calculateDiscount(item);
    }
    return item;
  }
  calculateCount(item: OrderDetailItem) {
    item.totalPrice = item.count * item.unitPrice;
    item.toPayPrice = item.totalPrice - item.discountPrice;
    return item;
  }
  calculateDiscount(item: OrderDetailItem) {
    if (item.discountPrice > item.totalPrice) {
      item.discountPrice = item.totalPrice;
      item.toPayPrice = 0;
    } else {
      item.toPayPrice = item.totalPrice - item.discountPrice;
    }
    return item;
  }
  getArgsToC_E(item) {
    let args = {
      accountnumber: item.accountNumber,
      authorID: this.auth.currentUserValue.userID,
      invoiceID: item.invoiceID,
      userID: item.userID,
      orderID: this.openedModalID,
    };
    return args;
  }

  ngOnDestroy() {
    this.isTableCreated = false;
    this.basketTable = new TableModel<Array<OrderDetailItem>>();
    this.basketFinalPrices = new Array<DetailHeader>();
    this.planOptions = new Array<PlanOption>();
    this.selectedPlanOption = null;
    this.session = Sessions.WatchAndEdit;
    this.itemToChange.next(itemToChangeInit);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateIsMobileValue();
  }
  // Addittion Section
  async getPlans() {
    const plansResult = this.planService
      .getPlanByProductId(this.productID)
      .pipe(
        map((res) => {
          if (res.success) {
            // if (res.data.length > 0) {
            //   this.isPlanOptionsExist = true;
            // }

            this.planService.plans$.next(res.data);
          }
          return res;
        })
      );
    return await lastValueFrom(plansResult);
  }
  async getPlanOptions() {
    if (await this.pushPlansToArray()) {
      this.selectedPlanOption = this.planOptions[0];
      setTimeout(() => {
        this.isPlanOptionsExist = true;
      }, 200);
      return true;
    } else {
      return false;
    }
  }
  async pushPlansToArray() {
    let value = false;
    if (this.planService.plansOfProductId) {
      let plans = this.planService.plansOfProductId;
      let plan = plans.find((it) => it.id == this.planId);
      if (plan) {
        if (plan.planOptions) {
          plan.planOptions.forEach((planOption) => {
            this.planOptions.push({
              id: planOption.id,
              price: planOption.price,
              title: planOption.title,
            });
          });
          return !value;
        }
      } else {
        return value;
      }
    } else {
      return !value;
    }
    return false;
  }
  changeSession() {
    if (this.session == Sessions.WatchAndEdit) {
      this.session = Sessions.ADD;
      let itemToChange = { ...itemToChangeInit };
      itemToChange.unitPrice = this.selectedPlanOption.price;
      itemToChange.count = 1;
      itemToChange.rowID = this.selectedPlanOption.id;
      itemToChange.totalPrice = itemToChange.count * itemToChange.unitPrice;
      itemToChange.toPayPrice = itemToChange.totalPrice;
      itemToChange.tableType = 16;
      this.itemToChange.next(itemToChange);
    } else {
      this.session = Sessions.WatchAndEdit;
      this.itemToChange.next(itemToChangeInit);
    }
  }
  discountPrice = 0;
  changeInput(label: string) {
    let sub = this.itemToChange.subscribe({
      next: (res) => {
        res[label] = this.discountPrice;
        res.toPayPrice = res.totalPrice - this.discountPrice;
      },
      complete: () => {
        sub.unsubscribe();
      },
    });
  }
  changeDropDown(event) {
    if (event.value) {
      this.discountPrice = 0;
      this.changeInput('discountPrice');
    }
  }
}
