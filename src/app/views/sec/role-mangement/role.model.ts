import { Base } from 'src/app/shared/models/Base/base.model';
import { IRole } from './role.interface';

export class RoleModel extends Base implements IRole {
  
  id: number;
  name: string = '';
  title:string;
  concurrencyStamp: string;
  updateDate: string;
  updateBy: number;
  createDate: string;
  createBy: number; 
  value:number;
}
