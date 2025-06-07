import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from '@/context/CartContext';

interface PaymentSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  paymentMethod: string;
  purchasedItems: CartItem[];
  transactionId?: string;
  order?: any;
  isProcessing?: boolean;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ 
  isOpen, 
  onClose, 
  orderId, 
  paymentMethod,
  purchasedItems,
  transactionId,
  order
}) => {
  // Calculate values from purchasedItems, not from useCart (which is now empty)
  const getSubtotal = () => purchasedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getGST = () => getSubtotal() * 0.18;
  const getTotal = () => getSubtotal() + getGST();
  
  // Use transactionId from props or generate if not present
  const txnId = transactionId || order?.transaction_id || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceNumber = order?.order_id || orderId || `INV-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString('en-IN');
  
  const getPaymentMethodName = (method: string) => {
    switch(method) {
      case 'upi': return 'UPI Payment';
      case 'card': return 'Card Payment';
      case 'cod': return 'Cash on Delivery';
      default: return 'Online Payment';
    }
  };

  const handleDownload = () => {
    // Create a simple text receipt
    const receiptContent = `
CHADS STORE - PAYMENT RECEIPT
==============================
Invoice: ${invoiceNumber}
Date: ${currentDate}
Order ID: ${orderId}
Transaction ID: ${txnId}

Items:
${purchasedItems.map(item => 
  `${item.name} x${item.quantity} - ₹${(item.price * 83 * item.quantity).toFixed(2)}`
).join('\n')}

Subtotal: ₹${(getSubtotal() * 83).toFixed(2)}
GST (18%): ₹${(getGST() * 83).toFixed(2)}
Total: ₹${(getTotal() * 83).toFixed(2)}

Payment Method: ${getPaymentMethodName(paymentMethod)}
GSTIN: 29AABCU9603R1ZX
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChadesStore_Receipt_${orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-2xl shadow-2xl border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Payment Receipt
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl">Chads Store</h3>
                <p className="text-gray-500 text-sm">
                  123 Fashion Street<br />
                  Mumbai, Maharashtra 400001<br />
                  India
                </p>
              </div>
              
              <div className="text-right">
                <p className="font-bold">Invoice: {invoiceNumber}</p>
                <p className="text-sm">Date: {currentDate}</p>
                <p className="text-sm">Order ID: {orderId}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Items</h4>
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {purchasedItems.map(item => {
                  const priceInRupees = item.price * 83;
                  const totalInRupees = priceInRupees * item.quantity;
                  
                  return (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">
                        <div className="flex items-center">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-10 h-10 object-cover rounded mr-2" 
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-500 text-xs">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-right py-2">₹{priceInRupees.toFixed(2)}</td>
                      <td className="text-right py-2">₹{totalInRupees.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{(getSubtotal() * 83).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>GST (18%)</span>
              <span>₹{(getGST() * 83).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span>₹{(getTotal() * 83).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold mb-2">Payment Information</h4>
                <p className="text-sm">
                  Payment Method: {getPaymentMethodName(paymentMethod)}<br />
                  Transaction ID: {txnId}<br />
                  Status: {paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid'}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Business Details</h4>
                <p className="text-sm">
                  GSTIN: 29AABCU9603R1ZX<br />
                  PAN: AABCU9603R<br />
                  CIN: U74999MH2023PTC123456
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center space-x-2">
            <Button 
              onClick={handleDownload}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </Button>
            <Button 
              onClick={onClose}
              className="bg-brand-blue text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSummary;
