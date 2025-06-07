import { NextApiRequest, NextApiResponse } from 'next';

// This is a placeholder backend route to receive location data
// In a real application, you would save this data to your database
// or use it for other purposes (like calculating shipping).

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // Only allow POST requests
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId, lat, lon, city, state, pincode, fullAddress } = req.body;

    // Log the received location data
    console.log(`Received location for user ${userId}:`);
    console.log(` Lat: ${lat}, Lon: ${lon}`);
    console.log(` City: ${city}, State: ${state}, Pincode: ${pincode}`);
    console.log(` Full Address: ${fullAddress}`);

    // *** In a real app, you would save this data to your database here ***
    // Example: await db.from('user_locations').insert({...});

    // Send a success response back
    res.status(200).json({ message: 'Location received successfully', data: { city, state, pincode } });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ message: 'Failed to save location', error });
  }
} 