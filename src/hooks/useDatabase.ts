import { useState, useEffect } from 'react'
import { supabase, CartItem, Order, OrderItem } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from './use-toast'

export const useDatabase = () => {
  const { user } = useAuth()

  // Cart operations
  const addToCartDB = async (product: any, quantity: number = 1) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to cart",
        variant: "destructive"
      })
      return null
    }

    const { data, error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image,
        product_category: product.category,
        quantity: quantity
      }, {
        onConflict: 'user_id,product_id'
      })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      })
      return null
    }

    return data
  }

  const getCartItems = async (): Promise<CartItem[]> => {
    if (!user) return []

    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching cart items:', error)
      return []
    }

    return data || []
  }

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!user) return null

    if (quantity <= 0) {
      return removeFromCartDB(productId)
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive"
      })
    }

    return data
  }

  const removeFromCartDB = async (productId: string) => {
    if (!user) return null

    const { data, error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      })
    }

    return data
  }

  const clearCartDB = async () => {
    if (!user) return null

    const { data, error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      })
    }

    return data
  }

  // Order operations
  const createOrder = async (cartItems: CartItem[], orderDetails: {
    subtotal: number,
    gst: number,
    total: number,
    payment_method: string,
    transaction_id: string,
    status: string,
    items: any[],
    notes?: string,
    address?: string,
    pincode?: string,
    device?: string,
    date?: string,
  }) => {
    if (!user) return null;
    const orderId = `VT-${Math.floor(100000 + Math.random() * 900000)}`;
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_id: orderId,
        total_amount: orderDetails.total,
        subtotal: orderDetails.subtotal,
        gst_amount: orderDetails.gst,
        status: orderDetails.status,
        payment_method: orderDetails.payment_method,
        transaction_id: orderDetails.transaction_id,
        items: orderDetails.items,
        notes: orderDetails.notes || null,
        address: orderDetails.address || null,
        pincode: orderDetails.pincode || null,
        device: orderDetails.device || null,
        date: orderDetails.date || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (orderError) {
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
      console.error('Supabase order creation error:', orderError);
      return null;
    }
    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
      total_price: item.product_price * item.quantity
    }));
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    if (itemsError) {
      toast({
        title: "Error",
        description: "Failed to create order items",
        variant: "destructive"
      })
      console.error('Supabase order items creation error:', itemsError);
      return null
    }

    // Clear cart after successful order
    await clearCartDB()

    return order
  }

  return {
    addToCartDB,
    getCartItems,
    updateCartQuantity,
    removeFromCartDB,
    clearCartDB,
    createOrder
  }
}
