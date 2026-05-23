'use client';
import { useEffect, useState } from 'react';
import { ProductAttributeDto } from '@/dtos/product-attribute.dto';
import { useGetAttributesByProductId, useDeleteProductAttribute, useGetAllProductAttributes } from '@/hooks/service-hooks/useProductAttributeService';
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
import { useProductAttributeColumns } from './columns';
import ManageProductAttribute from './add-edit';
import config from '@/config';

interface ProductAttributeListProps {
  productId?: number;
}

export default function ProductAttributeList({ productId }: ProductAttributeListProps) {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [data, setData] = useState<ProductAttributeDto[]>([]);
  const [recordCount, setRecordCount] = useState<number>(0);

  const { showModal: showEditModal, openModal: openEditModal, closeModal: closeEditModal, uniqueId: editId } = useModalShowHide();
  const { showModal: showDeleteModal, openModal: openDeleteModal, closeModal: closeDeleteModal, uniqueId: deleteId } = useModalShowHide();

  const columns = useProductAttributeColumns(
    (id) => openEditModal(id),
    (id) => openDeleteModal(id)
  );

  const attributesResponse = useGetAllProductAttributes();
  const deleteMutation = useDeleteProductAttribute();

  useEffect(() => {
    if (attributesResponse.status === 'success' && attributesResponse.data?.data?.data?.data) {
      const list = attributesResponse.data.data.data.data;
      setData(Array.isArray(list) ? list : []);
      setRecordCount(Array.isArray(list) ? list.length : 0);
    }
  }, [attributesResponse.status, attributesResponse.data]);

  console.log('attributesResponse', attributesResponse);

  const { sorting, onSortingChange } = useTanstackTableSorting<ProductAttributeDto>('', 'desc', columns);
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
    const response = await deleteMutation.mutateAsync(id);
    if (response && response.status === 204) {
      toast({ variant: 'success', title: 'Attribute deleted successfully' });
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast({ variant: 'destructive', title: 'Error', description: <span>{error}</span> });
    }
    closeDeleteModal(true);
  };

  if (attributesResponse.isError) {
    return <div className="text-center py-10 text-destructive">Error loading attributes</div>;
  }

  if (attributesResponse.isLoading) {
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
          <CustomDataTable columns={columns} table={table} />
        </div>
        <DataTablePagination table={table} totalRecord={recordCount} loading={attributesResponse.isLoading} />
      </div>

      {attributesResponse.isLoading && <Loader />}

      {showEditModal && (
        <ManageProductAttribute
          id={+(editId ?? 0)}
          defaultProductId={productId}
          isOpen={showEditModal}
          onClose={(refresh) => {
            closeEditModal(refresh);
            if (refresh) attributesResponse.refetch();
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmBox
          isOpen={showDeleteModal}
          onClose={() => closeDeleteModal(false)}
          onSubmit={() => handleDelete(+(deleteId ?? 0))}
          bodyText="Are you sure you want to delete this attribute?"
          noButtonText="Cancel"
          yesButtonText="Delete"
          loading={deleteMutation.isPending}
        />
      )}
    </>
  );
}
