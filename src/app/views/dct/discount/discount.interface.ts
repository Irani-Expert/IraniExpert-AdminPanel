import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IDiscount extends IBase {
  id: number,
  createDate: string,
  updateDate: string,
  createBy:string,
  updateBy:string,
  code: string,
  expireDate: string,
  amount: number,
  count: number,
  percent: number,
}
