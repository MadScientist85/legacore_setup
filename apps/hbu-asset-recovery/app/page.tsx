import Link from "next/link"
import { Button } from "@hbu/ui"
import { DollarSign, FileSearch, CheckCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-hbu-primary" />
            <h1 className="text-2xl font-bold text-hbu-primary">HBU Asset Recovery</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default" className="bg-hbu-primary hover:bg-hbu-secondary">
                Client Portal
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <section className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Recover Your Surplus Funds</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional assistance in recovering unclaimed surplus funds from foreclosure sales, tax deed auctions, and
            other government-held assets.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-hbu-primary hover:bg-hbu-secondary">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <FileSearch className="h-12 w-12 text-hbu-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Property Search</h3>
            <p className="text-gray-600">
              We search public records to identify surplus funds you may be entitled to claim.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <DollarSign className="h-12 w-12 text-hbu-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Claim Filing</h3>
            <p className="text-gray-600">
              Our experts handle all paperwork and filing requirements with government agencies.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <CheckCircle className="h-12 w-12 text-hbu-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Fund Recovery</h3>
            <p className="text-gray-600">
              We ensure you receive every dollar you're owed, typically within 60-90 days.
            </p>
          </div>
        </section>

        <section className="bg-white p-12 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Recover Your Funds?</h3>
          <p className="text-gray-600 mb-6">
            Join thousands of satisfied clients who have recovered millions in surplus funds.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-hbu-primary hover:bg-hbu-secondary">
              Start Your Claim
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600">
          <p>© 2025 HBU Asset Recovery. Part of Humbled Beginnings Unlimited LLC.</p>
        </div>
      </footer>
    </div>
  )
}
