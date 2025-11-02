import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
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
    onClose()
    setFormData({ name: "", email: "", phone: "", company: "", message: "" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
  )
}

