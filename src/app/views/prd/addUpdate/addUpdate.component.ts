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

@Component({
  selector: 'app-addUpdate',
  templateUrl: './addUpdate.component.html',
  styleUrls: ['./addUpdate.component.scss'],
})
export class AddUpdateComponent implements OnInit {
  productId: number = parseInt(
    this._route.snapshot.paramMap.get('productId') ?? '0'
  );
  addUpdate: ProductModel = new ProductModel();
  addForm: FormGroup;
  tableType: number = 6;
  imgChangeEvt: any = '';
  cropImagePreview: any = '';
  ifDataExist: boolean = false;
  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _router: Router,
    private _productsService: ProductService,
    private _fileUploaderService: FileUploaderService
  ) {}

  async ngOnInit() {
    console.log(this.cropImagePreview)

    if (this.productId === 0) {
      this.ifDataExist = true;
      this.addUpdate = new ProductModel();
      this.addUpdate.id = this.productId;
      this.addUpdate.isActive = false;
    } else {
      this.getProductById();
    }
    this.addForm = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      type: [null, Validators.compose([Validators.required])],
      orderID: [null, Validators.compose([Validators.required])],
      isActive: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
    });
  }

  async getProductById() {
    if (this.productId !== 0)
      this._productsService
        .getOneByID(this.productId, 'Product')
        .subscribe((res: Result<ProductModel>) => {
          if (res.success) {
            this.addUpdate = res.data;
            this.ifDataExist = true;
          } else {
            this._router.navigate(['/404']);
          }
        });
  }
  onFileChanged(event: any) {
    console.log(this.cropImagePreview)
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
  async uploadFile() {
    this._fileUploaderService
      .uploadFile(this.cropImagePreview, 'products')
      .subscribe((res: Result<string[]>) => {
        if (res.success) {
          this.addUpdate.cardImagePath = res.data[0];
          this.addUpdate.fileExists = true;
        } else {
          this.addUpdate.cardImagePath = res.errors[0];
        }
      });
  }

  async addOrUpdate() {
    if (this.cropImagePreview !== '') {
      await this.uploadFile();
    }
    setTimeout(() => {
      this.sendData();
    }, 800);
  }
  sendData() {
    if (this.addUpdate.id === 0) {
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
      this._productsService
        .update(this.addUpdate.id, this.addUpdate, 'product')
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
}
