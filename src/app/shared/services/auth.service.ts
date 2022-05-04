import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from './../services/globalService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';




@Injectable()
export class AuthService {

  constructor(private globalService: GlobalService, private _spinner: NgxSpinnerService) {
  }
  private sessionVariables: Map<string, string> = new Map<string, string>();
  private _snackBar: MatSnackBar
  loggedIn = false;


  isAuthenticated(permission) {
    //todo get user info by token
    let permissions;
    var accessToken = localStorage.getItem('access_token');
    var permissionStorage = localStorage.getItem('permissions');
    if (permissionStorage !== undefined && permissionStorage != null) {
      permissions = permissionStorage.split(',')
    } else {
      const promise = new Promise(
        (resolve, reject) => {
          this.loggedIn = false;
          resolve(this.loggedIn);
        }
      );
      return promise;
    }

    if (accessToken !== undefined && accessToken !== null) {
      if (permissions.find(item => item === permission)) {
        this.loggedIn = true;

        const promise = new Promise(
          (resolve, reject) => {

            resolve(this.loggedIn);

          }
        );
        return promise;
      }
      else {

        const promise = new Promise(
          (resolve, reject) => {
            this.loggedIn = false;

            resolve(this.loggedIn);

          }
        );
        return promise;
      }
    }
    else {

      const promise = new Promise(
        (resolve, reject) => {
          this.loggedIn = false;

          resolve(this.loggedIn);

        }
      );
      return promise;
    }

  }

  async getUserPermission(guid, orgId: number = 0) {
    //todo request to server
    debugger
    await this.globalService.getUserPermission(guid, orgId).toPromise().then(data => {
      localStorage.setItem('personal_info', guid);
      let string = JSON.stringify(data.userInfo);
      localStorage.setItem('userInfo', string);
      this.addPermission(data, guid);
      return true;
    })
  }

  async addPermission(data, guid) {
    await localStorage.setItem('access_token', guid);
    let permissions = [];
    data.permissions.forEach(item => {
      permissions.push(item.formTitle.trim());
      item.actions.forEach(action => {
        permissions.push(item.formTitle.trim() + "-" + action.title.trim());
      })
    });



    data.menus.forEach(item => {
      permissions.push(item.title.trim())
    })
    await localStorage.setItem('permissions', permissions.toString());
  }

  logout() {
    this.loggedIn = false;
    localStorage.clear();
  }
}

