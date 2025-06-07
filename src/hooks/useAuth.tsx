import { useState, useEffect, createContext, useContext } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name?: string, insta_subscribed?: boolean) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  updateInstaSubscribed: (userId: string, subscribed: boolean) => Promise<any>
  isAdmin: (user: User | null) => boolean
  updateProfile: (fields: { name?: string; insta_subscribed?: boolean }) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name?: string, insta_subscribed: boolean = false) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (!error && data.user) {
      // Insert profile data into users table
      await supabase.from('users').upsert({
        id: data.user.id,
        email,
        name,
        insta_subscribed,
        created_at: new Date().toISOString(),
      })
    }
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Update Instagram subscription status
  const updateInstaSubscribed = async (userId: string, subscribed: boolean) => {
    await supabase.from('users').update({ insta_subscribed: subscribed }).eq('id', userId)
  }

  // Check if user is admin (by email or is_admin field)
  const isAdmin = (user: User | null) => {
    if (!user) return false;
    // Example: check by email or fetch is_admin from users table
    return user.email === 'glowsygalaxyshop@gmail.com';
  }

  // Update user profile (e.g., Instagram subscription)
  const updateProfile = async (fields: { name?: string; insta_subscribed?: boolean }) => {
    if (!user) return { error: 'No user' }
    const { data, error } = await supabase.from('users').update(fields).eq('id', user.id)
    return { data, error }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      updateInstaSubscribed,
      isAdmin,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
