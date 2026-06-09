'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import ProductVariantList from '.';
import ManageProductVariant from './add-edit';
import { PageHeader } from '@/components/common/page-header';

 
export default function ProductVariantListingWrapper( ) {
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
        <ProductVariantList  />
      </Card>

      {showAddModal && <ManageProductVariant  id={0}
       isOpen={showAddModal} 
       onClose={() => setShowAddModal(false)} />}
    </>
  );
}
