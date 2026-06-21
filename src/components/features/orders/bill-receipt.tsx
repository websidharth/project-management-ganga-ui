import React from "react";
import { format } from "date-fns";
import { Hash } from "lucide-react";

interface BillReceiptProps {
  order: any;
}

// Ensure the ref can be passed to the main wrapper
const BillReceipt = React.forwardRef<HTMLDivElement, BillReceiptProps>(
  ({ order }, ref) => {
    if (!order) return null;

    const datePlaced = order.createdAt
      ? format(new Date(order.createdAt), "PPP p")
      : "—";

    return (
      <div
        ref={ref}
        className="p-8 bg-white text-black max-w-[800px] mx-auto space-y-8"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-start border-b pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              INVOICE
            </h1>
            <div className="flex flex-col text-sm text-gray-600">
              <span className="font-semibold text-gray-800">
                Store Code: {order.storeCode}
              </span>
              <span>123 Store Address St.</span>
              <span>City, Country, ZIP</span>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center justify-end gap-1 text-gray-900 font-bold text-lg">
              <Hash className="h-4 w-4" />
              <span>{order.orderNumber}</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Date: {datePlaced}</p>
              <p>Status: <span className="font-semibold">{order.status}</span></p>
            </div>
          </div>
        </div>

        {/* Customer & Info Section */}
        <div className="flex justify-between items-start text-sm">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Billed To:</h3>
            <div className="text-gray-700">
              <p className="font-medium">Customer ID: {order.customerId}</p>
              {/* Additional customer details if available could go here */}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-2 font-semibold text-gray-800 uppercase text-xs tracking-wider">
                  Item / SKU
                </th>
                <th className="py-3 px-2 font-semibold text-gray-800 uppercase text-xs tracking-wider text-right">
                  Price
                </th>
                <th className="py-3 px-2 font-semibold text-gray-800 uppercase text-xs tracking-wider text-center">
                  Qty
                </th>
                <th className="py-3 px-2 font-semibold text-gray-800 uppercase text-xs tracking-wider text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {(order.items || []).map((item: any) => (
                <tr key={item.id}>
                  <td className="py-4 px-2">
                    <p className="font-semibold text-gray-900">
                      Product ID: {item.productId}
                    </p>
                    <p className="text-xs text-gray-500">
                      SKU: PROD-{item.productId}
                    </p>
                  </td>
                  <td className="py-4 px-2 text-right text-gray-800">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="py-4 px-2 text-center text-gray-800">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-2 text-right font-semibold text-gray-900">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
              {(!order.items || order.items.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-gray-500 italic"
                  >
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end pt-6">
          <div className="w-1/2 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span className="font-medium text-red-600">
                -${order.discount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span className="font-medium text-gray-900">
                ${order.tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">
                ${order.shippingCost.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
              <span className="font-bold text-gray-900 text-base">
                Grand Total
              </span>
              <span className="font-bold text-gray-900 text-lg">
                ${order.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-16 text-center text-xs text-gray-400 border-t mt-8">
          <p>Thank you for your business!</p>
          <p className="mt-1">
            If you have any questions concerning this invoice, please contact
            support.
          </p>
        </div>
      </div>
    );
  }
);

BillReceipt.displayName = "BillReceipt";

export default BillReceipt;
