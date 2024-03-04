import { Component } from '@angular/core';
import { NavigationEnd, Router, Scroll } from '@angular/router';
import { Subject, Subscription, lastValueFrom, map, takeUntil } from 'rxjs';
import { BrokersService } from '../../brokers.service';
import { BrokerModel } from '../../models/broker.model';
import { ToastrService } from 'ngx-toastr';
import { rates } from './rates';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ckeditor } from 'src/app/shared/ckconfig';
import { FileUploaderService } from 'src/app/shared/services/fileUploader.service';
import { HttpEventType } from '@angular/common/http';
import { base64Maker } from 'src/app/shared/base64Maker';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { tagModel } from '../../../tags/tagModel/tag.model';
import { tagRelationModel } from '../../../article/tagModel/tagRelation.model';
import { Utils } from 'src/app/shared/utils';

interface Tag {
  name: string;
  code: number;
}

interface Navigation {
  id: number;
  title: string;
  urlPath: string;
  isActive: boolean;
  icon: string;
}
@Component({
  selector: 'app-broker-details',
  templateUrl: './broker-details.component.html',
  styleUrls: ['./broker-details.component.scss'],
})
export class BrokerDetailsComponent {
  color: string = '';
  isFileValid = false;
  isSecondFileValid = false;
  thirdFileValid = false;
  navId = 0;
  imgSrc = '/uploads/images/articles/8536cf59721a481e883faaba8b0c6bdf.jpg';
  selectedRate: number = 10;
  rates = rates;
  routeSubscriber: Subscription;
  item = new BrokerModel();
  private routeSubject = new Subject();
  formGroup: FormGroup;
  file: Blob;
  secondFile: Blob;
  thirdFile : Blob;
  fileName = '';
  secondFileName = '';
  thirdFileName = '';
  filePreview: any = '';
  secondFilePreview: any = '';
  thirdfilePreview: any = '';
  itemFetched = false;
  public CkEditor = new Ckeditor();

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private brokerService: BrokersService,
    private toastr: ToastrService,
    private fileUploader: FileUploaderService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService
  ) {
    this.routeSubscriber = this._router.events
      .pipe(takeUntil(this.routeSubject))
      .subscribe({
        next: async (event) => {
          if (event instanceof Scroll) {
            if (event.routerEvent instanceof NavigationEnd) {
              let urlValue = event.routerEvent.urlAfterRedirects.split('/')[3];

              if (urlValue == 'add') {
                this.item = new BrokerModel();
                this.formGroup = this._formBuilder.group({
                  title: [null, [Validators.required]],
                  isActive: [false, [Validators.required]],
                  brief: [null, [Validators.required]],
                  secondTitle: [null, [Validators.required]],
                  copyTrade: [false, [Validators.required]],
                  isRTL: [false, [Validators.required]],
                  metaDescription: [null, [Validators.required]],
                  browserTitle: [null, [Validators.required]],
                  isIRSupport: [false, [Validators.required]],
                  referralLink: [null],
                  staticRate: [null, [Validators.required]],
                  tradingSymbols: [null, [Validators.required]],
                  telegramSupportLink: [null, [Validators.required]],
                  videoLink: [null, [Validators.required]],
                  webSiteLink: [null, [Validators.required]],
                  accountCent: [false, [Validators.required]],
                  leverage: [null, [Validators.required]],
                  minDeposit: [null, [Validators.required]],
                  isPersianSupport: [false, [Validators.required]],
                  establishedYear: [null, [Validators.required]],
                  countryName: [null],
                  countryIcon: [null],
                  email: [null, [Validators.required, Validators.email]],
                  phoneNumber: [null],
                  colorCode: ['#6466f1'],
                  studyTime: [null, [Validators.required]],
                  seoAccepted: [false],
                  managementAccepted: [false],
                  authorAccepted: [false],
                });
                this.showForm = true;
              } else {
                if (await this.get(parseInt(urlValue))) {
                  this.itemFetched = true;
                  this.showForm = true;
                  if ((await this.getTags()).res) {
                    this.pushSectionItem();
                  }
                } else {
                  this.toastr.error('آیتم یافت نشد', 'خطا !!', {
                    timeOut: 3500,
                    positionClass: 'toast-top-left',
                    progressBar: true,
                  });
                  this._router.navigateByUrl('cnt/brokers/broker-list');
                }
              }
            }
          }
        },
      });
  }

  ngOnInit() {}
  showForm = false;
  ngOnDestroy() {
    this.routeSubscriber.unsubscribe();
  }
  async get(id: number): Promise<boolean> {
    Utils.scrollTopWindow();
    const result = this.brokerService.getBrokerDetails(id).pipe(
      map((res) => {
        if (res.success) {
          this.item = res.data;
          this.formGroup = this._formBuilder.group({
            title: [this.item.title, [Validators.required]],
            isActive: [this.item.isActive, [Validators.required]],
            brief: [this.item.brief, [Validators.required]],
            secondTitle: [this.item.secondTitle, [Validators.required]],
            copyTrade: [this.item.copyTrade, [Validators.required]],
            isRTL: [this.item.isRTL, [Validators.required]],
            metaDescription: [this.item.metaDescription, [Validators.required]],
            browserTitle: [this.item.browserTitle, [Validators.required]],
            isIRSupport: [this.item.isIRSupport, [Validators.required]],
            referralLink: [this.item.referralLink],
            staticRate: [this.item.staticRate, [Validators.required]],
            tradingSymbols: [this.item.tradingSymbols, [Validators.required]],
            telegramSupportLink: [
              this.item.telegramSupportLink,
              [Validators.required],
            ],
            videoLink: [this.item.videoLink, [Validators.required]],
            webSiteLink: [this.item.webSiteLink, [Validators.required]],
            accountCent: [this.item.accountCent, [Validators.required]],
            leverage: [this.item.leverage, [Validators.required]],
            minDeposit: [this.item.minDeposit, [Validators.required]],
            isPersianSupport: [
              this.item.isPersianSupport,
              [Validators.required],
            ],
            studyTime: [this.item.studyTime, [Validators.required]],
            establishedYear: [this.item.establishedYear, [Validators.required]],
            email: [this.item.email, [Validators.required, Validators.email]],
            countryName: [this.item.countryName],
            countryIcon: [this.item.countryIcon],
            phoneNumber: [this.item.phoneNumber],
            colorCode: [this.item.colorCode],
            authorAccepted: [this.item.authorAccepted],
            managementAccepted: [this.item.managementAccepted],
            seoAccepted: [this.item.seoAccepted],
          });
          if (res.data.colorCode == null || undefined) {
            this.color = '#6466f1';
          } else {
            this.color = res.data.colorCode;
          }
        }
        return res.success;
      })
    );

    return await lastValueFrom(result);
  }
  async changeFilePath(event: any, index: number) {
    let isFileValid = false;
    let file = event.target.files[0];

    let type = 'image/jpeg|image/webp|image/png';
    type.split('|').includes(file.type)
      ? (isFileValid = true)
      : this.toastr.error(
          'لطفا فقط عکس با فرمت های jpg, webp, png ارسال کنید.',
          'خطا!!',
          {
            messageClass: 'text-small',
            positionClass: 'toast-top-center',
            progressBar: true,
            timeOut: 3000,
          }
        );
    if (isFileValid) {
      if (index == 0) {
        this.isFileValid = true;
        let url = await base64Maker(file);
        this.filePreview = this.sanitizer.bypassSecurityTrustUrl(url);
        this.fileName = file.name;
        this.file = new Blob([file], { type: file.type });
      } 
      if (index == 1) {
        this.isSecondFileValid = true;
        let url = await base64Maker(file);
        this.secondFilePreview = this.sanitizer.bypassSecurityTrustUrl(url);
        this.secondFileName = file.name;
        this.secondFile = new Blob([file], { type: file.type });
      }
      if (index == 2) {
        this.thirdFileValid = true;
        let url = await base64Maker(file);
        this.thirdfilePreview = this.sanitizer.bypassSecurityTrustUrl(url);
        this.thirdFileName = file.name;
        this.thirdFile = new Blob([file], { type: file.type });
      }
    } else {
      this.filePreview = '';
      this.secondFilePreview = '';
      this.thirdfilePreview = '';
      this.isFileValid = false;
      this.isSecondFileValid = false;
      this.thirdFileValid = false;
    }
  }

  // Upload File
  async uploadFile(file: Blob, fileName: string, type: number) {
    const uploadRes = this.fileUploader.upload(file, 'article', fileName).pipe(
      map((res) => {
        if (res.type === HttpEventType.Response) {
          if (res.body.success) {
            if (type == 0) {
              this.item.cardImagePath = res.body.data[0];
            }
            if (type == 1) {
              this.item.secondCardImagePath = res.body.data[0];
            }
            if (type == 2) {
              this.item.thirdCardImagePath = res.body.data[0];
            }
          }
          return res.body.success;
        }
      })
    );
    const value = await lastValueFrom(uploadRes);
    return value;
  }
  async uploadOnClick(index: number) {
    this.spinner.show();
    let timeout = setTimeout(() => {
      this.spinner.hide();
    }, 3500);
    if (index == 0) {
      if (await this.uploadFile(this.file, this.fileName, 0)) {
        this.file = new Blob();
        this.spinner.hide();
        clearTimeout(timeout);
      }
    }
    if (index == 1) {
      if (await this.uploadFile(this.secondFile, this.secondFileName, 1)) {
        this.secondFile = new Blob();
        this.spinner.hide();
        clearTimeout(timeout);
      }
    }

    if (index == 2) {
      if (await this.uploadFile(this.thirdFile, this.thirdFileName, 2)) {
        this.thirdFile = new Blob();
        this.spinner.hide();
        clearTimeout(timeout);
      }
    }
  }
  async deleteFile(path: string, type: number) {
    this.fileUploader.deleteFile(path).subscribe({
      next: (res) => {
        if (res.success) {
          if (type == 0) {
            this.item.cardImagePath = '';
            this.filePreview = '';
          }
          if (type == 1) {
            this.item.secondCardImagePath = '';
            this.secondFilePreview = '';
          }
          if ( type == 2) {
            this.item.thirdCardImagePath = '';
            this.thirdfilePreview = '';
          }
          this.toastr.success(res.message, null, {
            messageClass: 'text-small',
            positionClass: 'toast-top-center',
            progressBar: true,
            timeOut: 3000,
          });
        } else {
          this.toastr.error(res.message, null, {
            messageClass: 'text-small',
            positionClass: 'toast-top-center',
            progressBar: true,
            timeOut: 3000,
          });
        }
      },
    });
  }

  changeBenefits(event) {
    this.item.advantages = event.advantages;
    this.item.disAdvantages = event.disadvantages;
  }

  getReadyForPost() {
    if (!this.formGroup.valid) {
      this.toastr.error('فیلد های خواسته شده را چک کنید', null, {
        positionClass: 'toast-top-center',
        progressBar: true,
        timeOut: 3000,
      });
      return;
    } else {
      // if (
      //   this.item.cardImagePath == '' ||
      //   this.item.secondCardImagePath == ''
      // ) {
      //   this.toastr.error('از آپلود شدن عکس ها اطمینان حاصل کنید', null, {
      //     positionClass: 'toast-top-center',
      //     progressBar: true,
      //     timeOut: 3000,
      //   });
      //   return;
      // } else {
      //   this.setItem(this.item);
      // }
        this.setItem(this.item);
    }
  }
  setItem(item: BrokerModel) {
    let sendingItem = {
      accountCent: this._controls['accountCent'].value,
      advantages: item.advantages,
      disAdvantages: item.disAdvantages,
      brief: this._controls['brief'].value,
      staticRate: this._controls['staticRate'].value,
      tradingSymbols: this._controls['tradingSymbols'].value,
      telegramSupportLink: this._controls['telegramSupportLink'].value,
      videoLink: this._controls['videoLink'].value,
      webSiteLink: this._controls['webSiteLink'].value,
      leverage: this._controls['leverage'].value,
      minDeposit: this._controls['minDeposit'].value,
      isPersianSupport: this._controls['isPersianSupport'].value,
      isIRSupport: this._controls['isIRSupport'].value,
      establishedYear: this._controls['establishedYear'].value,
      email: this._controls['email'].value,
      copyTrade: this._controls['copyTrade'].value,
      isRTL: this._controls['isRTL'].value,
      metaDescription: this._controls['metaDescription'].value,
      title: this._controls['title'].value,
      browserTitle: this._controls['browserTitle'].value,
      cardImagePath: item.cardImagePath == ''? ' ' : item.cardImagePath,
      secondCardImagePath: item.secondCardImagePath  == ''? ' ' : item.secondCardImagePath,
      thirdCardImagePath: item.thirdCardImagePath  == ''? ' ' : item.thirdCardImagePath,
      secondTitle: this._controls['secondTitle'].value,
      studyTime: this._controls['studyTime'].value,
      // Forcing True Will Change Later
      authorAccepted: this._controls['authorAccepted'].value,
      managementAccepted: this._controls['managementAccepted'].value,
      seoAccepted: this._controls['seoAccepted'].value,
      // Forcing True Will Change Later
      referralLink: this._controls['referralLink'].value,
      phoneNumber: this._controls['phoneNumber'].value,
      id: item.id ? item.id : 0,
      description: item.description,
      isActive: this._controls['isActive'].value,
      countryName: this._controls['countryName'].value,
      countryIcon: this._controls['countryIcon'].value,
      colorCode: this._controls['colorCode'].value,
    };
    if (sendingItem.id == 0) {
      
      this.brokerService.create(sendingItem, 'Broker').subscribe((it) => {
        this.showToast(it.success, it.message);
        if (it.success) {
          this.get(it.data);
        }
      });
    } else {
      this.brokerService
        .update(sendingItem.id, sendingItem, 'Broker')
        .subscribe((it) => {
          this.showToast(it.success, it.message);
          if (it.success) {
            this.get(this.item.id);
          }
        });
    }
    this.color = this.item.colorCode;
  }
  get _controls() {
    if (this.formGroup) {
      return this.formGroup.controls;
    } else {
      return false;
    }
  }

  showToast(res: boolean, message: string) {
    res
      ? this.toastr.success(message, 'موفق !', {
          closeButton: true,
          positionClass: 'toast-top-left',
        })
      : this.toastr.error(message, 'خطا !', {
          closeButton: true,
          positionClass: 'toast-top-left',
        });
  }
  // Tags

  addTagsData: tagRelationModel[] = new Array<tagRelationModel>();

  tags: Tag[] = new Array<Tag>();
  tagItems: tagModel[] = new Array<tagModel>();
  selectedTags: Tag[] = new Array<Tag>();
  async getTags() {
    const res = this.brokerService.getTags().pipe(
      map((it) => {
        this.tagItems = it.data.items;

        return { res: it.success, message: it.message };
      })
    );
    const tagsRes = await lastValueFrom(res);
    return tagsRes;
  }
  pushSectionItem() {
    this.tagItems.forEach((x) => {
      let index = this.item.linkTags.findIndex((i) => i.value == x.id);
      if (index != -1) {
        this.selectedTags.push({ name: x.title, code: x.id });

        this.tags.unshift({ name: x.title, code: x.id });
      } else {
        this.tags.push({ name: x.title, code: x.id });
      }
    });
  }
  setTags() {
    let counter = 0;
    this.selectedTags.forEach((x) => {
      this.addTagsData.push({
        linkTagID: x.code,
        rowID: this.item.id,
        tableType: 36,
      });
      counter++;
    });
    if (this.selectedTags.length == 0) {
      this.deleteTags();
    } else {
      this.addTags();
    }
  }
  addTags() {
    this.brokerService
      .create(this.addTagsData, 'LinkTagRelation/AddUpdateLinkTagRelations')
      .subscribe((data) => {
        if (data.success) {
          this._router.navigateByUrl('/cnt/brokers/1', {
            skipLocationChange: true,
          });
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
  deleteTags() {
    this.brokerService
      .create(
        { rowID: this.item.id, tableType: 36 },
        'LinkTagRelation/DeleteLinkTagRelations'
      )
      .subscribe((data) => {
        if (data.success) {
          this._router.navigateByUrl('/cnt/brokers/1', {
            skipLocationChange: true,
          });
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
  // confirm(id: number) {
  //   if (id == undefined) {
  //     this.getReadyForPost();
  //   } else {
  //   }
  // }
  changeNavId(event: string) {
    this.navId = parseInt(event.split('-')[2]);
  }
}
