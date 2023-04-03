import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractModel } from './contract.model';
import * as moment from 'jalali-moment';
import { RoleService } from '../../sec/role-mangement/role.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { RoleModel } from '../../sec/role-mangement/role.model';
import { Page } from 'src/app/shared/models/Base/page';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from '../contract.service';
import { ProductModel } from '../../prd/products-list/product.model';
import { ArticleModel } from '../../cnt/article/article/article.model';
import { UserBaseInfoModel } from 'src/app/shared/models/userBaseInfoModel';
import { number } from 'echarts';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ConditionModel } from 'src/app/shared/models/ConditionModel';
import { conditionService } from '../condition-service.service';
import { Condition } from 'selenium-webdriver';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],
})
export class ContractListComponent implements OnInit {
  date = new Date();
  dropdownList = [];
  sellingTypeTitle = ['IB', 'Invesment', 'License'];
  dropdownSettings: IDropdownSettings;
  viewMode: 'list' | 'grid' = 'list';
  roles: RoleModel[] = new Array<RoleModel>();
  allContract: ContractModel[] = new Array<ContractModel>();
  contractList: FormGroup;
  page: Page = new Page();
  userInfo: UserBaseInfoModel[] = new Array<UserBaseInfoModel>();
  contractModel: ContractModel;
  condition: ConditionModel[] = new Array<ConditionModel>();
  constructor(
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    public _roleService: RoleService,
    private toastr: ToastrService,
    private _contractService: ContractService,
    private _conditionService: conditionService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }

  ngOnInit(): void {
    this.getCondition();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'انتخاب همه',
      unSelectAllText: 'رد انتخاب',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'شرطی یافت نشد',
      noFilteredDataAvailablePlaceholderText: 'شرط مورد نظر یافت نشد',
    };
    this.contractList = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      sellingType: [null, Validators.compose([Validators.required])],
      prcentReward: [null, Validators.compose([Validators.required])],
      fromDate: [this.date, Validators.compose([Validators.required])],
      toDate: [this.date, Validators.compose([Validators.required])],
      // roleID: [null, Validators.compose([Validators.required])],
      userID: [null, Validators.compose([Validators.required])],
      isActive: [true],
      condition: [null],
    });
    this.getContrtactList();
  }
  onItemSelect(item: any) {
    this.contractModel.conditions.push(item.item_id);
  }
  onDeSelect(item: any) {
    let remove = this.contractModel.conditions.findIndex(
      (x) => x == item.item_id
    );
    this.contractModel.conditions.splice(remove, 1);
  }
  onSelectAll(items: any) {
    this.contractModel.conditions = [];
    items.forEach((x) => {
      this.contractModel.conditions.push(x.item_id);
    });
  }
  onDeSelectAll(item: any) {
    this.contractModel.conditions = [];
  }
  getContrtactList() {
    this._contractService.get(0, 100, 'ID', null, 'Contract').subscribe(
      (res: Result<Paginate<ContractModel[]>>) => {
        this.allContract = res.data.items;

        let counter = 0;
        this.allContract.forEach((x) => {
          this.allContract[counter].fromDate = moment(
            this.allContract[counter].fromDate,
            'YYYY/MM/DD'
          )
            .locale('fa')
            .format('YYYY/MM/DD');
          this.allContract[counter].toDate = moment(
            this.allContract[counter].toDate,
            'YYYY/MM/DD'
          )
            .locale('fa')
            .format('YYYY/MM/DD');
          counter++;
        });

        // this.allContract.forEach(x=>
        //   {
        //     x.fromDate=
        //   }
        //   )
        this.page.totalElements = res.data.totalCount;
        this.page.totalPages = res.data.totalPages - 1;
        this.page.pageNumber = res.data.pageNumber;
      },
      (_error) => {
        this.toastr.error(
          'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
          null,
          {
            closeButton: true,
            positionClass: 'toast-top-left',
          }
        );
      }
    );
  }
  openModal(content: any, row: ContractModel) {
    this.getCondition();

    if (row === undefined) {
      row = new ContractModel();
      row.id = 0;
      row.prcentReward = 0;
    }
    this.contractModel = row;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
      .result.then(
        (result) => {
          this.getCondition();
        },
        (reason) => {
          console.log('Err!', reason);
        }
      );
    this.getRoleList();
  }
  contractWith() {
    this.contractModel.sellingType = Number(this.contractModel.sellingType);
    this.contractModel.isActive = true;
    this._contractService
      .create(this.contractModel, 'Contract')
      .subscribe((data) => {
        this.modalService.dismissAll('Create Success');
        if (data.success) {
          this.contractModel.id = data.data;
          this.allContract.unshift(this.contractModel);
          this.toastr.success(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
  }
  removeContract(Id: number) {
    this._contractService.delete(Id, 'Contract').subscribe(
      (res: Result<ContractModel>) => {
        if (res.success) {
          this.toastr.success('با موفقیت حذف شد', null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
          var finder = this.allContract.findIndex((row) => row.id == Id);
          this.allContract.splice(finder, 1);
        }
      },
      (_error) => {
        this.toastr.error('خطا در حذف :برای این قرار داد رسید ثبت شده ', null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
      }
    );
  }
  changeFromDate(event: any) {
    this.contractModel.fromDate = moment
      .from(event, 'fa', 'YYYY-MM-DD')
      .format('YYYY-MM-DD');
  }
  changeToDate(event: any) {
    this.contractModel.toDate = moment
      .from(event, 'fa', 'YYYY-MM-DD')
      .format('YYYY-MM-DD');
  }
  // this.contractModel.toDate = moment
  // .from(this.contractModel.toDate, 'fa', 'YYYY-MM-DD')
  // .format('YYYY-MM-DD');
  getRoleList() {
    this._roleService.get(0, 100, 'ID', null, 'aspnetrole').subscribe(
      (res: Result<Paginate<RoleModel[]>>) => {
        this.roles = res.data.items;
        this.page.totalElements = res.data.totalCount;
        this.page.totalPages = res.data.totalPages - 1;
        this.page.pageNumber = res.data.pageNumber;
      },
      (_error) => {
        this.toastr.error(
          'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
          null,
          {
            closeButton: true,
            positionClass: 'toast-top-left',
          }
        );
      }
    );
  }
  userRole(val: any) {
    this._contractService
      .getUserInfiById(
        this.contractModel.roleID,
        'AspNetUser/GetUserNamesByRoleID'
      )
      .subscribe(
        (res: Result<UserBaseInfoModel[]>) => {
          //  this.page.totalElements = res.data.length;
          this.userInfo = res.data;
        },
        (_error) => {
          this.toastr.error(
            'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
            null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
        }
      );
  }

  getCondition() {
    this._conditionService.get(0, 100, 'ID', null, 'Condition').subscribe(
      (res: Result<Paginate<ConditionModel[]>>) => {
        if (this.dropdownList.length == 0) {
          res.data.items.forEach((x) => {
            if (x.id !== 1 && x.id !== 4) {
              this.dropdownList.push({ item_id: x.id, item_text: x.title });
            }
            if (x.id === 1 || x.id === 4) {
              this.contractModel.conditions.push(x.id);
            }
          });
          console.log(this.contractModel.conditions);
        }
      },
      (_error) => {
        this.toastr.error(
          'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
          null,
          {
            closeButton: true,
            positionClass: 'toast-top-left',
          }
        );
      }
    );
  }
}
