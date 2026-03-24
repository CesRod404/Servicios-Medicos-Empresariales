import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Stethoscope } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E2E8F0]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
        <Link href="/" className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-[#2C6E9E]" />
          <span className="text-xl font-bold text-[#0F2044] tracking-tight">
            Servicios Medicos<span className="text-[#2C6E9E] font-normal ml-1">Empresariales</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="#servicios" className="text-sm font-medium text-slate-600 hover:text-[#0F2044] transition-colors">
            Servicios Clínicos
          </Link>
          <Link href="/login">
            <button className="border border-[#2C6E9E] text-[#2C6E9E] bg-transparent hover:bg-[#2C6E9E]/10 h-9 px-4 rounded-md text-sm font-medium transition-colors">
              Iniciar Sesión Central
            </button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
