import { injectable } from 'inversify';
import { AxiosResponse } from 'axios';
import { TYPES } from '@/config/types';
import { container } from '@/config/ioc';
import IHttpService from './interfaces/IHttpService';
import IProductAttributeService from './interfaces/IProductAttributeService';
import { ProductAttributeDto } from '@/dtos/product-attribute.dto';
import { CreateProductAttributeModel, UpdateProductAttributeModel } from '@/models/product-attribute.model';
import Response from '@/dtos/Response';
import { ProductAttributeFilterParams } from '@/params/product.params';
import { ListResponseDto } from '@/dtos/list-response.dto';

@injectable()
export default class ProductAttributeService implements IProductAttributeService {
    private readonly httpService: IHttpService;

    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(params?: ProductAttributeFilterParams): Promise<AxiosResponse<Response<ListResponseDto<ProductAttributeDto>>>> {
        return this.httpService
            .call()
            .get<ListResponseDto<ProductAttributeDto>, AxiosResponse<Response<ListResponseDto<ProductAttributeDto>>>>(
                '/product-attributes', { params }
            );
    }

    create(model: CreateProductAttributeModel): Promise<AxiosResponse<Response<ProductAttributeDto>>> {
        return this.httpService
            .call()
            .post<ProductAttributeDto, AxiosResponse<Response<ProductAttributeDto>>>('/product-attributes', model);
    }

    getByProductId(productId: number | string): Promise<AxiosResponse<Response<ProductAttributeDto[]>>> {
        return this.httpService
            .call()
            .get<ProductAttributeDto[], AxiosResponse<Response<ProductAttributeDto[]>>>(
                `/product-attributes/product/${productId}`
            );
    }

    getById(id: number | string): Promise<AxiosResponse<Response<ProductAttributeDto>>> {
        return this.httpService
            .call()
            .get<ProductAttributeDto, AxiosResponse<Response<ProductAttributeDto>>>(
                `/product-attributes/${id}`
            );
    }

    update(id: number | string, model: UpdateProductAttributeModel): Promise<AxiosResponse<Response<ProductAttributeDto>>> {
        return this.httpService
            .call()
            .put<ProductAttributeDto, AxiosResponse<Response<ProductAttributeDto>>>(
                `/product-attributes/${id}`,
                model
            );
    }

    delete(id: number | string): Promise<AxiosResponse<Response<void>>> {
        return this.httpService
            .call()
            .delete<void, AxiosResponse<Response<void>>>(`/product-attributes/${id}`);
    }
}
