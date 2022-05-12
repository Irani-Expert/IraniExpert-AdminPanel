import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupModel } from 'src/app/views/bas/group/group.model';
import { ArticleModel } from '../article/article.model';
import { CKEditorComponent } from 'ng2-ckeditor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { Result } from 'src/app/shared/models/Base/result.model';
import { ToastrService } from 'ngx-toastr';
import {  CropperSettings } from 'ngx-img-cropper';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss']
})
export class AddUpdateComponent implements OnInit {
  addUpdate:ArticleModel;
  addForm: FormGroup;
  ckeConfig: CKEDITOR.config;
  @ViewChild("myckeditor") ckeditor: CKEditorComponent;
  image: any;
  cropperSettings: CropperSettings;
  constructor(private _formBuilder:FormBuilder,
    private _route:ActivatedRoute
    , private modalService: NgbModal
    ,private _fileUploaderService:FileUploaderService
    ,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.addUpdate=new ArticleModel();
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
    // this.cropperSettings.croppedWidth = 100;
    // this.cropperSettings.croppedHeight = 100;
    // this.cropperSettings.canvasWidth = 400;
    // this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    this.image ={};
  }



  selectGroup($event){

  }

  onChangeEditor($event: any): void {
    console.log("onChange");
    //this.log += new Date() + "<br />";
  }

  onPasteEditor($event: any): void {
    console.log("onPaste");
    //this.log += new Date() + "<br />";
  }

  openUploader(modal) {
    this.modalService.open(modal, { size:"lg" ,centered:true,ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
       this._fileUploaderService.uploadFile(result.image,"articles").subscribe(
        (res: Result<string[]>) => {
          debugger
          if(res.success){
            this.addUpdate.cardImagePath = res.data[0];
            this.toastr.success(
              'با موفقیت آپلود شد',
              null,
              {
                closeButton: true,
                positionClass: 'toast-top-left',
              }
            );
          }else{
            this.toastr.error(
              res.errors[0],
              'خطا در آپلود تصویر',
              {
                closeButton: true,
                positionClass: 'toast-top-left',
              }
            );
          }

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
    }, (reason) => {
      debugger
      console.log('Err!', reason);
    });
  }
}
