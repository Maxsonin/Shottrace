import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const AUTH_COOKIE = 'Authentication';
export const REFRESH_COOKIE = 'Refresh';

export const extractCookiesFromResponse = (response: Response) => {
  const setCookie = response.headers.get('set-cookie');
  if (!setCookie) return null;
  return setCookie;
};

const publicRoutes = ['/auth/signin', '/'];

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const auth = (await cookies()).get(AUTH_COOKIE)?.value;
  const refresh = (await cookies()).get(REFRESH_COOKIE)?.value;

  const isPublic = publicRoutes.some((r) => path.startsWith(r));

  // If user NOT authenticated but has refresh token → attempt refresh
  if (!auth && refresh) {
    const refreshRes = await fetch(`http://localhost:3000/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: cookies().toString(),
      },
    });

    const forwardedCookies = extractCookiesFromResponse(refreshRes);

    if (forwardedCookies) {
      const res = NextResponse.redirect(request.url);
      res.headers.set('Set-Cookie', forwardedCookies);
      return res;
    }
  }

  // Block protected routes
  if (!auth && !isPublic) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
