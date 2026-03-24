import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DoctorDashboardClient from './DoctorDashboardClient'

export default async function DoctorDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar rol
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'doctor') {
    redirect('/admin/companies') // Si es admin que no esté aquí, o denegado
  }

  // Fetch initial data needed for dropdowns: Companies, Exams
  const { data: companies } = await supabase.from('companies').select('id, name')
  const { data: exams } = await supabase.from('exams').select('*')

  return (
     <DoctorDashboardClient 
         initialCompanies={companies || []} 
         initialExams={exams || []} 
     />
  )
}
