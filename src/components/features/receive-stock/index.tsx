'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllProducts } from '@/hooks/service-hooks/useProductService';
import { useCreatePurchase } from '@/hooks/service-hooks/usePurchaseService';
import { toast } from '@/components/ui/use-toast';
import { Trash2, Plus, UploadCloud } from 'lucide-react';
import axios from 'axios';

interface PurchaseItemState {
  productId: number | '';
  quantity: number | '';
  unitCost: number | '';
}

export default function ReceiveStockPage() {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [notes, setNotes] = useState('');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [items, setItems] = useState<PurchaseItemState[]>([
    { productId: '', quantity: '', unitCost: '' }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: productsData } = useGetAllProducts();
  const products = productsData?.data?.data?.data || [];
  const createPurchase = useCreatePurchase();

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: '', unitCost: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof PurchaseItemState, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const uploadInvoiceToCloudinary = async (file: File): Promise<string> => {
    try {
      const { data } = await axios.get('/api/images/sign-cloudinary-params');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', data.apikey);
      formData.append('timestamp', data.timestamp);
      formData.append('signature', data.signature);
      formData.append('folder', data.folder);

      const res = await axios.post(`https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`, formData);
      return res.data.secure_url;
    } catch (error) {
      console.error('Upload failed', error);
      throw new Error('Failed to upload invoice');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(item => !item.productId || !item.quantity || !item.unitCost)) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Please fill out all item fields.' });
      return;
    }

    try {
      setIsUploading(true);
      let invoiceUrl = '';
      if (invoiceFile) {
        invoiceUrl = await uploadInvoiceToCloudinary(invoiceFile);
      }

      const formattedItems = items.map(item => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
        totalCost: Number(item.quantity) * Number(item.unitCost)
      }));

      const totalAmount = formattedItems.reduce((acc, item) => acc + item.totalCost, 0);

      await createPurchase.mutateAsync({
        invoiceNumber,
        supplierName,
        notes,
        invoiceUrl,
        totalAmount,
        items: formattedItems
      });

      toast({ variant: 'success', title: 'Success', description: 'Stock received successfully!' });
      
      // Reset form
      setInvoiceNumber('');
      setSupplierName('');
      setNotes('');
      setInvoiceFile(null);
      setItems([{ productId: '', quantity: '', unitCost: '' }]);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to receive stock' });
    } finally {
      setIsUploading(false);
    }
  };

  const totalCalculatedAmount = items.reduce((acc, item) => {
    if (item.quantity && item.unitCost) {
      return acc + (Number(item.quantity) * Number(item.unitCost));
    }
    return acc;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Receive Stock</h2>
          <p className="text-muted-foreground mt-1">Add multiple products to your inventory and upload supplier invoice.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Products to Add</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-end gap-3 p-4 border rounded-lg bg-slate-50/50">
                  <div className="flex-1 space-y-2">
                    <Label>Product</Label>
                    <Select
                      value={item.productId.toString()}
                      onValueChange={(val) => handleItemChange(index, 'productId', Number(val))}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p: any) => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Quantity</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      className="bg-white"
                      value={item.quantity} 
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                    />
                  </div>
                  <div className="w-28 space-y-2">
                    <Label>Unit Cost ($)</Label>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      className="bg-white"
                      value={item.unitCost} 
                      onChange={(e) => handleItemChange(index, 'unitCost', e.target.value)} 
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              
              <Button type="button" variant="outline" className="w-full border-dashed" onClick={handleAddItem}>
                <Plus className="w-4 h-4 mr-2" /> Add Another Product
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Supplier Name (Optional)</Label>
                <Input value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="e.g. Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label>Invoice Number (Optional)</Label>
                <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="e.g. INV-12345" />
              </div>
              <div className="space-y-2">
                <Label>Invoice File (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => document.getElementById('invoice-upload')?.click()}>
                  <Input 
                    id="invoice-upload" 
                    type="file" 
                    accept="image/*,.pdf" 
                    className="hidden" 
                    onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)}
                  />
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-sm text-slate-500 font-medium">
                    {invoiceFile ? invoiceFile.name : "Click to upload invoice"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional details..." />
              </div>

              <div className="pt-4 border-t mt-4 flex justify-between items-center">
                <span className="font-bold text-slate-600">Total Est. Cost</span>
                <span className="text-xl font-black text-primary">${totalCalculatedAmount.toFixed(2)}</span>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-4" 
                disabled={createPurchase.isPending || isUploading || items.length === 0}
              >
                {createPurchase.isPending || isUploading ? 'Processing...' : 'Complete Receive Stock'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
