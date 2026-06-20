import GalleryPage from "@/components/common/image-uplod/get-all-images";
import { MediaUploader } from "@/components/common/image-uplod/upload";
import { PageHeader } from '@/components/common/page-header';
import { Card } from '@/components/ui/card';
import config from '@/config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `File Manager List - ${config.appName}`,
};

export default function OrdersPage() {
  return (
    <div className=" mx-auto max-w-8xl space-y-6">
      <PageHeader
        title={`File Manager`}
        description=""
        variant="back"
      />

      <Card>
        <MediaUploader />
      </Card>
      <Card>
        <GalleryPage />
      </Card>
    </div>
  );
}
