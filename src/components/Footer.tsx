
import React from 'react';
import { QrCode } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Vibe<span className="text-brand-blue">Threadz</span></h3>
            <p className="text-gray-400 mb-6">Fresh merch for the culture. Limited drops, unlimited vibes.</p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'tiktok'].map(social => (
                <a 
                  key={social}
                  href={`#${social}`} 
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-blue transition-colors duration-300"
                >
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22c-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Shop</h4>
            <ul className="space-y-2">
              {['T-Shirts', 'Bottles', 'New Arrivals', 'Coming Soon', 'Giveaways'].map(item => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-400 hover:text-brand-green transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Info</h4>
            <ul className="space-y-2">
              {['About Us', 'Blog', 'Community', 'Contact', 'FAQs'].map(item => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-400 hover:text-brand-green transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Subscribe</h4>
            <p className="text-gray-400 mb-4">Get exclusive access to drops and discounts</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none w-full"
              />
              <button
                type="submit"
                className="bg-brand-blue px-4 py-2 rounded-r-lg hover:bg-opacity-90 transition-colors duration-200"
              >
                Join
              </button>
            </form>
            <div className="flex items-center mt-6 space-x-2">
              <QrCode className="w-5 h-5 text-brand-green" />
              <span className="text-sm text-gray-400">Scan for exclusive mobile access</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 VibeThreadz. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#terms" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Terms</a>
            <a href="#privacy" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Privacy</a>
            <a href="#cookies" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
