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
  privilege?: string;
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
  privilege?: string;
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
      privilege: 'Dashboard-Full Premission',
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
      privilege: 'sub-list-profit-Full Premission',
    },

    // {
    //   name: 'مشتریان من',
    //   description: 'پروفایل',
    //   navType: 'link',
    //   icon: 'i-Add-UserStar',
    //   state: '/mrk/sub-user',
    //   privilege: 'Subuser-Full Premission',
    // },
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

    // {
    //   name: 'مشتریان من',
    //   navType: 'dropDown',
    //   icon: 'i-Add-UserStar',
    //   privilege: 'Subuser-Full Premission',
    //   sub: [
    //     {
    //       icon: 'i-File-Horizontal-Text',
    //       name: 'license',
    //       state: '/dashboard/referral-user',
    //       navType: 'link',
    //       privilege: 'Subuser-Full Premission',
    //     },
    //     // {
    //     //   icon: 'i-File-Horizontal-Text',
    //     //   name: 'investor',
    //     //   state: '/dashboard/referral-user',
    //     //   navType: 'link',
    //     //   privilege:'Subuser-Full Premission'
    //     // },
    //     // {
    //     //   icon: 'i-File-Horizontal-Text',
    //     //   name: 'IB',
    //     //   state: '/dashboard/referral-user',
    //     //   navType: 'link',
    //     //   privilege:'Subuser-Full Premission'
    //     // },
    //   ],
    // },

    {
      name: 'سودها',
      navType: 'link',
      icon: 'i-Dollar',
      state: '/crt/profits',
      privilege: 'profits-Full Premission',
    },
    {
      name: 'سفارشات',
      navType: 'link',
      icon: 'i-Library',
      privilege: 'Orders-Watch',
      state: '/bsk/orders',
    },

    {
      name: 'محصولات',
      navType: 'link',
      icon: 'i-Checkout-Basket',
      state: '/prd/products-list',
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
      state: '/cnt/article',
      privilege: 'ArticleT-Watch',
    },
    {
      name: 'آپلود سنتر',
      navType: 'link',
      icon: 'i-Share-on-Cloud',
      state: '/mcm/upload-center',
      privilege: 'Upload-Center-Full Premission',
    },
    {
      name: '*',
      navType: 'link',
      icon: 'i-Video-2',
      state: '/mcm/media-list',
      privilege: 'Media-Full Premission',
    },
    {
      name: 'گروه ها',
      navType: 'link',
      icon: 'i-Dropbox',
      state: '/bas/group',
      privilege: 'Group-Full Premission',
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
      privilege: 'CalendarEvent-Full Premission',
    },
    {
      name: '  دسترسی ها',
      navType: 'link',
      icon: 'i-Gears',
      state: '/sec/permissions',
      privilege: 'permissions-Full Premission',
    },
    {
      name: 'کاربران',
      navType: 'link',
      icon: 'i-Business-ManWoman',
      state: '/sec/user-management',
      privilege: 'UserManangment-Full Premission',
    },
    {
      name: 'درخواست مشتریان',
      navType: 'link',
      icon: 'i-Love-User',
      state: '/shr/user-need',
      privilege: 'CustomerRequest-Full Premission',
    },
    {
      name: 'تخفیف ها',
      navType: 'link',
      icon: 'i-Dollar-Sign',
      state: '/dct/discount',
      privilege: 'Comment-Full Premission',
    },

    {
      name: 'نوشته ها',
      navType: 'link',
      icon: 'i-Speach-Bubbles',
      state: '/shr/comment',
      privilege: 'Comment-Full Premission',
    },

    {
      icon: 'i-ID-3',
      name: 'سفارشات من',
      state: '/bsk/user-orders',
      navType: 'link',
      privilege: 'CheckOrders-Full Premission',
    },
    {
      name: 'نظرات من',
      navType: 'link',
      icon: 'i-Speach-Bubble-3',
      state: '/shr/user-Comments',
      privilege: 'comment-user-Special-Premission',
    },

    // {
    //     name: 'Data Tables',
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    //     navType: 'dropDown',
    //     icon: 'i-File-Horizontal-Text',
    //     sub: [
    //         { icon: 'i-File-Horizontal-Text', name: 'List', state: '/tables/list', navType: 'link' },
    //         { icon: 'i-Full-View-Window', name: 'Fullscreen', state: '/tables/full', navType: 'link' },
    //         { icon: 'i-Code-Window', name: 'Paging', state: '/tables/paging', navType: 'link' },
    //         { icon: 'i-Filter-2', name: 'Filter', state: '/tables/filter', navType: 'link' },
    //     ]
    // },
    // {
    //     name: 'Sessions',
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    //     navType: 'dropDown',
    //     icon: 'i-Administrator',
    //     sub: [
    //         { icon: 'i-Add-User', name: 'Sign up', state: '/sessions/signup', navType: 'link' },
    //         { icon: 'i-Checked-User', name: 'Sign in', state: '/sessions/signin', navType: 'link' },
    //         { icon: 'i-Find-User', name: 'Forgot', state: '/sessions/forgot', navType: 'link' }
    //     ]
    // },
    // {
    //     name: 'Pages',
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    //     navType: 'dropDown',
    //     icon: 'i-Windows-2',
    //     sub: [
    //         { icon: 'i-Male', name: 'User Profile', state: '/pages/profile', navType: 'link' }
    //     ]
    // },
    // {
    //     name: 'Icons',
    //     description: '600+ premium icons',
    //     navType: 'link',
    //     icon: 'i-Cloud-Sun',
    //     state: '/icons/iconsmind'
    // },
    // {
    //     name: 'Others',
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    //     navType: 'dropDown',
    //     icon: 'i-Double-Tap',
    //     sub: [
    //         { icon: 'i-Error-404-Window', name: 'Not found', state: '/others/404', navType: 'link' }
    //     ]
    // },
    // {
    //     name: 'Doc',
    //     navType: 'extLink',
    //     tooltip: 'Documentation',
    //     icon: 'i-Safe-Box1',
    //     state: 'http://demos.ui-lib.com/gull-doc'
    // }
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
