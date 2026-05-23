'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import ProductAttributeList from '.';
import ManageProductAttribute from './add-edit';
import { SelectSearch } from '@/components/common/select-search';
import { useGetAllProducts } from '@/hooks/service-hooks/useProductService';
import { PageHeader } from '@/components/common/page-header';

interface ProductAttributeListingWrapperProps {
  productId?: number;
}

export default function ProductAttributeListingWrapper({ productId: initialProductId }: ProductAttributeListingWrapperProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(initialProductId);

  const getAllProducts = useGetAllProducts();

  return (
    <>
      <PageHeader
        title={`Product Attributes`}
        description="Manage product Attributes"
        variant="add"
        actionText="Add Category"
        onClick={() => setShowAddModal(true)}
      />
      {/* {!initialProductId && (
        <div className="max-w-sm">
          <SelectSearch
            buttonClass="w-full"
            placeholder="Filter by Product"
            disableSearch={false}
            items={
              getAllProducts?.data?.data?.data?.data?.map((item) => ({
                value: item.id,
                label: item.name,
              })) ?? []
            }
            value={selectedProductId ?? ''}
            onChange={(value) => setSelectedProductId(value ? Number(value) : undefined)}
          />
        </div>
      )} */}

      <Card>
        <ProductAttributeList productId={selectedProductId} />
        {selectedProductId ? (
          <ProductAttributeList productId={selectedProductId} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">Select a product to view its attributes</div>
        )}
      </Card>

      {showAddModal && <ManageProductAttribute defaultProductId={selectedProductId} isOpen={showAddModal} onClose={() => setShowAddModal(false)} />}
    </>
  );
}
