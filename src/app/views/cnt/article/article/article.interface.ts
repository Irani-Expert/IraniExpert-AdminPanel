import { IBase } from 'src/app/shared/interfaces/Base/base.interface';

export interface IArticle extends IBase {
  groupID: number;
  group: string;
  brief: string;
  publishDate: Date;
  cardImagePath: string;
  viewsCount: number;
  updateBy: number;
  updateByFirstName: string;
  updateByLastName: string;
}
