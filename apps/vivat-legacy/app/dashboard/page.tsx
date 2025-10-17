import { Button } from "@hbu/ui"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@hbu/ui"
import { FileText, CheckCircle, Clock } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-vivat-primary">Estate Planning Portal</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">2</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">6</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Documents</CardTitle>
            <CardDescription>Estate planning documents and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-vivat-primary" />
                  <div>
                    <div className="font-semibold">Last Will and Testament</div>
                    <div className="text-sm text-gray-600">Updated: March 15, 2024</div>
                  </div>
                </div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Completed
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-vivat-primary" />
                  <div>
                    <div className="font-semibold">Revocable Living Trust</div>
                    <div className="text-sm text-gray-600">Started: April 1, 2024</div>
                  </div>
                </div>
                <div className="text-sm text-orange-600 flex items-center gap-1">
                  <Clock className="h-4 w-4" /> In Progress
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="bg-vivat-primary hover:bg-vivat-secondary">
          <FileText className="mr-2 h-5 w-5" /> Create New Document
        </Button>
      </main>
    </div>
  )
}
