import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"
import { compare } from "bcryptjs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const { data: user, error } = await supabase.from("users").select("*").eq("email", credentials.email).single()

        if (error || !user) {
          throw new Error("Invalid credentials")
        }

        const isValid = await compare(credentials.password, user.password_hash)

        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.company_id,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.companyId = user.companyId
      }

      if (account?.provider === "google") {
        const { data: existingUser } = await supabase.from("users").select("*").eq("email", user.email).single()

        if (!existingUser) {
          const { data: newUser } = await supabase
            .from("users")
            .insert({
              email: user.email,
              name: user.name,
              auth_provider: "google",
              email_verified: true,
            })
            .select()
            .single()

          if (newUser) {
            token.id = newUser.id
            token.companyId = newUser.company_id
          }
        } else {
          token.id = existingUser.id
          token.companyId = existingUser.company_id
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
        session.user.companyId = token.companyId as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
