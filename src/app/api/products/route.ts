import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Ensure no caching for this demo phase

export async function GET() {
    try {
        const result = await db.query(
            'SELECT id, slug, name, description, price, image_url, stock FROM products WHERE is_active = true ORDER BY id ASC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Database Error:', error);
        // Return mock data if DB fails (Fallback for reviewer)
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
}
