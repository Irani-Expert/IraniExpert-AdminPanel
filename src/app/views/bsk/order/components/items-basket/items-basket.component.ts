import { Component, HostListener, Input } from '@angular/core';
import {
  C_E_OrderDetailItem,
  SingleOrderModel,
  TableModel,
} from '../../models/orders-new.model';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ToastrService } from 'ngx-toastr';
import { EditComponent } from 'src/app/shared/components/edit/edit.component';
import { DeleteComponent } from 'src/app/shared/components/delete/delete.component';
import { AdditionComponent } from 'src/app/shared/components/addition/addition.component';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { Utils } from 'src/app/shared/utils';

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
const Action = ActionTypes;

@Component({
  selector: 'app-items-basket',
  templateUrl: './items-basket.component.html',
  styleUrls: ['./items-basket.component.scss'],
  providers: [DialogService],
})
export class ItemsBasketComponent {
  @Input('id') openedModalID = 0;
  @Input('data') singleOrder = new SingleOrderModel();
  isDeviceMedium: boolean = false;
  constructor(
    public dialogService: DialogService,
    private toastr: ToastrService,
    private auth: AuthenticateService
  ) {}
  ngOnInit() {
    this.makeTable(this.singleOrder.items);
    this.updateIsMobileValue();
  }
  updateIsMobileValue() {
    if (Utils.isLMonitor()) {
      this.isDeviceMedium = true;
    } else {
      this.isDeviceMedium = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateIsMobileValue();
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

  get selectedBskItem() {
    return this.itemToChange.value;
  }

  basketCardMaker() {
    this.basketFinalPrices = new Array<DetailHeader>();
    this.basketFinalPrices.push(
      {
        key: 'totalPrice',
        value: this.singleOrder.orderDetails.totalPrice,
      },
      {
        key: 'discountPrice',
        value: this.singleOrder.orderDetails.discountPrice,
      },
      {
        key: 'toPayPrice',
        value: this.singleOrder.orderDetails.toPayPrice,
      }
    );
  }
  async makeTable(tableItems: Array<OrderDetailItem>) {
    this.basketTable = {
      data: tableItems,
      headers: Object.keys(tableItems[0]),
    };
    this.basketCardMaker();
    return true;
  }
  setSelectingItem(item: OrderDetailItem) {
    this.itemToChange.next(item);
  }

  // Actions Modal
  ref: DynamicDialogRef | undefined;
  async openActionsDialog(label: string, action: string) {
    let details = this.singleOrder.orderDetails;
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
    } else {
      this.toastr.error(
        result.message || 'خطا در برقراری اتصال ! با واحد فناوری تماس بگیرید',
        '',
        {
          closeButton: true,
          positionClass: 'toast-top-left',
        }
      );
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
      this._actionRoute = 'OrderNew/CreateOrderAdminAccess';
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
}
