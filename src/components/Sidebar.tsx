import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Stethoscope, Building2, Users, ClipboardList, Wallet, LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'

export async function Sidebar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = profile?.role || 'doctor'

  const handleLogout = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex h-screen w-[240px] flex-col bg-[#0F2044] text-slate-300 border-r border-[#0B1833] flex-shrink-0">
      <div className="flex h-16 shrink-0 items-center px-6 font-bold text-xl gap-2 border-b border-white/10 bg-[#0F2044]">
        <Stethoscope className="w-6 h-6 text-[#2C6E9E]" />
        <span className="text-white">Salud<span className="text-[#2C6E9E]">Laboral</span></span>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 font-medium">
        {role === 'admin' ? (
          <>
            <Link href="/admin/companies" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
              <Building2 className="w-5 h-5" /> Empresas
            </Link>
            <Link href="/admin/patients" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
              <Users className="w-5 h-5" /> Empleados
            </Link>
             <Link href="/admin/exams" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
              <ClipboardList className="w-5 h-5" /> Catálogo Exámenes
            </Link>
            <Link href="/admin/billing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
              <Wallet className="w-5 h-5" /> Cobranza
            </Link>
          </>
        ) : (
          <>
            <Link href="/doctor/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
              <Users className="w-5 h-5" /> Pacientes del Día
            </Link>
            <Link href="/doctor/exams" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
              <ClipboardList className="w-5 h-5" /> Catálogo Exámenes
            </Link>
          </>
        )}
      </nav>
      <div className="p-4 border-t border-white/10 bg-[#0F2044]">
        <form action={handleLogout}>
          <button type="submit" className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-[#F87171] hover:bg-white/10 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" /> Cerrar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}
