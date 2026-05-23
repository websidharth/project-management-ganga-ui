'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import ProductList from '.';
import ManageProduct from './add-edit';
import { PageHeader } from '@/components/common/page-header';

export default function ProductListingWrapper() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <PageHeader
        title={`Products`}
        description="Manage product listings"
        variant="add"
        actionText="Add Product"
        onClick={() => setShowAddModal(true)}
      />
      <Card>
        <ProductList />
      </Card>

      {showAddModal && <ManageProduct isOpen={showAddModal} onClose={() => setShowAddModal(false)} />}
    </>
  );
}
