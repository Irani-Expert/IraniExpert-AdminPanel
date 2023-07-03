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
import { async, catchError, lastValueFrom, map, throwError } from 'rxjs';
import { log } from 'console';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent implements OnInit {
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
  addForm: FormGroup;
  ifDataExist: boolean = false;
  ckeConfig: CKEDITOR.config;
  @ViewChild('myckeditor') ckeditor: CKEditorComponent;

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
      skin: 'moono-lisa',
      defaultLanguage: 'fa',
      language: 'fa',
      removeButtons:
        'Underline,Subscript,Superscript,SpecialChar,Source,Save,NewPage,DocProps,Preview,Print,' +
        'Templates,document,Cut,Copy,Paste,PasteText,PasteFromWord,Replace,SelectAll,Scayt,' +
        'Radio,TextField,Textarea,Select,Button,HiddenField,Strike,RemoveFormat,' +
        'Outdent,Indent,Blockquote,CreateDiv,Anchor,' +
        'Flash,HorizontalRule,SpecialChar,PageBreak,InsertPre,' +
        'UIColor,ShowBlocks,MediaEmbed,About,Language',
      removePlugins:
        'elementspath,save,magicline,exportpdf,pastefromword,forms,blockquote',
      extraPlugins: 'smiley,justify,colordialog,divarea,indentblock',
    };
    this.addForm = this._formBuilder.group({
      title: [null, Validators.required],
      brief: [null, Validators.required],
      groupID: [null, Validators.required],
      isActive: [null],
      description: [null, Validators.required],
      publishDate: [null],
      isRTL: [null],
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
    let file = event.target.files[0];
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

  uploadFile() {
    this.isLoading = true;
    this._fileUploaderService
      .upload(this.file, 'articles')
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
      .getOneByID(id, 'Article')
      .subscribe((res: Result<ArticleModel>) => {
        if (res.success) {
          this.ifDataExist = true;
          this.addUpdate = res.data;
          this.group = this.groupList.find(
            (item) => item.value === this.addUpdate.groupID
          );
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
