import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpiVerified: (upiId: string) => void;
}

const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  onUpiVerified,
}) => {
  const [upiId, setUpiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    if (!upiId) {
      toast({
        title: "UPI ID Required",
        description: "Please enter your UPI ID.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate UPI ID verification
    setTimeout(() => {
      setIsLoading(false);
      // Basic validation: check for @ symbol
      if (upiId.includes('@')) {
        toast({
          title: "UPI ID Verified",
          description: "Your UPI ID has been verified.",
        });
        onUpiVerified(upiId);
        onClose();
      } else {
        toast({
          title: "Invalid UPI ID",
          description: "Please enter a valid UPI ID (e.g., example@bank).",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Enter UPI ID</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="upi-id">Your UPI ID</Label>
            <Input
              id="upi-id"
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g., yourname@bank"
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleVerify} className="w-full bg-brand-blue text-white" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify UPI ID"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpiPaymentModal; 