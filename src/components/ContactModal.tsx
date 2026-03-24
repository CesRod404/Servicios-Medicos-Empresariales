"use client"
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2 } from 'lucide-react'

export function ContactModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    const formData = new FormData(e.currentTarget)
    const data = {
      companyName: formData.get('companyName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          setOpen(false)
          setSuccess(false)
        }, 4000)
      } else {
        setErrorMsg("Hubo un error al enviar tu solicitud. Intenta nuevamente.")
      }
    } catch (error) {
      setErrorMsg("Error de conexión. Revisa tu internet e intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block w-full sm:w-auto cursor-pointer">
        {children}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
        {success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <DialogTitle className="text-2xl font-bold text-center">¡Gracias!</DialogTitle>
            <DialogDescription className="text-center text-lg">
              Nos pondremos en contacto contigo a la brevedad posible.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Agenda tu cita</DialogTitle>
              <DialogDescription>
                Déjanos los datos de tu empresa y nos comunicaremos para evaluar la salud de tus empleados.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nombre de la Empresa</Label>
                <Input id="companyName" name="companyName" placeholder="Ej. Acme Corp" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" name="email" type="email" placeholder="contacto@empresa.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono (Opcional)</Label>
                <Input id="phone" name="phone" type="tel" placeholder="55 1234 5678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensaje / Requerimientos</Label>
                <textarea 
                  id="message" 
                  name="message" 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="¿Cuántos empleados necesitan evaluación?" 
                  required
                />
              </div>
              {errorMsg && <p className="text-sm text-red-500 font-medium">{errorMsg}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Enviando...' : 'Solicitar Información'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}
