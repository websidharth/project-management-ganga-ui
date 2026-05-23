import { Roles } from '@/enums/roles.enum';
import { MdDashboard, MdSettings, MdSend, MdPerson, MdList } from 'react-icons/md';
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
    id: 'product-attributes',
    title: 'Product Attributes',
    icon: MdSend,
    url: '/admin/product-attributes/',
    role: [Roles.ADMIN],
    isActive: false,
  },
  {
    id: 'product-variants',
    title: 'Product Variants',
    icon: MdSend,
    url: '/admin/product-variants/',
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
    id: 'settings',
    title: 'Settings',
    icon: MdSettings,
    url: '',
    role: [Roles.ADMIN],
    isActive: true,
    submenu: [
      {
        id: 'DashboardPreferences',
        title: 'Dashboard Preferences',
        icon: MdSettings,
        url: '/CreateList',
        role: [Roles.ADMIN],
        isActive: false,
      },
      // {
      //     id: "Rating/ReviewProcess",
      //     title: "Rating/Review Process",
      //     icon: faStar,
      //     url: "",
      //
      //     subsubmenu: [
      //         {
      //             id: "ReviewLinks",
      //             title: "Review Links",
      //             icon: faDash,
      //             url: "/smm-list",
      //             class: ""
      //         },
      //         {
      //             id: "EmailSettings",
      //             title: "Email Settings",
      //             icon: faDash,
      //             url: "",
      //             class: ""
      //         },
      //         {
      //             id: "QRSettings",
      //             title: "QR Settings",
      //             icon: faDash,
      //             url: "",
      //             class: ""
      //         },

      //         {
      //             id: "Scheduler",
      //             title: "Scheduler",
      //             icon: faDash,
      //             url: "",
      //             class: ""
      //         }
      //         ,
      //     ]
      // },
      // {
      //     id: "Testimonials",
      //     title: "Testimonials",
      //     icon: faPaperPlane,
      //     url: "",
      //
      //     subsubmenu: [

      //         {
      //             id: "Approve/ignoreratings",
      //             title: "Approve/ignore ratings",
      //             icon: faDash,
      //             url: "",
      //             class: ""
      //         },
      //         {
      //             id: "TestimonialPreferences",
      //             title: "Testimonial Preferences",
      //             icon: faDash,
      //             url: "",
      //             class: ""
      //         }, {
      //             id: "QRcode",
      //             title: "QR code",
      //             icon: faDash,
      //             url: "",
      //             class: ""
      //         }
      //     ]
      // },
    ],
  },

  // {
  //     id: "setting",
  //     title: "Setting",
  //     icon: faGearComplex,
  //     url: "/setting",
  //     class: ""
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
      {
        id: 'myTemplates',
        title: 'Templates',
        icon: MdList,
        url: '/dashboard/my-templates',
        role: [Roles.USER],
        isActive: false,
      },
    ],
  },
];
