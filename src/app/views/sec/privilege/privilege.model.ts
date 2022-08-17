import { Base } from 'src/app/shared/models/Base/base.model';
import { IPrivilege } from './privilege.interface';

export class PrivilegeModel extends Base implements IPrivilege {
  parentID: number;
  key: string;
}
