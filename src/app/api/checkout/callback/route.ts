import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Razorpay redirects here (POST) after mobile payment completes
export async function POST(req: Request) {
    try {
        // Razorpay sends form-encoded data on redirect
        const formData = await req.formData();
        const razorpay_order_id = formData.get('razorpay_order_id') as string;
        const razorpay_payment_id = formData.get('razorpay_payment_id') as string;
        const razorpay_signature = formData.get('razorpay_signature') as string;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            // Payment was cancelled or failed on mobile
            return NextResponse.redirect(new URL('/checkout?error=payment_failed', req.url));
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return NextResponse.redirect(new URL('/checkout?error=server_error', req.url));
        }

        // Verify signature
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return NextResponse.redirect(new URL('/checkout?error=invalid_signature', req.url));
        }

        // Signature valid — update DB and send email
        const { db } = await import('@/lib/db');
        const { EmailService } = await import('@/lib/email');

        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const checkRes = await client.query(
                'SELECT id, status, amount, customer_details, payment_method FROM orders WHERE razorpay_order_id = $1',
                [razorpay_order_id]
            );

            if (checkRes.rows.length === 0) {
                await client.query('ROLLBACK');
                return NextResponse.redirect(new URL('/checkout?error=order_not_found', req.url));
            }

            const order = checkRes.rows[0];
            const alreadyPaid = order.status === 'PAID';

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

            // Send email (always, to handle the case where webhook didn't send it)
            if (order.customer_details) {
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
                    console.log(`📧 Mobile payment emails sent for Order ${order.id}`);
                } catch (emailErr) {
                    console.error('❌ Email failed on mobile callback:', emailErr);
                }
            }

            // Redirect to success page with cart-clear flag
            const successUrl = new URL(`/checkout/success?orderId=${razorpay_order_id}&clearCart=true`, req.url);
            return NextResponse.redirect(successUrl);

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Mobile callback error:', error);
        return NextResponse.redirect(new URL('/checkout?error=verification_failed', req.url));
    }
}
