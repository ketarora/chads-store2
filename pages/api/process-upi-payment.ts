import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { upi } = req.body

  // Replace with actual payment processing logic
  const paymentSuccess = true // Placeholder condition

  if (paymentSuccess) {
    const receipt = {
      transactionId: 'TXN123456',
      amount: 1000,
      date: new Date().toISOString(),
      upi
    }
    res.status(200).json({ status: 'success', receipt })
  } else {
    res.status(200).json({ status: 'failure' })
  }
} 