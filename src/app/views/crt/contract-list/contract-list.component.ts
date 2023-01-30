import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractModel } from './contract.model';
import * as moment from 'moment';
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


@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],

})
export class ContractListComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'list';
  roles: RoleModel[] = new Array<RoleModel>();
  allContract:ContractModel[]=new Array<ContractModel>();
  contractList:FormGroup;
  page: Page = new Page();
userInfo:UserBaseInfoModel[]=new Array<UserBaseInfoModel>();
contractModel:ContractModel;
pipe = new DatePipe('en-US');
  constructor(  private modalService: NgbModal  ,
    private _formBuilder: FormBuilder ,
    public _roleService: RoleService,
    private toastr: ToastrService,
    private _contractService:ContractService
    ) {
      this.page.pageNumber = 0;
      this.page.size = 12;
    }

  ngOnInit(): void {

    this.contractList = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      sellingType: [null, Validators.compose([Validators.required])],
      prcentReward: [null, Validators.compose([Validators.required])],
      fromDate: [null, Validators.compose([Validators.required])],
      toDate: [null, Validators.compose([Validators.required])],
      roleID: [null, Validators.compose([Validators.required])],
      userID: [null, Validators.compose([Validators.required])],

    });
    this.getContrtactList()
  }
  getContrtactList(){
    this._contractService.get(0, 100, 'ID', null, 'Contract').subscribe(
      (res: Result<Paginate<ContractModel[]>>) => {
        debugger
        this.allContract = res.data.items;
        var shamsi = require('shamsi-date-converter');
        let counter=0
        this.allContract.forEach(x=>
          {
            let arr=shamsi.gregorianToJalali(x.fromDate);
            this.allContract[counter].fromDate=arr[0]+'/'+arr[1]+'/'+arr[2]
            arr=shamsi.gregorianToJalali(x.toDate);
            this.allContract[counter].toDate=arr[0]+'/'+arr[1]+'/'+arr[2]
            counter++;
          })

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
  openModal(content: any,row:ContractModel) {
    if (row === undefined) {
      row = new ContractModel();
      row.id = 0;
      row.prcentReward = 0;
    }
    this.contractModel = row;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' ,  size: 'lg', })
      .result.then(
        (result ) => {
         debugger
        },
        (reason) => {
          debugger
          console.log('Err!', reason);

        }
      );
    this.getRoleList();
  }
  contractWith(){
    this.contractModel.sellingType=Number(this.contractModel.sellingType)
    this.contractModel.userID=Number(this.contractModel.userID)
    this.contractModel.roleID=Number(this.contractModel.roleID)

    const JDate = require('jalali-date');
    //covert Date
    let toDate = this.contractModel.toDate.split("/")
    const jdateToDate = JDate.toGregorian(parseInt(toDate[0]),parseInt(toDate[1]), parseInt(toDate[2])) // => Gregorian Date object
    this.contractModel.toDate=moment(jdateToDate).format()
  //covert Date

    let fromDate = this.contractModel.fromDate.split("/")
    const jdate = JDate.toGregorian(parseInt(fromDate[0]),parseInt(fromDate[1]), parseInt(fromDate[2])) // => Gregorian Date object
    this.contractModel.fromDate=moment(jdate).format()

    this._contractService
    .create(this.contractModel, 'Contract')
    .toPromise()
    .then(
      (data) => {
        if (data.success) {
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
      },
      (error) => {
        debugger
        this.toastr.error('خطا مجدد تلاش فرمایید', null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
      }
    );



  }
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
userRole(val:any){

  this._contractService
        .getUserInfiById(this.contractModel.roleID, 'AspNetUser/GetUserNamesByRoleID')
        .subscribe(
          (res: Result<UserBaseInfoModel[]>) => {
            //  this.page.totalElements = res.data.length;
this.userInfo=res.data;
debugger
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
