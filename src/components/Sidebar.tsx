import { createClient } from '@/utils/supabase/server'
import { Building2, Users, ClipboardList, Wallet } from 'lucide-react'
import { redirect } from 'next/navigation'
import { SidebarShell } from './SidebarShell'

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

  const adminLinks = [
    { href: '/admin/companies', label: 'Empresas', icon: <Building2 className="w-5 h-5" /> },
    { href: '/admin/patients', label: 'Empleados', icon: <Users className="w-5 h-5" /> },
    { href: '/admin/exams', label: 'Catálogo Exámenes', icon: <ClipboardList className="w-5 h-5" /> },
    { href: '/admin/billing', label: 'Cobranza', icon: <Wallet className="w-5 h-5" /> },
  ]

  const doctorLinks = [
    { href: '/doctor/dashboard', label: 'Pacientes del Día', icon: <Users className="w-5 h-5" /> },
    { href: '/doctor/exams', label: 'Catálogo Exámenes', icon: <ClipboardList className="w-5 h-5" /> },
  ]

  return (
    <SidebarShell
      links={role === 'admin' ? adminLinks : doctorLinks}
      logoutAction={handleLogout}
    />
  )
}
