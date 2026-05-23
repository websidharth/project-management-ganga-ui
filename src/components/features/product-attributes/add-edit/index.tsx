'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { CreateProductAttributeModel } from '@/models/product-attribute.model';
import ProductAttributeSchema from '@/schema/productAttributeSchema';
import { useCreateProductAttribute, useGetProductAttributeById, useUpdateProductAttribute } from '@/hooks/service-hooks/useProductAttributeService';
import { useGetAllProducts } from '@/hooks/service-hooks/useProductService';
import { SelectSearch } from '@/components/common/select-search'; 
import { useGetAllAttributes } from '@/hooks/service-hooks/useAttributeService';

interface ManageProductAttributeProps {
  id?: number;
  defaultProductId?: number;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
}

export default function ManageProductAttribute({ id, defaultProductId, isOpen, onClose }: ManageProductAttributeProps) {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const isEdit = !!id && id > 0;

  const getAllAttributes = useGetAllAttributes();
  const getAllProducts = useGetAllProducts();
  const createAttribute = useCreateProductAttribute();
  const updateAttribute = useUpdateProductAttribute();
  const { data: attrResponse, isLoading: isFetching } = useGetProductAttributeById(id ?? 0, isEdit);

  const form = useForm<CreateProductAttributeModel>({
    resolver: yupResolver(ProductAttributeSchema),
    defaultValues: {
      productId: defaultProductId ?? 0,
      attributeId: 0,
      value: '',
    },
  });

  useEffect(() => {
    if (isEdit && attrResponse?.data?.data) {
      const a = attrResponse.data.data;
      form.reset({
        productId: a.productId,
        attributeId: a.attributeId,
        value: a.value,
      });
    }
  }, [isEdit, attrResponse, form]);

  const submitData = async (model: CreateProductAttributeModel) => {
    const response = isEdit
      ? await updateAttribute.mutateAsync({ id: id!, model: { attributeId: model.attributeId, value: model.value } })
      : await createAttribute.mutateAsync(model);

    if (response && (response.status === 200 || response.status === 201)) {
      toast({ variant: 'success', title: `Attribute ${isEdit ? 'updated' : 'created'} successfully` });
      onClose(true);
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast({ variant: 'destructive', title: 'Error', description: <span>{error}</span> });
    }
  };

  const isLoading = createAttribute.isPending || updateAttribute.isPending || isFetching;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Attribute' : 'Add Product Attribute'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form autoComplete="off" onSubmit={form.handleSubmit(submitData)} className="space-y-4">
            {/* Product */}
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product *</FormLabel>
                  <FormControl>
                    <SelectSearch
                      buttonClass="w-full"
                      placeholder="Select Product"
                      disableSearch={false}
                      items={
                        getAllProducts?.data?.data?.data?.data?.map((item) => ({
                          value: item.id,
                          label: item.name,
                        })) ?? []
                      }
                      value={field.value ?? ''}
                      onChange={(value) => field.onChange(value ? Number(value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attribute ID */}
            <FormField
              control={form.control}
              name="attributeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attribute ID *</FormLabel>
                  <FormControl>
                    <SelectSearch
                      buttonClass="w-full"
                      placeholder="Select Product"
                      disableSearch={false}
                      items={
                        getAllAttributes.data?.data?.data?.data?.map((item) => ({
                          value: item.id,
                          label: item.name,
                        })) ?? []
                      }
                      value={field.value ?? ''}
                      onChange={(value) => field.onChange(value ? Number(value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Value */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Red, 100W, Cotton" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onClose(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isEdit ? 'Update' : 'Add'} Attribute
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
