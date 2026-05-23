import { injectable } from 'inversify';
import { TYPES } from '@/config/types';
import { container } from '@/config/ioc';

import IUnitOfService from './interfaces/IUnitOfService';
import IHttpService from './interfaces/IHttpService';
import IAccountService from './interfaces/IAccountService';
import IDateTimeService from './interfaces/IDateTimeService';
import IErrorHandlerService from './interfaces/IErrorHandlerService';
import IUserListService from './interfaces/IUserListService.ts';
import INewsletterService from './interfaces/INewsletterService';
import IEmailService from './interfaces/IEmailService';
import IProductService from './interfaces/IProductService';
import ICategoryService from './interfaces/ICategoryService';
import IProductVariantService from './interfaces/IProductVariantService';
import IProductAttributeService from './interfaces/IProductAttributeService';
import IAttributeService from './interfaces/IAttributeService';
import IBrandNameService from './interfaces/IBrandNameService';
import IDashboardService from './interfaces/IDashboardService';
import IStaffSalaryService from './interfaces/IStaffSalaryService';
import IStaffService from './interfaces/IStaffService';
import BrandNameService from './BrandNameService';

@injectable()
export default class UnitOfService implements IUnitOfService {
  public HttpService: IHttpService;
  public AccountService: IAccountService;
  public DateTimeService: IDateTimeService;
  public NewsletterService: INewsletterService;
  public UserListService: IUserListService;
  public EmailService: IEmailService;
  public ErrorHandlerService: IErrorHandlerService;
  public ProductService: IProductService;
  public CategoryService: ICategoryService;
  public ProductVariantService: IProductVariantService;
  public ProductAttributeService: IProductAttributeService;
  public AttributeService: IAttributeService;
  public BrandNameService: IBrandNameService;
  public DashboardService: IDashboardService;
  public StaffSalaryService: IStaffSalaryService;
  public StaffService: IStaffService;

  constructor(
    httpService = container.get<IHttpService>(TYPES.IHttpService),
    accountService = container.get<IAccountService>(TYPES.IAccountService),
    dateTimeService = container.get<IDateTimeService>(TYPES.IDateTimeService),
    newsletterService = container.get<INewsletterService>(TYPES.INewsletterService),
    emailService = container.get<IEmailService>(TYPES.IEmailService),
    errorHandlerService = container.get<IErrorHandlerService>(TYPES.IErrorHandlerService),
    userListService = container.get<IUserListService>(TYPES.IUserListService),
    productService = container.get<IProductService>(TYPES.IProductService),
    categoryService = container.get<ICategoryService>(TYPES.ICategoryService),
    productVariantService = container.get<IProductVariantService>(TYPES.IProductVariantService),
    productAttributeService = container.get<IProductAttributeService>(TYPES.IProductAttributeService),
    attributeService = container.get<IAttributeService>(TYPES.IAttributeService),
    brandNameService = container.get<IBrandNameService>(TYPES.IBrandNameService),
    dashboardService = container.get<IDashboardService>(TYPES.IDashboardService),
    staffSalaryService = container.get<IStaffSalaryService>(TYPES.IStaffSalaryService),
    staffService = container.get<IStaffService>(TYPES.IStaffService)
  ) {
    this.HttpService = httpService;
    this.AccountService = accountService;
    this.DateTimeService = dateTimeService;
    this.NewsletterService = newsletterService;
    this.EmailService = emailService;
    this.ErrorHandlerService = errorHandlerService;
    this.UserListService = userListService;
    this.ProductService = productService;
    this.CategoryService = categoryService;
    this.ProductVariantService = productVariantService;
    this.ProductAttributeService = productAttributeService;
    this.AttributeService = attributeService;
    this.BrandNameService = brandNameService;
    this.DashboardService = dashboardService;
    this.StaffSalaryService = staffSalaryService;
    this.StaffService = staffService;
  }
}
