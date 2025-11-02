import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Workflow, Cog, Palette, TrendingUp } from "lucide-react"
import { ConsultationModal } from "./ConsultationModal"
import { useState } from "react"

export default function ServicesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const services = [
    {
      icon: Workflow,
      title: "אוטומציה עסקית חכמה",
      description: "בניית תהליכי עבודה אוטומטיים באמצעות כלי Low-Code/No-Code. משחרר את הצוות שלך ממשימות חוזרות ומגדיל את הפרודוקטיביות.",
      tools: ["n8n", "Make.com", "Zapier"],
      forWho: "עסקים עם תהליכים ידניים שגוזלים זמן רב",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-900/20 to-blue-900/5",
      borderColor: "border-blue-500/30",
    },
    {
      icon: Cog,
      title: "הטמעת AI במערכות קיימות",
      description: "חיבור כלי AI (Claude, ChatGPT) למערכות ה-CRM, האתר או הממשקים הקיימים שלך, ליצירת פתרונות מותאמים אישית.",
      tools: ["Claude API", "OpenAI API", "Webhooks"],
      forWho: "ארגונים שרוצים לשדרג את המערכות הקיימות",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-900/20 to-purple-900/5",
      borderColor: "border-purple-500/30",
    },
    {
      icon: Palette,
      title: "יצירת תוכן ויזואלי מבוסס AI",
      description: "שימוש ב-Prompt Engineering מתקדם וכלים כמו Midjourney ליצירת תמונות, וידאו ונכסים ויזואליים באיכות גבוהה.",
      tools: ["Midjourney", "Prompt Engineering", "AI Video"],
      forWho: "מנהלי שיווק, מותגים ויוצרי תוכן",
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-900/20 to-pink-900/5",
      borderColor: "border-pink-500/30",
    },
    {
      icon: TrendingUp,
      title: "מערכת מסחר אלגורתימית מבוססת AI",
      description: "בניית מערכת מסחר מבוססת על אסטרטגיה של הלקוח, עם מסחר אלגורתימי מבוסס בינה מלאכותית. ניתוח נתונים בזמן אמת וביצוע עסקאות אוטומטיות בהתאם לאסטרטגיה המותאמת.",
      tools: ["AI Algorithms", "Real-time Data", "API Integration"],
      forWho: "משקיעים, סוחרים וקרנות שרוצים אוטומציה חכמה של המסחר",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-900/20 to-green-900/5",
      borderColor: "border-green-500/30",
    },
  ]

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 mx-auto">
            שירותים מרכזיים
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            איך נהפוך את העסק שלך לחכם יותר?
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            4 מסלולי הטמעה ממוקדים לטרנספורמציה דיגיטלית
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className={`bg-gradient-to-br ${service.bgColor} ${service.borderColor} p-8 hover:border-opacity-100 transition-all duration-300 group hover:shadow-lg hover:shadow-${service.color.split(' ')[1]}/20`}
              >
                <div className="space-y-6">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white">{service.title}</h3>

                  {/* Description */}
                  <p className="text-white/70 leading-relaxed">{service.description}</p>

                  {/* Tools */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <p className="text-sm text-white/50 font-semibold">כלים:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.tools.map((tool, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* For Who */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-white/50 mb-2 font-semibold">למי זה מתאים:</p>
                    <p className="text-sm text-white/70">{service.forWho}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            לא בטוח איזה שירות מתאים לך?
          </h3>
          <p className="text-white/70 mb-6">
            בואו נדבר על הצרכים הספציפיים שלך ונמצא את הפתרון המושלם
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all cursor-pointer"
          >
            קבע שיחת ייעוץ חינם
          </Button>
        </div>

        {/* Consultation Modal */}
        <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </section>
  )
}

