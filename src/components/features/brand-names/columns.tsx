'use client';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import { BrandNameDto } from '@/dtos/brand-name.dto';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DataTableColumnHeader } from '../../Table/data-table-column-header';
import BrandNameRowActions from './row-action';

export const useBrandNameColumns = (editRecord: (id: number) => void, deleteRecord: (id: number) => void) =>
  useMemo<ColumnDef<BrandNameDto>[]>(
    () => [
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => <BrandNameRowActions row={row} editRecord={editRecord} deleteRecord={deleteRecord} />,
      },
      {
        id: 'brandName',
        accessorKey: 'brandName',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Brand Name" />,
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        meta: { sortingKey: 'brandName' },
      },
      {
        id: 'status',
        accessorKey: 'status',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Status" />,
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.status}</span>,
        meta: { sortingKey: 'status' },
      },
      {
        id: 'displayOrder',
        accessorKey: 'displayOrder',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Display Order" />,
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.displayOrder ?? '—'}</span>,
        meta: { sortingKey: 'displayOrder' },
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
