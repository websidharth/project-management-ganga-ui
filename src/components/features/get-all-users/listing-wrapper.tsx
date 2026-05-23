'use client'; 
import { Card, CardHeader, CardTitle } from '@/components/ui/card'; 
import GetAllUserss from '.';

export default function GetAllUsersListingWrapper() {

  return (
    <>

      <Card className="overflow-hidden space-y-4">
        <div className="flex items-center justify-between ">
          <CardHeader className="p-0">
            <CardTitle>All Users List</CardTitle>
          </CardHeader>
          {/* <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="">
              <Link href={`/admin/`}>Back</Link>
            </Button>
          </div> */}
        </div>
        <GetAllUserss />
      </Card>
    </>
  );
}
