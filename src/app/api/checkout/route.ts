import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { z } from 'zod';
import { db } from '@/lib/db';
import { EmailService } from '@/lib/email';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// Validation Schema
const checkoutSchema = z.object({
    items: z.array(z.object({
        id: z.number(),
        quantity: z.number().min(1),
    })),
    paymentMethod: z.enum(['ONLINE', 'COD']),
    customer: z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(10, "Valid phone number is required"), // Mandatory
        email: z.string().email("Valid email is required"), // Mandatory for order confirmation
        address: z.object({
            line1: z.string().min(1, "Address is required"),
            city: z.string().min(1, "City is required"),
            state: z.string().min(1, "State is required"),
            pincode: z.string().min(5, "Pincode is required"),
        }),
    }),
});

// Simple In-Memory Rate Limit (Reset on restart)
const rateLimitMap = new Map<string, number>();

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting
        const ip = (await headers()).get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        const lastRequest = rateLimitMap.get(ip) || 0;
        if (now - lastRequest < 2000) { // 2 seconds limit
            return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });
        }
        rateLimitMap.set(ip, now);

        const body = await req.json();
        const { items, paymentMethod, customer } = checkoutSchema.parse(body);

        if (items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // 2. Validate Stock & Price
        const ids = items.map(i => i.id);
        const placeholder = ids.map((_, i) => `$${i + 1}`).join(',');
        const query = `SELECT id, name, price, stock FROM products WHERE id IN (${placeholder})`;
        const { rows: products } = await db.query(query, ids);

        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = products.find(p => p.id === item.id);
            if (!product) continue;

            if (item.quantity > product.stock) {
                return NextResponse.json({ error: `Insufficient stock for product ID ${item.id}` }, { status: 400 });
            }

            totalAmount += product.price * item.quantity;
            orderItemsData.push({
                product_id: product.id,
                quantity: item.quantity,
                price_at_purchase: product.price,
                name: product.name
            });
        }

        // 3. Handle COD vs Online
        const client = await db.connect();
        let orderId: number;
        let razorpayOrderId: string;

        try {
            await client.query('BEGIN');

            if (paymentMethod === 'ONLINE') {
                if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('PLACEHOLDER')) {
                    throw new Error('Razorpay keys not configured');
                }
                const razorpay = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID!,
                    key_secret: process.env.RAZORPAY_KEY_SECRET!,
                });
                const rzpOrder = await razorpay.orders.create({
                    amount: totalAmount,
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                });
                razorpayOrderId = rzpOrder.id;
            } else {
                razorpayOrderId = `COD_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            }

            const status = paymentMethod === 'COD' ? 'COD_PENDING' : 'PENDING';

            const insertOrderQuery = `
        INSERT INTO orders (razorpay_order_id, amount, status, currency, payment_method, customer_details)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;
            const res = await client.query(insertOrderQuery, [
                razorpayOrderId, totalAmount, status, 'INR', paymentMethod, JSON.stringify(customer)
            ]);
            orderId = res.rows[0].id;

            for (const item of orderItemsData) {
                await client.query(`
                  INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                  VALUES ($1, $2, $3, $4)
                `, [orderId, item.product_id, item.quantity, item.price_at_purchase]);

                // For COD, decrement stock immediately
                if (paymentMethod === 'COD') {
                    await client.query(`
                        UPDATE products 
                        SET stock = stock - $1 
                        WHERE id = $2
                    `, [item.quantity, item.product_id]);
                }
            }

            await client.query('COMMIT');

        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

        // 4. Post-Creation Actions
        if (paymentMethod === 'COD') {
            // Immediate Email for COD
            EmailService.sendOrderConfirmation({
                orderId,
                customerName: customer.name,
                customerEmail: customer.email || undefined,
                customerPhone: customer.phone,
                customerAddress: customer.address,
                totalAmount,
                items: orderItemsData,
                paymentMethod: 'COD'
            });

            return NextResponse.json({
                success: true,
                paymentMethod: 'COD',
                orderId: razorpayOrderId // Using the string ID for URL
            });

        } else {
            // Return Razorpay data for Online
            return NextResponse.json({
                orderId: razorpayOrderId,
                amount: totalAmount,
                currency: 'INR',
                key: process.env.RAZORPAY_KEY_ID,
                paymentMethod: 'ONLINE'
            });
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        console.error('Checkout Error:', error);
        const msg = error instanceof Error ? error.message : 'Checkout failed';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
