export class Paginate<T>{
  hasNextPage:boolean;
  hasPreviousPage:boolean;
  items:T
  pageNumber:number;
  totalCount:number;
  totalPages:number;
}
