'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { CreateProductVariantModel } from '@/models/product-variant.model';
import ProductVariantSchema from '@/schema/productVariantSchema';
import { useCreateProductVariant, useGetProductVariantById, useUpdateProductVariant } from '@/hooks/service-hooks/useProductVariantService';
import { useGetAllProducts } from '@/hooks/service-hooks/useProductService';
import { SelectSearch } from '@/components/common/select-search';
import Loader from '@/components/loader';
import { StatusValues } from '@/enums/status-values.enum';
import { useGetAllBrandNames } from '@/hooks/service-hooks/useBrandNameService';
import { useGetAllProductAttributes } from '@/hooks/service-hooks/useProductAttributeService';
import { useGetAllAttributes } from '@/hooks/service-hooks/useAttributeService';

interface ManageProductVariantProps {
  id?: number;
  defaultProductId?: number;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
}

export default function ManageProductVariant({ id, defaultProductId, isOpen, onClose }: ManageProductVariantProps) {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const isEdit = !!id && id > 0;

  const getAllProductAttributes = useGetAllProductAttributes();
  const getAllAttributes = useGetAllAttributes();
  const getAllBrandNames = useGetAllBrandNames();
  const getAllProducts = useGetAllProducts();
  const createVariant = useCreateProductVariant();
  const updateVariant = useUpdateProductVariant();
  const { data: variantResponse, isLoading: isFetching } = useGetProductVariantById(id ?? 0, isEdit);

  const form = useForm<CreateProductVariantModel>({
    resolver: yupResolver(ProductVariantSchema),
    defaultValues: {
      name: '',
      slug: undefined,
      productId: defaultProductId ?? 0,
      brandNameId: undefined,
      productAttributeId: null,
      attributeId: null,
      cost: undefined,
      Price: undefined,
      stock: 0,
      lowStockThreshold: null,
      status: StatusValues.Published,
      displayOrder: null,
      isDefault: false,
    },
  });

  useEffect(() => {
    if (isEdit && variantResponse?.data?.data) {
      const v = variantResponse.data.data;
      form.reset({
        name: v.name ?? '',
        slug: v.slug ?? undefined,
        productId: v.productId ?? 0,
        brandNameId: v.brandNameId ?? undefined,
        productAttributeId: v.productAttributeId ?? null,
        attributeId: v.attributeId ?? null,
        cost: v.cost ?? undefined,
        Price: v.Price ?? undefined,
        stock: v.stock ?? 0,
        lowStockThreshold: v.lowStockThreshold ?? null,
        isDefault: v.isDefault ?? false,
        status: v.status,
        displayOrder: v.displayOrder ?? null,
      });
    }
  }, [isEdit, variantResponse, form]);

  const submitData = async (model: CreateProductVariantModel) => {
    const response = isEdit ? await updateVariant.mutateAsync({ id: id!, model }) : await createVariant.mutateAsync(model);

    if (response && (response.status === 200 || response.status === 201)) {
      toast({ variant: 'success', title: `Variant ${isEdit ? 'updated' : 'created'} successfully` });
      onClose(true);
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast({ variant: 'destructive', title: 'Error', description: <span>{error}</span> });
    }
  };

  const isLoading = createVariant.isPending || updateVariant.isPending || isFetching;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Variant' : 'Add New Variant'}</DialogTitle>
        </DialogHeader>

        {isLoading && <Loader />}

        <Form {...form}>
          <form autoComplete="off" onSubmit={form.handleSubmit(submitData)} className="grid   gap-4">
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

            <FormField
              control={form.control}
              name="attributeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attribute</FormLabel>
                  <FormControl>
                    <SelectSearch
                      buttonClass="w-full"
                      placeholder="Select Attribute"
                      disableSearch={false}
                      items={
                        getAllAttributes?.data?.data?.data?.data?.map((item) => ({
                          value: item.id,
                          label: item.name || item.name,
                        })) ?? []
                      }
                      value={field.value ?? ''}
                      onChange={(value) => field.onChange(value ? Number(value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Variant name" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Slug (optional)" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brandNameId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <SelectSearch
                      buttonClass="w-full"
                      placeholder="Select Brand"
                      disableSearch={false}
                      items={
                        getAllBrandNames?.data?.data?.data?.data?.map((item) => ({
                          value: item.id,
                          label: item.brandName,
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

            <FormField
              control={form.control}
              name="productAttributeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Attribute</FormLabel>
                  <FormControl>
                    <SelectSearch
                      buttonClass="w-full"
                      placeholder="Select Product Attribute"
                      disableSearch={false}
                      items={
                        getAllProductAttributes?.data?.data?.data?.data?.map((item) => ({
                          value: item.id,
                          label: item.value,
                        })) ?? []
                      }
                      value={field.value ?? ''}
                      onChange={(value) => field.onChange(value ? Number(value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Size */}
            {/* <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. S, M, L, XL" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Extra Price */}
            <FormField
              control={form.control}
              name="Price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stock */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <SelectSearch
                        placeholder="Select Status*"
                        buttonClass="w-full"
                        disableSearch={true}
                        items={[
                          { label: 'Published', value: StatusValues.Published },
                          { label: 'Draft', value: StatusValues.Draft },
                        ]}
                        value={field.value}
                        valueType="string"
                        containerName="brand-name-status"
                        onChange={(value) => field.onChange(value)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 1, 2, 3 (optional)"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : +e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Is Default */}
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-2">Set as Default</FormLabel>
                  <FormControl>
                    <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onClose(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isEdit ? 'Update' : 'Create'} Variant
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
