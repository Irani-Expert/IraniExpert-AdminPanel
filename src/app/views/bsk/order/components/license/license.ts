import { LicenseModel } from '../../models/license.model';
import { lastValueFrom, map } from 'rxjs';
import { LicenseService } from '../../services/license.service';
export class License {
  private licenseModel = new LicenseModel();
  constructor(
    private _licenseService: LicenseService,
    private licenseID: number
  ) {}
  async get() {
    const apiRes = this._licenseService
      .getOneByID(this.licenseID, 'License')
      .pipe(
        map((res) => {
          if (res.success) {
            this._licenseService.licenseSubject.next(res.data);
          }
          return res.success;
        })
      );
    return await lastValueFrom(apiRes);
  }
  get _licenseItem() {
    return this.licenseModel;
  }
  set _licenseItem(item: LicenseModel) {
    this.licenseModel = item;
  }
  async delete() {
    return await lastValueFrom(
      this._licenseService.delete(this.licenseID, 'License').pipe(
        map((res) => {
          return res;
        })
      )
    );
  }
  async post(item) {
    item.id = 0;

    return await lastValueFrom(
      this._licenseService.create(item, 'License').pipe(
        map((res) => {
          return res;
        })
      )
    );
  }
  async put(item) {
    return await lastValueFrom(
      this._licenseService.update(this.licenseID, item, 'License').pipe(
        map((res) => {
          return res;
        })
      )
    );
  }
  set licenseFilePath(filePath: string) {
    this.licenseModel.filePath = filePath;
  }
  async expireDate(item) {
    let date = new Date(item.expireDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    item.expireDate =
      date.getFullYear() +
      '-' +
      (month < 10 ? '0' + month : month) +
      '-' +
      (day < 10 ? '0' + day : day);
    return item.expireDate;
  }
  async startDate(item) {
    let date = new Date(item.startDate);
    date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    item.startDate =
      date.getFullYear() +
      '-' +
      (month < 10 ? '0' + month : month) +
      '-' +
      (day < 10 ? '0' + day : day);
    return item.startDate;
  }
}
