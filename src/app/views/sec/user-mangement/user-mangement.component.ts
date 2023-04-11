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
import { UserRoleModel } from '../user-role/user-role.model';
import { UserRolesModel } from 'src/app/shared/models/userRoles';
import { UserProfileService } from '../../dashboard/user-profile/user-profile.service';
import { referralModel } from 'src/app/shared/models/referralModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-mangement',
  templateUrl: './user-mangement.component.html',
  styleUrls: ['./user-mangement.component.scss'],
})
export class UserMangementComponent implements OnInit {
  changeParentStatus: boolean;
  userParentToSend: {
    userId: number;
    newReferralCode: string;
  };
  userParent: referralModel = new referralModel();
  isChangingParent: boolean = false;
  viewMode: 'list' | 'grid' = 'list';
  rows: UsersModel[] = new Array<UsersModel>();
  allSelected: boolean;
  page: Page = new Page();
  addUpdate: UsersModel;
  addForm: FormGroup;
  dropdownList = [];
  selectedItems = [];
  roleKeeper = [];
  removeIndexFromList: number;
  roleIdSaver: number;
  dropdownSettings: IDropdownSettings;
  roleModel: UserRolesModel[] = new Array<UserRolesModel>();
  constructor(
    public _usersService: UsersService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    public _roleService: RoleService,
    private _userReferralSevice: UserProfileService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 8;
  }

  ngOnInit(): void {
    this.userParentToSend = {
      userId: 0,
      newReferralCode: '',
    };
    this.getRoleList(0, 100);
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
    this.setPage(this.page.pageNumber);
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

    this.getUsersList(this.page.pageNumber, this.page.size, this.roleIdSaver);
  }
  getUsersList(pageNumber: number, seedNumber: number, roleId: number) {
    this.roleIdSaver = roleId;
    this._usersService
      .getUserByRoleID(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        roleId
      )
      .subscribe(
        (res: Result<Paginate<UsersModel[]>>) => {
          this.rows = res.data.items;
          this.page.totalElements = res.data.totalCount;
          this.page.totalPages = res.data.totalPages - 1;
          this.page.pageNumber = res.data.pageNumber + 1;
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
  usersEdit(content: any, row: UsersModel) {
    this.userParent.firstname = '';
    this.userParent.lastName = '';
    //this.roleKeeper=row.roles
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
    this._userReferralSevice.getParentLevelOne(row.id).subscribe((res) => {
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
            this.addOrUpdate(this.addUpdate);
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
    var indexFinder = this.rows.findIndex((item) => item.id === row.id);

    // if (row.id === 0) {
    //   this._usersService.create(row, 'aspnetuser').subscribe((data) => {
    //     if (data.success) {
    //       this.toastr.success(data.message, null, {
    //         closeButton: true,
    //         positionClass: 'toast-top-left',
    //       });
    //     } else {
    //       this.toastr.error(data.message, null, {
    //         closeButton: true,
    //         positionClass: 'toast-top-left',
    //       });
    //     }
    //   });
    // } else {
    var counter = 0;

    this.roleModel = [];
    this.roleKeeper.forEach((x) => {
      this.roleModel[counter] = new UserRolesModel();
      this.roleModel[counter].userId = row.id;
      this.roleModel[counter].roleId = x.item_id;
      counter += 1;
    });

    this.updateRoleId();

    this._usersService.update(row.id, row, 'aspnetuser').subscribe((data) => {
      if (data.success) {
        this.toastr.success(data.message, null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
        this.getUsersList(
          this.page.pageNumber,
          this.page.size,
          this.roleIdSaver
        );
      } else {
        this.toastr.error(data.message, null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
      }
    });
    this.isChangingParent = false;
  }
  deleteUser(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((_result) => {
        if (_result)
          this._usersService.delete(id, 'aspnetuser').subscribe((res) => {
            var indexFinder = this.rows.findIndex((rows) => rows.id === id);
            this.rows.splice(indexFinder, 1);
            if (res.success) {
              this.toastr.success(
                'فرایند حذف موفقیت آمیز بود',
                'موفقیت آمیز!',
                {
                  timeOut: 3000,
                  positionClass: 'toast-top-left',
                }
              );
            } else {
              this.toastr.error('خطا در حذف', res.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            }
          });
        this.getUsersList(
          this.page.pageNumber,
          this.page.size,
          this.roleIdSaver
        );
      });
  }
  getRoleList(pageNumber: number, seedNumber: number) {
    this._roleService
      .get(
        pageNumber !== 0 ? pageNumber - 1 : pageNumber,
        seedNumber,
        'ID',
        null,
        'aspnetrole'
      )
      .subscribe(
        (res: Result<Paginate<RoleModel[]>>) => {
          res.data.items.forEach((x) => {
            this.dropdownList.push({ item_id: x.id, item_text: x.name });
          });

          this.page.totalElements = res.data.totalCount;
          this.page.totalPages = res.data.totalPages - 1;
          this.page.pageNumber = res.data.pageNumber + 1;
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
    this._usersService.updateUserRole(this.roleModel).subscribe((data) => {
      if (data.success) {
        this.roleKeeper = [];
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
          this._userReferralSevice
            .getParentLevelOne(userId)
            .subscribe((res) => {
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
}
