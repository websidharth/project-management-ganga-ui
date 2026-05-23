'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import ProductVariantList from '.';
import ManageProductVariant from './add-edit';
import { PageHeader } from '@/components/common/page-header';

interface ProductVariantListingWrapperProps {
  productId?: number;
}

export default function ProductVariantListingWrapper({ productId }: ProductVariantListingWrapperProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <PageHeader
        title={`Product Variants`}
        description="Manage product Variants"
        variant="add"
        actionText="Add Variant"
        onClick={() => setShowAddModal(true)}
      />
      <Card>
        <ProductVariantList productId={productId} />
      </Card>

      {showAddModal && <ManageProductVariant defaultProductId={productId} isOpen={showAddModal} onClose={() => setShowAddModal(false)} />}
    </>
  );
}
