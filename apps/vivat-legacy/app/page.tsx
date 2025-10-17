import Link from "next/link"
import { Button } from "@hbu/ui"
import { FileText, Shield, Users, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-vivat-primary" />
            <h1 className="text-2xl font-bold text-vivat-primary">Vivat Legacy Solutions</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/services">
              <Button variant="ghost">Services</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default" className="bg-vivat-primary hover:bg-vivat-secondary">
                Client Portal
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <section className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Protect Your Legacy</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional estate planning services to ensure your wishes are honored and your loved ones are protected.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-vivat-primary hover:bg-vivat-secondary">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <FileText className="h-12 w-12 text-vivat-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Wills & Trusts</h3>
            <p className="text-gray-600">
              Comprehensive will preparation and trust setup to distribute your assets according to your wishes.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Shield className="h-12 w-12 text-vivat-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Power of Attorney</h3>
            <p className="text-gray-600">
              Legal documents designating trusted individuals to make decisions on your behalf.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Users className="h-12 w-12 text-vivat-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Healthcare Directives</h3>
            <p className="text-gray-600">Living wills and advance healthcare directives to guide medical decisions.</p>
          </div>
        </section>

        <section className="bg-white p-12 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold mb-4">Start Planning Your Legacy Today</h3>
          <p className="text-gray-600 mb-6">
            Affordable, professional estate planning services for individuals and families.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-vivat-primary hover:bg-vivat-secondary">
              Schedule Consultation
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600">
          <p>© 2025 Vivat Legacy Solutions. Part of Humbled Beginnings Unlimited LLC.</p>
        </div>
      </footer>
    </div>
  )
}
