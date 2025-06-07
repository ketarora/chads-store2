
import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import QRCodeModal from './QRCodeModal';

interface GiveawayCardProps {
  title: string;
  description: string;
  image: string;
}

const GiveawayCard: React.FC<GiveawayCardProps> = ({ title, description, image }) => {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    
    // Show QR modal after a slight delay for better UX
    setTimeout(() => {
      setShowQRCode(true);
    }, 500);
  };

  return (
    <div className="bg-gradient-to-r from-brand-pastel-purple to-brand-pastel-pink rounded-2xl shadow-xl overflow-hidden">
      <div className="relative aspect-video md:aspect-auto md:h-72 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 transform -rotate-2 animate-float">
            <h3 className="text-xl md:text-2xl font-black text-brand-black">
              {title}
            </h3>
            <p className="text-gray-700 text-sm md:text-base font-medium mt-1">
              {description}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="inline-block text-brand-blue font-semibold mb-1">
              Limited Time Offer
            </span>
            <p className="text-sm text-gray-500">
              Add to cart and scan QR code for instant access
            </p>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAddedToCart}
            className={`${
              isAddedToCart 
                ? 'bg-green-500 hover:bg-green-500' 
                : 'bg-brand-blue hover:bg-opacity-90'
            } text-white transition-all duration-300 font-bold py-3 px-6 rounded-lg shadow-lg flex items-center space-x-2`}
          >
            {isAddedToCart ? (
              <>
                <span>Added!</span>
                <QrCode className="w-5 h-5" onClick={() => setShowQRCode(true)} />
              </>
            ) : (
              <span>Add to Cart</span>
            )}
          </button>
        </div>
      </div>
      
      <QRCodeModal
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        title="Giveaway Access"
        description="Scan this QR code to access your giveaway item"
        qrValue="https://vibethreadz.com/giveaway"
      />
    </div>
  );
};

export default GiveawayCard;
