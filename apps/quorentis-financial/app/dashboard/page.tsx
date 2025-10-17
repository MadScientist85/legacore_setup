import { Button } from "@hbu/ui"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@hbu/ui"
import { Briefcase, PieChart } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-quorentis-primary">Portfolio Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Portfolios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <div className="text-sm text-gray-600">Across 8 states</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Face Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$2.4M</div>
              <div className="text-sm text-gray-600">Active accounts</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Recovery Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">18.5%</div>
              <div className="text-sm text-green-600">+2.3% YoY</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">$445K</div>
              <div className="text-sm text-gray-600">This quarter</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Portfolios</CardTitle>
            <CardDescription>Current debt portfolio performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Briefcase className="h-8 w-8 text-quorentis-primary" />
                  <div>
                    <div className="font-semibold">Medical Debt Portfolio Q1-2024</div>
                    <div className="text-sm text-gray-600">1,245 accounts</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">$87,500</div>
                  <div className="text-sm text-gray-600">15.2% recovery</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Briefcase className="h-8 w-8 text-quorentis-primary" />
                  <div>
                    <div className="font-semibold">Credit Card Portfolio Q4-2023</div>
                    <div className="text-sm text-gray-600">892 accounts</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">$124,300</div>
                  <div className="text-sm text-gray-600">22.1% recovery</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="bg-quorentis-primary hover:bg-quorentis-secondary">
          <PieChart className="mr-2 h-5 w-5" /> View Analytics
        </Button>
      </main>
    </div>
  )
}
