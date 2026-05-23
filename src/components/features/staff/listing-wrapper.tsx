'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import StaffList from '.';
import ManageStaff from './add-edit';
import { PageHeader } from '@/components/common/page-header';

export default function StaffListingWrapper() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <PageHeader
        title={`Staff Members`}
        description="Manage staff members"
        variant="add"
        actionText="Add Staff Member"
        onClick={() => setShowAddModal(true)}
      />
      <Card>
        <StaffList />
      </Card>

      {showAddModal && <ManageStaff isOpen={showAddModal} onClose={() => setShowAddModal(false)} />}
    </>
  );
}
