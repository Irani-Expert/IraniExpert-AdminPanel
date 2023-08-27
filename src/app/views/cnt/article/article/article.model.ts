import { Base } from 'src/app/shared/models/Base/base.model';
import { IArticle } from './article.interface';
import { TableType } from 'src/app/views/Log/models/table-typeModel';

export class ArticleModel extends Base implements IArticle {
  isRTL: boolean;
  updateBy: number;
  updateByFirstName: string;
  updateByLastName: string;
  groupID: number;
  group: string;
  brief: string;
  publishDate: Date;
  cardImagePath: string;
  viewsCount: number;
  fileExists: boolean;
  metaDescription: string;
  browserTitle: string = '';
  linkTags:TableType[]
}
