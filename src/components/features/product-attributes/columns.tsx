'use client';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../../Table/data-table-column-header';
import { useMemo } from 'react';
import { ProductAttributeDto } from '@/dtos/product-attribute.dto';
import ProductAttributeRowActions from './row-action';

export const useProductAttributeColumns = (editRecord: (id: number) => void, deleteRecord: (id: number) => void) =>
  useMemo<ColumnDef<ProductAttributeDto>[]>(
    () => [
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => <ProductAttributeRowActions row={row} editRecord={editRecord} deleteRecord={deleteRecord} />,
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
        id: 'attribute',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Attribute" />,
        cell: ({ row }) => {
          const attr = row.original.attribute;
          if (attr) {
            return (
              <div className="space-y-0.5">
                <span className="font-medium block">{attr.name}</span>
                {attr.unit && <span className="text-xs text-muted-foreground">{attr.unit}</span>}
              </div>
            );
          }
          return <span className="font-mono text-xs text-muted-foreground">{row.original.attributeId}</span>;
        },
      },
      {
        id: 'value',
        accessorKey: 'value',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} className="text-xs font-semibold uppercase" title="Value" />,
        cell: ({ row }) => <span className="text-sm font-medium">{row.original.value}</span>,
        meta: { sortingKey: 'value' },
      },
    ],
    [editRecord, deleteRecord]
  );
