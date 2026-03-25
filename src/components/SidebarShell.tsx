"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Stethoscope, Menu, X, LogOut } from 'lucide-react'

interface SidebarLink {
  href: string
  label: string
  icon: React.ReactNode
}

export function SidebarShell({
  links,
  logoutAction,
}: {
  links: SidebarLink[]
  logoutAction: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0F2044] h-14 flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-[#2C6E9E]" />
          <span className="text-white font-bold text-lg">SME</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Menú"
        >
          {open ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar - desktop fixed, mobile as drawer */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-screen w-[240px] flex flex-col bg-[#0F2044] text-slate-300 border-r border-[#0B1833] flex-shrink-0
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 shrink-0 items-center px-6 font-bold text-xl gap-2 border-b border-white/10 bg-[#0F2044]">
          <Stethoscope className="w-6 h-6 text-[#2C6E9E]" />
          <span className="text-white">Salud<span className="text-[#2C6E9E]">Laboral</span></span>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 bg-[#0F2044]">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-[#F87171] hover:bg-white/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Cerrar Sesión
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
