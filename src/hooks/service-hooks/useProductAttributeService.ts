import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import { CreateProductAttributeModel, UpdateProductAttributeModel } from '@/models/product-attribute.model';
import { ProductAttributeFilterParams } from '@/params/product.params';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const useCreateProductAttribute = () => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (model: CreateProductAttributeModel) =>
            unitOfService.ProductAttributeService.create(model),
        onSettled: (response) => {
            if (response && response.status === 201) {
                queryClient.invalidateQueries({ queryKey: ['ProductAttributeService.getByProductId'] });
            }
        },
        onError: (error) => error,
    });
};

const useGetAttributesByProductId = (productId: number | string, enabled: boolean = true) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    return useQuery({
        queryKey: ['ProductAttributeService.getByProductId', productId],
        queryFn: () => unitOfService.ProductAttributeService.getByProductId(productId),
        enabled: enabled && !!productId,
    });
};

const useGetProductAttributeById = (id: number | string, enabled: boolean = true) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    return useQuery({
        queryKey: ['ProductAttributeService.getById', id],
        queryFn: () => unitOfService.ProductAttributeService.getById(id),
        enabled: enabled && !!id,
    });
};

type UpdateProductAttributeArgs = { id: number | string; model: UpdateProductAttributeModel };

const useUpdateProductAttribute = () => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, model }: UpdateProductAttributeArgs) =>
            unitOfService.ProductAttributeService.update(id, model),
        onSettled: (response) => {
            if (response && response.status === 200) {
                queryClient.invalidateQueries({ queryKey: ['ProductAttributeService.getByProductId'] });
            }
        },
        onError: (error) => error,
    });
};

const useDeleteProductAttribute = () => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => unitOfService.ProductAttributeService.delete(id),
        onSettled: (response) => {
            if (response && response.status === 204) {
                queryClient.invalidateQueries({ queryKey: ['ProductAttributeService.getByProductId'] });
            }
        },
        onError: (error) => error,
    });
};

const useGetAllProductAttributes = (params?: ProductAttributeFilterParams, enabled: boolean = true) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    return useQuery({
        queryKey: ['ProductAttributeService.getAll', params],
        queryFn: async () => {
            return await unitOfService.ProductAttributeService.getAll(params);
        },
        enabled,
    });
};

export {
    useCreateProductAttribute,
    useGetAllProductAttributes,
    useGetAttributesByProductId,
    useGetProductAttributeById,
    useUpdateProductAttribute,
    useDeleteProductAttribute,
};
