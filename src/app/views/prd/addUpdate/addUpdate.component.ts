import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CropperSettings } from 'ngx-img-cropper';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/shared/models/Base/result.model';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { ProductModel } from '../products-list/product.model';
import { ProductService } from '../products-list/product.service';

@Component({
  selector: 'app-addUpdate',
  templateUrl: './addUpdate.component.html',
  styleUrls: ['./addUpdate.component.scss'],
})
export class AddUpdateComponent implements OnInit {
  productId: number = 0;
  tableType: number = 6;
  product: ProductModel = new ProductModel();
  addUpdate: ProductModel;
  addForm: FormGroup;
  cropperSettings: CropperSettings;
  image: any;

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _productsService: ProductService,
    private _fileUploaderService: FileUploaderService
  ) {
    this.productId = parseInt(
      this._route.snapshot.paramMap.get('productId') ?? '0'
    );

    this.addForm = this._formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
      cardImagePath: [null],
      iconPath: [null],
      type: [null, Validators.compose([Validators.required])],
    });

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 500;
    this.cropperSettings.height = 300;
    this.cropperSettings.canvasHeight = 400;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    this.image = {};
  }

  ngOnInit(): void {
    this.getProductById();
  }
  async getProductById() {
    await this._productsService.getOneByID(this.productId, 'Product').subscribe(
      (res: Result<ProductModel>) => {
        this.addUpdate = res.data;
        //  this.page.totalElements = res.data.length;
      },
      (_error) => {
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

  uploadFile(image) {
    this._fileUploaderService.uploadFile(image.image, 'articles').subscribe(
      (res: Result<string[]>) => {
        if (res.success) {
          this.addUpdate.cardImagePath = res.data[0];
          this.toastr.success('با موفقیت آپلود شد', null, {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
        } else {
          this.toastr.error(res.errors[0], 'خطا در آپلود تصویر', {
            closeButton: true,
            positionClass: 'toast-top-left',
          });
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
  }
}
