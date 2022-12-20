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
      name: 'داشبورد',
      description: 'داشبورد مدیریتی ایرانی اکسپرت',
      type: 'link',
      icon: 'i-Dashboard',
      state: '/dashboard/v1',
      privilege:'Dashboard-Full Premission'
    },
    {
      name: 'پروفایل من',
      description: 'پروفایل',
      type: 'link',
      icon: 'i-Dashboard',
      state: '/dashboard/user-profile',
      privilege:'Dashboard-Full Premission'
    },
    {
      name: 'کاربران زیر مجموعه',
      type: 'link',
      icon: 'i-Add-UserStar',
      state: '/dashboard/referral-user',
      privilege:'Subuser-Full Premission'
    },
    {
      name: 'محصولات',
      type: 'link',
      icon: 'i-Checkout-Basket',
      state: '/prd/products-list',
      privilege:'Product-Full Premission'
    },
    {
      icon: 'i-File-Horizontal-Text',
      name: 'سفارشات من',
      state: '/bsk/user-orders',
      type: 'link',
      privilege:'CheckOrders-Full Premission'
    },
    {
      name: 'سفارشات',
      type: 'dropDown',
      icon: 'i-File-Horizontal-Text',
      privilege:'Orders-Full Premission',
      sub: [
        {
          icon: 'i-Sync',
          name: 'سفارش ها در حال بررسی',
          state: '/bsk/orders',
          type: 'link',
          privilege:'CheckOrders-Full Premission'
        },
        {
          icon: 'i-Yes',
          name: 'سفارش های تأیید شده',
          state: '/bsk/license',
          type: 'link',
          privilege:'ConfirmedOrders-Full Premission'
        },
        {
          icon: 'i-Yes',
          name: 'لایسنس ها',
          state: '/bsk/license/updates',
          type: 'link',
          privilege:'ConfirmedOrders-Full Premission'
        },
      ],
    },
    {
      name: 'کاربران',
      type: 'dropDown',
      icon: 'i-Administrator',
      privilege:'Users-Full Premission',
      sub: [
        {
          icon: 'i-Checked-User',
          name: 'نقش  کاربران',
          state: '/sec/user-role',
          type: 'link',
          privilege:'UserPlane-Full Premission'
        },
        {
          icon: 'i-Gear',
          name: 'مدیریت نقش  ها ',
          state: '/sec/role-management',
          type: 'link',
          privilege:'RoleManangment-Full Premission'
        },
        {
          icon: 'i-Business-Man',
          name: ' مدیریت کاربران ',
          state: '/sec/user-management',
          type: 'link',
          privilege:'UserManangment-Full Premission'
        },
        {
          icon: 'i-Gears',
          name: '  دسترسی نقش ها ',
          state: '/sec/privilege',
          type: 'link',
          privilege:'ControlRoles-Full Premission'
        },
        {
          icon: 'i-Add-UserStar',
          name: 'تخصیص دسترسی به کاربران',
          state: '/sec/user-privilege',
          type: 'link',
          privilege:'AddUserRole-Full Premission'
        },
      ],
    },
    {
      name: 'بنرها',
      type: 'link',
      icon: 'i-Tag-2',
      state: '/cnt/banner',
      privilege:'Banner-Full Premission'
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
      icon: 'i-Double-Tap',
      state: '/bas/group',
      privilege:'Group-Full Premission'
    },
    {
      name: 'درخواست مشتریان',
      type: 'link',
      icon: 'i-Love-User',
      state: '/shr/user-need',
      privilege:'CustomerRequest-Full Premission'
    },
    {
      name: 'نظرات',
      type: 'link',
      icon: 'i-Speach-Bubbles',
      state: '/shr/comment',
      privilege:'Comment-Full Premission'
    },
    {
      name: 'نظرات من',
      type: 'link',
      icon: 'i-Speach-Bubbles',
      state: '/shr/user-Comments',
      privilege:'comment-user-Special-Premission'
    },
    {
      name: 'همه کامنت ها',
      type: 'link',
      icon: 'i-Speach-Bubbles',
      state: '/shr/all-Comments',
      privilege:'all-comment-user-Special-Premission'
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
