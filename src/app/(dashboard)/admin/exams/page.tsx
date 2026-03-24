import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ExamsClient from './ExamsClient'

export default async function ExamsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/doctor/dashboard')

  return <ExamsClient />
}
