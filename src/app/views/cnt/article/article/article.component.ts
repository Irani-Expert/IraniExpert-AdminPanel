import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Page } from 'src/app/shared/models/Base/page';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ArticleModel } from './article.model';
import { ArticleService } from './article.service';
import { GroupModel } from 'src/app/views/bas/group/group.model';
import { GroupService } from 'src/app/views/bas/group/group.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  rows: ArticleModel[] = new Array<ArticleModel>();
  viewMode: 'list' | 'grid' = 'list';
  allSelected: boolean;
  groups: GroupModel[] = new Array<GroupModel>();
  selectedGroup = new GroupModel();
  page: Page = new Page();
  loadDropDown: boolean = false;
  constructor(
    private _articleService: ArticleService,
    private _groupService: GroupService,
    private _route: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private _router: Router
  ) {
    this.page.pageNumber = 1;
    this.page.size = 6;
    this._route.params.subscribe((params) => {
      if (
        this.page.pageNumber != params['pageIndex'] ||
        this.rows.length == 0
      ) {
        this.page.pageNumber = params['pageIndex'];
      }
    });
  }

  async ngOnInit() {
    const data = await this.getGroups();
    if (data.success) {
      this.groups = data.data.items.reverse();
      this.selectedGroup = data.data.items.find((it) => it.id == 1);
      this.loadDropDown = true;

      this.setPage(this.page.pageNumber);
    }
  }

  setPage(pageNumber: number) {
    this.page.pageNumber = pageNumber;
    this._router.navigateByUrl(`cnt/article/${this.page.pageNumber}`);

    this.getArticleList(this.page.pageNumber, this.selectedGroup.id);
  }

  async getArticleList(pageNumber: number, groupID: number) {
    this.page.pageNumber = pageNumber;
    const apiRes = await this._articleService.getArticles(this.page, groupID);
    if (apiRes.success) {
      this.rows = apiRes.data.items;
      this.page.totalElements = apiRes.data.totalCount;
      this.page.totalPages = apiRes.data.totalPages - 1;
      // this.page.pageNumber = apiRes.data.pageNumber + 1;
    }
    // this._articleService
    //   .get(
    //     pageNumber !== 0 ? pageNumber - 1 : pageNumber,
    //     6,
    //     'ID',
    //     {"groupID": groupID},
    //     'Article'
    //   )
    //   .subscribe(
    //     (res: Result<Paginate<ArticleModel[]>>) => {
    //       this.rows = res.data.items;
    //       this.page.totalElements = res.data.totalCount;
    //       this.page.totalPages = res.data.totalPages - 1;
    //       this.page.pageNumber = res.data.pageNumber + 1;
    //     },
    //     (_error) => {
    //       this.toastr.error(
    //         'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
    //         null,
    //         {
    //           closeButton: true,
    //           positionClass: 'toast-top-left',
    //         }
    //       );
    //     }
    //   );
  }

  deleteArticle(id: number, modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        this._articleService
          .delete(id, 'Article')

          .subscribe((res) => {
            if (res.success) {
              this.toastr.success(
                'فرایند حذف موفقیت آمیز بود',
                'موفقیت آمیز!',
                {
                  timeOut: 3000,
                  positionClass: 'toast-top-left',
                }
              );
            } else {
              this.toastr.error('خطا در حذف', res.message, {
                timeOut: 3000,
                positionClass: 'toast-top-left',
              });
            }
            this.getArticleList(this.page.pageNumber, this.selectedGroup.id);
          });
      });
  }

  async getGroups() {
    const res = this._groupService.get(0, undefined, 'ID', undefined, 'Group');

    const finalRes = await lastValueFrom(res);

    return finalRes;
  }

  changeGroup() {
    this.page.pageNumber = 1;
    this.setPage(this.page.pageNumber);
  }
}
