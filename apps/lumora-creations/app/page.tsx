import Link from "next/link"
import { Button } from "@hbu/ui"
import { ShoppingBag, Palette, Sparkles, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-lumora-primary" />
            <h1 className="text-2xl font-bold text-lumora-primary">Lumora Creations</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/shop">
              <Button variant="ghost">Shop</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default" className="bg-lumora-primary hover:bg-lumora-secondary">
                My Store
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <section className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Your Ideas, Our Canvas</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create and sell custom merchandise with our print-on-demand platform. No inventory, no risk, just
            creativity.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-lumora-primary hover:bg-lumora-secondary">
              Start Creating <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Palette className="h-12 w-12 text-lumora-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Custom Designs</h3>
            <p className="text-gray-600">Upload your artwork or use our design tools to create unique products.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <ShoppingBag className="h-12 w-12 text-lumora-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Print-on-Demand</h3>
            <p className="text-gray-600">We print and ship orders as they come in. No upfront costs or inventory.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Sparkles className="h-12 w-12 text-lumora-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Easy Integration</h3>
            <p className="text-gray-600">Connect to major platforms or use our built-in storefront.</p>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-6 mb-20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <ShoppingBag className="h-20 w-20 text-gray-400" />
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-2">Product {i}</h4>
                <p className="text-sm text-gray-600">Custom t-shirt design</p>
                <p className="text-lg font-bold text-lumora-primary mt-2">$24.99</p>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white p-12 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Launch Your Store?</h3>
          <p className="text-gray-600 mb-6">
            Join thousands of creators earning passive income with custom merchandise.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-lumora-primary hover:bg-lumora-secondary">
              Get Started Free
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600">
          <p>© 2025 Lumora Creations. Part of Humbled Beginnings Unlimited LLC.</p>
        </div>
      </footer>
    </div>
  )
}
