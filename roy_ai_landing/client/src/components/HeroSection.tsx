import { Button } from "@/components/ui/button"
import { Wave } from "./Wave"
import { ArrowRight, MessageCircle } from "lucide-react"
import { ConsultationModal } from "./ConsultationModal"
import { useState } from "react"

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Wave Background */}
      <div className="absolute inset-0 z-0">
        <Wave />
      </div>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-white/80">AI Implementation Specialist</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            הפוך את העסק שלך{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              לחכם יותר
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            משמעת של ספורטאי, ניהול של מפקד, וחדשנות של מומחה AI. אני מהפכת תהליכים מורכבים לאוטומציה חכמה שמייצרת תוצאות אמיתיות.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 text-base h-12 px-8 rounded-lg cursor-pointer"
            >
              בנה לי אוטומציה חכמה
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="border-white/30 text-white hover:bg-white/10 text-base h-12 px-8 rounded-lg cursor-pointer"
            >
              <MessageCircle className="ml-2 h-5 w-5" />
              קבע שיחת ייעוץ
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400">✓</span>
              </div>
              <span>בוגר קרנליוס AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400">✓</span>
              </div>
              <span>8 שנים ניהול וניסיון</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <span className="text-pink-400">✓</span>
              </div>
              <span>פתרונות מוכחים</span>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

