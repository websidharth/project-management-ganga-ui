'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import ProductAttributeList from '.';
import ManageProductAttribute from './add-edit';  
import { PageHeader } from '@/components/common/page-header';

interface ProductAttributeListingWrapperProps {
  productId?: number;
}

export default function ProductAttributeListingWrapper({ productId }: ProductAttributeListingWrapperProps) {
  const [showAddModal, setShowAddModal] = useState(false);
 
 
  return (
    <>
      <PageHeader
        title={`Product Attributes`}
        description="Manage product Attributes"
        variant="add"
        actionText="Add Category"
        onClick={() => setShowAddModal(true)}
      />
     

      <Card>
        <ProductAttributeList productId={productId} />
        {productId ? (
          <ProductAttributeList productId={productId} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">Select a product to view its attributes</div>
        )}
      </Card>

      {showAddModal && <ManageProductAttribute defaultProductId={productId} isOpen={showAddModal} onClose={() => setShowAddModal(false)} />}
    </>
  );
}
