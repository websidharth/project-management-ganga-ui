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
          const parts = [v.size, v.color, v.material, v.voltage].filter(Boolean);
          return (
            <div className="flex flex-wrap gap-1">
              {parts.length > 0 ? (
                parts.map((p, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {p}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-xs">—</span>
              )}
            </div>
          );
        },
      },
      {
        id: 'extraSku',
        accessorKey: 'extraSku',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Extra SKU" />,
        cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.extraSku ?? '—'}</span>,
        meta: { sortingKey: 'extraSku' },
      },
      {
        id: 'extraPrice',
        accessorKey: 'extraPrice',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Extra Price" />,
        cell: ({ row }) => <span className="text-sm">{row.original.extraPrice != null ? `$${row.original.extraPrice.toFixed(2)}` : '—'}</span>,
        meta: { sortingKey: 'extraPrice' },
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
      {
        id: 'isDefault',
        accessorKey: 'isDefault',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Default" />,
        cell: ({ row }) =>
          row.original.isDefault ? <Badge variant="default">Default</Badge> : <span className="text-muted-foreground text-xs">—</span>,
        meta: { sortingKey: 'isDefault' },
      },
    ],
    [editRecord, deleteRecord]
  );
