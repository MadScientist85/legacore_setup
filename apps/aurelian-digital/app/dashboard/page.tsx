import { Button } from "@hbu/ui"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@hbu/ui"
import { TrendingUp, Users, MousePointerClick } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-aurelian-primary border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-aurelian-accent">Marketing Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">45.2K</div>
              <div className="text-sm text-green-600">+12% vs last month</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">1,247</div>
              <div className="text-sm text-gray-600">2.76% rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">$18.5K</div>
              <div className="text-sm text-green-600">+24% MoM</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">385%</div>
              <div className="text-sm text-gray-600">Excellent</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Current marketing initiatives and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <MousePointerClick className="h-8 w-8 text-aurelian-primary" />
                  <div>
                    <div className="font-semibold">Spring Sale Campaign</div>
                    <div className="text-sm text-gray-600">Google Ads, Facebook</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">$4,250</div>
                  <div className="text-sm text-gray-600">412% ROI</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-aurelian-primary" />
                  <div>
                    <div className="font-semibold">Affiliate Network Expansion</div>
                    <div className="text-sm text-gray-600">45 active partners</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">$7,890</div>
                  <div className="text-sm text-gray-600">285% ROI</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="bg-aurelian-primary hover:bg-aurelian-secondary text-white">
          <TrendingUp className="mr-2 h-5 w-5" /> Create New Campaign
        </Button>
      </main>
    </div>
  )
}
