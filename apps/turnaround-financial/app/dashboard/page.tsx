import { Button } from "@hbu/ui"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@hbu/ui"
import { CreditCard, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-turnaround-primary">Credit Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Credit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-turnaround-primary">685</div>
              <div className="text-sm text-green-600">+45 this month</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Negative Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">8</div>
              <div className="text-sm text-gray-600">3 in dispute</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm text-gray-600">5 positive</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">42%</div>
              <div className="text-sm text-gray-600">Target: &lt;30%</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Disputes</CardTitle>
            <CardDescription>Items currently being challenged</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <div className="font-semibold">Late Payment - ABC Bank</div>
                    <div className="text-sm text-gray-600">Filed: March 15, 2024</div>
                  </div>
                </div>
                <div className="text-sm text-orange-600">In Review</div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <div className="font-semibold">Collection Account</div>
                    <div className="text-sm text-gray-600">Filed: April 1, 2024</div>
                  </div>
                </div>
                <div className="text-sm text-green-600">Removed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="bg-turnaround-primary hover:bg-turnaround-secondary">
          <CreditCard className="mr-2 h-5 w-5" /> File New Dispute
        </Button>
      </main>
    </div>
  )
}
