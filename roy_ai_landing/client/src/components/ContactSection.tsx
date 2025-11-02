import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MessageCircle, Calendar, X } from "lucide-react"
import { useState } from "react"

export default function ContactSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Create mailto link with form data
    const mailtoLink = `mailto:roydavidi2004@gmail.com?subject=בקשה לשיחת ייעוץ - ${formData.name}&body=שם: ${formData.name}%0Aדוא"ל: ${formData.email}%0Aטלפון: ${formData.phone}%0Aחברה: ${formData.company}%0A%0Aהודעה:%0A${formData.message}`
    window.location.href = mailtoLink
    setIsOpen(false)
    setFormData({ name: "", email: "", phone: "", company: "", message: "" })
  }

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Main CTA */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            הגיע הזמן להפסיק לדבר על AI
          </h2>
          <p className="text-xl text-white/70">
            ולהתחיל להטמיע אותו בעסק שלך
          </p>
          <p className="text-lg text-white/60">
            בין אם אתה רוצה אוטומציה מלאה או שדרוג נקודתי – אני כאן כדי להבטיח שההשקעה שלך ב-AI תחזיר את עצמה.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Phone Card */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border-blue-500/30 p-8 hover:border-blue-500/60 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-blue-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">שיחה טלפונית</h3>
                <p className="text-white/70 mb-4">זמין לשיחות בזמן קצר</p>
                <a
                  href="tel:0523570858"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold"
                >
                  052-3570858
                  <span>→</span>
                </a>
              </div>
            </div>
          </Card>

          {/* Email Card */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border-purple-500/30 p-8 hover:border-purple-500/60 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-purple-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Gmail</h3>
                <p className="text-white/70 mb-4">שלח לי הודעה</p>
                <a
                  href="mailto:roydavidi2004@gmail.com"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold text-sm"
                >
                  roydavidi2004@gmail.com
                  <span>→</span>
                </a>
              </div>
            </div>
          </Card>

          {/* WhatsApp Card */}
          <Card className="bg-gradient-to-br from-green-900/20 to-green-900/5 border-green-500/30 p-8 hover:border-green-500/60 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">WhatsApp</h3>
                <p className="text-white/70 mb-4">שלח הודעה מהירה</p>
                <a
                  href="https://wa.me/972523570858"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold"
                >
                  052-3570858
                  <span>→</span>
                </a>
              </div>
            </div>
          </Card>

          {/* Telegram Card */}
          <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-900/5 border-cyan-500/30 p-8 hover:border-cyan-500/60 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Telegram</h3>
                <p className="text-white/70 mb-4">צור קשר בטלגרם</p>
                <a
                  href="https://t.me/+972523570858"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  052-3570858
                  <span>→</span>
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* Primary CTA Button with Modal */}
        <div className="text-center mb-12">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 text-lg h-14 px-10 rounded-lg cursor-pointer"
              >
                <Calendar className="mr-2 h-5 w-5" />
                קבע שיחת ייעוץ ראשונית בחינם
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">קביעת שיחת ייעוץ</DialogTitle>
                <DialogDescription className="text-white/70">
                  מלא את הפרטים שלך וניצור קשר בתוך 24 שעות
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    שם מלא
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="שם מלא"
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    דוא"ל
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">
                    טלפון
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="05X-XXXXXXX"
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">
                    שם החברה (אופציונלי)
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="שם החברה"
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-white/50"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">
                    הודעה
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="ספר לי על הצרכים שלך..."
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-white/50 resize-none"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 font-semibold"
                >
                  שלח בקשה לשיחת ייעוץ
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <p className="text-white/50 text-sm mt-4">
            זמן התגובה ממוצע: פחות מ-24 שעות
          </p>
        </div>

        {/* Trust Section */}
        <div className="relative bg-gradient-to-r from-slate-900/50 to-slate-900/20 border border-slate-700/50 rounded-xl p-8 text-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/roy-profile.png"
              alt="Roy Davidi"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70" />
          </div>
          
          {/* Content */}
          <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-6">למה לבחור בי?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <p className="text-white/70">התמקדות בתוצאות מדידות</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">פרויקטים</div>
              <p className="text-white/70">צפה בפרויקטים שהכנתי</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400 mb-2">10+</div>
              <p className="text-white/70">פרויקטים מוגמרים בהצלחה</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}

