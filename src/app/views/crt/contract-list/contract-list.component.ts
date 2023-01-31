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

  constructor(  private modalService: NgbModal  ,
    private _formBuilder: FormBuilder ,
    public _roleService: RoleService,
    private toastr: ToastrService,
    private _contractService:ContractService,
    
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
    debugger
    this._contractService.get(0, 100, 'ID', null, 'Contract').subscribe(
      (res: Result<Paginate<ContractModel[]>>) => {
        
        this.allContract = res.data.items;
        

       
       

         let counter=0 
         this.allContract.forEach(x=>
           {
       
             this.allContract[counter].fromDate=moment(this.allContract[counter].fromDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
             this.allContract[counter].toDate=moment(this.allContract[counter].toDate, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');
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
    debugger
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
    debugger
    this.contractModel.sellingType=Number(this.contractModel.sellingType)
    this.contractModel.userID=Number(this.contractModel.userID)
    this.contractModel.roleID=Number(this.contractModel.roleID)
    this.contractModel.toDate= moment.from(this.contractModel.toDate, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
    this.contractModel.fromDate= moment.from(this.contractModel.fromDate, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');  
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
  removeContract(Id:number){
  this._contractService.delete(Id,'Contract').subscribe(
    (res: Result<ContractModel>) => {
      
    let x=res.data
    this.getContrtactList()
    },
    (_error) => {
 
      
      this.toastr.error(
        'خطا در حذف :برای این قرار داد رسید ثبت شده ',
        null,
        {
          closeButton: true,
          positionClass: 'toast-top-left',
        }
      );
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
