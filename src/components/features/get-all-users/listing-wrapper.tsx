'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import GetAllUserss from '.';
import ManageUser from './add-edit';
import { PageHeader } from '@/components/common/page-header';

export default function GetAllUsersListingWrapper() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <PageHeader 
        title={`All Users List`} 
        description="Manage all users" 
        variant="add" 
        actionText="Add User"
        onClick={() => setShowAddModal(true)} 
      />
      <Card className="overflow-hidden space-y-4">
        <GetAllUserss />
      </Card>

      {showAddModal && <ManageUser isOpen={showAddModal} onClose={() => setShowAddModal(false)} />}
    </>
  );
}
