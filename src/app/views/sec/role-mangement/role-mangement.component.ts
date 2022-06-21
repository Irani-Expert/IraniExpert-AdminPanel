import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { RoleModel } from './role.model';
import { RoleService } from './role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-role-mangement',
  templateUrl: './role-mangement.component.html',
  styleUrls: ['./role-mangement.component.scss'],
})
export class RoleMangementComponent implements OnInit {
  rows: RoleModel[] = new Array<RoleModel>();
  allSelected: boolean;
  pageIndex = 1;
  pageSize = 12;
  constructor(
    public _roleService: RoleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setPage(0);
  }
  setPage(pageInfo: number) {
    this.pageIndex = pageInfo;
    this.getRoleList(this.pageIndex, this.pageSize);
  }
  async getRoleList(pageNumber: number, seedNumber: number) {
    this._roleService
      .get(pageNumber, seedNumber, 'ID', null, 'aspnetrole')
      .subscribe(
        (res: Result<RoleModel[]>) => {
          this.rows = res.data;
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
