import Link from "next/link"
import { Button } from "@hbu/ui"
import { TrendingUp, CreditCard, Target, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-turnaround-primary" />
            <h1 className="text-2xl font-bold text-turnaround-primary">Turnaround Financial</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/services">
              <Button variant="ghost">Services</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default" className="bg-turnaround-primary hover:bg-turnaround-secondary">
                Client Portal
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <section className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Transform Your Financial Future</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Expert credit repair and financial consulting to help you achieve your goals and build lasting financial
            health.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-turnaround-primary hover:bg-turnaround-secondary">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <CreditCard className="h-12 w-12 text-turnaround-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Credit Repair</h3>
            <p className="text-gray-600">Remove negative items, dispute inaccuracies, and improve your credit score.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Target className="h-12 w-12 text-turnaround-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Debt Analysis</h3>
            <p className="text-gray-600">Comprehensive analysis of your debt situation with actionable strategies.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <TrendingUp className="h-12 w-12 text-turnaround-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Financial Planning</h3>
            <p className="text-gray-600">Personalized consulting to build wealth and achieve financial independence.</p>
          </div>
        </section>

        <section className="bg-white p-12 rounded-lg shadow-md text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Improve Your Credit?</h3>
          <p className="text-gray-600 mb-6">
            Join thousands who have successfully repaired their credit and transformed their finances.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-turnaround-primary hover:bg-turnaround-secondary">
              Start Your Journey
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600">
          <p>© 2025 Turnaround Financial Solutions. Part of Humbled Beginnings Unlimited LLC.</p>
        </div>
      </footer>
    </div>
  )
}
