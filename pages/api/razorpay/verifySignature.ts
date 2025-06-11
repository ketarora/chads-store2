import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    console.error('Razorpay Key Secret is not set in environment variables.');
    return res.status(500).json({ error: 'Server configuration error: Missing Razorpay secret.' });
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing Razorpay payment details for verification.' });
  }

  try {
    const signedRequestBody = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(signedRequestBody.toString()) // Ensure it's a string
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Signature matches, payment is authentic
      // TODO: At this point, you should update your database record for the order,
      // marking it as paid/completed and storing the razorpay_payment_id.
      // This logic will be in the client calling this API, after getting a success response.
      console.log(`Payment verification successful for Order ID: ${razorpay_order_id}, Payment ID: ${razorpay_payment_id}`);
      return res.status(200).json({ verified: true, paymentId: razorpay_payment_id });
    } else {
      // Signature does not match
      console.warn(`Payment verification failed for Order ID: ${razorpay_order_id}. Signature mismatch.`);
      return res.status(400).json({ verified: false, error: 'Signature mismatch' });
    }
  } catch (error) {
    console.error('Error during Razorpay signature verification:', error);
    return res.status(500).json({ error: 'Internal server error during payment verification.' });
  }
}
