'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductDto } from '@/dtos/product.dto';
import { ProductFilterParams } from '@/params/product.params';
import { useGetAllProducts, useDeleteProduct } from '@/hooks/service-hooks/useProductService';
import { useCustomDataTable } from '@/hooks/use-custom-table';
import { useTanstackTablePagination } from '@/hooks/use-tanstack-table-pagination';
import { useTanstackTableSorting } from '@/hooks/use-tanstack-table-sorting';
import { CustomDataTable } from '../../Table/data-table';
import { DataTablePagination } from '../../Table/data-table-pagination';
import RecentPostSkeleton from '../../skelton/recent-post';
import ConfirmBox from '../../common/confirm-box';
import { toast } from '../../ui/use-toast';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import useModalShowHide from '@/hooks/use-modal-show-hide';
import { useProductColumns } from './columns';
import ProductListFilter from './filter';
import ManageProduct from './add-edit';
import config from '@/config';
import { useGetAllBrandNames } from '@/hooks/service-hooks/useBrandNameService';

export default function ProductList() {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [data, setData] = useState<ProductDto[]>([]);
  const [recordCount, setRecordCount] = useState<number>(0);
  const searchParams = useSearchParams();

  const { showModal: showEditModal, openModal: openEditModal, closeModal: closeEditModal, uniqueId: editId } = useModalShowHide();
  const { showModal: showDeleteModal, openModal: openDeleteModal, closeModal: closeDeleteModal, uniqueId: deleteId } = useModalShowHide();

  const [filterParams, setFilterParams] = useState<ProductFilterParams>({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || null,
    categoryId: searchParams.get('categoryId') || '',
    startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!).toISOString() : undefined,
    endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!).toISOString() : undefined,
    page: +(searchParams.get('page') || 1),
    recordPerPage: +(searchParams.get('recordPerPage') || config.recordPerPage),
  });

  const columns = useProductColumns(
    (id) => openEditModal(id),
    (id) => openDeleteModal(id)
  );

  const getAllProductsResponse = useGetAllProducts(filterParams);
  const deleteProductMutation = useDeleteProduct();

  useEffect(() => {
    if (getAllProductsResponse.isSuccess && getAllProductsResponse.data?.data?.data) {
      setData(getAllProductsResponse.data.data.data.data ?? []);
      setRecordCount(getAllProductsResponse.data.data.data.totalRecord ?? 0);
    }
  }, [getAllProductsResponse.isSuccess, getAllProductsResponse.data]);

  const { sorting, onSortingChange } = useTanstackTableSorting<ProductDto>('', 'desc', columns);

  const { onPaginationChange, pagination } = useTanstackTablePagination(filterParams.recordPerPage);

  const table = useCustomDataTable({
    columns,
    data,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil((recordCount || 0) / (filterParams.recordPerPage || 1)),
    pagination,
    sorting,
    onPaginationChange,
    onSortingChange,
  });

  useEffect(() => {
    setFilterParams((prev) => ({
      ...prev,
      page: pagination.pageIndex + 1,
      recordPerPage: pagination.pageSize,
    }));
  }, [pagination]);

  const resetForm = () => {
    setFilterParams({
      search: undefined,
      page: 1,
      recordPerPage: config.recordPerPage,
    });
  };

  const handleDelete = async (id: number) => {
    const response = await deleteProductMutation.mutateAsync(id);
    if (response && response.status === 204) {
      toast({ variant: 'success', title: 'Product deleted successfully' });
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast({ variant: 'destructive', title: 'Error', description: <span>{error}</span> });
    }
    closeDeleteModal(true);
  };

  if (getAllProductsResponse.isError) {
    return <div className="text-center py-10 text-destructive">Error loading products</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <ProductListFilter
          table={table}
          resetForm={resetForm}
          onTextChange={(value) => setFilterParams((prev) => ({ ...prev, search: value || undefined, page: 1 }))}
          onStatusChange={(value) => {
            setFilterParams((oldValue) => {
              return {
                ...oldValue,
                status: value,
              };
            });
          }}
          onCategoryTypeChange={(value) => {
            setFilterParams((oldValue) => {
              return { ...oldValue, categoryId: value || undefined };
            });
          }}
          onStartDateChanged={(value) => {
            const selectedDate = value;
            if (selectedDate) {
              selectedDate.setHours(0, 0, 0, 0);
            }

            setFilterParams((oldValue) => {
              return {
                ...oldValue,
                startDate: selectedDate?.toISOString(),
              };
            });
          }}
          onEndDateChanged={(value) => {
            const selectedDate = value;
            if (selectedDate) {
              selectedDate.setHours(23, 59, 59, 999);
            }

            setFilterParams((oldValue) => {
              return {
                ...oldValue,
                endDate: selectedDate?.toISOString(),
              };
            });
          }}
        />

        <div className="rounded-md border">
          <CustomDataTable columns={columns} table={table} isLoading={getAllProductsResponse.isLoading} />
        </div>

        <DataTablePagination table={table} totalRecord={recordCount} loading={getAllProductsResponse.isLoading} />
      </div>

      {showEditModal && (
        <ManageProduct
          id={+(editId ?? 0)}
          isOpen={showEditModal}
          onClose={(refresh) => {
            closeEditModal(refresh);
            if (refresh) getAllProductsResponse.refetch();
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmBox
          isOpen={showDeleteModal}
          onClose={() => closeDeleteModal(false)}
          onSubmit={() => handleDelete(+(deleteId ?? 0))}
          bodyText="Are you sure you want to delete this product?"
          noButtonText="Cancel"
          yesButtonText="Delete"
          loading={deleteProductMutation.isPending}
        />
      )}
    </>
  );
}
