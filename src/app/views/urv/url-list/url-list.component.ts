import { Component, OnInit } from '@angular/core';
import { UrvService } from '../urv.service';
import { lastValueFrom, map } from 'rxjs';
import { UrlModel } from '../models/url-list.model';
import { SingleUrlModel } from '../models/single-url.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';

@Component({
  selector: 'app-url-list',
  templateUrl: './url-list.component.html',
  styleUrls: ['./url-list.component.scss'],
})
export class UrlListComponent implements OnInit {
  items = new Array<UrlModel>();
  page = new Page();
  pageHasItems = false;
  constructor(
    private urvService: UrvService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    if ((await this.get(0)).length !== 0) {
      this.pageHasItems = true;
    }
  }
  async get(id: number) {
    const res = this.urvService.get(id, 10, 'ID', null, 'URLRedirect').pipe(
      map((it) => {
        if (it.success) {
          this.items = it.data.items;
          this.page.totalElements = it.data.totalCount;
          this.page.totalPages = it.data.totalPages;
        }
        return it.data.items;
      })
    );
    return await lastValueFrom(res);
  }
  async getOne(id: number) {
    const res = this.urvService.getOneByID(id, 'URLRedirect').pipe(
      map((it) => {
        if (it.success) {
          this.urvService.singelUrlSubject.next(it.data);
        }
        return it.success;
      })
    );
    return await lastValueFrom(res);
  }
  goToDetails(id: number) {
    if (id == -1) {
      this.urvService.singelUrlSubject.next(new SingleUrlModel());
      this.router.navigateByUrl(`urv/detail/${id}`);
    } else {
      if (this.getOne(id)) {
        this.router.navigateByUrl(`urv/detail/${id}`);
      } else {
        this.toastr.error('لطفا دوبار امتحان کنید', 'خطا !!', {
          positionClass: 'toast-top-left',
          timeOut: 3000,
          progressBar: true,
        });
      }
    }
  }
}
