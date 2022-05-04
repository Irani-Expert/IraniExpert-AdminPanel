import { IResult } from './../../interfaces/Base/result.interface';

export class Result<T> implements IResult<T>{
  data:T;
  success:boolean;
  message:string;
  errors:string[];
}
