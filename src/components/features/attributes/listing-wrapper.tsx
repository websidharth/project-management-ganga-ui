'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import AttributeList from '.';
import ManageAttribute from './add-edit';
import { PageHeader } from '@/components/common/page-header';

export default function AttributeListingWrapper() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <PageHeader
        title={`Attributes`}
        description="Manage product attributes (name &amp; unit)"
        variant="add"
        actionText="Add Attribute"
        onClick={() => setShowAddModal(true)}
      />
      <Card>
        <AttributeList />
      </Card>
      {showAddModal && <ManageAttribute isOpen={showAddModal} onClose={() => setShowAddModal(false)} />}
    </>
  );
}
