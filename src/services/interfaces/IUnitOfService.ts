import IHttpService from './IHttpService';
import IAccountService from './IAccountService';
import IDateTimeService from './IDateTimeService';
import IErrorHandlerService from './IErrorHandlerService';
import INewsletterService from './INewsletterService';
import IUserListService from './IUserListService.ts';
import IEmailService from './IEmailService';
import IProductService from './IProductService';
import ICategoryService from './ICategoryService';
import IProductVariantService from './IProductVariantService';
import IProductAttributeService from './IProductAttributeService';
import IAttributeService from './IAttributeService';
import IBrandNameService from './IBrandNameService';
import IDashboardService from './IDashboardService';
import IStaffSalaryService from './IStaffSalaryService';
import IStaffService from './IStaffService';
import IStoreService from './IStoreService';

export default interface IUnitOfService {
  HttpService: IHttpService;
  AccountService: IAccountService;
  DateTimeService: IDateTimeService;
  NewsletterService: INewsletterService;
  EmailService: IEmailService;
  ErrorHandlerService: IErrorHandlerService;
  UserListService: IUserListService;
  ProductService: IProductService;
  CategoryService: ICategoryService;
  ProductVariantService: IProductVariantService;
  ProductAttributeService: IProductAttributeService;
  AttributeService: IAttributeService;
  BrandNameService: IBrandNameService;
  DashboardService: IDashboardService;
  StaffSalaryService: IStaffSalaryService;
  StaffService: IStaffService;
  StoreService: IStoreService;
}
