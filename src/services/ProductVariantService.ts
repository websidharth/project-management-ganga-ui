import { injectable } from 'inversify';
import { AxiosResponse } from 'axios';
import { TYPES } from '@/config/types';
import { container } from '@/config/ioc';
import IHttpService from './interfaces/IHttpService';
import IProductVariantService from './interfaces/IProductVariantService';
import { ProductVariantDto } from '@/dtos/product-variant.dto';
import { CreateProductVariantModel } from '@/models/product-variant.model';
import Response from '@/dtos/Response';

@injectable()
export default class ProductVariantService implements IProductVariantService {
    private readonly httpService: IHttpService;

    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    create(model: CreateProductVariantModel): Promise<AxiosResponse<Response<ProductVariantDto>>> {
        return this.httpService
            .call()
            .post<ProductVariantDto, AxiosResponse<Response<ProductVariantDto>>>('/product-variants', model);
    }

    getAll(): Promise<AxiosResponse<Response<ProductVariantDto[]>>> {
        return this.httpService
            .call()
            .get<ProductVariantDto[], AxiosResponse<Response<ProductVariantDto[]>>>('/product-variants');
    }

    getByProductId(productId: number | string): Promise<AxiosResponse<Response<ProductVariantDto[]>>> {
        return this.httpService
            .call()
            .get<ProductVariantDto[], AxiosResponse<Response<ProductVariantDto[]>>>(`/product-variants/product/${productId}`);
    }

    getById(id: number | string): Promise<AxiosResponse<Response<ProductVariantDto>>> {
        return this.httpService
            .call()
            .get<ProductVariantDto, AxiosResponse<Response<ProductVariantDto>>>(`/product-variants/${id}`);
    }

    update(id: number | string, model: CreateProductVariantModel): Promise<AxiosResponse<Response<ProductVariantDto>>> {
        return this.httpService
            .call()
            .put<ProductVariantDto, AxiosResponse<Response<ProductVariantDto>>>(`/product-variants/${id}`, model);
    }

    delete(id: number | string): Promise<AxiosResponse<Response<void>>> {
        return this.httpService
            .call()
            .delete<void, AxiosResponse<Response<void>>>(`/product-variants/${id}`);
    }
}
