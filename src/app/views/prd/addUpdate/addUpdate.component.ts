import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'projects/ngx-image-cropper/src/public-api';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { ProductModel } from '../products-list/product.model';
import { ProductService } from '../products-list/product.service';
import { error } from 'console';
import { HttpEventType } from '@angular/common/http';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
import { Ckeditor } from 'src/app/shared/ckconfig';
import { tagRelationModel } from '../../cnt/article/tagModel/tagRelation.model';
import { tagModel } from '../../cnt/tags/tagModel/tag.model';
import { Paginate } from 'src/app/shared/models/Base/paginate.model';
import { FilterModel } from 'src/app/shared/models/Base/filter.model';

interface Tag {
  name: string;
  code: number;
}

@Component({
  selector: 'app-addUpdate',
  templateUrl: './addUpdate.component.html',
  styleUrls: ['./addUpdate.component.scss'],
})
export class AddUpdateComponent implements OnInit {
  fileName: string = '';
  productId: number = parseInt(
    this._route.snapshot.paramMap.get('productId') ?? '0'
  );
  addUpdate: ProductModel = new ProductModel();
  addForm: FormGroup;
  imageUploadProccess: number = 0;
  tableType: number = 6;
  imgChangeEvt: any = '';
  imageUploadFile;
  imageInputText: string;
  isFileValid: boolean = false;
  cropImagePreview: any = '';
  ifDataExist: boolean = false;
  public CkEditor = new Ckeditor();

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _router: Router,
    private fileUploader: FileUploaderService,
    private _productsService: ProductService,
    private _fileUploaderService: FileUploaderService
  ) {
    // this.getTags();
  }

  async ngOnInit() {
    if (this.productId === 0) {
      this.ifDataExist = true;
      this.addUpdate = new ProductModel();
      this.addUpdate.id = this.productId;
      this.addUpdate.isActive = false;
    } else {
      this.getProductById();
    }
    this.getTags();
    this.addForm = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      type: [null, Validators.compose([Validators.required])],
      orderID: [null, Validators.compose([Validators.required])],
      isActive: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
      browserTitle: [null, Validators.compose([Validators.required])],
      colorCode: ['#6466f1'],
      isRTL: [null],
      secondTitle: [null],
      authorizeAccepted: [false],
      managementAccepted: [false],
      seoAccepted: [false],
      metaDescription: [null],
      brief: [null],
      selectedItems: [''],
    });
    
    // if ((await this.getTags()).res) {
    //   this.pushSectionItem();
    // }

  }
// ===========[هشتک ها]========
items: tagModel[] = new Array<tagModel>();
selectedTags: Tag[] = new Array<Tag>();
tags: Tag[] = new Array<Tag>();
filterHolder: FilterModel = new FilterModel();
selectedItems: string[] = [];
// tetst: boolean = false;
addTagsData: tagRelationModel[] = new Array<tagRelationModel>();

async getTags() {
  this._productsService.getTags(this.filterHolder, 0, 1000).subscribe(
    (res: Result<Paginate<tagModel[]>>) => {
      this.items = [];
      this.items = res.data['items'];
      this.pushSectionItem();
    },
    (error) => {}
  );
}

pushSectionItem() {
  this.items.forEach((x) => {
    let index = this.addUpdate.linkTags.findIndex((i) => i.value == x.id);
    
    if (index != -1) {
      this.selectedTags.push({ name: x.title, code: x.id });

      this.tags.unshift({ name: x.title, code: x.id });
    } else {
      this.tags.push({ name: x.title, code: x.id });
    }
  });
  // setTimeout(() => {
  //   this.tetst = true;
  // }, 500);
}

setTags() {
  let counter = 0;
  this.selectedTags.forEach((x) => {
    this.addTagsData.push({
      linkTagID: x['code'],
      rowID: this.productId,
      tableType: 6,
    });
    counter++;
  });
  this.addTags();
}

