import { Base } from 'src/app/shared/models/Base/base.model';
import { BrokerItem } from './broker-item.model';

export class BrokerModel extends Base {
  description: string = '';
  updateDate: string;
  createDate: string;
  createBy: number;
  updateBy: number;
  brief: string;
  publishDate: string;
  cardImagePath: string = '';
  secondCardImagePath: string = '';
  thirdCardImagePath: string = '';
  secondTitle: string;
  isRTL: boolean = false;
  metaDescription: string;
  browserTitle: string;
  studyTime: string;
  countryIcon: string;
  countryName: string;
  authorAccepted: boolean = false;
  managementAccepted: boolean = false;
  seoAccepted: boolean = false;
  isIRSupport: boolean = false;
  referralLink: string;
  staticRate: number;
  colorCode : string;
  linkTags: [
    {
      title: string;
      value: number;
    }
  ];
  sharpLinkTags: [
    {
      title: string;
      value: number;
    }
  ];
  faQs: [
    {
      id: number;
      question: string;
      answer: string;
      orderID: number;
    }
  ];
  author: string;
  items: Array<BrokerItem>;
  leverage: number;
  minDeposit: number;
  authorIconExists: boolean = false;
  fileExists: boolean = false;
  authorIconPath: string;
  establishedYear: string;
  phoneNumber: string;
  email: string;
  accountCent: boolean = false;
  tradingSymbols: string;
  telegramSupportLink: string;
  isPersianSupport: boolean = false;
  copyTrade: boolean = false;
  videoLink: string;
  webSiteLink: string;
  advantages: string;
  disAdvantages: string;
}
