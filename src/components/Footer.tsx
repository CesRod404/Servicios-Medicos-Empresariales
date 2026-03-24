import { Stethoscope } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#0F2044] py-12 text-slate-300 border-t border-[#0B1833]">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-[#2C6E9E]" />
          <span className="text-xl font-bold text-white tracking-tight">Servicios Medicos<span className="text-[#2C6E9E] font-normal ml-1">Empresariales</span></span>
        </div>
        <p className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} Servicios Médicos Empresariales. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
