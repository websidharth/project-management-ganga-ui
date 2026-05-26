import 'reflect-metadata';

import { Container } from 'inversify';
import { TYPES } from './types';

import IHttpService from '@/services/interfaces/IHttpService';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import IAccountService from '@/services/interfaces/IAccountService';
import IDateTimeService from '@/services/interfaces/IDateTimeService';
import IErrorHandlerService from '@/services/interfaces/IErrorHandlerService';

import HttpService from '@/services/HttpService';
import UnitOfService from '@/services/UnitOfService';
import DateTimeService from '@/services/DateTimeService';
import ErrorHandlerService from '@/services/ErrorHandlerService';
import IUserListService from '@/services/interfaces/IUserListService.ts';
import INewsletterService from '@/services/interfaces/INewsletterService';
import IEmailService from '@/services/interfaces/IEmailService';
import UserListService from '@/services/UserListService';
import AccountService from '@/services/AccountService';
import NewsletterService from '@/services/NewsletterService';
import EmailService from '@/services/EmailService';
import IProductService from '@/services/interfaces/IProductService';
import ProductService from '@/services/ProductService';
import ICategoryService from '@/services/interfaces/ICategoryService';
import CategoryService from '@/services/CategoryService';
import IProductVariantService from '@/services/interfaces/IProductVariantService';
import ProductVariantService from '@/services/ProductVariantService';
import IProductAttributeService from '@/services/interfaces/IProductAttributeService';
import ProductAttributeService from '@/services/ProductAttributeService';
import IAttributeService from '@/services/interfaces/IAttributeService';
import AttributeService from '@/services/AttributeService';
import IBrandNameService from '@/services/interfaces/IBrandNameService';
import BrandNameService from '@/services/BrandNameService';
import IDashboardService from '@/services/interfaces/IDashboardService';
import DashboardService from '@/services/DashboardService';
import IStaffSalaryService from '@/services/interfaces/IStaffSalaryService';
import StaffSalaryService from '@/services/StaffSalaryService';
import IStaffService from '@/services/interfaces/IStaffService';
import StaffService from '@/services/StaffService';
import IStoreService from '@/services/interfaces/IStoreService';
import StoreService from '@/services/StoreService';

const container = new Container();

container.bind<IHttpService>(TYPES.IHttpService).to(HttpService);
container.bind<IUnitOfService>(TYPES.IUnitOfService).to(UnitOfService);
container.bind<IAccountService>(TYPES.IAccountService).to(AccountService);
container.bind<IDateTimeService>(TYPES.IDateTimeService).to(DateTimeService);
container.bind<INewsletterService>(TYPES.INewsletterService).to(NewsletterService);
container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
container.bind<IErrorHandlerService>(TYPES.IErrorHandlerService).to(ErrorHandlerService);
container.bind<IUserListService>(TYPES.IUserListService).to(UserListService);
container.bind<IProductService>(TYPES.IProductService).to(ProductService);
container.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService);
container.bind<IProductVariantService>(TYPES.IProductVariantService).to(ProductVariantService);
container.bind<IProductAttributeService>(TYPES.IProductAttributeService).to(ProductAttributeService);
container.bind<IAttributeService>(TYPES.IAttributeService).to(AttributeService);
container.bind<IBrandNameService>(TYPES.IBrandNameService).to(BrandNameService);
container.bind<IDashboardService>(TYPES.IDashboardService).to(DashboardService);
container.bind<IStaffSalaryService>(TYPES.IStaffSalaryService).to(StaffSalaryService);
container.bind<IStaffService>(TYPES.IStaffService).to(StaffService);
container.bind<IStoreService>(TYPES.IStoreService).to(StoreService);

export { container };
