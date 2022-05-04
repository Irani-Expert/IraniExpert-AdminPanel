import { IMenu } from "../interfaces/menu.interface";


/**
 * مدل منو
 */
export class MenuModel implements IMenu {
  id: number;
  title: string;
  icon: string;
}
