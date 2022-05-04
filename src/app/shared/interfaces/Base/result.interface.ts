export interface IResult<T> {
  data:T;
  success:boolean;
  message:string;
  errors:string[];
}

