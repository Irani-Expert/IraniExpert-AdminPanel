import { Base } from 'src/app/shared/models/Base/base.model';
import { IAddUpdateprivilage } from './add-updateprivilage.interface';
import { IUserPrivilege } from './user-privilege.interface';
export class AddUpdateprivilage extends Base implements IAddUpdateprivilage{
    id: number=0;
    userID: number=0;
    roleID: number=0;
    privilageID: number=0;
}
