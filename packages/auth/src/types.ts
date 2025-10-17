import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: string
    companyId: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      companyId: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    role: string
    companyId: string
  }
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "user"
  companyId: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
  companyId?: string
}
