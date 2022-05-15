import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleModel } from '../article/article.model';
import { CKEditorComponent } from 'ng2-ckeditor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ToastrService } from 'ngx-toastr';
import { CropperSettings } from 'ngx-img-cropper';
import { ArticleService } from '../article/article.service';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent implements OnInit {
  addUpdate: ArticleModel = new ArticleModel();
  addForm: FormGroup;
  ckeConfig: CKEDITOR.config;
  @ViewChild('myckeditor') ckeditor: CKEditorComponent;
  image: any;
  cropperSettings: CropperSettings;
  constructor(
    private _formBuilder: FormBuilder,
    private _articleService: ArticleService,
    private _route: ActivatedRoute,
    private modalService: NgbModal,
    private _router: Router,
    private _fileUploaderService: FileUploaderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.addUpdate = new ArticleModel();
    this.addUpdate.id = parseInt(
      this._route.snapshot.paramMap.get('articleId') ?? '0'
    );
    if (this.addUpdate.id != 0) this.getArticleById(this.addUpdate.id);
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      removePlugins: 'exportpdf',

    };
    this.addForm = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      brief: [null, Validators.compose([Validators.required])],
      groupID: [null, Validators.compose([Validators.required])],
      isActive: [null],
      description: [null, Validators.compose([Validators.required])],
    });
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 500;
    this.cropperSettings.height = 300;
    this.cropperSettings.canvasHeight = 400;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.croppedHeight = 400;
    this.cropperSettings.croppedWidth = 300;
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    this.image = {};
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

  uploadFile(image) {
    this._fileUploaderService.uploadFile(image.image, 'product').subscribe(
      (res: Result<string[]>) => {
        debugger;
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

  async addOrUpdate(row: ArticleModel) {
    debugger;
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
