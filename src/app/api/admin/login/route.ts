import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json({ error: 'Password required' }, { status: 400 });
        }

        const hash = createHash('sha256').update(password).digest('hex');
        const validHash = process.env.ADMIN_PASSWORD_HASH;

        if (hash === validHash) {
            const response = NextResponse.json({ success: true });

            // Set HttpOnly cookie
            response.cookies.set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
