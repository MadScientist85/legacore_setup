"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Shield, LogOut, Settings, Bell } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  user: any
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="border-b border-aurelian-purple/30 bg-gray-900/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-aurelian-gold" />
          <h1 className="text-2xl font-bold aurelian-text-gradient">LegaCore</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-gray-300 hover:text-aurelian-gold transition">
            Dashboard
          </Link>
          <Link href="/agents" className="text-gray-300 hover:text-aurelian-gold transition">
            Agents
          </Link>
          <Link href="/analytics" className="text-gray-300 hover:text-aurelian-gold transition">
            Analytics
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-aurelian-gold">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-aurelian-gold">
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            variant="outline"
            className="border-aurelian-purple text-aurelian-gold hover:bg-aurelian-purple/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
