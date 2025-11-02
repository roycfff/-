import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function TechStackSection() {
  const categories = [
    {
      title: "כלי אוטומציה",
      items: ["n8n", "Make.com", "Zapier"],
      description: "פלטפורמות Low-Code/No-Code לאוטומציה של תהליכים עסקיים",
    },
    {
      title: "מודלי AI",
      items: ["Claude AI", "ChatGPT & OpenAI API", "Midjourney"],
      description: "כלי בינה מלאכותית מובילים ליצירה וניתוח",
    },
    {
      title: "פיתוח ואינטגרציה",
      items: ["Lovable.dev", "Vibe Coding", "WordPress", "HTML/CSS"],
      description: "כלים לפיתוח אתרים וביצוע אינטגרציות",
    },
    {
      title: "מתודולוגיה",
      items: ["Prompt Engineering", "API Integration", "Webhooks"],
      description: "טכניקות מתקדמות לשילוב מערכות",
    },
  ]

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/50 mx-auto">
            ארגז הכלים
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            שליטה מלאה בטכנולוגיות הליבה של AI
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            כלים מתקדמים שמוביל לתוצאות אמיתיות
          </p>
        </div>

        {/* Tech Categories Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-slate-900/50 to-slate-900/20 border-slate-700/50 p-8 hover:border-slate-600 transition-colors"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
                <p className="text-white/60 text-sm">{category.description}</p>

                {/* Tech Items */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {category.items.map((item, idx) => (
                    <Badge
                      key={idx}
                      className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-blue-500/30 hover:border-blue-500/60 transition-colors"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Expertise Highlight */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-3">שליטה מתקדמת</h4>
              <p className="text-white/70">
                בעל ידע עמוק בכלים המובילים בתעשייה עם יכולת ליישם אותם בתרחישים מורכבים
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-3">למידה מתמשכת</h4>
              <p className="text-white/70">
                מעקב אחרי התפתחויות הטכנולוגיה החדשות ושילובן בפתרונות עדכניים
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-3">אינטגרציה מושלמת</h4>
              <p className="text-white/70">
                יכולת לחבר כלים שונים ליצירת מערכות מקוהסיביות ויעילות
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

