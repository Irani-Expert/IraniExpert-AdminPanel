import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserBaseInfoModel } from 'src/app/shared/models/userBaseInfoModel';
import { Observable } from 'rxjs';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ContractModel } from './contract-list/contract.model';
import { ConditionModel } from 'src/app/shared/models/ConditionModel';
import { allComissionModel } from './all-commission/allComission.model';
import { ReceiptModel } from '../bsk/order/models/Receipt.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class allcommissionService extends BaseService<ConditionModel, number> {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {
    super(_http, environment.api.baseUrl);
  }
  addReceipt(data:ReceiptModel){
    debugger
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };    
    return this._http.post<Result<ReceiptModel>>(
      this._base + '/Receipt',
      data ,
      _options
    );
  }
  getReceipt(
    ContractID:number,pageSize:number,pageIndex:number
  ): Observable<Result<Paginate<ReceiptModel[]>>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };
    return this._http.get<Result<Paginate<ReceiptModel[]>>>(
      this._base + '/Receipt?'+ pageIndex+'=0&'+pageSize+'=100&ContractID='+ContractID,
      _options
    );
  }
  // getReceipt(ContractID:number,pageSize:number,pageIndex:number): Observable<Paginate<Result<ReceiptModel>>>{
  //   let _options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Cache-Control':
  //         'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
  //       Pragma: 'no-cache',
  //       Expires: '0',
  //     }),
  //   };    
  //   return this._http.get<Paginate<Result<ReceiptModel>>>(
  //     'https://dev.iraniexpert.com/api/Receipt?'+pageIndex+'=0&'+pageSize+'=100&ContractID='+ContractID,
  //     _options
  //   );
  // }
  getCommissionAllUser(
    sellingType: number,

  ): Observable<Result<allComissionModel[]>> {
    let _options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        Pragma: 'no-cache',
        Expires: '0',
      }),
    };    
    return this._http.get<Result<allComissionModel[]>>(
      this._base + '/Orders/GetCommissionAllUserBySellingType'+'?sellingType=' + sellingType,
      _options
    );
  }

}