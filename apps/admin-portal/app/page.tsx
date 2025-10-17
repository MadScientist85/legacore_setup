import Link from "next/link"
import { Button } from "@hbu/ui"
import { Card, CardHeader, CardTitle, CardContent } from "@hbu/ui"
import {
  Building2,
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  Shield,
  FileText,
  CreditCard,
  Briefcase,
  Zap,
  ShoppingBag,
} from "lucide-react"

export default function AdminPortal() {
  const companies = [
    {
      id: "hbu-asset-recovery",
      name: "HBU Asset Recovery",
      icon: DollarSign,
      color: "text-blue-600",
      revenue: "$127K",
      status: "Active",
    },
    {
      id: "vivat-legacy",
      name: "Vivat Legacy Solutions",
      icon: Shield,
      color: "text-green-600",
      revenue: "$89K",
      status: "Active",
    },
    {
      id: "turnaround-financial",
      name: "Turnaround Financial",
      icon: CreditCard,
      color: "text-purple-600",
      revenue: "$156K",
      status: "Active",
    },
    {
      id: "quorentis-financial",
      name: "Quorentis Financial",
      icon: Briefcase,
      color: "text-red-600",
      revenue: "$445K",
      status: "Active",
    },
    {
      id: "aurelian-digital",
      name: "Aurelian Digital",
      icon: Zap,
      color: "text-purple-900",
      revenue: "$78K",
      status: "Active",
    },
    {
      id: "lumora-creations",
      name: "Lumora Creations",
      icon: ShoppingBag,
      color: "text-amber-600",
      revenue: "$62K",
      status: "Active",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">HBU Admin Portal</h1>
          </div>
          <nav className="flex gap-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              <Users className="mr-2 h-4 w-4" /> Users
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              <Activity className="mr-2 h-4 w-4" /> Analytics
            </Button>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              Settings
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">$957K</div>
              <div className="text-sm text-green-400">+22% YoY</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">Active Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">6</div>
              <div className="text-sm text-gray-400">All operational</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">2,847</div>
              <div className="text-sm text-green-400">+156 this month</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">AI Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">45.2K</div>
              <div className="text-sm text-gray-400">This month</div>
            </CardContent>
          </Card>
        </div>

        {/* Company Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Business Units</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => {
              const Icon = company.icon
              return (
                <Link key={company.id} href={`/${company.id}`}>
                  <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Icon className={`h-10 w-10 ${company.color}`} />
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                          {company.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{company.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">{company.revenue}</div>
                          <div className="text-xs text-gray-400">Monthly revenue</div>
                        </div>
                        <TrendingUp className="h-6 w-6 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                <FileText className="h-8 w-8 text-blue-400" />
                <div className="flex-1">
                  <div className="font-semibold text-white">New claim filed - HBU Asset Recovery</div>
                  <div className="text-sm text-gray-400">Claim #HBU-2024-147 • 5 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                <Users className="h-8 w-8 text-green-400" />
                <div className="flex-1">
                  <div className="font-semibold text-white">New client onboarded - Vivat Legacy</div>
                  <div className="text-sm text-gray-400">Estate planning package • 12 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                <Activity className="h-8 w-8 text-purple-400" />
                <div className="flex-1">
                  <div className="font-semibold text-white">Credit score improved - Turnaround Financial</div>
                  <div className="text-sm text-gray-400">Client ID #TF-5847 • 1 hour ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
