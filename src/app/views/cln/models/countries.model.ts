import { ICountries } from './countries.interface';

export class Countries implements ICountries {
  id: number;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
}
