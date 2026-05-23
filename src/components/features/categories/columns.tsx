'use client';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../../Table/data-table-column-header';
import { useMemo } from 'react';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { CategoryDto } from '@/dtos/category.dto';
import CategoryRowActions from './row-action';

export const useCategoryColumns = (editRecord: (id: number) => void, deleteRecord: (id: number) => void) =>
  useMemo<ColumnDef<CategoryDto>[]>(
    () => [
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => <CategoryRowActions row={row} editRecord={editRecord} deleteRecord={deleteRecord} />,
      },
      {
        id: 'name',
        accessorKey: 'name',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Name" />,
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        meta: { sortingKey: 'name' },
      },
      {
        id: 'description',
        accessorKey: 'description',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Description" />,
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.description ?? '—'}</span>,
        meta: { sortingKey: 'description' },
      },
      {
        id: 'parentId',
        accessorKey: 'parentId',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Parent ID" />,
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.parentId ?? '—'}</span>,
        meta: { sortingKey: 'parentId' },
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Created At" />,
        cell: ({ row }) => {
          const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
          return (
            <span className="text-sm text-muted-foreground">
              {row.original.createdAt ? unitOfService.DateTimeService.convertToLocalDate(row.original.createdAt, true) : '—'}
            </span>
          );
        },
        meta: { sortingKey: 'createdAt' },
      },
    ],
    [editRecord, deleteRecord]
  );
