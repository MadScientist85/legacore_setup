"use client"

import type * as React from "react"
import {
  Bot,
  Command,
  LifeBuoy,
  PieChart,
  Send,
  CreditCard,
  FileText,
  TrendingUp,
  Shield,
  Building,
  Megaphone,
  Package,
  Code,
  MessageSquare,
  Calculator,
  Database,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data for the sidebar
const data = {
  user: {
    name: "LEGACORE™ Admin",
    email: "admin@legacore.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "LEGACORE™",
      logo: Command,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Command Center",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "AI Agent Hub",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Legal Agents",
          url: "#",
        },
        {
          title: "Financial Agents",
          url: "#",
        },
        {
          title: "Marketing Agents",
          url: "#",
        },
        {
          title: "Business Agents",
          url: "#",
        },
      ],
    },
    {
      title: "Legacy Vault",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Documents",
          url: "#",
        },
        {
          title: "Contracts",
          url: "#",
        },
        {
          title: "SOPs",
          url: "#",
        },
        {
          title: "Assets",
          url: "#",
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: PieChart,
      items: [
        {
          title: "Performance",
          url: "#",
        },
        {
          title: "Usage Stats",
          url: "#",
        },
        {
          title: "ROI Tracking",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Surplus Funds Recovery",
      url: "#",
      icon: FileText,
    },
    {
      name: "Trust Management",
      url: "#",
      icon: Shield,
    },
    {
      name: "Credit Repair",
      url: "#",
      icon: CreditCard,
    },
    {
      name: "Government Contracting",
      url: "#",
      icon: Building,
    },
    {
      name: "Digital Products",
      url: "#",
      icon: Package,
    },
    {
      name: "Affiliate Marketing",
      url: "#",
      icon: TrendingUp,
    },
    {
      name: "Print on Demand",
      url: "#",
      icon: Megaphone,
    },
    {
      name: "Web Development",
      url: "#",
      icon: Code,
    },
    {
      name: "Social Media",
      url: "#",
      icon: MessageSquare,
    },
    {
      name: "Tradeline Stacking",
      url: "#",
      icon: Calculator,
    },
    {
      name: "Debt Strategy",
      url: "#",
      icon: Database,
    },
    {
      name: "Real Estate",
      url: "#",
      icon: Home,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
