'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
// Import Supabase client (adjust path as needed)
import { supabase } from '@/lib/supabase' // Import the initialized supabase client
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function PaymentPage() {
  const merchantUpi = '8700619530@ibl'
  const [status, setStatus] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const id = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (id && amount) {
      setOrderId(id);
      setTotalAmount(parseFloat(amount));
    } else {
      setStatus('❌ Error: Missing order details.');
    }
  }, [searchParams, navigate]);

  const confirmPayment = async () => {
    if (!orderId) {
      setStatus('❌ Error: Order ID is missing.');
      return;
    }
    setStatus('Checking payment status...')

    // Simulate payment gateway response
    setTimeout(async () => {
      const paid = Math.random() > 0.4 // 60% chance of success
      const generatedTransactionId = `TXN${Math.floor(Math.random() * 1000000)}`;

      if (paid) {
        setStatus('✅ Payment successful!')
        setTransactionId(generatedTransactionId);
        setShowReceipt(true)

        // Store transaction in Supabase
        try {
          const { data, error } = await supabase
            .from('transactions') // Assuming you have a 'transactions' table
            .insert([
              {
                order_id: orderId,
                amount: totalAmount,
                payment_method: 'UPI',
                transaction_id: generatedTransactionId,
                status: 'Completed',
                upi_id: merchantUpi,
              },
            ]);

          if (error) {
            console.error('Error storing transaction in Supabase:', error);
            // Handle error (e.g., show an error message to the user)
          } else {
            console.log('Transaction stored successfully:', data);
          }
        } catch (error) {
          console.error('Error during Supabase operation:', error);
          // Handle error
        }

      } else {
        setStatus('❌ Payment failed. Please try again.')
        setShowReceipt(false);
        setTransactionId(null);
      }
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Scan & Pay</h2>

      <div className="flex flex-col items-center gap-2 mb-4">
        <img
          src="/phonepe-qr-code.jpeg"
          alt="QR Code"
          width={200}
          height={200}
        />
        <p className="text-center font-medium">
          Pay to: <span className="text-blue-600">{merchantUpi}</span>
        </p>
      </div>

      {orderId && totalAmount > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Order Summary (Order ID: {orderId}):</h3>
          <p className="font-semibold">Total: ₹{totalAmount.toFixed(2)}</p>
        </div>
      )}

      <Button className="w-full mt-4" onClick={confirmPayment} disabled={!orderId || totalAmount <= 0}>
        I Have Paid
      </Button>

      {status && <p className="text-center mt-4">{status}</p>}

      {showReceipt && transactionId && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">🧾 Receipt</h3>
          <p>Transaction ID: {transactionId}</p>
          <p>Amount Paid: ₹{totalAmount.toFixed(2)}</p>
          <p>Paid To: {merchantUpi}</p>
          <p>Date: {new Date().toLocaleString()}</p>
        </div>
      )}
    </div>
  )
} 