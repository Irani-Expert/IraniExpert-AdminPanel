import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { number } from 'echarts';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { RoleModel } from '../../role-mangement/role.model';
import { RoleService } from '../../role-mangement/role.service';
import { PrivilegeModel } from '../privilege.model';
import { PrivilegeService } from '../privilege.service';
import { AddUpdateprivilage } from './add-updateprivilage.model';
import { UserPrivilegeModel } from './user-privilege.model';
import { UserPrivilegeService } from './user-privilege.service';

// import {
//   CdkDragDrop,
//   moveItemInArray,
//   transferArrayItem,
// } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-user-privilege',
  templateUrl: './user-privilege.component.html',
  styleUrls: ['./user-privilege.component.scss'],
})
export class UserPrivilegeComponent implements OnInit {
  roles: RoleModel[] = new Array<RoleModel>();
  rows: UserPrivilegeModel[] ;
  ChangePrivilage:AddUpdateprivilage[]=new Array<AddUpdateprivilage>();
  PrivilageSaver:AddUpdateprivilage=new AddUpdateprivilage;
  privilages: PrivilegeModel[] = new Array<PrivilegeModel>();

  allSelected: boolean;
  page: Page = new Page();
  addUpdate: UserPrivilegeModel;
  addForm: FormGroup;
  roleIdSaver:number
  rolesaver:string
  removeItem:number[]=new Array<number>
  rowCounter:number=0
  element :boolean=false;
  UpdateRole: RoleModel = new RoleModel();
  constructor(
    public _roleService: RoleService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _privilegeService: PrivilegeService,
    private _userPrivilageService: UserPrivilegeService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 12;
  }
  // selectRole(_$event: any) {
  //   if (_$event != undefined) {
  //     this.addUpdate.roleID = parseInt(_$event);
  //   }
  // }
  // selectPrivilage(_$event: any) {
  //   if (_$event != undefined) {
  //     this.addUpdate.privilageID = parseInt(_$event);
  //   }
  // }

