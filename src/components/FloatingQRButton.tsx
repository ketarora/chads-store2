import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCodeModal from './QRCodeModal';

const FloatingQRButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const instagramUrl = "https://www.instagram.com/chadscomments?igsh=MW12cHZ4amtvbXo5bg==";
  const storeUrl = "https://vibethreadz.com";

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-brand-blue text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse-light"
        aria-label="Scan QR Code"
      >
        <QrCode className="w-6 h-6" />
      </button>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-white rounded-2xl shadow-2xl border-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Quick Access</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center py-4">
            {/* Instagram Block */}
            <div className="flex flex-col items-center">
              <span className="font-semibold mb-2">Instagram</span>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(instagramUrl)}`} alt="Instagram QR" className="w-40 h-40 mb-2" />
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue underline">@chadscomments</a>
            </div>
            {/* Store/Product Block */}
            <div className="flex flex-col items-center">
              <span className="font-semibold mb-2">Store</span>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(storeUrl)}`} alt="Store QR" className="w-40 h-40 mb-2" />
              <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue underline">Visit Store</a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingQRButton;
