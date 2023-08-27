import { IBase } from 'src/app/shared/interfaces/Base/base.interface';
import { TableType } from 'src/app/views/Log/models/table-typeModel';

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
  fileExists: boolean;
  isRTL: boolean;
  metaDescription: string;
  browserTitle: string;
  linkTags:TableType[]
}
