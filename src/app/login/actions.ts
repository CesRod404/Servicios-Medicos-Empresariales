'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=Credenciales+incorrectas')
  }

  // Identificar rol para redirigir
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
     const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
     if (profile?.role === 'admin') {
         redirect('/admin/companies')
     } else {
         redirect('/doctor/dashboard')
     }
  }

  redirect('/')
}
