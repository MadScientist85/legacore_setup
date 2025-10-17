import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Lock, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-aurelian-dark">
      {/* Header */}
      <header className="border-b border-aurelian-purple/30 bg-aurelian-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-aurelian-gold" />
            <h1 className="text-2xl font-bold aurelian-text-gradient">LegaCore</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-300 hover:text-aurelian-gold transition">
              Features
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-aurelian-gold transition">
              About
            </Link>
            <Link href="/login">
              <Button className="aurelian-gradient hover:opacity-90 text-white">Get Started</Button>
            </Link>
          </nav>
          <Link href="/login" className="md:hidden">
            <Button size="sm" className="aurelian-gradient">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <section className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-aurelian-purple/20 border border-aurelian-purple rounded-full">
            <span className="text-sm text-aurelian-gold font-medium">Aurelian Digital</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            AI-Powered Legal
            <br />
            <span className="aurelian-text-gradient">Automation Platform</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Streamline your legal workflows with specialized AI agents. Built to scale, designed to last.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login">
              <Button size="lg" className="aurelian-gradient hover:opacity-90 text-white">
                <Zap className="mr-2 h-5 w-5" />
                Launch Platform
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-aurelian-purple text-aurelian-gold bg-transparent">
              Learn More
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-6 bg-gray-900 rounded-xl border border-aurelian-purple/30 hover:border-aurelian-purple/60 transition">
            <Shield className="h-12 w-12 text-aurelian-gold mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-gray-400">Bank-grade encryption and compliance-ready architecture</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-xl border border-aurelian-purple/30 hover:border-aurelian-purple/60 transition">
            <Zap className="h-12 w-12 text-aurelian-gold mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI-Powered Agents</h3>
            <p className="text-gray-400">Specialized agents for legal, financial, and business tasks</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-xl border border-aurelian-purple/30 hover:border-aurelian-purple/60 transition">
            <TrendingUp className="h-12 w-12 text-aurelian-gold mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Real-Time Analytics</h3>
            <p className="text-gray-400">Comprehensive insights and performance tracking</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 px-6 bg-aurelian-purple/10 rounded-2xl border border-aurelian-purple/30">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Workflow?</h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Join forward-thinking organizations using LegaCore to automate legal operations
          </p>
          <Link href="/login">
            <Button size="lg" className="aurelian-gradient hover:opacity-90 text-white">
              <Lock className="mr-2 h-5 w-5" />
              Access Platform
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-aurelian-purple/30 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p className="text-sm">
            © 2025 Aurelian Digital. All rights reserved. |{" "}
            <span className="text-aurelian-gold">Built to Outlive the Builder</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
