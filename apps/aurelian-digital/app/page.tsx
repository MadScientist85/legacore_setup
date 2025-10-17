import Link from "next/link"
import { Button } from "@hbu/ui"
import { Zap, Target, TrendingUp, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <header className="border-b border-aurelian-accent/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-aurelian-accent" />
            <h1 className="text-2xl font-bold text-white">Aurelian Digital</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/services">
              <Button variant="ghost" className="text-white hover:text-aurelian-accent">
                Services
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default" className="bg-aurelian-accent text-aurelian-primary hover:bg-yellow-500">
                Client Portal
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <section className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6">Digital Marketing Excellence</h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Data-driven digital marketing strategies that drive growth, engagement, and ROI for your business.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-aurelian-accent text-aurelian-primary hover:bg-yellow-500">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-aurelian-accent/20">
            <Target className="h-12 w-12 text-aurelian-accent mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">SEO & Content</h3>
            <p className="text-purple-200">
              Dominate search rankings with strategic SEO and compelling content marketing.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-aurelian-accent/20">
            <TrendingUp className="h-12 w-12 text-aurelian-accent mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Affiliate Marketing</h3>
            <p className="text-purple-200">
              Build profitable affiliate partnerships with performance-based strategies.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-aurelian-accent/20">
            <Zap className="h-12 w-12 text-aurelian-accent mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Social Media</h3>
            <p className="text-purple-200">Engage audiences and grow your brand across all major social platforms.</p>
          </div>
        </section>

        <section className="bg-white/10 backdrop-blur-sm p-12 rounded-lg border border-aurelian-accent/20 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Transform Your Digital Presence</h3>
          <p className="text-purple-200 mb-6">
            Partner with experts who understand the digital landscape and deliver results.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-aurelian-accent text-aurelian-primary hover:bg-yellow-500">
              Schedule Consultation
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-aurelian-accent/20 bg-black/20 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-purple-200">
          <p>© 2025 Aurelian Digital Enterprises. Part of Humbled Beginnings Unlimited LLC.</p>
        </div>
      </footer>
    </div>
  )
}
