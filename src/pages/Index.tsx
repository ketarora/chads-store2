import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import GiveawayCard from '@/components/GiveawayCard';
import FloatingQRButton from '@/components/FloatingQRButton';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import NotificationForm from '@/components/NotificationForm';
import LearnMoreModal from '@/components/LearnMoreModal';
import AuthModal from '@/components/AuthModal';
import ContactSection from '@/components/ContactSection';
import { ShoppingCart, Gift, Package, Sparkles, Star, Instagram } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import CartPincodePopup from '@/components/CartPincodePopup';

// Updated product data with your uploaded images
const products = [
  {
    id: '1',
    name: 'CC Premium T-Shirt',
    price: 29.99,
    image: '/lovable-uploads/5aba27bf-85b2-46fd-91be-532ec4f3968d.png',
    category: 'T-Shirt',
    isNew: true
  },
  {
    id: '2',
    name: 'CC Canvas Tote Bag',
    price: 19.99,
    image: '/lovable-uploads/50cb5d25-e482-4abe-8ea8-df8c18b0942b.png',
    category: 'Bag'
  },
  {
    id: '3',
    name: 'CC Insulated Coffee Cup',
    price: 24.99,
    image: '/lovable-uploads/ccb87bf8-7454-4597-b05b-7928ef563695.png',
    category: 'Cup',
    isPopular: true
  }
];

// Mystery box product
const mysteryBox = {
  id: 'mystery-box',
  name: 'CC Mystery Box',
  price: 49.99,
  originalPrice: 74.97,
  image: '/mystery-box-attached.jpg',
  category: 'Mystery Box',
  description: 'Get all 3 items + exclusive sticker pack at a special price!'
};

