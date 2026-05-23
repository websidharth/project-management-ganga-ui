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
import { CreateBrandNameModel } from '@/models/brand-name.model';
import BrandNameSchema from '@/schema/brandNameSchema';
import { useCreateBrandName, useGetBrandNameById, useUpdateBrandName } from '@/hooks/service-hooks/useBrandNameService';
import { SelectSearch } from '@/components/common/select-search';
import { SelectSearchMulti } from '@/components/common/select-search-multi';
import { StatusValues } from '@/enums/status-values.enum';
import { useGetAllCategories } from '@/hooks/service-hooks/useCategoryService';

interface ManageBrandNameProps {
  id?: number;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
}

export default function ManageBrandName({ id, isOpen, onClose }: ManageBrandNameProps) {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const isEdit = !!id && id > 0;
  const getAllCategories = useGetAllCategories();
  const createMutation = useCreateBrandName();
  const updateMutation = useUpdateBrandName();
  const { data: brandNameResponse, isLoading: isFetching } = useGetBrandNameById(id ?? 0, isEdit);

  const form = useForm<CreateBrandNameModel>({
    resolver: yupResolver(BrandNameSchema),
    defaultValues: { brandName: '', status: StatusValues.Published, displayOrder: 0, categoryIds: [] },
  });

  useEffect(() => {
    if (isEdit && brandNameResponse?.data?.data) {
      const b = brandNameResponse.data.data;
      form.reset({ brandName: b.brandName, status: b.status, displayOrder: b.displayOrder ?? 0, categoryIds: b.categoryId ? [b.categoryId] : [] });
    }
  }, [isEdit, brandNameResponse, form]);

  const submitData = async (model: CreateBrandNameModel) => {
    const response = isEdit ? await updateMutation.mutateAsync({ id: id!, model }) : await createMutation.mutateAsync(model);

    if (response && (response.status === 200 || response.status === 201)) {
      toast({ variant: 'success', title: `Brand name ${isEdit ? 'updated' : 'created'} successfully` });
      onClose(true);
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast({ variant: 'destructive', title: 'Error', description: <span>{error}</span> });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isFetching;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Brand Name</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form autoComplete="off" onSubmit={form.handleSubmit(submitData)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Category ID</FormLabel>
                  <FormControl>
                    <SelectSearchMulti
                      buttonClass={`w-full`}
                      placeholder="Select Category"
                      items={
                        getAllCategories?.data?.data?.data?.data?.map((item) => ({
                          value: item.id,
                          label: item.name,
                        })) ?? []
                      }
                      value={field.value ?? []}
                      onChange={(values) => field.onChange(values.map(Number))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Nike, Adidas" {...field} />
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

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onClose(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isEdit ? 'Update' : 'Add'} Brand Name
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
