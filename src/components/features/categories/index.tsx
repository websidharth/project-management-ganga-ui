'use client';
import { useEffect, useState } from 'react';
import { CategoryDto } from '@/dtos/category.dto';
import { useGetAllCategories, useDeleteCategory } from '@/hooks/service-hooks/useCategoryService';
import { useCustomDataTable } from '@/hooks/use-custom-table';
import { useTanstackTablePagination } from '@/hooks/use-tanstack-table-pagination';
import { useTanstackTableSorting } from '@/hooks/use-tanstack-table-sorting';
import { CustomDataTable } from '../../Table/data-table';
import { DataTablePagination } from '../../Table/data-table-pagination';
import RecentPostSkeleton from '../../skelton/recent-post';
import Loader from '../../loader';
import ConfirmBox from '../../common/confirm-box';
import { toast } from '../../ui/use-toast';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import useModalShowHide from '@/hooks/use-modal-show-hide';
import { useCategoryColumns } from './columns';
import CategoryListFilter from './filter';
import ManageCategory from './add-edit';
import config from '@/config';

export default function CategoryList() {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [data, setData] = useState<CategoryDto[]>([]);
  const [recordCount, setRecordCount] = useState<number>(0);

  const { showModal: showEditModal, openModal: openEditModal, closeModal: closeEditModal, uniqueId: editId } = useModalShowHide();
  const { showModal: showDeleteModal, openModal: openDeleteModal, closeModal: closeDeleteModal, uniqueId: deleteId } = useModalShowHide();

  const columns = useCategoryColumns(
    (id) => openEditModal(id),
    (id) => openDeleteModal(id)
  );

  const getAllCategoriesResponse = useGetAllCategories();
  const deleteCategoryMutation = useDeleteCategory();

  useEffect(() => {
    if (getAllCategoriesResponse.status === 'success' && getAllCategoriesResponse.data?.data?.data) {
      const result = getAllCategoriesResponse.data.data.data;
      setData(result.data ?? []);
      setRecordCount(result.totalRecord ?? 0);
    }
  }, [getAllCategoriesResponse.status, getAllCategoriesResponse.data]);

  const { sorting, onSortingChange } = useTanstackTableSorting<CategoryDto>('', 'desc', columns);
  const { onPaginationChange, pagination } = useTanstackTablePagination(config.recordPerPage);

  const table = useCustomDataTable({
    columns,
    data,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil((recordCount || 0) / config.recordPerPage),
    pagination,
    sorting,
    onPaginationChange,
    onSortingChange,
  });

  const handleDelete = async (id: number) => {
    const response = await deleteCategoryMutation.mutateAsync(id);
    if (response && response.status === 204) {
      toast({ variant: 'success', title: 'Category deleted successfully' });
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast({ variant: 'destructive', title: 'Error', description: <span>{error}</span> });
    }
    closeDeleteModal(true);
  };

  if (getAllCategoriesResponse.isError) {
    return <div className="text-center py-10 text-destructive">Error loading categories</div>;
  }

  if (getAllCategoriesResponse.isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <RecentPostSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <CategoryListFilter table={table} resetForm={() => getAllCategoriesResponse.refetch()} />

        <div className="rounded-md border">
          <CustomDataTable columns={columns} table={table} />
        </div>

        <DataTablePagination table={table} totalRecord={recordCount} loading={getAllCategoriesResponse.isLoading} />
      </div>

      {getAllCategoriesResponse.isLoading && <Loader />}

      {showEditModal && (
        <ManageCategory
          id={+(editId ?? 0)}
          isOpen={showEditModal}
          onClose={(refresh) => {
            closeEditModal(refresh);
            if (refresh) getAllCategoriesResponse.refetch();
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmBox
          isOpen={showDeleteModal}
          onClose={() => closeDeleteModal(false)}
          onSubmit={() => handleDelete(+(deleteId ?? 0))}
          bodyText="Are you sure you want to delete this category?"
          noButtonText="Cancel"
          yesButtonText="Delete"
          loading={deleteCategoryMutation.isPending}
        />
      )}
    </>
  );
}
