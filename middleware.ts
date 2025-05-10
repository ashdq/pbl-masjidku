import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const protectedPaths = ['/dashboard', '/admin', '/takmir']
  const publicPaths = ['/', '/login', '/register', '/landing-page']

  // Skip middleware untuk static files
  if (path.startsWith('/_next') || path.startsWith('/favicon.ico')) {
    return NextResponse.next()
  }

  // Cek session hanya untuk protected paths
  if (protectedPaths.some(p => path.startsWith(p))) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
        credentials: 'include',
        headers: {
          Cookie: request.headers.get('cookie') || '',
        },
      })

      if (!response.ok) {
        throw new Error('Unauthorized')
      }

      const user = await response.json()

      // Role-based path protection
      if (path.startsWith('/admin') && user.roles !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      if (path.startsWith('/takmir') && user.roles !== 'takmir') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      return NextResponse.next()
    } catch (error) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Untuk public paths, jangan lakukan apapun
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - static files
     * - public paths
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|landing-page).*)',
  ],
}