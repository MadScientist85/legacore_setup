import { Button } from "@hbu/ui"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@hbu/ui"
import { ShoppingBag, Package, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-lumora-primary">Creator Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$12,450</div>
              <div className="text-sm text-green-600">+18% this month</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">287</div>
              <div className="text-sm text-gray-600">42 pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <div className="text-sm text-gray-600">3 drafts</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">42%</div>
              <div className="text-sm text-gray-600">Above average</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Best Sellers</CardTitle>
            <CardDescription>Your top performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Vintage Logo T-Shirt</div>
                    <div className="text-sm text-gray-600">87 units sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">$2,175</div>
                  <div className="text-sm text-gray-600">$25 each</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Abstract Art Hoodie</div>
                    <div className="text-sm text-gray-600">52 units sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">$2,340</div>
                  <div className="text-sm text-gray-600">$45 each</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button className="bg-lumora-primary hover:bg-lumora-secondary">
            <Package className="mr-2 h-5 w-5" /> Add New Product
          </Button>
          <Button variant="outline">
            <TrendingUp className="mr-2 h-5 w-5" /> View Analytics
          </Button>
        </div>
      </main>
    </div>
  )
}
