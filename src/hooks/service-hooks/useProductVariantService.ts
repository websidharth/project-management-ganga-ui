import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import { CreateProductVariantModel, UpdateProductVariantModel } from '@/models/product-variant.model';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const useCreateProductVariant = () => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (model: CreateProductVariantModel) =>
            unitOfService.ProductVariantService.create(model),
        onSettled: (response) => {
            if (response && response.status === 201) {
                queryClient.invalidateQueries({ queryKey: ['ProductVariantService.getAll'] });
                queryClient.invalidateQueries({ queryKey: ['ProductVariantService.getByProductId'] });
            }
        },
        onError: (error) => error,
    });
};

const useGetAllProductVariants = (enabled: boolean = true) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    return useQuery({
        queryKey: ['ProductVariantService.getAll'],
        queryFn: () => unitOfService.ProductVariantService.getAll(),
        enabled,
    });
};

const useGetVariantsByProductId = (productId: number | string, enabled: boolean = true) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    return useQuery({
        queryKey: ['ProductVariantService.getByProductId', productId],
        queryFn: () => unitOfService.ProductVariantService.getByProductId(productId),
        enabled: enabled && !!productId,
    });
};

const useGetProductVariantById = (id: number | string, enabled: boolean = true) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    return useQuery({
        queryKey: ['ProductVariantService.getById', id],
        queryFn: () => unitOfService.ProductVariantService.getById(id),
        enabled: enabled && !!id,
    });
};

type UpdateProductVariantArgs = { id: number | string; model: UpdateProductVariantModel };

const useUpdateProductVariant = () => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, model }: UpdateProductVariantArgs) =>
            unitOfService.ProductVariantService.update(id, model),
        onSettled: (response) => {
            if (response && response.status === 200) {
                queryClient.invalidateQueries({ queryKey: ['ProductVariantService.getAll'] });
                queryClient.invalidateQueries({ queryKey: ['ProductVariantService.getByProductId'] });
            }
        },
        onError: (error) => error,
    });
};

const useDeleteProductVariant = () => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => unitOfService.ProductVariantService.delete(id),
        onSettled: (response) => {
            if (response && response.status === 204) {
                queryClient.invalidateQueries({ queryKey: ['ProductVariantService.getAll'] });
                queryClient.invalidateQueries({ queryKey: ['ProductVariantService.getByProductId'] });
            }
        },
        onError: (error) => error,
    });
};

export {
    useCreateProductVariant,
    useGetAllProductVariants,
    useGetVariantsByProductId,
    useGetProductVariantById,
    useUpdateProductVariant,
    useDeleteProductVariant,
};