addTags() {
  this._productsService.addTagToArticle(this.addTagsData).subscribe((data) => {
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
// addTagsData: tagRelationModel[] = new Array<tagRelationModel>();

// tags: Tag[] = new Array<Tag>();
// tagItems: tagModel[] = new Array<tagModel>();
// selectedTags: Tag[] = new Array<Tag>();

// loadMultiSelect: boolean;

// async getTags() {
//   const res = this._productsService.getTags().pipe(
//     map((it) => {
//       this.tagItems = it.data.items;

//       return { res: it.success, message: it.message };
//     })
//   );
//   const tagsRes = await lastValueFrom(res);
//   return tagsRes;
  
// }

// pushSectionItem() {
  
//   this.tagItems.forEach((x) => {
//     let index = this.addUpdate.linkTags.findIndex((i) => i.value == x.id);
    
//     if (index != -1) {
//       this.selectedTags.push({ name: x.title, code: x.id });

//       this.tags.unshift({ name: x.title, code: x.id });
//     } else {
//       this.tags.push({ name: x.title, code: x.id });
//     }
//   });
// }

// setTags() {
//   this.selectedTags.forEach((x) => {
//     this.addTagsData.push({
//       linkTagID: x.code,
//       rowID: this.productId,
//       tableType: 6,
//     });
//   });
//   if (this.selectedTags.length == 0) {
//     this.deleteTags();
//   } else {
//     this.addTags();
//   }
// }

// addTags() {
//   this._productsService
//     .create(this.addTagsData, 'LinkTagRelation/AddUpdateLinkTagRelations')
//     .subscribe((data) => {
//       if (data.success) {
//         this.toastr.success(data.message, null, {
//           closeButton: true,
//           positionClass: 'toast-top-left',
//         });
//       } else {
//         this.toastr.error(data.message, null, {
//           closeButton: true,
//           positionClass: 'toast-top-left',
//         });
//       }
//     });
// }

// deleteTags() {
//   this._productsService
//     .create(
//       { rowID: this.productId, tableType: 6 },
//       'LinkTagRelation/DeleteLinkTagRelations'
//     )
//     .subscribe((data) => {
//       if (data.success) {
//         this.toastr.success(data.message, null, {
//           closeButton: true,
//           positionClass: 'toast-top-left',
//         });
//       } else {
//         this.toastr.error(data.message, null, {
//           closeButton: true,
//           positionClass: 'toast-top-left',
//         });
//       }
//     });
// }
// ===========
  async getProductById() {
    if (this.productId !== 0)
      this._productsService
        .getOneByID(this.productId, 'Product/GetById')
        .subscribe((res: Result<ProductModel>) => {
          if (res.success) {
            this.addUpdate = res.data;
            this.pushSectionItem();
            this.ifDataExist = true;
          } else {
            this._router.navigate(['/404']);
          }
        });
        

  }
  onFileChanged(event: any) {
    // console.log(this.cropImagePreview);
    this.imgChangeEvt = event;
    this.fileName = event.target.files[0].name;
  }
  cropImg(e: ImageCroppedEvent) {
    this.cropImagePreview = e.base64;
  }
  imgLoad() {}
  initCropper() {}
  imgFailed() {
    alert('image Failed to Show');
  }
  // async uploadFile() {
  //   this._fileUploaderService
  //     .uploadFile(this.cropImagePreview, 'products',this.fileName)
  //     .subscribe((res: Result<string[]>) => {
  //       if (res.success) {
  //         this.addUpdate.cardImagePath = res.data[0];
  //         this.addUpdate.fileExists = true;
  //       } else {
  //         this.addUpdate.cardImagePath = res.errors[0];
  //       }
  //     });
  // }

  async addOrUpdate() {
    setTimeout(() => {
      this.sendData();
    }, 800);
    
  }
  sendData() {
    if (this.addUpdate.id === 0) {
      // let x = {...this.addUpdate,...{colorCode: '',iconPath:'',platformType:0,type:0,versionHistory:'',brief:''}}
      this._productsService
        .create(this.addUpdate, 'product')
        .subscribe((data) => {
          if (data.success) {
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            this._router.navigate(['prd/products-list']);
          } else {
            this.toastr.error(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        });
    } else {
      // let x = {...this.addUpdate,...{colorCode: '',iconPath:'',platformType:0,type:0,versionHistory:'',brief:''}}
      this._productsService
        .update(this.addUpdate.id, this.addUpdate, 'product')
        .subscribe((data) => {
          if (data.success) {
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            // this._router.navigate(['prd/products-list']);
          } else {
            this.toastr.error(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
          }
        });
    }
    
  }
  selectType($event: any) {
    if ($event != undefined) {
      this.addUpdate.type = parseInt($event);
    }
  }
  selectOrder($event: any) {
    if ($event != undefined) {
      this.addUpdate.orderID = parseInt($event);
    }
  }
  deleteImg(filePath: string) {
    this.cropImagePreview = null;
    this.imageUploadProccess = 0;
    this.imageInputText = '';
    this._fileUploaderService
      .deleteFile(filePath)
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.addUpdate.cardImagePath = undefined;
          this.addUpdate.fileExists = false;
          this.toastrFunction('با موفقیت حذف شد', 1);
        } else {
          this.toastrFunction('خطا در حذف تصویر', 2);
        }
      });
  }
  toastrFunction(text: string, type: number) {
    switch (type) {
      case 1:
        this.toastr.success(text, null, {
          timeOut: 2000,
          closeButton: true,
          positionClass: 'toast-top-left',
        });
        break;
      case 2:
        this.toastr.error(text, null, {
          timeOut: 2000,
          closeButton: true,
          positionClass: 'toast-top-left',
        });
        break;
      case 3:
        this.toastr.show(text, null, {
          timeOut: 2000,
          closeButton: true,
          positionClass: 'toast-top-left',
        });
        break;
    }
  }
  checkFileValidation(event: any) {
    this.cropImagePreview = null;
    if (event.target.files[0] != undefined) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        this.cropImagePreview = reader.result;
      };
    }

    this.imageUploadProccess = 0;
    this.imgChangeEvt = event;
    let eventFile = event.target.files[0];
    if (eventFile.type == 'image/webp') {
      this.fileName = eventFile.name;
      this.imageUploadFile = new Blob([eventFile], {
        type: eventFile.type,
      });
      return true;
    } else {
      this.toastrFunction('فایل انتخابی باید webp باشد', 3);
      return false;
    }
  }
  uploadImg() {
    this.imageUploadProccess = 1;
    // if (this.cropImagePreview !== '') {
    //   this
    // }
    this.fileUploader
      .upload(this.imageUploadFile, 'products', this.fileName)
      .pipe(
        map((event) => {
          let toasterType = 2;
          if (event.type == HttpEventType.UploadProgress) {
            this.imageUploadProccess = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event.type == HttpEventType.Response) {
            this.addUpdate.cardImagePath = event.body.data[0];
            if (event.body.success) {
              this.isFileValid = false;
              toasterType = 1;
            }

            this.toastrFunction(event.body.message, toasterType);
          }
        }),
        catchError((err) => {
          this.imageUploadProccess = 0;
          return throwError(err.message);
        })
      )
      .toPromise();
  }
}
