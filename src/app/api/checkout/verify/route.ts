import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) return NextResponse.json({ error: 'Server config error' }, { status: 500 });

        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // Verification Successful

            // CONNECT DB
            const { db } = await import('@/lib/db');
            const { EmailService } = await import('@/lib/email');

            const client = await db.connect();
            try {
                await client.query('BEGIN');

                // 1. Check current status
                const checkRes = await client.query('SELECT id, status, amount, customer_details, payment_method FROM orders WHERE razorpay_order_id = $1', [razorpay_order_id]);
                if (checkRes.rows.length === 0) {
                    await client.query('ROLLBACK');
                    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
                }

                const order = checkRes.rows[0];
                if (order.status === 'PAID') {
                    await client.query('ROLLBACK'); // Already processed by webhook
                    return NextResponse.json({ success: true, message: 'Already Paid' });
                }

                // 2. Update Status
                await client.query("UPDATE orders SET status = 'PAID' WHERE id = $1", [order.id]);

                // 3. Reduce Stock (if not already done)
                const itemsRes = await client.query(`
                    SELECT product_id, quantity, price_at_purchase, p.name as product_name 
                    FROM order_items 
                    JOIN products p ON p.id = order_items.product_id
                    WHERE order_id = $1
                `, [order.id]);

                for (const item of itemsRes.rows) {
                    await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
                }

                await client.query('COMMIT');

                // 4. Send Email
                if (order.customer_details) {
                    EmailService.sendOrderConfirmation({
                        orderId: order.id,
                        customerName: order.customer_details.name,
                        customerEmail: order.customer_details.email,
                        totalAmount: order.amount,
                        items: itemsRes.rows,
                        paymentMethod: 'ONLINE (Razorpay Verified)'
                    });
                }

                return NextResponse.json({ success: true, message: 'Payment Verified & Order Updated' });

            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }

        } else {
            return NextResponse.json({ success: false, message: 'Invalid Signature' }, { status: 400 });
        }

    } catch (error) {
        console.error('Verify Error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
