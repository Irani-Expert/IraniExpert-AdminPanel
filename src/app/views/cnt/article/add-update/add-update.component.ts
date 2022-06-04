import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleModel } from '../article/article.model';
import { CKEditorComponent } from 'ng2-ckeditor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ToastrService } from 'ngx-toastr';
import { ArticleService } from '../article/article.service';
import { GroupModel } from 'src/app/views/bas/group/group.model';
import { GroupService } from 'src/app/views/bas/group/group.service';
import { ImageCroppedEvent } from 'projects/ngx-image-cropper/src/public-api';
@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent implements OnInit {
  imgChangeEvt: any = '';
  cropImagePreview: any = '';
  addUpdate: ArticleModel = new ArticleModel();
  groupList: GroupModel[] = new Array<GroupModel>();
  addForm: FormGroup;
  ckeConfig: CKEDITOR.config;
  @ViewChild('myckeditor') ckeditor: CKEditorComponent;

  constructor(
    private _formBuilder: FormBuilder,
    private _articleService: ArticleService,
    private _route: ActivatedRoute,
    private modalService: NgbModal,
    private _router: Router,
    private _fileUploaderService: FileUploaderService,
    private toastr: ToastrService,
    private _groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.getGroupList();
    this.addUpdate = new ArticleModel();
    this.addUpdate.id = parseInt(
      this._route.snapshot.paramMap.get('articleId') ?? '0'
    );
    if (this.addUpdate.id != 0) this.getArticleById(this.addUpdate.id);
    this.ckeConfig = {
      extraPlugins: 'filebrowser',
      allowedContent: false,
      forcePasteAsPlainText: true,
      removePlugins: 'exportpdf',
      skin: 'moono',
      defaultLanguage: 'fa',
      language: 'fa',
    };
    this.addForm = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      brief: [null, Validators.compose([Validators.required])],
      groupID: [null, Validators.compose([Validators.required])],
      isActive: [null],
      description: [null, Validators.compose([Validators.required])],
      publishDate: [null],
    });
  }

  selectGroup($event) {}

  onChangeEditor($event: any): void {
    console.log('onChange');
    //this.log += new Date() + "<br />";
  }

  onPasteEditor($event: any): void {
    console.log('onPaste');
    //this.log += new Date() + "<br />";
  }
  onFileChanged(event: any) {
    this.imgChangeEvt = event;
  }
  cropImg(e: ImageCroppedEvent) {
    this.cropImagePreview = e.base64;
  }
  imgLoad() {}
  initCropper() {}
  imgFailed() {
    alert('image Failed to Show');
  }
  uploadFile() {
    this._fileUploaderService
      .uploadFile(this.cropImagePreview, 'articles')
      .subscribe(
        (res: Result<string[]>) => {
          if (res.success) {
            this.addUpdate.cardImagePath = res.data[0];
            this.toastr.success('با موفقیت آپلود شد', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          } else {
            //TODO Delete Set AddUpdate.cardImagePAth
            this.addUpdate.cardImagePath = res.errors[0];
            this.toastr.error(res.errors[0], 'خطا در آپلود تصویر', {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
          //Todo Image={}
        },
        (error) => {
          this.toastr.error(
            'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
            null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
        }
      );
  }

  async getArticleById(id: number) {
    await this._articleService.getOneByID(id, 'Article').subscribe(
      (res: Result<ArticleModel>) => {
        this.addUpdate = res.data;
        //  this.page.totalElements = res.data.length;
      },
      (error) => {
        this.toastr.error(
          'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
          null,
          {
            closeButton: true,
            positionClass: 'toast-top-left',
          }
        );
      }
    );
  }

  async getGroupList() {
    await this._groupService
      .getTitleValues(0, 10000, 'ID', null, 'Group')
      .subscribe(
        (res: Result<GroupModel[]>) => {
          this.groupList = res.data;
          //  this.page.totalElements = res.data.length;
        },
        (error) => {
          this.toastr.error(
            'خطاارتباط با سرور!!! لطفا با واحد فناوری اطلاعات تماس بگیرید.',
            null,
            {
              closeButton: true,
              positionClass: 'toast-top-left',
            }
          );
        }
      );
  }

  async addOrUpdate(row: ArticleModel) {
    if(row.isActive) {
    row.publishDate = new Date();
  }

    if (row.id === 0) {
      await this._articleService
        .create(row, 'article')
        .toPromise()
        .then(
          (data) => {
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
          },
          (error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    } else {
      await this._articleService
        .update(row.id, row, 'article')
        .toPromise()
        .then(
          (data) => {
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
          },
          (error) => {
            this.toastr.error('خطا مجدد تلاش فرمایید', null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        );
    }

    this._router.navigate(['/cnt/article']);
  }
}
