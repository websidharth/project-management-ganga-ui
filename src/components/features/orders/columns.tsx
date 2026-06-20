'use client';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import { OrderDto } from '@/dtos/order.dto';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
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
      {
        id: 'items',
        header: 'Order Items',
        cell: ({ row }) => {
          const items = row.original.items || [];
          return (
            <div className="flex flex-wrap gap-1 max-w-[250px]">
              {items.map((item) => (
                <Badge key={item.id} variant="outline" className="text-[10px] font-normal py-0.5 px-1.5">
                  ID: {item.productId} ({item.quantity}x)
                </Badge>
              ))}
              {items.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
            </div>
          );
        },
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
