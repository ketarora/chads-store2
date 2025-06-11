import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import PaymentSummary from './PaymentSummary';
import PaymentMethodModal from './PaymentMethodModal';
import { useDatabase } from '@/hooks/useDatabase';
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    getSubtotal,
    getGST,
    getTotal,
    addToCart
  } = useCart();
  const { createOrder, updateOrderStatusAndPayment } = useDatabase(); // Added updateOrderStatusAndPayment
  const { user } = useAuth();
  
  const [isPaying, setIsPaying] = useState(false); // Used for UPI's handleConfirmProceed
  const [order, setOrder] = useState<any>(null); // Stores the full order object from Supabase if needed
  const [currentInternalOrderId, setCurrentInternalOrderId] = useState(''); // Renamed for clarity, stores "VT-xxxxxx"
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPincode, setCustomerPincode] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [pincodeCity, setPincodeCity] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }
    // Directly proceed to UPI payment confirmation
    // setPaymentMethod('UPI');
    // setConfirmMessage("Do you want to proceed with UPI payment?");
    // setShowConfirm(true);
    // NOW: Open the payment method modal
    setShowPaymentMethod(true);
  };

  const handlePaymentSelect = async (method: string) => {
    setShowPaymentMethod(false); // Close the modal first

    if (method === 'card') {
      setProcessingPayment(true);
      toast({ title: "Initiating Card Payment", description: "Please wait..." });

      try {
        // 1. Create internal order first
        const dbCartItemsForOrder = cartItems.map(item => ({ // Prepare items for createOrder
          id: item.id,
          user_id: user?.id || '',
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          product_image: item.id === 'mystery-box' ? '/mystery-box-attached.jpg' : item.image,
          product_category: item.category,
          quantity: item.quantity,
          created_at: new Date().toISOString(),
        }));

        const internalOrder = await createOrder(dbCartItemsForOrder, {
          subtotal: getSubtotal(),
          gst: getGST(),
          total: getTotal(),
          payment_method: 'Card (Razorpay)', // Indicate payment method
          transaction_id: 'Pending Razorpay',   // Placeholder until payment is done
          status: 'Pending Payment',       // Initial status
          items: dbCartItemsForOrder.map(item => ({ // Simplified item structure for 'orders' table
             id: item.product_id, name: item.product_name, quantity: item.quantity, price: item.product_price
          })),
          notes: customerNotes,
          address: customerAddress,
          pincode: customerPincode,
          device: navigator.userAgent,
          date: new Date().toISOString(),
        });

        if (!internalOrder || !internalOrder.internal_order_id) {
          toast({ title: "Order Creation Failed", description: "Could not create an order in our system. Please try again.", variant: "destructive" });
          setProcessingPayment(false);
          return;
        }
        setCurrentInternalOrderId(internalOrder.internal_order_id); // Store our "VT-xxxxxx" ID
        console.log('Internal Order Created:', internalOrder.internal_order_id);

        // 2. Create Razorpay order
        toast({ title: "Processing Card Payment", description: "Connecting to payment gateway..." });
        const razorpayApiResponse = await fetch('/api/razorpay/createOrder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: getTotal() * 100,
            currency: 'INR',
            receipt: internalOrder.internal_order_id // Pass internal order_id as receipt
          }),
        });
        const razorpayOrderPayload = await razorpayApiResponse.json();
        if (!razorpayApiResponse.ok) {
          setProcessingPayment(false);
          throw new Error(razorpayOrderPayload.error || 'Failed to create Razorpay order');
        }
        console.log('Razorpay Order Created:', razorpayOrderPayload);

        const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKeyId) {
          console.error('Razorpay Key ID is not defined in environment variables.');
          toast({ title: "Configuration Error", description: "Razorpay payments are currently unavailable. Please try another method.", variant: "destructive" });
          setProcessingPayment(false);
          return;
        }

        if (!(window as any).Razorpay) {
          console.error('Razorpay SDK not loaded.');
          toast({ title: "Error", description: "Payment gateway failed to load. Please refresh and try again.", variant: "destructive" });
          setProcessingPayment(false);
          return;
        }

        const options = {
          key: razorpayKeyId,
          amount: razorpayOrderPayload.amount.toString(), // Amount is in currency subunits. Default currency is INR.
          currency: razorpayOrderPayload.currency,
          name: 'Glowsy Galaxy Shop',
          description: `Payment for Order ID: ${internalOrder.internal_order_id}`,
          order_id: razorpayOrderPayload.id,
          handler: async function (rzpResponse: any) { // Made handler async
            toast({ title: "Payment Submitted", description: "Verifying payment details..." });
            // setProcessingPayment(true) should already be true and remain true

            try {
              const verificationResponse = await fetch('/api/razorpay/verifySignature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: rzpResponse.razorpay_order_id,
                  razorpay_payment_id: rzpResponse.razorpay_payment_id,
                  razorpay_signature: rzpResponse.razorpay_signature,
                }),
              });

              const verificationResult = await verificationResponse.json();

              if (verificationResult.verified) {
                toast({ title: "Payment Verified!", description: "Updating your order status..." });

                const updateResult = await updateOrderStatusAndPayment(
                  internalOrder.internal_order_id, // Use the stored internal order ID
                  rzpResponse.razorpay_payment_id,
                  'Paid'
                );

                if (updateResult) {
                  toast({ title: "Order Confirmed!", description: "Your order has been placed successfully." });
                  clearCart();
                  onClose(); // Close cart modal
                  navigate(`/order-success?orderId=${internalOrder.internal_order_id}&paymentId=${rzpResponse.razorpay_payment_id}`);
                } else {
                  toast({ title: "Order Update Failed", description: "Payment verified, but failed to update order. Please contact support.", variant: "destructive" });
                }
              } else {
                toast({ title: "Payment Verification Failed", description: verificationResult.error || "Signature mismatch. Please contact support.", variant: "destructive" });
              }
            } catch (verificationError: any) {
              console.error('Error during payment verification or order update:', verificationError);
              toast({ title: "Verification Process Error", description: "An error occurred during payment verification. Please contact support.", variant: "destructive" });
            } finally {
              setProcessingPayment(false); // Set processing to false after all steps in handler are done or if error
            }
          },
          prefill: {
            name: user?.user_metadata?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          notes: {
            internal_order_id: internalOrder.internal_order_id,
            customer_notes: customerNotes || '',
          },
          theme: {
            color: '#4A00E0', // Example theme color
          },
          modal: {
            ondismiss: function () {
              console.log('Razorpay payment modal dismissed.');
              toast({ title: "Payment Cancelled", description: "You cancelled the payment.", variant: "destructive" });
              setProcessingPayment(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);

        rzp.on('payment.failed', function (response: any) {
          console.error('Razorpay payment failed:', response.error);
          toast({
            title: "Payment Failed",
            description: `Error: ${response.error.description} (Reason: ${response.error.reason})`,
            variant: "destructive",
          });
          setProcessingPayment(false);
        });

        rzp.open();

      } catch (error: any) { // This catch is for the fetch to /api/razorpay/createOrder
        console.error('Razorpay order creation API error:', error);
        toast({ title: "Error", description: error.message, variant: "destructive" });
        // setProcessingPayment(false) is already called if !response.ok,
        // but if fetch itself fails (network error), it needs to be here too.
        // However, the Razorpay modal logic now handles setProcessingPayment(false) on its own lifecycle.
        // The primary setProcessingPayment(true) is at the start of 'card' method.
        // If API fails before Razorpay SDK is invoked, we need to ensure it's reset.
        // This catch is for the try block wrapping internal order creation and Razorpay order creation
      } catch (error: any) {
        console.error('Error during card payment pre-processing or Razorpay setup:', error);
        toast({ title: "Payment Setup Error", description: error.message || "Could not initiate card payment.", variant: "destructive" });
        setProcessingPayment(false); // Ensure processing is false if any setup step fails
      }
      // Note: The setProcessingPayment(false) that was in a finally block for the fetch to /api/razorpay/createOrder
      // is now effectively handled by the new outer try/catch's finally in the handler,
      // or by explicit setProcessingPayment(false) calls on error before rzp.open().
    } else if (method === 'upi') {
      setPaymentMethod('UPI');
      // For UPI, we might also want to create the internal order before showing QR
      // For consistency, let's try to create the order here as well.
      // This assumes handleConfirmProceed will then use this orderId.
      // This part is becoming complex, handleConfirmProceed also creates an order.
      // For now, let's keep UPI as is, and focus on card payment's orderId.
      // To do this properly, handleConfirmProceed would need to be refactored to accept an orderId
      // or also use the setCurrentInternalOrderId pattern.
      // For this subtask, the main goal is Razorpay flow.
      setConfirmMessage("Do you want to proceed with UPI payment?");
      setShowConfirm(true);
    } else if (method === 'cod') {
      console.log("Cash on Delivery selected");
      toast({ title: "Cash on Delivery", description: "COD selected. Further implementation needed." });
      // TODO: Implement COD logic (e.g. save order with COD status)
      // For now, let's simulate creating an order for COD
      // This part would typically involve calling createOrder with 'COD'
      // and then navigating to a success page or showing a message.
      // As a placeholder:
      // onClose(); // Close cart
    }
  };

  const handleConfirmProceed = async () => {
    setShowConfirm(false);

    console.log('User object state:', user);
    setIsPaying(true);

    // If user is logged in, create order in Supabase
    if (user) {
      console.log('User is logged in. Attempting to create order.');
      try {
        const dbCartItems = cartItems.map(item => ({
          id: item.id,
          user_id: user.id,
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          product_image: item.id === 'mystery-box' ? '/mystery-box-attached.jpg' : item.image,
          product_category: item.category,
          quantity: item.quantity,
          created_at: new Date().toISOString(),
        }));

        const order = await createOrder(dbCartItems, {
          subtotal: getSubtotal(),
          gst: getGST(),
          total: getTotal(),
          payment_method: 'UPI', // Always 'UPI'
          transaction_id: 'Pending', // Set to pending initially
          status: 'Pending',
          items: dbCartItems,
          notes: customerNotes,
          address: customerAddress,
          pincode: customerPincode,
          device: navigator.userAgent,
          date: new Date().toISOString(),
        });

        // Check if the order was created successfully
        if (!order || !order.order_id) {
          console.error("Order creation failed or returned no order ID for logged in user.", order);
          toast({
            title: "Error",
            description: "Failed to create order. Please try again.",
            variant: "destructive",
          });
          setIsPaying(false);
          return; // Stop execution if order creation failed
        }

        setOrder(order);
        const createdOrderId = order?.internal_order_id || order?.order_id || ''; // Prioritize internal_order_id
        setCurrentInternalOrderId(createdOrderId); // Ensure state is updated for UPI flow too if order is made here.

        // Redirect to the new payment page with order details
        navigate(`/payment?orderId=${createdOrderId}&amount=${getTotal()}`);

        // Clear cart after order is created and user is redirected
        clearCart();
        onClose(); // Close the cart modal

      } catch (error) {
        console.error("Error creating order for logged in user:", error);
        toast({
          title: "Error",
          description: "There was an error creating your order.",
          variant: "destructive",
        });
        setIsPaying(false);
      }
    } else { // If user is NOT logged in, proceed without creating order in Supabase
      console.log('User is NOT logged in. Proceeding to payment directly.');
      console.log("Proceeding to payment without user login.");
      // Redirect to the new payment page with anonymous indicator
      // You might pass cart details here if needed on the payment page
      navigate(`/payment?orderId=anonymous&amount=${getTotal()}`);

      // Clear cart (optional for anonymous flow, depends on requirements)
      clearCart();
      onClose(); // Close the cart modal
      setIsPaying(false);
    }
  };

  // Ensure mystery box image is correct in cart display
  const dbCartItems = cartItems.map(item => ({
    id: item.id,
    user_id: user?.id || '',
    product_id: item.id,
    product_name: item.name,
    product_price: item.price,
    product_image: item.id === 'mystery-box' ? '/mystery-box-attached.jpg' : item.image, // Use attached image for mystery box
    product_category: item.category,
    quantity: item.quantity,
    created_at: new Date().toISOString(),
  }));

  async function getLocationAndSendToBackend(userId: string) {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Location access is not supported by your browser.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      // Reverse geocode using OpenStreetMap Nominatim (FREE API)
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();

        const locationDetails = {
          userId,
          lat: latitude,
          lon: longitude,
          city: data.address?.city || data.address?.town || data.address?.village || '',
          state: data.address?.state || '',
          pincode: data.address?.postcode || '',
          fullAddress: data.display_name,
        };

        // Send to backend API route
        // IMPORTANT: Update this URL if your Next.js API route path is different
        const backendRes = await fetch('/api/save-location', { // Using Next.js API route path
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(locationDetails),
        });

        const result = await backendRes.json();
        console.log('Location saved:', result);
        toast({
          title: "Location Fetched!",
          description: `Fetched: ${locationDetails.city}, ${locationDetails.state}, ${locationDetails.pincode}`, // Or update address field directly
        });
        // OPTIONAL: Automatically fill the address textarea with the fetched full address
        // setCustomerAddress(locationDetails.fullAddress);

      } catch (error) {
        console.error('Error during geocoding or sending to backend:', error);
        toast({
          title: "Location Error",
          description: "Could not fetch or save location.",
          variant: "destructive",
        });
      }

    }, (error) => {
      console.error('Error getting location:', error);
      let errorMessage = 'Location access denied or unavailable';
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 'Location permission denied. Please enable it in your browser/device settings.';
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = 'Location information is unavailable.';
      } else if (error.code === error.TIMEOUT) {
        errorMessage = 'The request to get user location timed out.';
      }
      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive",
      });
    });
  }

  const handlePincodeValidation = async () => {
    if (customerPincode.length !== 6 || !/^[0-9]+$/.test(customerPincode)) {
      setPincodeCity(null);
      toast({
        title: "Invalid Pincode Format",
        description: "Pincode must be 6 digits.",
        variant: "destructive",
      });
      return;
    }

    setPincodeCity("Verifying pincode...");
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${customerPincode}`);
      const data = await response.json();

      if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const city = postOffice.District;
        const state = postOffice.State;
        setPincodeCity(`${city}, ${state}`);
        toast({
          title: "Pincode Validated",
          description: `City: ${city}, State: ${state}`,
          variant: "default",
        });
      } else {
        setPincodeCity(null);
        toast({
          title: "Invalid Pincode",
          description: "No records found for this pincode.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error validating pincode:", error);
      setPincodeCity(null);
      toast({
        title: "Pincode Validation Error",
        description: "Failed to validate pincode. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl border-0 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" /> 
              Your Cart
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4"> {/* Added py-4 for vertical padding around this section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Delivery Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer-address" className="mb-1 block text-sm font-medium text-gray-700">Shipping Address</Label>
                  <Textarea
                    id="customer-address"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Enter your full shipping address..."
                    rows={3}
                    className="resize-none" // Added to prevent manual resize if not desired
                  />
                  <button
                    onClick={() => getLocationAndSendToBackend(user?.id || 'anonymous')}
                    className="mt-2 text-sm text-brand-blue hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue rounded"
                    type="button"
                  >
                    Use My Current Location
                  </button>
                </div>
                <div>
                  <Label htmlFor="customer-pincode" className="mb-1 block text-sm font-medium text-gray-700">Pincode</Label>
                  <div className="flex items-start gap-2"> {/* Changed to items-start for better alignment if button is taller */}
                    <Input
                      id="customer-pincode"
                      type="text" // Keep as text to allow non-numeric if needed, validation handles digits
                      value={customerPincode}
                      onChange={(e) => setCustomerPincode(e.target.value)}
                      placeholder="Enter 6-digit pincode"
                      className="flex-grow"
                      maxLength={6} // Added maxLength for pincode
                    />
                    <Button
                      onClick={handlePincodeValidation}
                      type="button"
                      variant="outline"
                      className="flex-shrink-0"
                      disabled={processingPayment} // Assuming processingPayment might disable this
                    >
                      Validate
                    </Button>
                  </div>
                  {pincodeCity && (
                    <p className="mt-1 text-xs text-gray-500"> {/* Adjusted text size for pincode city */}
                      {pincodeCity.startsWith("Verifying") ? pincodeCity : `Deliverable to: ${pincodeCity}`}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2"> {/* Added some top padding to separate from address */}
              <Label htmlFor="customer-notes" className="mb-1 block text-sm font-medium text-gray-700">Order Notes <span className="text-xs text-gray-500">(Optional)</span></Label>
              <Textarea
                id="customer-notes" // Changed from customerNotes to customer-notes for consistency
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Any special instructions for your order?"
                rows={2} // Reduced rows from 3 to 2 for notes
                className="resize-none"
              />
            </div>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">Your cart is empty</p>
                <Button 
                  onClick={onClose}
                  className="mt-4"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center p-3 border-b">
                      <img 
                        src={item.id === 'mystery-box' ? '/mystery-box-attached.jpg' : item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="font-medium text-brand-blue">₹{(item.price * 83).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-2 w-6 text-center">{item.quantity}</span>
                        <button 
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 p-1.5 rounded-full text-red-500 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{(getSubtotal() * 83).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span>₹{(getGST() * 83).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>₹{(getTotal() * 83).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    className="w-full bg-brand-blue text-white"
                    onClick={handleCheckout}
                    disabled={isPaying || processingPayment}
                  >
                    {isPaying ? "Processing Payment..." : "Proceed to Checkout"}
                  </Button>
                </div>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  <p>GSTIN: 29AABCU9603R1ZX</p>
                  <p>All prices are inclusive of 18% GST</p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog (after payment method selection) */}
      <ConfirmDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <ConfirmDialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl border-0">
          <ConfirmDialogHeader>
            <ConfirmDialogTitle className="text-xl font-bold">Confirm Payment</ConfirmDialogTitle>
          </ConfirmDialogHeader>
          <div className="py-4 text-center">
            <p>{confirmMessage}</p>
            <div className="mt-6 flex justify-center gap-4">
              <Button onClick={handleConfirmProceed} className="bg-brand-blue text-white" disabled={isPaying || processingPayment}>
                {isPaying ? "Processing..." : "Yes, Proceed"}
              </Button>
              <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isPaying}>Cancel</Button>
            </div>
          </div>
        </ConfirmDialogContent>
      </ConfirmDialog>

      <PaymentMethodModal
        isOpen={showPaymentMethod}
        onClose={() => setShowPaymentMethod(false)}
        onPaymentSelect={handlePaymentSelect}
        total={getTotal()}
      />
      
      <PaymentSummary 
        isOpen={showPaymentSummary}
        onClose={() => setShowPaymentSummary(false)}
        orderId={currentInternalOrderId} // Use currentInternalOrderId
        paymentMethod={paymentMethod || ''}
        purchasedItems={purchasedItems}
        transactionId={order?.transaction_id}
        order={order}
        isProcessing={isPaying}
      />
    </>
  );
};

export default Cart;
