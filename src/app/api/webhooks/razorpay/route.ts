import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { EmailService } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-razorpay-signature');
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!signature || !secret) {
            return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
        }

        // 1. Verify Signature
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error('Invalid Webhook Signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const payload = JSON.parse(body);
        const event = payload.event;

        // 2. Handle payment.captured
        if (event === 'payment.captured') {
            const payment = payload.payload.payment.entity;
            const orderId = payment.order_id; // Razorpay Order ID

            // 3. Idempotency Check & Update
            const client = await db.connect();
            try {
                await client.query('BEGIN');

                // Check current status
                const checkRes = await client.query('SELECT status FROM orders WHERE razorpay_order_id = $1', [orderId]);
                if (checkRes.rows.length === 0) {
                    console.warn(`Order ${orderId} not found locally.`);
                    await client.query('ROLLBACK');
                    return NextResponse.json({ status: 'ignored' });
                }

                const currentStatus = checkRes.rows[0].status;
                if (currentStatus === 'PAID') {
                    console.log(`Order ${orderId} already PAID. Ignoring duplicate event.`);
                    await client.query('ROLLBACK');
                    return NextResponse.json({ status: 'ignored' });
                }

                // Update to PAID
                await client.query(`
            UPDATE orders 
            SET status = 'PAID' 
            WHERE razorpay_order_id = $1
        `, [orderId]);

                // Get Order Details for Email
                const orderRes = await client.query(`
            SELECT id, amount, customer_details, payment_method FROM orders WHERE razorpay_order_id = $1
        `, [orderId]);
                const order = orderRes.rows[0];

                // Reduce Stock
                const itemsRes = await client.query(`
            SELECT product_id, quantity, price_at_purchase FROM order_items 
            JOIN orders ON orders.id = order_items.order_id
            WHERE orders.razorpay_order_id = $1
        `, [orderId]);

                for (const item of itemsRes.rows) {
                    await client.query(`
                UPDATE products 
                SET stock = stock - $1 
                WHERE id = $2
            `, [item.quantity, item.product_id]);
                }

                await client.query('COMMIT');
                console.log(`Order ${orderId} marked as PAID.`);

                // Trigger Email (Non-blocking)
                if (order && order.customer_details) {
                    const customer = order.customer_details; // JSONB
                    EmailService.sendOrderConfirmation({
                        orderId: order.id,
                        customerName: customer.name,
                        customerEmail: customer.email,
                        totalAmount: order.amount,
                        items: itemsRes.rows,
                        paymentMethod: 'ONLINE (Razorpay)'
                    });
                }

            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
