'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDatabase } from '@/hooks/useDatabase' // Import useDatabase hook
import { useAuth } from '@/hooks/useAuth' // Import useAuth hook
import { toast } from '@/hooks/use-toast'

export default function PaymentPage() {
  const merchantUpi = '8700619530@ibl'
  const [status, setStatus] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)
  const { createOrder } = useDatabase(); // Get createOrder function from hook
  const { user } = useAuth(); // Get user from auth hook

  // NOTE: In a real application, cartItems and total would be passed as props or fetched
  // from a shared state/context, not hardcoded.
  const cartItems = [
    { name: 'T-shirt (Size M)', price: 499 },
    { name: 'Headphones', price: 999 },
  ]
  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  const confirmPayment = async () => { // Made async to await Supabase call
    setStatus('Checking payment status...')

    setTimeout(async () => { // Added async here too
      const paid = Math.random() > 0.4 // 60% chance of success
      if (paid) {
        setStatus('✅ Payment successful!')
        setShowReceipt(true)

        // --- Supabase Integration --- 
        if (user) { // Only save if user is logged in
            try {
                const orderDetails = {
                    user_id: user.id, // Get user ID
                    items: cartItems, // Use the items listed in this component
                    total_amount: total, // Use the total from this component
                    payment_method: 'UPI/QR', // Or determine based on flow
                    transaction_id: `TXN${Math.floor(Math.random() * 1000000)}`, // Generate a simple ID
                    status: 'completed',
                    notes: 'Payment via QR scan', // Add a default note
                    address: 'N/A', // Address is not captured in this simple flow
                    device_info: navigator.userAgent, // Capture device info
                    order_date: new Date().toISOString(), // Capture date
                };

                const { data, error } = await createOrder(orderDetails);

                if (error) {
                    console.error('Error saving order to Supabase:', error);
                    toast({
                        title: "Order Save Error",
                        description: "Payment was successful, but failed to save order details.",
                        variant: "destructive",
                    });
                } else {
                    console.log('Order saved to Supabase:', data);
                     toast({
                        title: "Order Saved",
                        description: "Payment and order details successfully recorded.",
                    });
                }
            } catch (error) {
                console.error('Unexpected error saving order:', error);
                 toast({
                    title: "Unexpected Error",
                    description: "An unexpected error occurred while saving the order.",
                    variant: "destructive",
                });
            }
        } else {
            console.warn('User not logged in, skipping Supabase order save.');
             toast({
                title: "User Not Logged In",
                description: "Order details not saved because you are not logged in.",
                variant: "default",
            });
        }
        // --- End Supabase Integration ---

      } else {
        setStatus('❌ Payment failed. Please try again.')
      }
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Scan & Pay</h2>

      <div className="flex flex-col items-center gap-2 mb-4">
        <Image
          // NOTE: Ensure 'phonepe-qr-code.jpeg' is in your public directory
          src="/phonepe-qr-code.jpeg"
          alt="QR Code"
          width={200}
          height={200}
        />
        <p className="text-center font-medium">
          Pay to: <span className="text-blue-600">{merchantUpi}</span>
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Items in Cart:</h3>
        <ul className="list-disc list-inside text-sm mb-2">
          {cartItems.map((item, i) => (
            <li key={i}>{item.name} – ₹{item.price}</li>
          ))}
        </ul>
        <p className="font-semibold">Total: ₹{total}</p>
      </div>

      <Button className="w-full mt-4" onClick={confirmPayment} disabled={status === 'Checking payment status...'}>
        I Have Paid
      </Button>

      {status && <p className="text-center mt-4">{status}</p>}

      {showReceipt && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">🧾 Receipt</h3>
          <p>Transaction ID: TXN{Math.floor(Math.random() * 1000000)}</p>
          <p>Amount Paid: ₹{total}</p>
          <p>Paid To: {merchantUpi}</p>
          <p>Date: {new Date().toLocaleString()}</p>
        </div>
      )}
    </div>
  )
} 