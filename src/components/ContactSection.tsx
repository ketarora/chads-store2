import React, { useState } from 'react';
import { Instagram, MessageCircle } from 'lucide-react';
import QRCodeModal from './QRCodeModal';

const ContactSection: React.FC = () => {
  const [showQR, setShowQR] = useState(false);

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/chadscomments?igsh=MW12cHZ4amtvbXo5bg==', '_blank');
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-brand-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have questions? Want to collaborate? Reach out to us!
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Instagram className="w-6 h-6 text-pink-500" />
              Follow Us
            </h3>
            <p className="text-gray-300 mb-6">
              Stay updated with our latest drops and behind-the-scenes content
            </p>
            <button
              onClick={handleInstagramClick}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition duration-200 w-full"
            >
              @chadscomments
            </button>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-brand-green" />
              Quick Contact
            </h3>
            <p className="text-gray-300 mb-6">
              Scan the QR code to message us directly on Instagram
            </p>
            <button
              onClick={() => setShowQR(true)}
              className="bg-brand-green text-brand-black font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-200 w-full"
            >
              Show QR Code
            </button>
          </div>
        </div>
      </div>
      
      <QRCodeModal 
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        title="Instagram QR"
        qrValue="https://www.instagram.com/chadscomments?igsh=MW12cHZ4amtvbXo5bg=="
      />
    </section>
  );
};

export default ContactSection;
