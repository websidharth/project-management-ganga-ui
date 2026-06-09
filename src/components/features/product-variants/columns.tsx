'use client';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../../Table/data-table-column-header';
import { useMemo } from 'react';
import { ProductVariantDto } from '@/dtos/product-variant.dto';
import { Badge } from '../../ui/badge';
import ProductVariantRowActions from './row-action';

export const useProductVariantColumns = (editRecord: (id: number) => void, deleteRecord: (id: number) => void) =>
  useMemo<ColumnDef<ProductVariantDto>[]>(
    () => [
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => <ProductVariantRowActions row={row} editRecord={editRecord} deleteRecord={deleteRecord} />,
      },
      {
        id: 'productId',
        accessorKey: 'productId',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Product ID" />,
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.productId}</span>,
        meta: { sortingKey: 'productId' },
      },
      {
        id: 'variant',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Variant" />,
        cell: ({ row }) => {
          const v = row.original;
           
          return (
            <div className="flex flex-wrap gap-1">
               {row.original.Price}
            </div>
          );
        },
      },
      
      {
        id: 'stock',
        accessorKey: 'stock',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Stock" />,
        cell: ({ row }) => <span className="font-medium">{row.original.stock}</span>,
        meta: { sortingKey: 'stock' },
      },
     
    ],
    [editRecord, deleteRecord]
  );
