import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IMenuItem {
  id?: string;
  title?: string;
  description?: string;
  type: string; // Possible values: link/dropDown/extLink
  name?: string; // Used as display text for item and title for separator type
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
  type?: string;
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
      type: 'link',
      icon: 'i-Home1',
      state: '/dashboard/v1',
      privilege: 'Dashboard-Full Premission',
    },
    {
      name: 'پروفایل من',
      description: 'پروفایل',
      type: 'link',
      icon: 'i-Administrator',
      state: '/dashboard/user-profile',
      privilege: 'Dashboard-Full Premission',
    },

    // {
    //   name: 'مشتریان من',
    //   type: 'dropDown',
    //   icon: 'i-Add-UserStar',
    //   privilege: 'Subuser-Full Premission',
    //   sub: [
    //     {
    //       icon: 'i-File-Horizontal-Text',
    //       name: 'license',
    //       state: '/dashboard/referral-user',
    //       type: 'link',
    //       privilege: 'Subuser-Full Premission',
    //     },
    //     // {
    //     //   icon: 'i-File-Horizontal-Text',
    //     //   name: 'investor',
    //     //   state: '/dashboard/referral-user',
    //     //   type: 'link',
    //     //   privilege:'Subuser-Full Premission'
    //     // },
    //     // {
    //     //   icon: 'i-File-Horizontal-Text',
    //     //   name: 'IB',
    //     //   state: '/dashboard/referral-user',
    //     //   type: 'link',
    //     //   privilege:'Subuser-Full Premission'
    //     // },
    //   ],
    // },
    {
      name: 'محصولات',
      type: 'link',
      icon: 'i-Checkout-Basket',
      state: '/prd/products-list',
      privilege: 'Product-Full Premission',
    },
    {
      name: 'سفارشات',
      type: 'link',
      icon: 'i-Library',
      privilege: 'Orders-Full Premission',
      state: '/bsk/orders',
    },
    {
      icon: 'i-ID-3',
      name: 'سفارشات من',
      state: '/bsk/user-orders',
      type: 'link',
      privilege: 'CheckOrders-Full Premission',
    },

    {
      icon: 'i-Dollar-Sign-2',
      name: 'پورسانت',
      state: '/bsk/commission',
      type: 'link',
      privilege: 'CheckOrders-Full Premission',
    },

    {
      name: 'تخصیص دسترسی به کاربران',
      type: 'link',
      icon: 'i-Add-UserStar',
      state: '/sec/user-privilege',
      privilege: 'AddUserRole-Full Premission',
    },
    {
      name: '  دسترسی نقش ها ',
      type: 'link',
      icon: 'i-Gears',
      state: '/sec/privilege',
      privilege: 'ControlRoles-Full Premission',
    },
    {
      name: 'کاربران',
      type: 'link',
      icon: 'i-Business-ManWoman',
      state: '/sec/user-management',
      privilege: 'UserManangment-Full Premission',
    },
    {
      name: 'بنرها',
      type: 'link',
      icon: 'i-Tag-2',
      state: '/cnt/banner',
      privilege: 'Banner-Full Premission',
    },
    {
      name: 'مقالات',
      type: 'link',
      icon: 'i-File-Edit',
      state: '/cnt/article',
      privilege: 'Article-Full Premission',
    },

    {
      name: 'گروه ها',
      type: 'link',
      icon: 'i-Dropbox',
      state: '/bas/group',
      privilege: 'Group-Full Premission',
    },
    {
      name: 'درخواست مشتریان',
      type: 'link',
      icon: 'i-Love-User',
      state: '/shr/user-need',
      privilege: 'CustomerRequest-Full Premission',
    },
    {
      name: 'نظرات',
      type: 'link',
      icon: 'i-Speach-Bubbles',
      state: '/shr/comment',
      privilege: 'Comment-Full Premission',
    },
    {
      name: 'تخفیف ها',
      type: 'link',
      icon: 'i-Dollar-Sign',
      state: '/dct/discount',
      privilege: 'Comment-Full Premission',
    },

    {
      name: 'قرار داد ها',
      type: 'dropDown',
      icon: 'i-File-Horizontal-Text',
      privilege: 'Users-Full Premission',
      sub: [
        {
          icon: 'i-File-Clipboard-File--Text',
          name: 'لیست قرار دادها',
          state: '/crt/List',
          type: 'link',
          privilege: 'UserPlane-Full Premission',
        },
      ],
    },
    {
      name: 'نظرات من',
      type: 'link',
      icon: 'i-Speach-Bubble-3',
      state: '/shr/user-Comments',
      privilege: 'comment-user-Special-Premission',
    },
    {
      name: 'همه کامنت ها',
      type: 'link',
      icon: 'i-Speach-Bubbles',
      state: '/shr/all-Comments',
      privilege: 'all-comment-user-Full Premission',
    },

    // {
    //     name: 'Data Tables',
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    //     type: 'dropDown',
    //     icon: 'i-File-Horizontal-Text',
    //     sub: [
    //         { icon: 'i-File-Horizontal-Text', name: 'List', state: '/tables/list', type: 'link' },
    //         { icon: 'i-Full-View-Window', name: 'Fullscreen', state: '/tables/full', type: 'link' },
    //         { icon: 'i-Code-Window', name: 'Paging', state: '/tables/paging', type: 'link' },
    //         { icon: 'i-Filter-2', name: 'Filter', state: '/tables/filter', type: 'link' },
    //     ]
    // },
    // {
    //     name: 'Sessions',
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    //     type: 'dropDown',
    //     icon: 'i-Administrator',
    //     sub: [
    //         { icon: 'i-Add-User', name: 'Sign up', state: '/sessions/signup', type: 'link' },
    //         { icon: 'i-Checked-User', name: 'Sign in', state: '/sessions/signin', type: 'link' },
    //         { icon: 'i-Find-User', name: 'Forgot', state: '/sessions/forgot', type: 'link' }
    //     ]
    // },
    // {
    //     name: 'Pages',
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    //     type: 'dropDown',
    //     icon: 'i-Windows-2',
    //     sub: [
    //         { icon: 'i-Male', name: 'User Profile', state: '/pages/profile', type: 'link' }
    //     ]
    // },
    // {
    //     name: 'Icons',
    //     description: '600+ premium icons',
    //     type: 'link',
    //     icon: 'i-Cloud-Sun',
    //     state: '/icons/iconsmind'
    // },
    // {
    //     name: 'Others',
    //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    //     type: 'dropDown',
    //     icon: 'i-Double-Tap',
    //     sub: [
    //         { icon: 'i-Error-404-Window', name: 'Not found', state: '/others/404', type: 'link' }
    //     ]
    // },
    // {
    //     name: 'Doc',
    //     type: 'extLink',
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
  // different user type.
  // publishNavigationChange(menuType: string) {
  //   switch (userType) {
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
