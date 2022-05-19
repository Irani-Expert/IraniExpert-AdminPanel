import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  productId: number = parseInt(
    this._route.snapshot.paramMap.get('productId') ?? '0'
  );
  addUpdate: ProductModel;
  addForm: FormGroup;
  tableType: number = 6;
  cropperSettings: CropperSettings;
  image: any;
  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _router:Router,
    private _productsService: ProductService,
    private _fileUploaderService: FileUploaderService
  ) {

  }

 async ngOnInit() {
    if (this.productId === 0) {
      this.addUpdate = new ProductModel();
      this.addUpdate.id = this.productId;
      this.addUpdate.isActive = false;
    }else{
     await this.getProductById();
    }
    this.addForm = this._formBuilder.group({
      cardImagePath: [null],
      title: [null, Validators.compose([Validators.required])],
      type: [null, Validators.compose([Validators.required])],
      orderID: [null, Validators.compose([Validators.required])],
      isActive: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
    });
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.cropperDrawSettings.lineDash = true;
    this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth = 0;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.canvasWidth = 500;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.croppedWidth = 200;

    this.image = {};
  }

  async getProductById() {
    if (this.productId !== 0)
      await this._productsService
        .getOneByID(this.productId, 'Product')
        .subscribe(
          (res: Result<ProductModel>) => {
            debugger
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
    this._fileUploaderService.uploadFile(image.image, 'Product').subscribe(
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
  addOrUpdate(row: ProductModel) {
    if (row.id !== 0)
    {
      this._productsService
      .update(row.id, row, 'product')
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

    }else{
     var x= this._productsService
      .create(row, 'Product')
      .toPromise()
      .then(
        (data) => {
          row.id = 0;
          if (data.success) {
            this.toastr.success(data.message, null, {
              closeButton: true,
              positionClass: 'toast-top-left',
            });
            this._router.navigate(['prd/addUpdate/'+data.data])
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
}
