import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ExamsClient from '../../admin/exams/ExamsClient'

export default async function DoctorExamsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  // Validamos que sea doctor
  if (profile?.role !== 'doctor') {
    redirect('/admin/companies')
  }

  // Reutilizamos el componente cliente del CRUD directamente
  return <ExamsClient />
}
