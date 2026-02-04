import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const headers = response.headers;

    // Basic Security Headers (already in next.config.js, but reinforcement here for some edge cases is good, 
    // though typically redundant. We can add custom ones here).

    // Rate Limiting Stub (Phase 1)
    // Real implementation would use Redis/KV.
    // Here we just log or set headers.

    // Bot Protection Stub
    const userAgent = request.headers.get('user-agent') || '';
    if (userAgent.includes('BadBot')) {
        return new NextResponse(null, { status: 403, statusText: 'Forbidden' });
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
