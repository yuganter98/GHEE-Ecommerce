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

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ success: false, message: 'Invalid Signature' }, { status: 400 });
        }

        // Signature verified — proceed
        const { db } = await import('@/lib/db');
        const { EmailService } = await import('@/lib/email');

        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // 1. Get order details
            const checkRes = await client.query(
                'SELECT id, status, amount, customer_details, payment_method FROM orders WHERE razorpay_order_id = $1',
                [razorpay_order_id]
            );
            if (checkRes.rows.length === 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }

            const order = checkRes.rows[0];
            const alreadyPaid = order.status === 'PAID';

            // 2. Update status + reduce stock ONLY if not already done by webhook
            if (!alreadyPaid) {
                await client.query("UPDATE orders SET status = 'PAID' WHERE id = $1", [order.id]);

                const stockItems = await client.query(
                    'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
                    [order.id]
                );
                for (const item of stockItems.rows) {
                    await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
                }
            }

            await client.query('COMMIT');

            // 3. ALWAYS send email from verify route (this is the client-facing endpoint)
            //    The webhook may or may not have sent one — but it's better to
            //    guarantee delivery from the route the user is actually waiting on.
            if (order.customer_details) {
                // Get items with product names for the email
                const itemsRes = await client.query(`
                    SELECT oi.product_id, oi.quantity, oi.price_at_purchase, p.name 
                    FROM order_items oi
                    JOIN products p ON p.id = oi.product_id
                    WHERE oi.order_id = $1
                `, [order.id]);

                try {
                    await EmailService.sendOrderConfirmation({
                        orderId: order.id,
                        customerName: order.customer_details.name,
                        customerEmail: order.customer_details.email,
                        customerPhone: order.customer_details.phone,
                        customerAddress: order.customer_details.address,
                        totalAmount: order.amount,
                        items: itemsRes.rows,
                        paymentMethod: 'ONLINE (Razorpay)'
                    });
                    console.log(`📧 Online payment emails sent for Order ${order.id}`);
                } catch (emailErr) {
                    console.error('❌ Email failed but payment verified:', emailErr);
                }
            }

            return NextResponse.json({ success: true, message: 'Payment Verified & Order Updated' });

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Verify Error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
