import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Subject, Subscription, debounceTime, lastValueFrom, map } from 'rxjs';
import { UsersModel } from 'src/app/views/sec/user-mangement/users.model';
import { ProductModel } from 'src/app/views/prd/products-list/product.model';
import { OrderItemBasket } from '../../models/AddOrder.interface';
import { PlanModel } from 'src/app/views/bas/plan/plan.model';
import { PlanService } from 'src/app/views/bas/plan/plan.service';
import { PlanOptionModel } from 'src/app/views/bas/plan-option/plan-option.model';
import { ToastrService } from 'ngx-toastr';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { UserInfoModel } from 'src/app/shared/models/userInfoModel';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { AdditionComponent } from 'src/app/shared/components/addition/addition.component';
import { SendingItem } from './sending-item';
import { Result } from 'src/app/shared/models/Base/result.model';
type DropDown = {
  id: number;
  name: string;
  inactive: boolean;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};
enum ADDTYPE {
  NEW_USER,
  CURRENT_USER,
}
enum SEARCHTYPE {
  ID,
  USERNAME,
}

const dropDown: DropDown[] = [
  {
    id: undefined,
    name: 'موردی یافت نشد',
    inactive: true,
    email: '',
  },
];
@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('addingToKart', [
      state('default', style({ transform: 'translate(0, 0)' })),
      state('added', style({ transform: 'translate(2px, 2px)' })),
      transition('rotated => default', animate('200ms ease-out')),
      transition('default => rotated', animate('200ms ease-in')),
    ]),
  ],
})
export class AddOrderComponent {
  state: 'default' | 'added' = 'default';
  showCartList: boolean = false;
  selectingPlanOptionslength = 0;
  basket = new Array<OrderItemBasket>();
  products = new Array<ProductModel>();
  plans = new Array<PlanModel>();
  selectedPlanOptions: PlanOptionModel[] = null;
  planOptions = new Array<PlanOptionModel>();
  formControls = [
    {
      id: 1,
      name: 'accountNumber',
      label: 'شماره حساب',
      show: true,
    },
    {
      id: 2,
      name: 'transactionCode',
      label: 'کد پرداخت',
      show: true,
    },
    {
      id: 3,
      name: 'firstName',
      label: 'نام',
      show: false,
    },
    {
      id: 5,
      name: 'lastName',
      label: 'نام خانوادگی',
      show: false,
    },
    {
      id: 6,
      name: 'email',
      label: 'ایمیل و نام کاربری',
      show: false,
    },
    {
      id: 7,
      name: 'phoneNumber',
      label: 'شماره تلفن',
      show: false,
    },
  ];
  private _searchInputSubscription: Subscription;
  private _searchinput: Subject<string> = new Subject<string>();
  selectedUser: any = null;
  dropDownItems = dropDown;
  searchTypes = [
    {
      name: 'شناسه',
      key: SEARCHTYPE.ID,
      title: 'id',
    },
    {
      title: 'name',
      name: 'نام کاربر',
      key: SEARCHTYPE.USERNAME,
    },
  ];
  searchType = SEARCHTYPE.ID;
  selectedSearchType: any = null;
  view: number = ADDTYPE.CURRENT_USER;
  value: any;
  addTypeOptions: any[] = [
    { icon: 'pi pi-user', toolTip: 'ایجاد کاربر و ثبت سفارش' },
    { icon: 'pi pi-plus', toolTip: ' ثبت سفارش برای کاربر موجود' },
  ];
  addOrder: FormGroup;
  @Output('output') emitter = new EventEmitter<boolean>(false);
  constructor(
    public dialogService: DialogService,
    private toastr: ToastrService,
    public orderService: OrderService,
    private auth: AuthenticateService,
    private planService: PlanService
  ) {
    this._searchInputSubscription = this._searchinput
      .pipe(debounceTime(600))
      .subscribe(async (res) => {
        let apiRes = await this.searchUser(res);
        if (apiRes) {
          if (apiRes.success) {
            this.fillDropDown(apiRes.data.items);
          }
        }
      });
    this.selectedSearchType = this.searchTypes[0];
    this.value = this.addTypeOptions[1];
    this.addOrder = new FormGroup({
      accountNumber: new FormControl<string | null>(null, Validators.required),
      startDate: new FormControl<Date | string>(null, Validators.required),
      transactionCode: new FormControl<string | null>(
        null,
        Validators.required
      ),
      token: new FormControl<string>(this.auth.currentUserValue.token),
      discountCode: new FormControl<string | null>(null),
      clientID: new FormControl<number | null>(null, Validators.required),
      userID: new FormControl<number>(this.auth.currentUserValue.userID),
    });
  }

