'use client';
import { Card } from '@/components/ui/card';
import GetAllUserss from '.';
import { PageHeader } from '@/components/common/page-header';

export default function GetAllUsersListingWrapper() {
  return (
    <>
      <Card className="overflow-hidden space-y-4">
        <PageHeader title={`All Users List`} description="" variant="back" />
        <GetAllUserss />
      </Card>
    </>
  );
}
