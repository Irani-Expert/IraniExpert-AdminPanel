import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { UsersModel } from './users.model';
import { UsersService } from './users.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RoleModel } from '../role-mangement/role.model';
import { RoleService } from '../role-mangement/role.service';
import { UserRolesModel } from 'src/app/shared/models/userRoles';
import { UserProfileService } from '../../dashboard/user-profile/user-profile.service';
import { referralModel } from 'src/app/shared/models/referralModel';
import { Observable } from 'rxjs';
import * as moment from 'jalali-moment';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { DatePipe } from '@angular/common';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-mangement',
  templateUrl: './user-mangement.component.html',
  styleUrls: ['./user-mangement.component.scss'],
  animations: [
    trigger('rotate90deg', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-90deg)' })),
      transition('rotated => default', animate('300ms ease-in-out')),
      transition('default => rotated', animate('500ms ease-in-out')),
    ]),
    // trigger('pushDown', [
    //   state('default', style({ margin: '0' })),
    //   state('rotated', style({ margin: '2% 0 0 0' })),
    //   transition('rotated => default', animate('100ms ease-in-out')),
    //   transition('default => rotated', animate('300ms ease-in-out')),
    // ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-40%)', opacity: 0 }),
        animate(
          '500ms ease-in-out',
          style({ transform: 'translateY(0%)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in-out',
          style({ transform: 'translateY(-40%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class UserMangementComponent implements OnInit {
  filterModel: FilterModel = new FilterModel();
  changeParentStatus: boolean;
  userParentToSend: {
    userId: number;
    newReferralCode: string;
  };
  roles: RoleModel[] = new Array<RoleModel>();

  ToSignUpDate:string;
  fromSignUpDate:string;
  filterHolder: UsersModel=new UsersModel;
  addupdateKeeper:UsersModel=new UsersModel;
  userParent: referralModel = new referralModel();
  isChangingParent: boolean = false;
  convertDate: { year: number; month: number; day: number };
  viewMode: 'list' | 'grid' = 'list';
  rows: UsersModel[] = new Array<UsersModel>();
  allSelected: boolean;
  page: Page = new Page();
  addUpdate: UsersModel = new UsersModel();
  addForm: FormGroup;
  filterData: UsersModel = new UsersModel();
  dropdownList = [];
  selectedItems = [];
  updateRoleIdV:boolean=true;
  userType: string = 'همه';
  roleKeeper = [];
  isDivExpanded: boolean = false;
  removeIndexFromList: number;
  roleIdSaver: number;
  stateOfChevron: string = 'default';
  dropdownSettings: IDropdownSettings;
  roleModel: UserRolesModel[] = new Array<UserRolesModel>();
  constructor(
    public _usersService: UsersService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    public _roleService: RoleService,
    private _userProfileSevice: UserProfileService,
    public datepipe: DatePipe,
    private _auth: AuthenticateService,
    private _route: ActivatedRoute,
    private _router: Router,

  ) {
    this.page.pageNumber = 1;
    this.page.size = 8;
    this._route.params.subscribe((params) => {
      if(this.page.pageNumber!=params['pageNumber'] || this.rows.length==0){
        
        this.page.pageNumber = params['pageNumber']
        this.setPage(this.page.pageNumber)
      }

		});
  }

  ngOnInit(): void {
    this.getRoleListservice();
    this.userParentToSend = {
      userId: 0,
      newReferralCode: '',
    };
    // this.getRoleList(0, 100);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'انتخاب همه',
      unSelectAllText: 'رد انتخاب همه',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: 'جستجو',
    };
    this.addForm = this._formBuilder.group({
      userName: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      accountNumber: [null, Validators.compose([Validators.required])],
      permision: [null, Validators.compose([Validators.required])],
    });
  }
  setPage(pageInfo: number) {
    
    this.page.pageNumber = pageInfo;
    this.getUsersList(
      this.page.pageNumber,
      this.page.size,
      this.roleIdSaver,
      null
    );
    this._router.navigateByUrl(`sec/user-management/${this.page.pageNumber}`);

  }
 
  usersEdit(content: any, row: UsersModel,userID:number) {
    this.userParent.firstname = '';
    this.userParent.lastName = '';
    this.roleKeeper = row.roles;
    if (row === undefined) {
      row = new UsersModel();
      row.id = 0;
    } else {
      this.selectedItems = [{ item_id: 11, item_text: 'ss' }];
      row.roles.forEach((x) => {
        this.selectedItems.push({ item_id: x.value, item_text: x.title });
      });
      this.selectedItems.splice(0, 1);

      this.roleKeeper = this.selectedItems;
    }
    this.addUpdate = row;
    this._userProfileSevice.getParentLevelOne(row.id).subscribe((res) => {
      if (res.success) {
        this.userParent = res.data;
      }
      if (!res.success) {
        this.userParent.firstname = '';
        this.userParent.lastName = res.message;
        this.userParent.userID = res.data.userID;
      }
    });
    this.userParentToSend.userId = row.id;
    this.modalService
      .open(content, {
        size: 'md',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        (result: boolean) => {
          if (result != undefined) {
            
            this.updateUserInfo(userID);
          }
        },
        (reason) => {
          this.isChangingParent = false;
          console.log('Err!', reason);
          this.addForm.reset;
        }
      );
  }
  async addOrUpdate(row: UsersModel) {
    // var indexFinder = this.rows.findIndex((item) => item.id === row.id);

    if (row.id === 0) {
      // this._usersService.create(row, 'aspnetuser').subscribe((data) => {
      //   if (data.success) {
      //     this.toastr.success(data.message, null, {
      //       closeButton: true,
      //       positionClass: 'toast-top-left',
      //     });
      //   } else {
      //     this.toastr.error(data.message, null, {
      //       closeButton: true,
      //       positionClass: 'toast-top-left',
      //     });
      //   }
      // });
    } else {
      //     var counter = 0;
      //     this.updateRoleId();
      //     this._usersService.update(row.id, row, 'aspnetuser').subscribe((data) => {
      //       if (data.success) {
      //         this.toastr.success(data.message, null, {
      //           closeButton: true,
      //           positionClass: 'toast-top-left',
      //         });
      //         this.setPage(this.page.pageNumber-1);      } else {
      //         this.toastr.error(data.message, null, {
      //           closeButton: true,
      //           positionClass: 'toast-top-left',
      //         });
      //       }
      //     });
    }
    this.isChangingParent = false;
  }

  // getRoleList(pageNumber: number, seedNumber: number) {
  //   this._roleService
  //     .get(
  //       pageNumber !== 0 ? pageNumber - 1 : pageNumber,
  //       seedNumber,
  //       'ID',
  //       null,
  //       'aspnetrole'
  //     )
  //     .subscribe(
  //       (res: Result<Paginate<RoleModel[]>>) => {
     

  //         this.page.totalElements = res.data.totalCount;
  //         this.page.totalPages = res.data.totalPages - 1;
  //       },
  //       (_error) => {
  //         this.toastr.error(
  //           'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
  //           null,
  //           {
  //             closeButton: true,
  //             positionClass: 'toast-top-left',
  //           }
  //         );
  //       }
  //     );
  // }
  onItemSelect(item: RoleModel) {
    this.roleKeeper.push(item);
  }
  onDeSelect(item: any) {
    this.removeIndexFromList = this.roleKeeper.findIndex(
      (x) => x.item_id == item.item_id
    );
    this.roleKeeper.splice(this.removeIndexFromList, 1);
  }
  onSelectAll(items: any) {
    this.roleKeeper = [];
    items.forEach((x) => {
      this.roleKeeper.push(x.item_id);
    });
  }
  onDeSelectAll(_item: any) {
    this.roleKeeper = [];
  }
  updateRoleId() {
    let userId=this._auth.currentUserValue.userID
    this._usersService.updateUserRole(this.roleModel,userId).subscribe((data) => {
      if (data.success) {
        this.roleKeeper = [];
        this.setPage(this.page.pageNumber);

      } else {
      }
    });
  }

  // ----------------------------- Change Parent Modal

  changeParent(changeParentModal: NgbModal) {
    this.modalService
      .open(changeParentModal, {
        ariaLabelledBy: 'modal-basic-title',
        centered: false,
        size: 'xs',
      })
      .result.then(
        (accept) => {
          if (accept) {
            (<HTMLInputElement>document.getElementById('parent')).value = '';
            this.isChangingParent = true;
          }
        },
        (reject) => {
          console.log(reject.message);
        }
      );
  }
  changeUserParent(userId: number, newParentRefCode: string) {
    this._usersService
      .changeParentPresentor(userId, newParentRefCode)
      .subscribe((res) => {
        if (res.success) {
          this.toastr.success(res.message, '', {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
          this._userProfileSevice.getParentLevelOne(userId).subscribe((res) => {
            if (res.success) {
              this.userParent = res.data;
              (<HTMLInputElement>document.getElementById('parent')).value =
                this.userParent.firstname + ' ' + this.userParent.lastName;
            }

            if (!res.success) {
              this.userParent.firstname = '';
              this.userParent.lastName = res.message;
              this.userParent.userID = res.data.userID;
            }
          });

          this.changeParentStatus = true;
          this.isChangingParent = false;
        }
        if (!res.success) {
          this.toastr.error(res.message, '', {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
          this.changeParentStatus = false;
          this.isChangingParent = true;
        }
      });
  }
  changeUserParentValue(e: string) {
    this.userParentToSend.newReferralCode = e;
  }
  getUsersList(
    pageNumber: number,
    pageSize: number,
    roleIdSaver: number,
    userType: string
  ) {
    if(roleIdSaver!=null){
      this.roleIdSaver=roleIdSaver
    }
    pageNumber = pageNumber - 1;
    if (userType != null) {
      this.userType = userType;
    }
    this.roleKeeper = [];
    this._usersService.getUserByFilter(pageNumber,pageSize,this.filterHolder,null,roleIdSaver).subscribe((data) => {
    this.rows=[]
      this.rows=data['data'].items
    this.rows.forEach(date=>{
      date.persianSignUpDate= moment(date.signUpDate, 'YYYY/MM/DD')
      .locale('fa')
      .format('YYYY/MM/DD');
    })
    this.page.pageNumber=data['data'].pageNumber+1
    this.page.totalElements=data['data'].totalCount
    
    });
  }
  updateUserInfo(userID: number) {
   
    var finder = this.rows.findIndex((x) => x.id == userID);
    this.roleModel = [];
    var counter = 0;
    this.roleKeeper.forEach((x) => {
      this.roleModel[counter] = new UserRolesModel();
      this.roleModel[counter].userId = userID;
      this.roleModel[counter].roleId = x.item_id;
      counter += 1;
    });
    if(this.updateRoleIdV){
      this.updateRoleId()

    }
    this.updateRoleIdV=true
    this._userProfileSevice
      .updateUserbyAspnet(userID, this.addUpdate)
      .subscribe((data) => {
        if (data) {

          if(!this.filterHolder){
            
            this.page.pageNumber = 1;
            this.setPage(this.page.pageNumber);
          }
        this.startFilter()

       

          this.toastr.success(data.message, null, {
                      closeButton: true,
                      positionClass: 'toast-top-left',
                    });
                    // this.updateRoleId()
         }
         else{
          this.toastr.warning(data.message, null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
  }

  updateQuestion(modalInfo: any, userId: number) {
    this.modalService
      .open(modalInfo, {
        ariaLabelledBy: 'modal-basic-title',
        centered: false,
        size: 'xs',
      })
      .result.then(
        (accept) => {
          var finder = this.rows.findIndex((x) => x.id == userId);
          this.addUpdate = this.rows[finder];
          this.addUpdate.isActive = !this.addUpdate.isActive;
          this.updateRoleIdV=false
          this.updateUserInfo(userId);
        },
        (reject) => {
          console.log(reject.message);
        }
      );
  }
  toggleFilters() {
    this.isDivExpanded = !this.isDivExpanded;
    this.stateOfChevron =
      this.stateOfChevron === 'default' ? 'rotated' : 'default';
  }
  convertDatetoMiladi(){
    if (this.ToSignUpDate != null) {
      this.filterData.ToSignUpDate =
        this.ToSignUpDate['year'] +
        '-' +
        this.ToSignUpDate['month'] +
        '-' +
        this.ToSignUpDate['day'];
    }
    if (this.fromSignUpDate != null) {
      this.filterData.fromSignUpDate =
        this.fromSignUpDate['year'] +
        '-' +
        this.fromSignUpDate['month'] +
        '-' +
        this.fromSignUpDate['day'];
    }
  }
  startFilter() {
    this.page.pageNumber = 1;
 
    this.setPage(this.page.pageNumber);
  }
  filteredItems(filter: UsersModel) {
    this.filterHolder = { ...filter };
  }
  filterButton(){
    this.convertDatetoMiladi()
    this.filteredItems(this.filterData);
    this.startFilter()
  }
  removeFilter(item:string){
    delete this.filterHolder[item]
    delete this.filterData[item]
    this.startFilter()

  }
  async getRoleListservice() {
    this._roleService.get(0, 100, 'ID', null, 'aspnetrole').subscribe(
      (res: Result<Paginate<RoleModel[]>>) => {
        this.roles = res.data.items;
        res.data.items.forEach((x) => {
          this.dropdownList.push({ item_id: x.id, item_text: x.name });
        });
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
