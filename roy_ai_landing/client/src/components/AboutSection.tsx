import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Brain, Target } from "lucide-react"

export default function AboutSection() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 mx-auto">
            הצעת הערך שלי
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            לא עוד AI "על הנייר" — הטמעה שמביאה תוצאות
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            שילוב ייחודי של משמעת ספורטאית, ניהול מקצועי, וחדשנות טכנולוגית
          </p>
        </div>

        {/* The Triple DNA Model */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: Discipline */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border-blue-500/30 p-8 hover:border-blue-500/60 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">משמעת ודבקות במטרה</h3>
              <p className="text-white/70">
                8 שנים כטריאתלט מקצועי. עמידה ביעדים, ניהול זמן אפקטיבי, ואופטימיזציה תמידית של תהליכים.
              </p>
              <div className="pt-4 border-t border-blue-500/20">
                <p className="text-sm text-blue-300 font-semibold">כלים: Low-Code / No-Code, n8n, Make.com</p>
              </div>
            </div>
          </Card>

          {/* Card 2: Leadership */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border-purple-500/30 p-8 hover:border-purple-500/60 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">מנהיגות וניהול מורכבות</h3>
              <p className="text-white/70">
                מפקד הכשרה קרבית בצי הים. ניהול פרויקטים מורכבים תחת לחץ, הדרכה של צוותים, וקבלת החלטות מהירה.
              </p>
              <div className="pt-4 border-t border-purple-500/20">
                <p className="text-sm text-purple-300 font-semibold">כלים: AI Integration, Project Management</p>
              </div>
            </div>
          </Card>

          {/* Card 3: Innovation */}
          <Card className="bg-gradient-to-br from-pink-900/20 to-pink-900/5 border-pink-500/30 p-8 hover:border-pink-500/60 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white">חדשנות טכנולוגית</h3>
              <p className="text-white/70">
                בוגר קרנליוס. שליטה מתקדמת בכלי AI מובילים (Claude, ChatGPT, Midjourney) ופיתוח אוטומציות מותאמות.
              </p>
              <div className="pt-4 border-t border-pink-500/20">
                <p className="text-sm text-pink-300 font-semibold">כלים: Claude, ChatGPT, Prompt Engineering</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Key Stats */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-8 md:p-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">8+</div>
              <p className="text-white/70">שנות ניהול וניסיון</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">100+</div>
              <p className="text-white/70">שעות הכשרה ב-AI</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">10+</div>
              <p className="text-white/70">פרויקטים מוגמרים</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <p className="text-white/70">התמקדות בתוצאות</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

