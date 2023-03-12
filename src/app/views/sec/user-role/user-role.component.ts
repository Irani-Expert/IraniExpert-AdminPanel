import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { RoleModel } from '../role-mangement/role.model';
import { RoleService } from '../role-mangement/role.service';
import { UsersModel } from '../user-mangement/users.model';
import { UsersService } from '../user-mangement/users.service';
import { UserRoleModel } from './user-role.model';
import { UserRoleService } from './user-role.service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent implements OnInit {
  userIdTracker = 0;
  viewMode: 'list' | 'grid' = 'list';
  rows: UserRoleModel[] = new Array<UserRoleModel>();
  roles: RoleModel[] = new Array<RoleModel>();
  allSelected: boolean;
  page: Page = new Page();
  addUpdate: UserRoleModel = new UserRoleModel();

  addForm: FormGroup;
  signUpForm:FormGroup;
  signUpModel:UsersModel=new UsersModel();
  constructor(
    private _roleService: RoleService,
    public _userRoleService: UserRoleService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    public _usersService: UsersService,

  ) {}

  ngOnInit(): void {
    this.getRoleList();
    this.setPage(this.page.pageNumber);
    this.addForm = this._formBuilder.group({
      userId: [null, Validators.compose([Validators.required])],
      roleId: [null, Validators.compose([Validators.required])],
    });
    this.signUpForm = this._formBuilder.group({
      accountNumber: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      phoneNumber: [null, Validators.compose([Validators.required])],
    });
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getUserRoleList(this.page.pageNumber, this.page.size);
  }
  async getRoleList() {
    this._roleService.get(0, 1000, 'ID', null, 'aspnetrole').subscribe(
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
  async getUserRoleList(pageNumber: number, seedNumber: number) {
    this._userRoleService
      .get(pageNumber, seedNumber, 'ID', null, 'aspnetuserrole')
      .subscribe(
        (res: Result<Paginate<UserRoleModel[]>>) => {
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
  userRoleEdit(content: any, row: UserRoleModel) { 
    if (row === undefined) {
      this.userIdTracker = 0;
      this.addUpdate = new UserRoleModel();
    } 
    this.modalService
      .open(content, {
        size: 'md',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        (result: boolean) => {

          if (result != undefined) {
            this.addOrUpdate(this.addUpdate, this.userIdTracker);
            this.addForm.reset();
          }
        },
        (reason) => {
          console.log('Err!', reason);
          this.addForm.reset;
        }
      );
  }
  async addOrUpdate(row: UserRoleModel, _id: number) {
    
    if (row.userId !== _id) {
      await this._userRoleService
        .create(row, 'aspnetuserrole')
        .subscribe(
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
          }
        );
    } else {
      
      await this._userRoleService
        .update(row.userId, row, 'aspnetuserrole')
        .subscribe(
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
        );
    }
    this.getUserRoleList(this.page.pageNumber, this.page.size);
  }
  async deleteUserRole(userId: number, roleId: number, modal: any) {
    await this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (_result) => {
          this._userRoleService
            .deleteIt(userId, roleId, 'aspnetuserrole')
            .subscribe((res) => {
              if (res.success) {
                this.toastr.success(
                  'فرایند حذف موفقیت آمیز بود',
                  'موفقیت آمیز!',
                  {
                    timeOut: 3000,
                    positionClass: 'toast-top-left',
                  }
                );
                this.getUserRoleList(this.page.pageNumber, this.page.size);
              } else {
                this.toastr.error('خطا در حذف', res.message, {
                  timeOut: 3000,
                  positionClass: 'toast-top-left',
                });
                this.getUserRoleList(this.page.pageNumber, this.page.size);
              }
            });
        },
        (_error) => {}
      );
  }
  openSignupModal(modal:any){
    
    this.modalService
    .open(modal, {
      size: 'md',
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    })
    .result.then(
      (result: boolean) => {
       this.signUpModel.userName=this.signUpModel.email
        this._usersService
        .create(this.signUpModel, 'aspnetuser')
        .subscribe(
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
          }
        );
    
      },
      (reason) => {
      
      }
    );
   } 
 

}
