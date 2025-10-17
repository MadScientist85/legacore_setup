import { Button } from "@hbu/ui"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@hbu/ui"
import { DollarSign, FileText, Clock, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-hbu-primary">Client Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Active Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">7</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Recovered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$127,450</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
            <CardDescription>Track your active surplus fund claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-hbu-primary" />
                  <div>
                    <div className="font-semibold">Property: 123 Main St</div>
                    <div className="text-sm text-gray-600">Claim #HBU-2024-001</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">$15,750</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" /> In Review
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-hbu-primary" />
                  <div>
                    <div className="font-semibold">Property: 456 Oak Ave</div>
                    <div className="text-sm text-gray-600">Claim #HBU-2024-002</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">$22,300</div>
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Approved
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="bg-hbu-primary hover:bg-hbu-secondary">
          <DollarSign className="mr-2 h-5 w-5" /> Submit New Claim
        </Button>
      </main>
    </div>
  )
}
