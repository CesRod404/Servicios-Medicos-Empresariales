import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAuthRoute = path.startsWith('/admin') || path.startsWith('/doctor') || path === '/dashboard'

  // Proteccion de rutas para usuarios logueados
  if (isAuthRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Redirigir al dashboard correspondiente si ya está logueado y visita el home o el login
  if ((path === '/login' || path === '/dashboard') && user) {
     // Check role using a fast API fetch or simple inference.
     // In middleware we cannot directly query Postgres as easily, 
     // but we can query using the Supabase restful API
     const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
     
     const dashUrl = request.nextUrl.clone()
     dashUrl.pathname = profile?.role === 'admin' ? '/admin/companies' : '/doctor/dashboard'
     return NextResponse.redirect(dashUrl)
  }

  return supabaseResponse
}
