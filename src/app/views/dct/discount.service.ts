import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/baseService/baseService';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiscountModel } from './discount/Discount.model';
@Injectable({
  providedIn: 'root'
})
export class discountService extends BaseService<DiscountModel, number>  {
  userGuid = environment.jwtToken;

  constructor(public _http: HttpClient) {     super(_http, environment.api.baseUrl);}
}
