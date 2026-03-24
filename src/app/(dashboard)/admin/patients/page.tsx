import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PatientsClient from './PatientsClient'

export default async function PatientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/doctor/dashboard')

  const { data: companies } = await supabase.from('companies').select('id, name')

  return <PatientsClient initialCompanies={companies || []} />
}
