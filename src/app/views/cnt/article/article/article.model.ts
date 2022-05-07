
import { Base } from 'src/app/shared/models/Base/base.model';
import { IArticle } from './article.interface';

export class ArticleModel extends Base implements IArticle{
  groupID: number;
  group: string;
  brief: string;
  publishDate: Date;
  cardImagePath: string;
  viewsCount: number;

}