  ngOnInit(): void {
 
    this.getPrivilageList();

    this.setPage(this.page.pageNumber);
    this.addForm = this._formBuilder.group({
      privilageID: [null, Validators.required],
      userID: [null],
      roleID: [null],
    });
  }
showData() {
    return (this.element = true);
  }
  hideData() {
    return (this.element = false);
  }
  async addOrUpdate(row: UserPrivilegeModel) {


    if (row.id === 0) {
      await this._userPrivilageService
        .create(row, 'UserPrivilege')
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
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    } 
  }
  setPage(pageInfo: number) {
    this.page.pageNumber = pageInfo;

    this.getRoleList();
    //this.getUserPrivilegeList(this.page.pageNumber, this.page.size);
  }
  async getRoleList() {
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
  async getPrivilageList() {
    this._privilegeService.get(0, 100, 'ID', null, 'Privilege').subscribe(
      (res: Result<Paginate<PrivilegeModel[]>>) => {
        this.privilages=[];
        res.data.items.forEach(it=>{
          
          it.child=new Array<PrivilegeModel>();
          it.child.push(... res.data.items.filter(index=>index.parentID==it.id))
          let x=res.data.items.findIndex(index=>index.parentID==it.id)
         it.child.forEach(y=>{
          this.privilages.splice(this.privilages.findIndex(ide=>ide.id==y.id),1)
          
         })
          this.privilages.push(it)
          
          
          
          
        })
       
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

  ///// -------------Delete A User-Privilege--------- //////
  deleteUserPrivilege(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (_result) => {
          this._userPrivilageService
            .delete(id, 'UserPrivilege')
            .toPromise()
            .then((res) => {
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
              //this.getUserPrivilegeList(this.page.pageNumber, this.page.size);
            })
            .catch((err) => {
              this.toastr.error('خطا در حذف', err.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            });
        },
        (error) => {
          this.toastr.error('انصراف از حذف', error.message, {
            timeOut: 3000,
            positionClass: 'toast-top-left',
          });
        }
      );
  }
  ///// -------------Add A Privilege--------- //////

  roleEdit(content: any, roleId: number) {

    this.PrivilageSaver.roleID=roleId;
    this._userPrivilageService
      .getUserPrivilegesByRoleID(
      
        roleId
      )
      .subscribe(
        (res: Result<UserPrivilegeModel[]>) => {
          this.roleIdSaver=roleId
          this.rows = res.data;
          this.rolesaver=this.rows[0].role
          this.ChangePrivilage=[]
          this.PrivilageSaver=new AddUpdateprivilage;
          this.rows.forEach(x=>{
            this.PrivilageSaver.roleID=x.roleID
            this.PrivilageSaver.privilageID=x.privilageID
            this.ChangePrivilage.push(this.PrivilageSaver)
          })
          
          this.privilages.forEach(it=>{
            let index=this.rows.findIndex(a=>a.privilageID==it.id)
            it.selected=index!=-1 ? true:false
          })
          this.privilages=this.privilages
          console.log(this.ChangePrivilage)
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

   // this.addUpdate = row;
    this.modalService
      .open(content, {
        size: 'lg',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
     
      })
      .result.then(
        (result: boolean) => {
          if (result) {
            this.addForm.reset();
          }
        },
        (reason) => {
          console.log('Err!', reason);
          this.addForm.reset();
        }
      );
  }
  AddOrRemovepermision(situation:boolean,item:PrivilegeModel){
   if(item.parentID==null){
    if(situation){

      item.child.forEach(it=>{
        it.selected=true
        this.AddOrRemovepermision(true,it)
      })
    }
    else{
      item.child.forEach(it=>{
        it.selected=false
        this.AddOrRemovepermision(false,it)
      })
    }}
     if(item.selected==false && item.parentID!=null){
        let index=this.privilages.findIndex(idfinder=>idfinder.id==item.parentID)
        this.privilages[index].selected=false  
    }

    
 if(situation){
  this.PrivilageSaver=new AddUpdateprivilage;
  this.PrivilageSaver.privilageID=item.id
  this.PrivilageSaver.roleID=this.roleIdSaver
  this.ChangePrivilage.push(this.PrivilageSaver)
  console.log(this.ChangePrivilage);
  
   }
 
 else{
  let indexfinder=this.ChangePrivilage.findIndex(x=>{
    x.privilageID==item.id
  })
  this.ChangePrivilage.splice(indexfinder,1)
  
 }

        
        
       
    

    
  }
 
    NewPrivilageList(){
    
     this._userPrivilageService.addUpdateUserPrivilege(this.ChangePrivilage).subscribe(response=>{
       if(response.data==1){
        this.toastr.success("موفقیت امیز بود", null, {
           closeButton: true,
           positionClass: 'toast-top-left',
         });
       }
     else{
        this.toastr.error("شکست خورد", null, {
          closeButton: true,
         positionClass: 'toast-top-left',
        });
       }
    })
    
    }
    ShowBuyyon(item:PrivilegeModel){
item.childerendisplay=!item.childerendisplay
    }
   async createOrUpdateRole(row: RoleModel){
    row.title="mohammad"
    if (row.id === 0) {
      await this._roleService
        .create(row, 'aspnetrole')
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
          (_error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    } else {
      await this._roleService
        .update(row.id, row, 'aspnetrole')
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
          (_error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    }

   }
   roleNameEdit(content: any, row: RoleModel) { 
    if (row === undefined) {
      row = new RoleModel();
      row.id = 0;
    }
    this.UpdateRole = row;
    this.modalService
      .open(content, {
        size: 'sm',
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
      })
      .result.then(
        (result: boolean) => {
          if (result) {
            this.createOrUpdateRole(this.UpdateRole);
            this.addForm.reset();
          }
        },
        (reason) => {
          console.log('Err!', reason);
          this.addForm.reset();
        }
      );
  }
    //   )
  }
  // todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  // done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }

