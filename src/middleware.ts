import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isLoginPage = request.nextUrl.pathname === '/AdminLogin' || request.nextUrl.pathname === '/login'

  // If no session and trying to access protected route, redirect to login
  if (!session && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/AdminLogin'
    return NextResponse.redirect(url)
  }

  // If session exists, verify admin role
  if (session) {
    // Check both auth_user_id and email for flexibility
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .or(`auth_user_id.eq.${session.user.id},email.eq.${session.user.email}`)
      .maybeSingle()

    // If role is NOT admin, redirect to login even if authenticated
    if (error || userData?.role !== 'admin') {
      if (!isLoginPage) {
        const url = request.nextUrl.clone()
        url.pathname = '/AdminLogin'
        return NextResponse.redirect(url)
      }
    } else {
      // If session exists AND user is an admin, and they are on login page, redirect to home
      if (isLoginPage) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
}

