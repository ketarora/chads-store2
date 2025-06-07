import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { upi } = req.body

  // Replace with actual UPI validation logic or API call
  const isValid = upi === 'valid@upi' // Placeholder condition

  if (isValid) {
    res.status(200).json({ status: 'success', name: 'User Name' })
  } else {
    res.status(200).json({ status: 'failure' })
  }
} 