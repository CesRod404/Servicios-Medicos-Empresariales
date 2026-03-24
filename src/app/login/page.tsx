import { login } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stethoscope, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// searchParams en Next15 es una Promesa
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const query = await searchParams;
  const errorMsg = query.error as string;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 shadow-inner">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="w-7 h-7 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Salud<span className="text-blue-600">Laboral</span>
          </CardTitle>
          <CardDescription className="text-slate-500">
            Ingresa a la plataforma de gestión de expedientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-3 rounded-md text-center">
                {errorMsg}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="doctor@clinica.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            
            <Button type="submit" formAction={login} className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base">
              Ingresar al Dashboard
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la página principal
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
