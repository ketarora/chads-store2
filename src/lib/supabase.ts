
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hjbumqohxgnugfotcvnz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqYnVtcW9oeGdudWdmb3Rjdm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTQ2NjEsImV4cCI6MjA2NDE3MDY2MX0.cbR4azC9IBMA4l4HfImyYA4RjNB8ty9X7Jeq7Yuwdhw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface CartItem {
  id: string
  user_id: string
  product_id: string
  product_name: string
  product_price: number
  product_image: string
  product_category: string
  quantity: number
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  order_id: string
  total_amount: number
  subtotal: number
  gst_amount: number
  status: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  total_price: number
}
