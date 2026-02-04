import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Check for admin session cookie
        const adminSession = request.cookies.get('admin_session');

        if (!adminSession || adminSession.value !== 'true') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // 2. Protect /api/admin routes (excluding login)
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
        if (request.nextUrl.pathname === '/api/admin/login') {
            return NextResponse.next();
        }

        const adminSession = request.cookies.get('admin_session');
        if (!adminSession || adminSession.value !== 'true') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
