
import React, { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    isNew?: boolean;
    isPopular?: boolean;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  
  // Convert price from dollars to rupees (approximate conversion)
  const priceInRupees = product.price * 83; // Assuming 1 USD = 83 INR

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <div 
      className="product-card relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {product.isNew && (
        <div className="absolute top-3 left-3 z-10">
          <span className="badge bg-brand-blue text-white px-3 py-1 text-xs font-semibold rounded-full">New Drop</span>
        </div>
      )}
      
      {product.isPopular && (
        <div className="absolute top-3 left-3 z-10">
          <span className="badge bg-brand-green text-brand-black px-3 py-1 text-xs font-semibold rounded-full">Hot</span>
        </div>
      )}
      
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={product.image} 
          alt={product.name} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <button 
            className="bg-brand-blue text-white hover:bg-opacity-90 transition duration-200 
                      font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full flex items-center justify-center gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
        
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md transition-transform duration-200 hover:scale-110"
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-colors duration-200",
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
            )} 
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-brand-black">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-brand-blue">₹{priceInRupees.toFixed(2)}</span>
          <span className="text-xs px-2 py-1 bg-brand-pastel-yellow rounded-full text-brand-black">In stock</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
