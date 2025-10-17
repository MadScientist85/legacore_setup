import Link from "next/link"
import { Button } from "@hbu/ui"
import { Briefcase, PieChart, BarChart3, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-quorentis-primary" />
            <h1 className="text-2xl font-bold text-quorentis-primary">Quorentis Financial</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default" className="bg-quorentis-primary hover:bg-quorentis-secondary">
                Portal
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <section className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Strategic Debt Portfolio Management</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional debt acquisition, portfolio management, and collection services with industry-leading analytics
            and compliance.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-quorentis-primary hover:bg-quorentis-secondary">
              Access Portal <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Briefcase className="h-12 w-12 text-quorentis-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Debt Acquisition</h3>
            <p className="text-gray-600">
              Strategic purchasing of distressed debt portfolios with comprehensive due diligence.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <PieChart className="h-12 w-12 text-quorentis-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Portfolio Management</h3>
            <p className="text-gray-600">Active management and optimization of debt portfolios to maximize recovery.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <BarChart3 className="h-12 w-12 text-quorentis-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Analytics & Reporting</h3>
            <p className="text-gray-600">Real-time performance metrics and comprehensive reporting for stakeholders.</p>
          </div>
        </section>

        <section className="bg-white p-12 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold mb-4">Partner With Industry Experts</h3>
          <p className="text-gray-600 mb-6">
            Proven track record in debt portfolio management with transparent processes.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-quorentis-primary hover:bg-quorentis-secondary">
              Learn More
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600">
          <p>© 2025 Quorentis Financial Group. Part of Humbled Beginnings Unlimited LLC.</p>
        </div>
      </footer>
    </div>
  )
}
