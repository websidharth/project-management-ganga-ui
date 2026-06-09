'use client';
import { useEffect, useState } from 'react';
import { ProductVariantDto } from '@/dtos/product-variant.dto';
import { useGetAllProductVariants, useGetVariantsByProductId, useDeleteProductVariant } from '@/hooks/service-hooks/useProductVariantService';
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
import { useProductVariantColumns } from './columns';
import ManageProductVariant from './add-edit';
import config from '@/config';

interface ProductVariantListProps {
  productId?: number;
}

export default function ProductVariantList({ productId }: ProductVariantListProps) {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [data, setData] = useState<ProductVariantDto[]>([]);
  const [recordCount, setRecordCount] = useState<number>(0);

  const { showModal: showEditModal, openModal: openEditModal, closeModal: closeEditModal, uniqueId: editId } = useModalShowHide();
  const { showModal: showDeleteModal, openModal: openDeleteModal, closeModal: closeDeleteModal, uniqueId: deleteId } = useModalShowHide();

  const columns = useProductVariantColumns(
    (id) => openEditModal(id),
    (id) => openDeleteModal(id)
  );

  const allVariantsResponse = useGetAllProductVariants(!productId);
  const byProductResponse = useGetVariantsByProductId(productId ?? 0, !!productId);
  const activeResponse = productId ? byProductResponse : allVariantsResponse;

  const deleteVariantMutation = useDeleteProductVariant();

  useEffect(() => {
    if (activeResponse.status === 'success' && activeResponse.data?.data?.data) {
      const result = activeResponse.data.data.data;
      const list = Array.isArray(result) ? result : (result as any).data ?? [];
      setData(list);
      setRecordCount(Array.isArray(result) ? list.length : (result as any).totalRecord ?? list.length);
    }
  }, [activeResponse.status, activeResponse.data]);

  const { sorting, onSortingChange } = useTanstackTableSorting<ProductVariantDto>('', 'desc', columns);
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
    const response = await deleteVariantMutation.mutateAsync(id);
    if (response && response.status === 204) {
      toast({ variant: 'success', title: 'Variant deleted successfully' });
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast({ variant: 'destructive', title: 'Error', description: <span>{error}</span> });
    }
    closeDeleteModal(true);
  };

  if (activeResponse.isError) {
    return <div className="text-center py-10 text-destructive">Error loading variants</div>;
  }

  if (activeResponse.isLoading) {
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
        <div className="rounded-md border">
          <CustomDataTable columns={columns} table={table}  isLoading={activeResponse.isLoading}/>
        </div>
        <DataTablePagination table={table} totalRecord={recordCount} loading={activeResponse.isLoading} />
      </div>

      

      {showEditModal && (
        <ManageProductVariant
          id={+(editId ?? 0)} 
          isOpen={showEditModal}
          onClose={(refresh) => {
            closeEditModal(refresh);
            if (refresh) activeResponse.refetch();
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmBox
          isOpen={showDeleteModal}
          onClose={() => closeDeleteModal(false)}
          onSubmit={() => handleDelete(+(deleteId ?? 0))}
          bodyText="Are you sure you want to delete this variant?"
          noButtonText="Cancel"
          yesButtonText="Delete"
          loading={deleteVariantMutation.isPending}
        />
      )}
    </>
  );
}
