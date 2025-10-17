"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function SocialCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has dismissed before
    const dismissed = localStorage.getItem("socialCTADismissed")
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Show after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem("socialCTADismissed", "true")
  }

  if (!isVisible || isDismissed) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-3 animate-fade-in">
      <div className="bg-gradient-to-r from-aurelian-purple to-purple-700 text-white p-4 rounded-lg shadow-2xl flex items-center gap-4 max-w-md">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Join Our Community</h3>
          <p className="text-sm text-gray-200">Get updates, support, and exclusive features</p>
        </div>

        <div className="flex gap-2">
          <a
            href="https://discord.gg/legacore"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Join our Discord"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-.93c.416-.346.795-.732 1.174-1.118a.075.075 0 0 0-.041-.128h-1.15a15.65 15.65 0 0 1-1.96-.428a.076.076 0 0 1-.027-.117a13.107 13.107 0 0 0 1.225-.849a.076.076 0 0 1 .085-.011c3.967 1.793 8.18 1.793 12.108 0a.077.077 0 0 1 .085.011a12.55 12.55 0 0 0 1.225.849a.077.077 0 0 1-.026.118a15.187 15.187 0 0 1-1.959.427h-1.138a.075.075 0 0 0-.042.128c.379.386.758.772 1.174 1.118a13.88 13.88 0 0 1 1.226.93a.077.077 0 0 0 .084.028a19.84 19.84 0 0 0 6.002-3.03a.077.077 0 0 0 .031-.057c.5-5.177-.838-9.674-3.549-13.66a.074.074 0 0 0-.031-.028z" />
            </svg>
          </a>

          <a
            href="https://wa.me/1234567890?text=Hi%20LegaCore%20team"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
            aria-label="Chat on WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.482 0 1.467 1.065 2.871 1.213 3.07.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>

        <button
          onClick={handleDismiss}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
