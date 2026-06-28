'use client';
import { PageHeader } from '@/components/common/page-header';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import StaffList from '.';
import ManageStaff from './add-edit';

export default function StaffListingWrapper() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <PageHeader
        title={`Staff Members`}
        description="Manage staff members"
        variant="back"
      />
      <Card>
        <StaffList />
      </Card>

      {showAddModal && <ManageStaff isOpen={showAddModal} onClose={() => setShowAddModal(false)} />}
    </>
  );
}
