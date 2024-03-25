import { TableType } from '../../Log/models/table-typeModel';
import { ICountries } from './countries.interface';

export class CountriesModel implements ICountries {
  id: number;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  codeFlag: string;
  title?: string;
  browserTitle?: string;
  description?: string;
  linkTags?:TableType[];
  metaDescription?: string;

}
