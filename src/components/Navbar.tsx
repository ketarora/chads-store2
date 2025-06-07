import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface NavbarProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartOpen, onAuthOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const cartItemsCount = getTotalItems();
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={cn(
      "fixed w-full top-0 left-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white shadow-md py-2" : "bg-white/95 backdrop-blur-sm shadow-sm py-3"
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="/" className="flex items-center">
          <h1 className={cn(
            "text-2xl md:text-3xl font-black transition-all duration-300",
            "text-brand-black"
          )}>
            Chads<span className="text-brand-blue">Store</span>
          </h1>
        </a>
        
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { name: 'Shop', id: 'shop' },
            { name: 'About', id: 'about' },
            { name: 'Community', id: 'community' },
            { name: 'Contact', id: 'contact' }
          ].map((item) => (
            <button 
              key={item.name} 
              onClick={() => scrollToSection(item.id)}
              className="font-medium text-lg hover:text-brand-blue transition-colors duration-200 text-brand-black"
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          {/* Cart Button */}
          <button 
            onClick={onCartOpen}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <ShoppingBag className="w-6 h-6 text-brand-black" />
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-brand-blue text-white" variant="destructive">
                {cartItemsCount}
              </Badge>
            )}
          </button>

          {/* Auth Button */}
          {!user ? (
            <button 
              onClick={onAuthOpen}
              className="bg-brand-green text-brand-black hover:bg-opacity-90 transition duration-200 
                        font-bold py-2 px-4 rounded-lg shadow-sm flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="font-bold text-brand-black text-sm hidden sm:inline">
                Hello, {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}!
              </span>
              <Button 
                onClick={async () => {
                  const { error } = await signOut();
                  if (!error) {
                    toast({
                      title: "Logged Out",
                      description: "You have been successfully logged out.",
                      variant: "default",
                    });
                  } else {
                    toast({
                      title: "Logout Error",
                      description: error.message,
                      variant: "destructive",
                    });
                  }
                }}
                className="bg-red-500 text-white hover:bg-red-600 transition duration-200 
                          font-bold py-2 px-4 rounded-lg shadow-sm"
              >
                Logout
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 focus:outline-none text-brand-black"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isAdmin(user) && (
            <>
              <button
                className="ml-4 px-3 py-2 rounded bg-brand-blue text-white font-bold hover:bg-brand-green transition"
                onClick={() => setAdminDrawerOpen(true)}
              >
                Admin Panel
              </button>
              <Drawer open={adminDrawerOpen} onOpenChange={setAdminDrawerOpen} shouldScaleBackground={false}>
                <DrawerContent className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50">
                  <DrawerHeader>
                    <DrawerTitle>Admin & Analytics</DrawerTitle>
                  </DrawerHeader>
                  {/* Google Analytics and data overview UI will go here */}
                  <div className="p-4">
                    <h3 className="font-bold mb-2">Google Analytics</h3>
                    <input type="text" placeholder="Tracking ID (UA-XXXX...)" className="w-full border p-2 rounded mb-4" />
                    <button className="bg-brand-blue text-white px-4 py-2 rounded">Save</button>
                    <hr className="my-4" />
                    <h3 className="font-bold mb-2">Data Overview</h3>
                    <p className="text-sm text-gray-500">(Coming soon: Orders, Users, etc.)</p>
                  </div>
                </DrawerContent>
              </Drawer>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {[
              { name: 'Shop', id: 'shop' },
              { name: 'About', id: 'about' },
              { name: 'Community', id: 'community' },
              { name: 'Contact', id: 'contact' }
            ].map((item) => (
              <button 
                key={item.name} 
                onClick={() => {
                  scrollToSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-brand-black hover:text-brand-blue rounded-md"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
