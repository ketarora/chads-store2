import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info, Instagram, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose }) => {
  const handleInstagramDM = () => {
    window.open('https://instagram.com/direct/t/chadstore_official', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl max-h-[80vh] bg-white rounded-2xl shadow-2xl border-0 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Info className="h-5 w-5" />
            About Chads Store
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-brand-blue">Our Brand Story</h3>
            <p>
              Chads Store was born from a desire to create clothing and accessories that speak to the energy of Gen Z culture. 
              We're not just selling products—we're creating a community that celebrates authenticity, creativity, and self-expression.
            </p>
            
            <h3 className="text-lg font-bold text-brand-blue mt-4">Quality & Sustainability</h3>
            <p>
              Every Chads Store product is crafted with premium materials and designed to last. 
              We're committed to ethical manufacturing practices and reducing our environmental footprint 
              through eco-friendly materials and production methods.
            </p>
            
            <h3 className="text-lg font-bold text-brand-blue mt-4">The Drops</h3>
            <p>
              Our limited-edition drops feature unique designs that capture the zeitgeist of youth culture. 
              Each collection tells a story and once they're gone, they're gone forever. 
              Join our notification list to be the first to know when new merch drops!
            </p>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-3">Contact & Support</h4>
              <div className="space-y-2">
                <Button 
                  onClick={handleInstagramDM}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  DM us on Instagram
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  @chadstore_official
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold">GST Information</h4>
              <p className="text-sm text-gray-600">
                GSTIN: 29AABCU9603R1ZX<br />
                All prices are inclusive of 18% GST
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={onClose}
              className="bg-brand-blue text-white"
            >
              Got It
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreModal;
