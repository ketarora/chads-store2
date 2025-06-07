import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardVerified: (cardDetails: { cardNumber: string; expiryDate: string; cvv: string }) => void;
}

const CardPaymentModal: React.FC<CardPaymentModalProps> = ({
  isOpen,
  onClose,
  onCardVerified,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      toast({
        title: "Missing Card Details",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate card verification
    setTimeout(() => {
      setIsLoading(false);
      // Basic validation: check format (very simple)
      if (cardNumber.length >= 16 && expiryDate.includes('/') && cvv.length >= 3) {
        toast({
          title: "Card Details Verified",
          description: "Your card details have been verified.",
        });
        onCardVerified({ cardNumber, expiryDate, cvv });
        onClose();
      } else {
        toast({
          title: "Invalid Card Details",
          description: "Please check your card number, expiry date (MM/YY), and CVV.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Enter Card Details</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="card-number">Card Number</Label>
            <Input
              id="card-number"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="e.g., 1234 5678 9012 3456"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input
                id="expiry-date"
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="e.g., 123"
                disabled={isLoading}
              />
            </div>
          </div>
          <Button onClick={handleVerify} className="w-full bg-brand-blue text-white" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Card Details"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardPaymentModal; 