const Index: React.FC = () => {
  // State for modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPincodePopupOpen, setIsPincodePopupOpen] = useState(false);
  
  // Get cart items count
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    if (product.id === 'mystery-box') {
      toast({
        title: "Mystery Box Added!",
        description: "CC Mystery Box has been added to your cart.",
      });
    }
    setIsPincodePopupOpen(true);
  };
  
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar 
        onCartOpen={() => setIsCartOpen(true)}
        onAuthOpen={() => setIsAuthModalOpen(true)}
      />
      
      {/* Improved Coupon Banner */}
      <section className="fixed top-16 left-0 right-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-3 overflow-hidden shadow-lg z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-3 text-white">
            <Instagram className="w-5 h-5 text-yellow-300 animate-bounce flex-shrink-0" />
            <div className="text-center">
              <span className="font-bold text-sm md:text-lg">
                Follow us on Instagram for <span className="bg-yellow-300 text-purple-800 px-2 py-1 rounded-full font-black text-xs md:text-sm">EXCLUSIVE DEALS!</span>
              </span>
            </div>
            <Instagram className="w-5 h-5 text-yellow-300 animate-bounce flex-shrink-0" />
          </div>
        </div>
      </section>
      
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-r from-brand-black to-gray-900 flex items-center justify-center overflow-hidden" style={{ marginTop: '112px' }}>
        {/* Background patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-green rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight animate-float">
            Chads <span className="text-brand-blue">Store</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Premium merchandise for the culture. Elevate your style with our exclusive collection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-brand-blue text-white hover:bg-opacity-90 transition duration-200 
                      font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => setIsNotificationOpen(true)}
            >
              Get Notified
            </button>
            <button 
              className="bg-brand-green text-brand-black hover:bg-opacity-90 transition duration-200 
                      font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => setIsLearnMoreOpen(true)}
            >
              Learn More
            </button>
          </div>
          
          {/* Floating stickers */}
          <div className="absolute top-20 left-20 hidden md:block">
            <div className="bg-brand-pastel-yellow text-brand-black p-3 rounded-full transform rotate-12 shadow-lg">
              <span className="font-bold text-sm">New Collection!</span>
            </div>
          </div>
          <div className="absolute bottom-20 right-20 hidden md:block">
            <div className="bg-brand-pastel-pink text-brand-black p-3 rounded-full transform -rotate-12 shadow-lg">
              <span className="font-bold text-sm">Limited Edition!</span>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section id="shop" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-2">Choose Your Style</h2>
              <p className="text-gray-500">Get the mystery box or pick individual items</p>
            </div>
          </div>
          
          {/* Mystery Box Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-brand-black mb-6 text-center">You can choose the Mystery Box</h3>
            <div className="max-w-4xl mx-auto">
              <div className="relative group cursor-pointer" onClick={() => handleAddToCart(mysteryBox)}>
                <div className="bg-gradient-to-br from-brand-blue to-brand-green p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Left side - Text content */}
                    <div className="text-center lg:text-left flex-1">
                      <div className="relative inline-block mb-4">
                        <Package className="w-24 h-24 text-white mx-auto lg:mx-0" />
                        <Sparkles className="w-8 h-8 text-brand-pastel-yellow absolute -top-2 -right-2 animate-pulse" />
                      </div>
                      <h4 className="text-3xl font-black text-white mb-2">{mysteryBox.name}</h4>
                      <p className="text-blue-100 mb-4">{mysteryBox.description}</p>
                      <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                        <span className="text-2xl font-bold text-white">₹{(mysteryBox.price * 83).toFixed(2)}</span>
                        <span className="text-lg text-blue-200 line-through">₹{(mysteryBox.originalPrice * 83).toFixed(2)}</span>
                        <span className="bg-brand-pastel-yellow text-brand-black px-3 py-1 rounded-full text-sm font-bold">
                          Save ₹{((mysteryBox.originalPrice - mysteryBox.price) * 83).toFixed(2)}
                        </span>
                      </div>
                      <button className="bg-white text-brand-blue hover:bg-gray-100 transition duration-200 
                                    font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105">
                        Add Mystery Box to Cart
                      </button>
                    </div>
                    
                    {/* Right side - Sticker image */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img 
                          src="/lovable-uploads/46ff811f-31e0-4eb9-ab15-5937a97ccbe2.png" 
                          alt="Exclusive Sticker Pack"
                          className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-lg transform rotate-12 hover:rotate-6 transition-transform duration-300"
                        />
                        <div className="absolute -top-2 -right-2 bg-brand-pastel-yellow text-brand-black px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                          Bonus!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Individual Items Section - Single Line */}
          <div>
            <h3 className="text-2xl font-bold text-brand-black mb-6 text-center">Or choose one of the merchandise</h3>
            <div className="flex justify-center gap-6 md:gap-8 max-w-7xl mx-auto overflow-x-auto">
              {products.map(product => (
                <div key={product.id} className="flex-shrink-0 w-80">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-8">About Chads Store</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            We're more than just a clothing brand. We're a community of creators, dreamers, and 
            individuals who believe in expressing their authentic selves through premium fashion and accessories.
          </p>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-2">Join Our Community</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Connect with fellow Chads Store enthusiasts and be part of our growing community</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <GiveawayCard
              title="Win a VIP Merch Bundle"
              description="Get early access to our exclusive merch collection"
              image="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            />
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Newsletter Section */}
      <section className="py-16 md:py-20 bg-brand-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-blue-100 mb-8">Be the first to know about our new drops, exclusive offers, and community events</p>
            
            <form className="flex flex-col sm:flex-row gap-2 sm:gap-0 mb-8">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow px-4 py-3 rounded-l-lg sm:rounded-r-none focus:outline-none"
              />
              <button
                type="submit"
                className="bg-brand-green text-brand-black font-bold px-6 py-3 rounded-r-lg sm:rounded-l-none hover:bg-opacity-90 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
            
            <p className="text-xs text-blue-100">By subscribing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* Floating QR Button */}
      <FloatingQRButton />
      
      {/* Modals */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <NotificationForm isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
      <LearnMoreModal isOpen={isLearnMoreOpen} onClose={() => setIsLearnMoreOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartPincodePopup 
        isOpen={isPincodePopupOpen} 
        onClose={() => setIsPincodePopupOpen(false)} 
      />
    </div>
  );
};

export default Index;
