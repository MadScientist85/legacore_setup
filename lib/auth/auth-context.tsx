"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "../supabase/client"
import { Logger } from "../utils/logger"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData?: any) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const logger = new Logger("AuthProvider")

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        logger.error("Error getting session", { error: error.message })
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info("Auth state changed", { event, userId: session?.user?.id })

      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Update user login tracking
      if (event === "SIGNED_IN" && session?.user) {
        try {
          await supabase
            .from("users")
            .update({
              last_login: new Date().toISOString(),
              login_count: supabase.raw("login_count + 1"),
            })
            .eq("id", session.user.id)
        } catch (error) {
          logger.error("Error updating login tracking", { error })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        logger.error("Sign in error", { error: error.message, email })
        throw new Error(error.message)
      }

      logger.info("User signed in successfully", { email })
    } catch (error) {
      logger.error("Sign in failed", { error, email })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) {
        logger.error("Sign up error", { error: error.message, email })
        throw new Error(error.message)
      }

      logger.info("User signed up successfully", { email })
    } catch (error) {
      logger.error("Sign up failed", { error, email })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        logger.error("Sign out error", { error: error.message })
        throw new Error(error.message)
      }

      logger.info("User signed out successfully")
    } catch (error) {
      logger.error("Sign out failed", { error })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        logger.error("Password reset error", { error: error.message, email })
        throw new Error(error.message)
      }

      logger.info("Password reset email sent", { email })
    } catch (error) {
      logger.error("Password reset failed", { error, email })
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
