import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

export default function ProjectsSection() {
  const projects = [
    {
      title: "GuardMe.com",
      description: "הפכו את הסמארטפון שלכם לשומר אישי דיגיטלי. מערכת הגנה חכמה עם הקלטת שמע, מעקב מיקום והתראות חירום",
      logo: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/3e6f12c3-af71-4a8e-bdb7-dafeaac12b2a/generated_images/modern-minimalist-logo-for-web-developme-a62c1619-20251015110814.jpg",
      url: "https://guardme-safe-zone.lovable.app/auth",
      siteName: "GuardMe Safe Zone",
      category: "Security App",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "AI Match",
      description: "Discover, compare, and build your perfect AI package with AI Match. Streamline your workflow and boost efficiency with our intelligent recommendation platform.",
      logo: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/3e6f12c3-af71-4a8e-bdb7-dafeaac12b2a/generated_images/modern-minimalist-logo-for-web-developme-a62c1619-20251015110813.jpg",
      url: "https://ai-match-09a2d309.base44.app",
      siteName: "AI Match Platform",
      category: "AI Platform",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Build N Sparkle",
      description: "Custom automation tools and workflows that streamline processes and increase efficiency. Advanced automation systems for modern businesses.",
      logo: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/3e6f12c3-af71-4a8e-bdb7-dafeaac12b2a/generated_images/sleek-minimalist-logo-for-automation-sys-f655e448-20251015110823.jpg",
      url: "https://build-n-sparkle.lovable.app/",
      siteName: "Build N Sparkle",
      category: "Automation",
      color: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/50 mx-auto">
            פרויקטים
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            פרויקטים שהכנתי
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            דוגמאות לפרויקטים מוצלחים שביצעתי עבור לקוחות
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-slate-900/50 to-slate-900/20 border-slate-700/50 p-6 hover:border-slate-600 transition-all duration-300 group"
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block space-y-4"
              >
                {/* Logo */}
                <div className="w-full aspect-video bg-slate-800/50 rounded-lg overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={project.logo}
                    alt={project.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={`bg-gradient-to-r ${project.color} text-white border-0`}
                  >
                    {project.category}
                  </Badge>
                  <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 leading-relaxed text-sm">
                  {project.description}
                </p>

                {/* Site Name */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/50">
                    <span className="font-semibold">אתר:</span> {project.siteName}
                  </p>
                </div>
              </a>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-white/70 mb-4">
            רוצה לראות עוד פרויקטים או לדבר על הפרויקט שלך?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all"
          >
            בואו נדבר
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

