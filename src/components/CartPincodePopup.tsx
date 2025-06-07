'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Use Shadcn Dialog components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast' // Assuming you use the toast system

interface CartPincodePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onPincodeValid?: (pincode: string, location: string) => void; // Optional callback
}

export default function CartPincodePopup({ isOpen, onClose, onPincodeValid }: CartPincodePopupProps) {
  const [pincode, setPincode] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validatePincode = async () => {
    if (!pincode || pincode.length !== 6 || !/^[0-9]+$/.test(pincode)) {
      setError('Please enter a valid 6-digit Indian pincode')
      setLocation('')
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit Indian pincode.",
        variant: "destructive",
      });
      return
    }

    setLoading(true)
    setError('')
    setLocation('')

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      const data = await res.json()

      if (data && data[0] && data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0]; // Assuming the first post office is sufficient
        const fetchedLocation = `${postOffice.District}, ${postOffice.State}, India`;
        setLocation(fetchedLocation);
        toast({
            title: "Pincode Validated",
            description: `Deliverable to: ${fetchedLocation}.`, 
        });
        if(onPincodeValid) {
            onPincodeValid(pincode, fetchedLocation);
        }
      } else {
        setError('Invalid Indian Pincode')
         toast({
            title: "Invalid Pincode",
            description: "Could not find a valid location for this pincode.",
            variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error validating pincode:', err);
      setError('Error validating pincode. Please try again.')
       toast({
          title: "Validation Error",
          description: "An error occurred while validating the pincode.",
          variant: "destructive",
      });
    }

    setLoading(false)
  }

  return (
    // Using Shadcn Dialog components
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Enter Pincode to Check Delivery</DialogTitle>
        </DialogHeader>
         <div className="py-4 space-y-4">
            <div>
                <label htmlFor="pincode" className="block font-semibold mb-1">Pincode</label>
                <Input
                id="pincode"
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="mb-3"
                type="number"
                maxLength={6}
                />
            </div>

            <Button onClick={validatePincode} disabled={loading} className="w-full bg-brand-blue text-white">
            {loading ? 'Checking...' : 'Check Availability'}
            </Button>

            {location && (
            <p className="text-green-600 mt-3 text-sm">✅ Deliverable to: {location}</p>
            )}
            {error && (
            <p className="text-red-600 mt-3 text-sm">❌ {error}</p>
            )}
         </div>

        <Button variant="outline" onClick={onClose} className="mt-4 w-full">Close</Button>
      </DialogContent>
    </Dialog>
  )
} 