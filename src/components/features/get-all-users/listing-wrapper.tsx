'use client';
import { PageHeader } from '@/components/common/page-header';
import { Card } from '@/components/ui/card';
import { Roles } from '@/enums/roles.enum';
import { useState } from 'react';
import GetAllUserss from '.';
import ManageUser from './add-edit';

export default function GetAllUsersListingWrapper({ role = Roles.USER }: { role?: string }) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <PageHeader
        title={`${role} List`}
        variant="add"
        actionText="Add User"
        onClick={() => setShowAddModal(true)}
      />
      <Card className="overflow-hidden space-y-4">
        <GetAllUserss />
      </Card>

      {showAddModal && <ManageUser isOpen={showAddModal} onClose={() => setShowAddModal(false)} role={role} />}
    </>
  );
}