  ngOnInit(): void {
    if (this.orderService.productValue.length > 0) {
      this.products = this.orderService.productValue;
    } else {
      this.orderService
        .getProducts()
        .then((fullfilled) => (this.products = this.orderService.productValue));
    }
  }
  emit() {
    this.emitter.emit(true);
  }
  dismiss() {
    this.emitter.emit(false);
  }
  async changeAddType() {
    if (this.view == ADDTYPE.CURRENT_USER) {
      this.addOrder.removeControl('clientID');
      this.addOrder.setControl(
        'firstName',
        new FormControl<string | null>(null, Validators.required)
      );
      this.addOrder.setControl(
        'email',
        new FormControl<string | null>(null, Validators.required)
      );
      this.addOrder.setControl(
        'lastName',
        new FormControl<string | null>(null, Validators.required)
      );
      this.addOrder.setControl(
        'phoneNumber',
        new FormControl<string | null>(null, Validators.required)
      );
      this.formControls.forEach((it) => (it.show = true));
      this.view = ADDTYPE.NEW_USER;
    } else {
      this.view = ADDTYPE.CURRENT_USER;
      this.selectedUser = null;

      this.addOrder.removeControl('firstName');
      this.addOrder.removeControl('email');
      this.addOrder.removeControl('lastName');
      this.addOrder.removeControl('phoneNumber');
      this.addOrder.setControl(
        'clientID',
        new FormControl<string | null>(null, Validators.required)
      );
      this.formControls.forEach((it) => {
        switch (it.name) {
          case 'firstName':
            it.show = false;
            break;
          case 'email':
            it.show = false;
            break;
          case 'lastName':
            it.show = false;
            break;
          case 'phoneNumber':
            it.show = false;
            break;
        }
      });
    }
  }
  private get controls() {
    return this.addOrder.controls;
  }
  changeSearchType(value: any) {
    this.dropDownItems = [];
    this.searchType = value.key;
    if (this.searchType == SEARCHTYPE.ID) {
    }
  }
  filterUser(event: any) {
    this._searchinput.next(event.filter);
  }
  async searchUser(searchString: any) {
    if (this.searchType == SEARCHTYPE.ID) {
      searchString = parseInt(searchString);
      if (Number.isNaN(searchString)) {
        searchString = '';
        return;
      } else {
        const result = this.orderService.getUserbyUserId(searchString).pipe(
          map((res) => {
            return res;
          })
        );
        return await lastValueFrom(result);
      }
    }
    if (this.searchType == SEARCHTYPE.USERNAME) {
      const result = this.orderService.getUserbyFirstName(searchString).pipe(
        map((res) => {
          return res;
        })
      );
      return await lastValueFrom(result);
    }
  }
  fillDropDown(items: UsersModel[]) {
    this.dropDownItems = [];
    items.forEach((it) => {
      this.dropDownItems.unshift({
        id: it.id,
        inactive: !it.isActive,
        name: it.firstName + ' ' + it.lastName,
        email: it.userName,
        firstName: it.firstName,
        lastName: it.lastName,
        phoneNumber: it.phoneNumber,
      });
    });
  }
  async changeUser(value) {
    this.controls['clientID'].setValue(value.id);
  }
  async changeProduct(product: ProductModel) {
    let bskHasPrd = this.basket.findIndex((it) => it.tableType == 6);
    let isSameItem = this.basket.findIndex(
      (it) => it.rowID == product.id && it.tableType == 6
    );
    if (isSameItem !== -1) {
      this.toastr.show('محصول در سبد خرید موجود میباشد', null, {
        positionClass: 'toast-top-left',
        progressBar: true,
        toastClass: 'bg-dark',
        messageClass: 'text-white text-small',
        timeOut: 2000,
      });
      return;
    }
    if (bskHasPrd !== -1) {
      this.basket.splice(bskHasPrd, 1);
    }

    let item: OrderItemBasket = {
      title: product.title,
      count: 1,
      price: 0,
      rowID: product.id,
      tableType: 6,
    };
    this.basket.push(item);
    this.orderService.itemsInBsk.next(this.basket);
    this.addedToCart();
    const apiResultPlans = this.planService.getPlanByProductId(product.id).pipe(
      map((res) => {
        let data = res.data.filter((it) => it.isActive);
        return data;
      })
    );
    this.plans = await lastValueFrom(apiResultPlans);
  }
  async changePlan(plan: PlanModel) {
    let isProductSelected = this.basket.findIndex(
      (it) => it.tableType == 6 && it.rowID !== plan.productId
    );
    if (isProductSelected == -1) {
      this.toastr.show('لطفا اول محصول مربوط به پلن را انتخاب کنید', null, {
        positionClass: 'toast-top-left',
        progressBar: true,
        toastClass: 'bg-dark',
        messageClass: 'text-white',
        timeOut: 2000,
      });
      return;
    }
    let index = this.basket.findIndex((it) => it.tableType == 17);
    if (index !== -1) {
      this.basket.splice(index, 1);
    }
    let item: OrderItemBasket = {
      title: plan.title,
      count: 1,
      price: plan.price,
      rowID: plan.id,
      tableType: 17,
    };

    this.selectedPlanOptions = null;
    this.basket = this.basket.filter(
      (it) => it.tableType == 6 || it.tableType == 17
    );
    this.basket.push(item);
    this.orderService.itemsInBsk.next(this.basket);
    this.addedToCart();
    this.planOptions = plan.planOptions.filter((it) => it.isActive);
  }
  async changePlanOptions(planOptions: PlanOptionModel[]) {
    let isPlanSeleceted = this.basket.findIndex((it) => it.tableType == 17);
    if (isPlanSeleceted == -1) {
      this.toastr.show('لطفا اول پلن مربوط به امکان را انتخاب کنید', null, {
        positionClass: 'toast-top-left',
        progressBar: true,
        toastClass: 'bg-dark',
        messageClass: 'text-white',
        timeOut: 2000,
      });
      return;
    }
    if (planOptions.length > this.selectingPlanOptionslength) {
      this.selectingPlanOptionslength = planOptions.length;
      planOptions.forEach((it) => {
        let indexInBsk = this.basket.findIndex(
          (item) => item.rowID == it.id && item.tableType == 16
        );
        if (indexInBsk == -1) {
          this.basket.push({
            title: it.title,
            count: 1,
            price: it.price,
            rowID: it.id,
            tableType: 16,
          });
        }
      });
      this.orderService.itemsInBsk.next(this.basket);
      this.addedToCart();
    }
    if (planOptions.length < this.selectingPlanOptionslength) {
      for (let i = 0; i <= this.selectingPlanOptionslength; i++) {
        let index = this.basket.findIndex((it) => it.tableType == 16);
        if (index !== -1) this.basket.splice(index, 1);
      }
      planOptions.forEach((it) => {
        let indexInBsk = this.basket.findIndex(
          (item) => item.rowID == it.id && item.tableType == 16
        );
        if (indexInBsk == -1) {
          this.basket.push({
            title: it.title,
            count: 1,
            price: it.price,
            rowID: it.id,
            tableType: 16,
          });
        }
      });
      this.selectingPlanOptionslength = planOptions.length;
      this.orderService.itemsInBsk.next(this.basket);
      this.addedToCart();
    }
  }
  changeCount(count: number, item: OrderItemBasket) {
    if (count < 1) {
      count = 1;
    }
    if (count > item.count) {
      item.price = item.price + item.price / item.count;
      item.count = count;
    }
    if (count < item.count) {
      item.price = item.price - item.price / item.count;
      item.count = count;
    }
  }
  removeItem(item: OrderItemBasket) {
    let isPlansSelected = this.basket.findIndex((it) => it.tableType == 17);
    let isPlanOptionSelected = this.basket.findIndex(
      (it) => it.tableType == 16
    );
    if (item.tableType == 6 && isPlansSelected !== -1) {
      this.toastr.show('لطفا اول پلن انتخابی را حذف کنید', null, {
        positionClass: 'toast-top-left',
        progressBar: true,
        toastClass: 'bg-dark',
        messageClass: 'text-white',
        timeOut: 2000,
      });
      return;
    }
    if (item.tableType == 17 && isPlanOptionSelected !== -1) {
      this.toastr.show('لطفا اول امکانات پلن انتخابی را حذف کنید', null, {
        positionClass: 'toast-top-left',
        progressBar: true,
        toastClass: 'bg-dark',
        messageClass: 'text-white',
        timeOut: 2000,
      });
      return;
    }
    if (item.tableType == 16) {
      let indexOfPlanOption = this.selectedPlanOptions.findIndex(
        (it) => it.id == item.rowID
      );
      this.selectedPlanOptions.splice(indexOfPlanOption, 1);
      this.changePlanOptions(this.selectedPlanOptions);
      return;
    }
    let indexToRemove = this.basket.findIndex(
      (it) => it.rowID == item.rowID && it.tableType == item.tableType
    );
    this.basket.splice(indexToRemove, 1);
    this.orderService.itemsInBsk.next(this.basket);
    this.addedToCart();
  }
  ngOnDestroy() {
    this._searchInputSubscription.unsubscribe();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.showCartList = false;
  }
  addedToCart() {
    this.state = this.state === 'default' ? 'added' : 'default';
    setTimeout(() => {
      this.state = this.state === 'default' ? 'added' : 'default';
    }, 200);
  }

