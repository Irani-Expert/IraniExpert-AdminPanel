import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { UsersService } from 'src/app/views/sec/user-mangement/users.service';
import { Subject, Subscription, debounceTime, lastValueFrom, map } from 'rxjs';
import { UsersModel } from 'src/app/views/sec/user-mangement/users.model';
import { ProductModel } from 'src/app/views/prd/products-list/product.model';
import { OrderItemBasket } from '../../models/AddOrder.interface';
import { PlanModel } from 'src/app/views/bas/plan/plan.model';
import { PlanService } from 'src/app/views/bas/plan/plan.service';
import { PlanOptionModel } from 'src/app/views/bas/plan-option/plan-option.model';
import { title } from 'process';
type DropDown = {
  id: number;
  name: string;
  inactive: boolean;
  email: string;
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
})
export class AddOrderComponent {
  selectingPlanOptionslength = 0;
  basket = new Array<OrderItemBasket>();
  products = new Array<ProductModel>();
  plans = new Array<PlanModel>();
  selectedPlanOptions: any = null;
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
      label: 'کد رهگیری',
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
    public orderService: OrderService,
    private userService: UsersService,
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
      startDate: new FormControl<string | null>(null, Validators.required),
      transactionCode: new FormControl<string | null>(
        null,
        Validators.required
      ),
      discountCode: new FormControl<string | null>(null, Validators.required),
      clientID: new FormControl<number | null>(null, Validators.required),
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
      this.addOrder.removeControl('firstName');
      this.addOrder.removeControl('email');
      this.addOrder.removeControl('lastName');
      this.addOrder.removeControl('phoneNumber');
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
        email: it.email,
      });
    });
  }
  async changeProduct(product: ProductModel) {
    let item: OrderItemBasket = {
      title: product.title,
      count: 1,
      price: 0,
      rowID: product.id,
      tableType: 6,
    };
    this.basket.push(item);
    this.orderService.itemsInBsk.next(this.basket);
    const apiResultPlans = this.planService.getPlanByProductId(product.id).pipe(
      map((res) => {
        let data = res.data.filter((it) => it.isActive);
        return data;
      })
    );
    this.plans = await lastValueFrom(apiResultPlans);
  }
  async changePlan(plan: PlanModel) {
    let index = this.basket.findIndex((it) => it.tableType == 17);
    let item: OrderItemBasket = {
      title: plan.title,
      count: 1,
      price: plan.price,
      rowID: plan.id,
      tableType: 17,
    };
    this.basket.splice(index, 1);
    this.basket.push(item);
    this.orderService.itemsInBsk.next(this.basket);
    this.planOptions = plan.planOptions;
  }
  async changePlanOptions(planOptions: PlanOptionModel[]) {
    if (planOptions.length > this.selectingPlanOptionslength) {
      this.selectingPlanOptionslength = planOptions.length;
      planOptions.forEach((it) => {
        let isAlreadyInBsk = this.basket.findIndex(
          (item) => item.rowID == it.id && item.tableType == 16
        );
        if (isAlreadyInBsk !== -1) {
          this.basket.push({
            title: it.title,
            count: 1,
            price: it.price,
            rowID: it.id,
            tableType: 16,
          });
        }
      });
    }
    if (planOptions.length < this.selectingPlanOptionslength) {
      for (let i = 0; i <= this.selectingPlanOptionslength; i++) {
        let index = this.basket.findIndex((it) => it.tableType == 16);
        this.basket.splice(index, 1);
      }
      planOptions.forEach((it) => {
        let isAlreadyInBsk = this.basket.findIndex(
          (item) => item.rowID == it.id && item.tableType == 16
        );
        if (isAlreadyInBsk !== -1) {
          this.basket.push({
            title: it.title,
            count: 1,
            price: it.price,
            rowID: it.id,
            tableType: 16,
          });
        }
      });
    }
    // if(planOptions.length > 0)
    // planOptions.forEach((it) => {
    //   let isAlreadyInBsk = this.basket.findIndex(item=> item.rowID == it.id && item.tableType == 16)
    //   if(isAlreadyInBsk !== -1) {
    //     this.basket.push({
    //       title: it.title,
    //       count: 1,
    //       price: it.price,
    //       rowID: it.id,
    //       tableType: 16,
    //     });
    //   }
    // });
    // this.orderService.itemsInBsk.next(this.basket);
  }
  ngOnDestroy() {
    this._searchInputSubscription.unsubscribe();
  }
}
