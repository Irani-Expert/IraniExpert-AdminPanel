
export interface Itag {
  id: number;
  updateDate: string;
  createDate: string;
  createBy: number;
  updateBy: number;
  title: string;
  description: string;
  orderID: number;
  isActive: boolean;
  groupID: number;
  groupTitle: string;
  isSharp : boolean;
}

export interface GroupId {
  title : string;
  value : number;
}