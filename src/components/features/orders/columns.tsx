'use client';
import { OrderDto } from '@/dtos/order.dto';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DataTableColumnHeader } from '../../Table/data-table-column-header';
import { Badge } from '../../ui/badge';
import { OrderRowActions } from './row-action';

export const useOrderColumns = (editRecord: (id: number) => void, deleteRecord: (id: number) => void) =>
  useMemo<ColumnDef<OrderDto>[]>(
    () => [
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => <OrderRowActions row={row} editRecord={editRecord} deleteRecord={deleteRecord} />,
      },
      {
        id: 'orderNumber',
        accessorKey: 'orderNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-left text-xs font-semibold uppercase" title="Order #" />,
      },
      {
        id: 'customerId',
        accessorKey: 'customerId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
      },
      {
        id: 'orderDate',
        accessorKey: 'orderDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Order Date" />,
      },
      {
        id: 'grandTotal',
        accessorKey: 'grandTotal',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
        cell: ({ row }) => <span>${row.original.grandTotal.toFixed(2)}</span>,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <Badge variant={row.original.status ? true : false}>{row.original.status}</Badge>,
      },
    ],
    [deleteRecord, editRecord]
  );
