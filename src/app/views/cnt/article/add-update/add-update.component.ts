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
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { Base } from 'src/app/shared/models/Base/base.model';
import { CliamxLicenseModel } from 'src/app/views/bsk/order/models/cliamaxLicense.model';
import { AuthenticateService } from 'src/app/shared/services/auth/authenticate.service';
import { async, lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent implements OnInit {
  articleId: number = parseInt(
    this._route.snapshot.paramMap.get('articleId') ?? '0'
  );
  imageFound: boolean = false;
  tableType: number = 1;
  imgChangeEvt: any = '';
  cropImagePreview: any = '';
  addUpdate: ArticleModel = new ArticleModel();
  groupList: any[] = new Array<any>();
  group: any = new Object();
  addForm: FormGroup;
  ckeConfig: CKEDITOR.config;
  @ViewChild('myckeditor') ckeditor: CKEditorComponent;

  constructor(
    private _formBuilder: FormBuilder,
    private _articleService: ArticleService,
    private _route: ActivatedRoute,
    private _fileUploaderService: FileUploaderService,
    private toastr: ToastrService,
    private _groupService: GroupService,
    private _user: AuthenticateService
  ) {}

  ngOnInit(): void {
    this.getGroupList();
    this.addUpdate = new ArticleModel();
    this.addUpdate.id = parseInt(
      this._route.snapshot.paramMap.get('articleId') ?? '0'
    );
    if (this.addUpdate.id != 0) this.getArticleById(this.addUpdate.id);
    this.ckeConfig = {
      filebrowserBrowseUrl: 'dl.iraniexpert.com//uploads/images/articles',
      filebrowserUploadUrl:
        'https://dl.iraniexpert.com/FileUploader/FileUploadCkEditor',
      allowedContent: false,
      forcePasteAsPlainText: true,
      skin: 'moono',
      defaultLanguage: 'fa',
      language: 'fa',
      removePlugins: 'elementspath,save,magicline,exportpdf',
      extraPlugins: 'divarea,smiley,justify,indentblock,colordialog',
    };
    this.addForm = this._formBuilder.group({
      title: [null, Validators.required],
      brief: [null, Validators.required],
      groupID: [null, Validators.required],
      isActive: [null],
      description: [null, Validators.required],
      publishDate: [null],
    });
  }

  selectGroup() {}

  onChangeEditor(): void {
    console.log('onChange');
    //this.log += new Date() + "<br />";
  }

  onPasteEditor(): void {
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
  deleteImg(filePath: string) {
    this._fileUploaderService
      .deleteFile(filePath)
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.imageFound = true;
          this.addUpdate.cardImagePath = undefined;

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

  uploadFile() {
    this._fileUploaderService
      .uploadFile(this.cropImagePreview, 'articles')
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.addUpdate.cardImagePath = res.data[0];
          this.imageFound = true;
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
      });
  }

  async getArticleById(id: number) {
    this._articleService
      .getOneByID(id, 'Article')
      .subscribe((res: Result<ArticleModel>) => {
        this.addUpdate = res.data;
        this.imageFound = true;
        this.group = this.groupList.find(
          (item) => item.value === this.addUpdate.groupID
        );
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
    row.updateBy = this._user.currentUserValue.userID;
    // if (row.isActive) {
    //   row.publishDate = new Date();
    // }
    // row.groupID = this.group.value;
    if (row.id === 0) {
      this._articleService
        .create(row, 'article')

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
    } else {
      if (row.cardImagePath.indexOf('com/') != -1) {
        row.cardImagePath = row.cardImagePath.substring(
          row.cardImagePath.indexOf('com/') + 4
        );
      }
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
}
