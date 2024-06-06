import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IMenuItem {
  id?: string;
  title?: string;
  description?: string;
  navType: string; // Possible values: link/dropDown/extLink
  name?: string; // Used as display text for item and title for separator navType
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
  active?: boolean;
  privilege?: any;
}
export interface IChildItem {
  id?: string;
  parentId?: string;
  navType?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
  active?: boolean;
  privilege?: any;
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

interface ISidebarState {
  sidenavOpen?: boolean;
  childnavOpen?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  public sidebarState: ISidebarState = {
    sidenavOpen: true,
    childnavOpen: false,
  };
  selectedItem: IMenuItem;

  constructor() {}

  defaultMenu: IMenuItem[] = [
    {
      name: 'صفحه اصلی',
      description: 'داشبورد مدیریتی ایرانی اکسپرت',
      navType: 'link',
      icon: 'i-Home1',
      state: '/dashboard/v1',
      privilege: 'Dashboard-Full',
    },
    {
      name: 'پروفایل من',
      description: 'پروفایل',
      navType: 'link',
      icon: 'i-Administrator',
      state: '/dashboard/user-profile',
      privilege: 'UserProfile-Full',
    },
    {
      name: 'مشتریان من',
      description: 'پروفایل',
      navType: 'link',
      icon: 'i-Add-UserStar',
      state: '/mrk/sub-list-profit',
      privilege: 'MySubscribers-Full',
    },

    {
      name: '*',
      description: '',
      navType: '',
      icon: '',
      state: '/prd/addUpdate/:productId',
      privilege: 'SingleProduct-Watch',
    },
    {
      name: '*',
      description: '',
      navType: '',
      icon: '',
      state: '/prd/addUpdate',
      privilege: 'ProductT-Add',
    },
    {
      name: '*',
      description: '',
      navType: '',
      icon: '',
      state: '/cnt/article/addUpdate-article/:articleId',
      privilege: 'ArticleSingleT-Watch',
    },
    {
      name: '*',
      description: '',
      navType: '',
      icon: '',
      state: '/cnt/article/addUpdate-article',
      privilege: 'ArticleT-Add',
    },

    {
      name: 'کمیسیون ها',
      navType: 'link',
      icon: 'i-Dollar',
      state: '/crt/profits',
      privilege: 'Comissions-Contracts-Watch',
    },
    {
      name: 'سفارشات',
      navType: 'link',
      icon: 'i-Library',
      privilege: 'Orders-Watch',
      state: '/bsk/orders/1',
    },

    {
      name: 'محصولات',
      navType: 'link',
      icon: 'i-Checkout-Basket',
      state: '/prd/products-list/1',
      privilege: 'ProductT-Watch',
    },

    {
      name: 'بنرها',
      navType: 'link',
      icon: 'i-Landscape',
      state: '/cnt/banner',
      privilege: 'Banners-Watch',
    },
    {
      name: 'مقالات',
      navType: 'link',
      icon: 'i-File-Edit',
      state: '/cnt/article/1',
      privilege: 'ArticleT-Watch',
    },
    {
      name: 'بروکر ها',
      navType: 'link',
      icon: 'pi pi-bitcoin',
      state: '/cnt/brokers/broker-list',
      privilege: 'Brokers-Watch',
    },
    {
      name: 'تگ ها',
      navType: 'link',
      icon: 'i-Tag-2',
      state: 'cnt/tags',
      privilege: 'Tags-Watch',
    },
    {
      name: 'آپلود سنتر',
      navType: 'link',
      icon: 'i-Share-on-Cloud',
      state: '/mcm/media-list',
      privilege: 'Upload-Center-Full',
    },
    {
      name: '*',
      navType: 'link',
      icon: 'i-Video-2',
      state: '/mcm/media-list',
      privilege: 'Media-Full Premission',
    },
    {
      name: 'ریدایرکشن',
      navType: 'link',
      icon: 'i-Share',
      state: '/urv',
      privilege: 'URV-Watch',
    },
    {
      name: 'گروه ها',
      navType: 'link',
      icon: 'i-Dropbox',
      state: '/bas/group/1',
      privilege: 'Groups-Watch',
    },
    {
      name: 'فعالیت ها',
      description: '',
      navType: 'link',
      icon: 'i-Clock-Forward',
      state: '/log-info',
      privilege: 'Logs-Watch',
    },
    {
      name: 'تقویم اقتصادی',
      description: '',
      navType: 'link',
      icon: 'i-Calendar-4',
      state: '/calendar',
      privilege: 'Calendar-Watch',
    },
    {
      name: 'امنیت پنل',
      navType: 'link',
      icon: 'i-Data-Security',
      state: '/sec/permissions',
      privilege: 'ManageSec-Watch',
    },
    {
      name: 'کاربران',
      navType: 'link',
      icon: 'i-Business-ManWoman',
      state: '/sec/user-management/1',
      privilege: 'User-Watch',
    },
    {
      name: 'درخواست مشتریان',
      navType: 'link',
      icon: 'i-Love-User',
      state: '/shr/user-need/1',
      privilege: 'CustomerRequest-Full',
    },
    {
      name: 'تخفیف ها',
      navType: 'link',
      icon: 'i-Dollar-Sign',
      state: '/dct/discount',
      privilege: 'Discount-Watch',
    },

    {
      name: 'نوشته ها',
      navType: 'link',
      icon: 'i-Speach-Bubbles',
      state: '/shr/writings',
      privilege: 'Writings-Watch',
    },

    {
      icon: 'i-ID-3',
      name: 'سفارشات من',
      state: '/bsk/user-orders',
      navType: 'link',
      privilege: 'UserProfile-Full',
    },
    {
      name: 'نظرات من',
      navType: 'link',
      icon: 'i-Speach-Bubble-3',
      state: '/shr/user-Comments',
      privilege: 'UserProfile-Full',
    },
  ];

  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // You can customize this method to supply different menu for
  // different user navType.
  // publishNavigationChange(menunavType: string) {
  //   switch (usernavType) {
  //     case 'admin':
  //       this.menuItems.next(this.adminMenu);
  //       break;
  //     case 'user':
  //       this.menuItems.next(this.userMenu);
  //       break;
  //     default:
  //       this.menuItems.next(this.defaultMenu);
  //   }
  // }
}
