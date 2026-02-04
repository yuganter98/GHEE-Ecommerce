import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = await db.connect();
        try {
            const result = await client.query(`
                SELECT 
                    id, 
                    razorpay_order_id, 
                    amount, 
                    status, 
                    customer_details, 
                    created_at 
                FROM orders 
                ORDER BY created_at DESC
            `);

            return NextResponse.json({ success: true, orders: result.rows });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Admin Orders Error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
