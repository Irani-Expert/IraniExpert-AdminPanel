import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleModel } from '../article/article.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ToastrService } from 'ngx-toastr';
import { ArticleService } from '../article/article.service';
import { GroupService } from 'src/app/views/bas/group/group.service';
import { ImageCroppedEvent } from 'projects/ngx-image-cropper/src/public-api';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { catchError, map, throwError } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';
import { tagModel } from '../../tags/tagModel/tag.model';
import { tagRelationModel } from '../tagModel/tagRelation.model';
import { Ckeditor } from 'src/app/shared/ckconfig';

interface Tag {
  name: string;
  code: number;
}

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent implements OnInit, OnDestroy {
  color: string = '';
  itemFetched = false;
  navId = 0;

  fileName: string = '';
  addTagsData: tagRelationModel[] = new Array<tagRelationModel>();
  Tags: Tag[] = new Array<Tag>();
  selectedCityCodes: string[];
  isLoading: boolean = false;
  articleId: number = parseInt(
    this._route.snapshot.paramMap.get('articleId') ?? '0'
  );
  file: Blob;
  tableType: number = 1;
  imgChangeEvt: any = '';
  cropImagePreview: any = '';
  addUpdate: ArticleModel = new ArticleModel();
  groupList: any[] = new Array<any>();
  group: any = new Object();
  selectedTags: Tag[] = new Array<Tag>();
  countries: any[];
  addForm: FormGroup;
  ifDataExist: boolean = false;
  selectedItems: string[] = [];
  filterHolder: FilterModel = new FilterModel();
  items: tagModel[] = new Array<tagModel>();
  formcontrol: FormGroup;
  tetst: boolean = false;
  public CkEditor = new Ckeditor();

  constructor(
    private _formBuilder: FormBuilder,
    private _articleService: ArticleService,
    private _route: ActivatedRoute,
    private _fileUploaderService: FileUploaderService,
    private toastr: ToastrService,
    private _groupService: GroupService,
    private _user: AuthenticateService,
    private _router: Router
  ) {}
  changeNavId(event: string) {
    this.navId = parseInt(event.split('-')[2]);
  }

  pushSectionItem() {
    this.items.forEach((x) => {
      let index = this.addUpdate.linkTags.findIndex((i) => i.value == x.id);
      if (index != -1) {
        this.selectedTags.push({ name: x.title, code: x.id });

        this.Tags.unshift({ name: x.title, code: x.id });
      } else {
        this.Tags.push({ name: x.title, code: x.id });
      }
    });
    setTimeout(() => {
      this.tetst = true;
    }, 500);
  }
  async getTags() {
    this._articleService.getTags(this.filterHolder, 0, 1000).subscribe(
      (res: Result<Paginate<tagModel[]>>) => {
        this.items = [];
        this.items = res.data['items'];
        this.pushSectionItem();
      },
      (error) => {}
    );
  }
  ngOnDestroy(): void {
    if (this.addUpdate.cardImagePath !== undefined && this.addUpdate.id == 0) {
      this.deleteImg(this.addUpdate.cardImagePath);
    }
  }
  pushSelectedFilterItem() {}
  onSelectAll() {}
  onDeSelectAll() {}
  async ngOnInit() {
    this.getGroupList();

    this.getTags();

    this.addUpdate = new ArticleModel();
    this.addUpdate.id = parseInt(
      this._route.snapshot.paramMap.get('articleId') ?? '0'
    );
    if (this.addUpdate.id != 0) this.getArticleById(this.addUpdate.id);
    this.addForm = this._formBuilder.group({
      title: [null, Validators.required],
      brief: [null, Validators.required],
      groupID: [null, Validators.required],
      isActive: [null],
      description: [null],
      publishDate: [null],
      isRTL: [null],
      metaDescription: [''],
      browserTitle: [''],
      selectedItems: [''],
      colorCode: [''],
      authorAccepted: [false],
      managementAccepted: [false],
      seoAccepted: [false],
      studyTime: [null, Validators.required],
    });
  }

  selectGroup() {}

  onFileChanged(event: any) {
    this.imgChangeEvt = event;
    let file = event.target.files[0];
    this.fileName = file.name;
    this.file = new Blob([file], {
      type: file.type,
    });
  }

  cropImg(e: ImageCroppedEvent) {
    this.cropImagePreview = e.base64;
  }

  imgLoad() {}

  initCropper() {}

  imgFailed() {
    alert(`ناموفق! \n لطفا صحت فایل را بررسی کنید`);
    this.cropImagePreview = '';
  }
  deleteImg(filePath: string) {
    this._fileUploaderService
      .deleteFile(filePath)
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.addUpdate.cardImagePath = undefined;
          this.addUpdate.fileExists = false;
          this.toastr.success('با موفقیت حذف شد', null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(res.message, 'خطا در حذف تصویر', {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        }
      });
  }

  async uploadFile() {
    this.isLoading = true;
    this._fileUploaderService
      .upload(this.file, 'articles', this.fileName)
      .pipe(
        map((res) => {
          if (res.type == HttpEventType.Response) {
            if (res.body.success) {
              this.isLoading = false;
              this.addUpdate.cardImagePath = res.body.data[0];
              this.addUpdate.fileExists = true;
              this.toastr.success(res.body.message, '', {
                positionClass: 'toast-top-left',
                messageClass: 'text-small',
              });
            } else {
              this.isLoading = false;
              this.toastr.error(res.body.message, '', {
                positionClass: 'toast-top-left',
                messageClass: 'text-small',
              });
            }
          }
        }),
        catchError((err) => {
          this.isLoading = false;
          this.toastr.error('آپلود با خطا مواجه شد', '', {
            positionClass: 'toast-top-left',
            messageClass: 'text-small',
          });
          return throwError(err.message);
        })
      )
      .toPromise();
    // this._fileUploaderService
    //   .uploadFile(this.cropImagePreview, 'articles')
    //   .subscribe((res: Result<string[]>) => {
    //     if (res.success) {
    //       this.addUpdate.cardImagePath = res.data[0];
    //       this.addUpdate.fileExists = true;
    //       this.toastr.success('با موفقیت آپلود شد', null, {
    //         closeButton: true,
    //         positionClass: 'toast-top-left',
    //       });
    //     } else {
    //       //TODO Delete Set AddUpdate.cardImagePAth
    //       this.addUpdate.cardImagePath = res.errors[0];
    //       this.toastr.error(res.errors[0], 'خطا در آپلود تصویر', {
    //         closeButton: true,
    //         positionClass: 'toast-top-left',
    //       });
    //     }
    //     //Todo Image={}
    //   });
  }

  async getArticleById(id: number) {
    this._articleService
      .getDetails(id, 'Article/details')
      .subscribe((res: Result<ArticleModel>) => {
        if (res.success) {
          this.ifDataExist = true;
          this.addUpdate = res.data;
          this.group = this.groupList.find(
            (item) => item.value === this.addUpdate.groupID
          );

          if (res.data.colorCode == null || undefined) {
            this.color = '#6466f1';
          } else {
            this.color = res.data.colorCode;
          }

          this.pushSectionItem();
          this.itemFetched = true;
        } else {
          this._router.navigate(['/404']);
        }
        //  this.page.totalElements = res.data.length;
      });
  }

  async getGroupList() {
    this._groupService
      .getTitleValues(0, 10000, 'ID', null, 'Group')
      .subscribe((res: Result<Paginate<any[]>>) => {
        this.groupList = res.data.items;
        this.group = this.groupList.find(
          (item) => item.value === this.addUpdate.groupID
        );
        //  this.page.totalElements = res.data.length;
      });
  }

  async addOrUpdate(row: ArticleModel) {
    this.addUpdate.colorCode = this.color;
    row.updateBy = this._user.currentUserValue.userID;
    // if (row.isActive) {
    //   row.publishDate = new Date();
    // }
    // row.groupID = this.group.value;
    if (row.id === 0) {
      delete row.isActive;
      this._articleService
        .create(row, 'article')

        .subscribe((data) => {
          if (data.success) {
            this.addUpdate.id = data.data;
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          } else {
            this.toastr.error(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        });
    } else {
      this._articleService
        .update(row.id, row, 'article')

        .subscribe((data) => {
          if (data.success) {
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          } else {
            this.toastr.error(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        });
    }
  }
  setTags() {
    let counter = 0;
    this.selectedTags.forEach((x) => {
      this.addTagsData.push({
        linkTagID: x['code'],
        rowID: this.articleId,
        tableType: 1,
      });
      counter++;
    });
    this.addTags();
  }
  addTags() {
    this._articleService.addTagToArticle(this.addTagsData).subscribe((data) => {
      if (data.success) {
        this.toastr.success(data.message, null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
      } else {
        this.toastr.error(data.message, null, {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
      }
    });
  }
}
