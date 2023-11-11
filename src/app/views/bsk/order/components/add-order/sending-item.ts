import { AddOrderModel } from '../../models/AddOrder.model';
import { OrderItemBasket } from '../../models/AddOrder.interface';
import { AbstractControl } from '@angular/forms';
type selectedUser = {
  id: number;
  name: string;
  inactive: boolean;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};
class orderItemBasketModel implements OrderItemBasket {
  title?: string;
  tableType: number;
  rowID: number;
  count: number;
  price: number;
}
interface ItemInterface {
  orderItems: Array<orderItemBasketModel>;
  control: { [key: string]: AbstractControl<any, any> };
}
class Item implements ItemInterface {
  orderItems = new Array<orderItemBasketModel>();
  control: { [key: string]: AbstractControl<any, any> };
}
export class SendingItem {
  data = new AddOrderModel();
  constructor(_itemToAdd: Item, user?: selectedUser) {
    this.data.orderItems = [{ count: 0, price: 0, rowID: 0, tableType: 0 }];
    this.puttingItemsBsk(_itemToAdd);
    if (user) this.settingUser(user);
  }
  puttingItemsBsk(_item: Item) {
    var totalPrice = 0;
    this.data.orderItems.pop();
    _item.orderItems.forEach((it) => {
      delete it.title;
      totalPrice += it.price;
      this.data.orderItems.push(it);
    });
    // (For Now) => We Change It Later
    this.data.totalPrice = totalPrice;
    this.data.discountPrice = 0;
    this.data.toPayPrice = totalPrice;
    this.putControlValues(_item);
  }
  putControlValues(_item: Item) {
    let keys = Object.keys(_item.control);
    let keysForAdd = Object.keys(this.data);

    keys.forEach((it) => {
      let isFilled = keysForAdd.findIndex((item) => item == it);
      if (isFilled !== -1) {
        if (_item.control[it].value !== null)
          this.data[keysForAdd[isFilled]] = _item.control[it].value;
      }
    });
  }
  settingUser(user: selectedUser) {
    this.data.acceptRules = true;
    this.data.firstName = user.firstName;
    this.data.lastName = user.lastName;
    this.data.email = user.email;
    this.data.phoneNumber = user.phoneNumber;
  }
}
