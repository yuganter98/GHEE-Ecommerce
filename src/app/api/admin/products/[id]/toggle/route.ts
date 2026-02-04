import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { is_active } = body;

        if (typeof is_active !== 'boolean') {
            return NextResponse.json({ error: 'Invalid active status' }, { status: 400 });
        }

        const client = await db.connect();
        try {
            await client.query('UPDATE products SET is_active = $1 WHERE id = $2', [is_active, parseInt(id)]);
            return NextResponse.json({ success: true });
        } finally {
            client.release();
        }
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
