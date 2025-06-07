
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  qrValue: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  qrValue
}) => {
  // Create QR code placeholder - in a real app, you'd use a QR code library
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`;

  // Close modal with escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          {description && (
            <p className="text-gray-500 text-center mb-6">{description}</p>
          )}
          <div className="bg-white p-3 rounded-xl shadow-lg mb-6 animate-float">
            <img 
              src={qrCodeUrl} 
              alt="QR Code"
              className="w-56 h-56 object-contain"
            />
          </div>
          <p className="text-sm text-gray-400 text-center">
            Scan this QR code with your phone camera to access this item
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
