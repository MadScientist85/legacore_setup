import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { supabaseAdmin } from "@/lib/supabase/client"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const { data: user, error } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email.toLowerCase())
          .single()

        if (error || !user) {
          throw new Error("Invalid credentials")
        }

        if (user.status !== "active") {
          throw new Error("Account is not active")
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash)

        if (!isValidPassword) {
          throw new Error("Invalid credentials")
        }

        await supabaseAdmin.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
          role: user.role,
          companyId: user.company_id,
          image: user.avatar_url,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { data: existingUser } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", user.email?.toLowerCase())
          .single()

        if (!existingUser) {
          const { error } = await supabaseAdmin.from("users").insert({
            email: user.email?.toLowerCase(),
            full_name: user.name,
            avatar_url: user.image,
            role: "user",
            status: "active",
            auth_provider: "google",
            email_verified: true,
          })

          if (error) {
            console.error("Error creating user:", error)
            return false
          }
        } else {
          await supabaseAdmin.from("users").update({ last_login: new Date().toISOString() }).eq("id", existingUser.id)
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.companyId = user.companyId
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.companyId = token.companyId as string
      }

      return session
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}
