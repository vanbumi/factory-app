import { NextResponse, type NextRequest } from 'next/server'
// import { updateSession } from '@/lib/supabase/middleware' // Matikan import ini

export async function middleware(request: NextRequest) {
  // return await updateSession(request) // Matikan pemanggilan session
  
  // Langsung teruskan request agar halaman bisa terbuka
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
