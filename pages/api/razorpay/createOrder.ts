import Razorpay from 'razorpay'
import { NextApiRequest, NextApiResponse } from 'next'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Amount should be calculated on the backend to prevent tampering
  // For this example, we'll take it from the body, but ideally, you'd verify cart items and calculate server-side.
  const { amount, currency = 'INR' } = req.body // amount in base units (e.g., paisa for INR)

  if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const options = {
      amount: amount, // amount is expected in paisa/base units by Razorpay
      currency: currency,
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: '1' // Auto capture payment
    }

    const order = await razorpay.orders.create(options)
    res.status(200).json(order)
  } catch (err: any) {
    console.error('Razorpay order creation failed:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order', details: err.message })
  }
} 