import { Roles } from '@/enums/roles.enum';
import { MdDashboard, MdList, MdPeople, MdPerson, MdReceipt, MdSend, MdShoppingCart, MdStore } from 'react-icons/md';
import { TbTemplate } from 'react-icons/tb';

export interface SideBarMenuDto {
  id: string;
  title: string;
  icon: any; // React component from react-icons
  url: string;
  class?: string;
  submenu?: SideBarSubMenuDto[];
  isActive?: boolean;
  role: string[];
}
export interface SideBarSubMenuDto {
  id: string;
  title: string;
  icon: any;
  url: string;
  class?: string;
  subsubmenu?: SideBarSubSubMenuDto[];
  role: string[];
  isActive?: boolean;
}

export interface SideBarSubSubMenuDto {
  id: string;
  title: string;
  icon: any;
  url: string;
  class?: string;
  role: string[];
  isActive?: boolean;
}

export const SideBarMenu: SideBarMenuDto[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: MdDashboard,
    url: '/dashboard',
    isActive: false,
    role: [Roles.USER],
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: MdDashboard,
    url: '/admin',
    isActive: false,
    role: [Roles.ADMIN],
  },
  {
    id: 'products',
    title: 'Products',
    icon: TbTemplate,
    url: '/admin/products/',
    role: [Roles.ADMIN],
    isActive: false,
  },
  {
    id: 'attributes',
    title: 'Attributes',
    icon: TbTemplate,
    url: '/admin/attributes/',
    role: [Roles.ADMIN],
    isActive: false,
  },

  {
    id: 'categories',
    title: 'Categories',
    icon: MdSend,
    url: '/admin/categories/',
    role: [Roles.ADMIN],
    isActive: false,
  },

  {
    id: 'brand-names',
    title: 'Brand Names',
    icon: MdList,
    url: '/admin/brand-names/',
    role: [Roles.ADMIN],
    isActive: false,
  },
  {
    id: 'positions',
    title: 'Positions',
    icon: MdList,
    url: '/admin/positions/',
    role: [Roles.ADMIN],
    isActive: false,
  },
  {
    id: 'departments',
    title: 'Departments',
    icon: TbTemplate,
    url: '/admin/departments/',
    role: [Roles.ADMIN],
    isActive: false,
  },
  {
    id: 'orders',
    title: 'Orders',
    icon: MdShoppingCart,
    url: '/admin/orders/',
    role: [Roles.ADMIN],
    isActive: false,
  },
  {
    id: 'purchase',
    title: 'Purchase',
    icon: MdReceipt,
    url: '/admin/purchase/',
    role: [Roles.ADMIN],
    isActive: false,
  },
  {
    id: 'staff',
    title: 'Staff',
    icon: MdPeople,
    url: '/admin/staff/',
    role: [Roles.ADMIN],
    isActive: false,
  },

  {
    id: 'stores',
    title: 'Stores',
    icon: MdStore,
    url: '/admin/stores/',
    role: [Roles.SUPER_ADMIN],
    isActive: false,
  },
  {
    id: 'users',
    title: 'Users',
    icon: MdPerson,
    url: '/admin/users/',
    role: [Roles.ADMIN],
    isActive: false,
  },
  {
    id: 'admin-profile',
    title: 'Profile Settings',
    icon: MdPerson,
    url: '/admin/settings/profile',
    role: [Roles.ADMIN, Roles.SUPER_ADMIN],
    isActive: false,
  },
  // {
  //     id: "newsletter",
  //     title: "Newsletter",
  //     icon: MdPerson,
  //     url: "",
  //     role: [Roles.ADMIN],
  //     isActive: true,
  //     submenu: [
  //         {
  //             id: "email-sent",
  //             title: "Email Sent",
  //             icon: MdPerson,
  //             url: "/admin/email-sent",
  //             role: [Roles.ADMIN],
  //             isActive: false,
  //             subsubmenu: [
  //                 {
  //                     id: "SendNewsletter2",
  //                     title: "Send Newsletter",
  //                     icon: MdSend,
  //                     url: "/send-newsletter",
  //                     role: [Roles.ADMIN],
  //                     isActive: false,
  //                 }
  //             ]
  //         },

  //     ]
  // },
  {
    id: 'user',
    title: 'Sidharth Kumar',
    icon: MdPerson,
    url: '',
    role: [Roles.USER],
    isActive: true,
    submenu: [
      {
        id: 'profile',
        title: 'Profile',
        icon: MdList,
        url: '/dashboard/edit-profile',
        role: [Roles.USER],
        isActive: false,
      },
    ],
  },
];
