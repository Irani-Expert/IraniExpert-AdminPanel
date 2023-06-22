import { IStation } from '../interfaces/station';

export class StationModel implements IStation {
  id: number;
  updateDate: string;
  createDate: string;
  createBy: number;
  updateBy: number;
  title: string;
  code: string;
  cardImagePath: string;
  fileExists: boolean;
}
