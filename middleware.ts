import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/claims',
  '/payments',
  '/plans',
  '/drugs',
  '/telemedicine',
  '/facilities',
  '/family',
  '/profile',
  '/admin',
];
const AUTH_PREFIXES = ['/login', '/signup'];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Mock mode has no real session to enforce server-side — the client-side
  // mock auth provider owns access control for local/demo use only. This
  // must be an explicit opt-in, never inferred from missing env vars, or a
  // misconfigured deploy would silently disable all route protection.
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true';
  if (isMockMode) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Misconfigured deploy: Supabase isn't reachable and mock mode wasn't
    // requested. Fail closed — treat every request as unauthenticated
    // instead of letting it through unchecked.
    if (matchesPrefix(pathname, PROTECTED_PREFIXES)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response.cookies.set(name, value, options as any)
        );
      },
    },
  });

  // getUser() revalidates the token against Supabase Auth; getSession()
  // only reads the (spoofable) local cookie and must not be trusted here.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = matchesPrefix(pathname, PROTECTED_PREFIXES);
  const isAuthPage = matchesPrefix(pathname, AUTH_PREFIXES);

  if (!user && isProtected) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (user && matchesPrefix(pathname, ['/admin'])) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
