import { Base } from 'src/app/shared/models/Base/base.model';
import { IArticle } from './article.interface';

export class ArticleModel extends Base implements IArticle {
  updateBy: number;
  updateByFirstName: string;
  updateByLastName: string;
  groupID: number;
  group: string;
  brief: string;
  publishDate: Date;
  cardImagePath: string;
  viewsCount: number;
  fileExists:boolean
}
