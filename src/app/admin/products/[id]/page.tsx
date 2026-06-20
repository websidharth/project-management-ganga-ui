
import ManageProduct from '@/components/features/products/add-edit';
import config from '@/config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Add Product - ${config.appName}`,
};

interface ProductsPageProps {
  params: {
    id: number;
  };
}


export default function ProductsPage({ params }: ProductsPageProps) {
  const { id } = params;


  return (
    <div className="grid gap-5">
      <ManageProduct id={id} />
    </div>
  );
}
