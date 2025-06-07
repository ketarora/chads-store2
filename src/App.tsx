import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPanel from './components/AdminPanel';
import PaymentPage from './pages/payment';

// New AdminButton component
const AdminButton = ({ onOpen }: { onOpen: () => void }) => {
  const { user, isAdmin } = useAuth();
  if (!isAdmin(user)) return null;
  return (
    <button
      className="fixed top-4 right-4 z-50 bg-brand-blue text-white px-4 py-2 rounded shadow-lg"
      onClick={onOpen}
    >
      Admin Panel
    </button>
  );
};

const App = () => {
  const queryClient = new QueryClient();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AdminButton onOpen={() => setIsAdminPanelOpen(true)} />
            </BrowserRouter>
            <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