  // Add Section
  ref: DynamicDialogRef | undefined;
  async openModal() {
    var item: SendingItem;
    if (await this.setUserOnFormControls()) {
      let itemToAdd = {
        orderItems: this.orderService.basketItemsToAdd,
        control: this.controls,
      };
      if (this.view == ADDTYPE.CURRENT_USER) {
        item = new SendingItem(itemToAdd, this.selectedUser);
      }
      if (this.view == ADDTYPE.NEW_USER) {
        item = new SendingItem(itemToAdd);
      }
    }

    // Open Modal To Add
    this.ref = this.dialogService.open(AdditionComponent, {
      data: {
        sendingItem: item.data,
        routeOfAction: 'OrderNew/CreateOrderAdminAccess',
      },
      header: 'ایجاد',
      draggable: false,
    });
    this.ref.onClose.subscribe((res) => {
      this.modalConfirmed(res);
    });
  }
  modalConfirmed(res: Result<any>) {
    if (res) {
      res.success
        ? this.toastr.success(res.message, '', {
            closeButton: true,
            positionClass: 'toast-top-left',
          })
        : this.toastr.error(
            res.message || 'خطا در برقراری اتصال ! با واحد فناوری تماس بگیرید',
            '',
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
      this.emit();
    } else {
      this.dismiss();
      console.log('Denied Or Server Err');
    }
  }
  async setUserOnFormControls() {
    if (this.view == ADDTYPE.CURRENT_USER)
      this.controls['clientID'].setValue(this.selectedUser.id);
    return true;
  }
  async changeStrtDate(date: Date) {
    this.controls['startDate'].setValue(await this.startDate(date));
  }
  async startDate(date) {
    let _stringDate = '';
    date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    _stringDate =
      date.getFullYear() +
      '-' +
      (month < 10 ? '0' + month : month) +
      '-' +
      (day < 10 ? '0' + day : day);
    return _stringDate;
  }
}
