import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IDiscount extends IBase {
  id: number,
  createDate: string,
  code: string,
  expireDate: string,
  amount: number,
  count: number
  createBy:string
}
