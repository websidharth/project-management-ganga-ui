'use client';
import { useEffect, useState } from 'react';
import { BrandNameDto } from '@/dtos/brand-name.dto';
import { useGetAllBrandNames, useDeleteBrandName } from '@/hooks/service-hooks/useBrandNameService';
import { useCustomDataTable } from '@/hooks/use-custom-table';
import { useTanstackTablePagination } from '@/hooks/use-tanstack-table-pagination';
import { useTanstackTableSorting } from '@/hooks/use-tanstack-table-sorting';
import { CustomDataTable } from '../../Table/data-table';
import { DataTablePagination } from '../../Table/data-table-pagination';
import Loader from '../../loader';
import ConfirmBox from '../../common/confirm-box';
import { toast } from '../../ui/use-toast';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import useModalShowHide from '@/hooks/use-modal-show-hide';
import { useBrandNameColumns } from './columns';
import BrandNameListFilter from './filter';
import ManageBrandName from './add-edit';
import config from '@/config';

export default function BrandNameList() {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [data, setData] = useState<BrandNameDto[]>([]);
  const [recordCount, setRecordCount] = useState<number>(0);

  const { showModal: showEditModal, openModal: openEditModal, closeModal: closeEditModal, uniqueId: editId } = useModalShowHide();
  const { showModal: showDeleteModal, openModal: openDeleteModal, closeModal: closeDeleteModal, uniqueId: deleteId } = useModalShowHide();

  const columns = useBrandNameColumns(
    (id) => openEditModal(id),
    (id) => openDeleteModal(id)
  );

  const getAllBrandNamesResponse = useGetAllBrandNames();
  const deleteBrandNameMutation = useDeleteBrandName();

  useEffect(() => {
    if (getAllBrandNamesResponse.status === 'success' && getAllBrandNamesResponse.data?.data?.data) {
      const result = getAllBrandNamesResponse.data.data.data;
      setData(result.data ?? []);
      setRecordCount(result.totalRecord ?? 0);
    }
  }, [getAllBrandNamesResponse.status, getAllBrandNamesResponse.data]);

  const { sorting, onSortingChange } = useTanstackTableSorting<BrandNameDto>('', 'desc', columns);
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
    const response = await deleteBrandNameMutation.mutateAsync(id);
    if (response && response.status === 204) {
      toast({ variant: 'success', title: 'Brand name deleted successfully' });
    } else {
      const error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast({ variant: 'destructive', title: 'Error', description: <span>{error}</span> });
    }
    closeDeleteModal(true);
  };

  if (getAllBrandNamesResponse.isError) {
    return <div className="text-center py-10 text-destructive">Error loading brand names</div>;
  }

  return (
    <>
      <div className="p-4">
        <BrandNameListFilter table={table} />
      </div>
      {deleteBrandNameMutation.isPending && <Loader />}
      <CustomDataTable table={table} columns={columns} isLoading={getAllBrandNamesResponse.isLoading} />
      <DataTablePagination table={table} />
      {showEditModal && editId && (
        <ManageBrandName
          id={+editId}
          isOpen={showEditModal}
          onClose={(refresh) => {
            closeEditModal(refresh);
          }}
        />
      )}
      {showDeleteModal && deleteId && (
        <ConfirmBox
          isOpen={showDeleteModal}
          onClose={() => closeDeleteModal(false)}
          onSubmit={() => handleDelete(+deleteId)}
          heading="Delete Brand Name"
          bodyText="Are you sure you want to delete this brand name? This action cannot be undone."
        />
      )}
    </>
  );
}
