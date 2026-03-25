"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Stethoscope, Menu, X } from 'lucide-react'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E2E8F0]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
        <Link href="/" className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-[#2C6E9E]" />
          <span className="text-lg sm:text-xl font-bold text-[#0F2044] tracking-tight">
            Servicios Medicos<span className="text-[#2C6E9E] font-normal ml-1">Empresariales</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#servicios" className="text-sm font-medium text-slate-600 hover:text-[#0F2044] transition-colors">
            Servicios Clínicos
          </Link>
          <Link href="/login">
            <button className="border border-[#2C6E9E] text-[#2C6E9E] bg-transparent hover:bg-[#2C6E9E]/10 h-9 px-4 rounded-md text-sm font-medium transition-colors">
              Iniciar Sesión Central
            </button>
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X className="w-6 h-6 text-[#0F2044]" /> : <Menu className="w-6 h-6 text-[#0F2044]" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <Link
            href="#servicios"
            className="block text-sm font-medium text-slate-600 hover:text-[#0F2044] py-2 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Servicios Clínicos
          </Link>
          <Link href="/login" onClick={() => setMobileOpen(false)}>
            <button className="w-full border border-[#2C6E9E] text-[#2C6E9E] bg-transparent hover:bg-[#2C6E9E]/10 h-10 px-4 rounded-md text-sm font-medium transition-colors">
              Iniciar Sesión Central
            </button>
          </Link>
        </div>
      )}
    </header>
  )
}
