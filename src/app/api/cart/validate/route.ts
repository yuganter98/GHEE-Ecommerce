import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic'; // No caching as requested

const cartItemSchema = z.object({
    id: z.number(),
    quantity: z.number().min(1),
});

const validateSchema = z.object({
    items: z.array(cartItemSchema),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items } = validateSchema.parse(body);

        if (items.length === 0) {
            return NextResponse.json({ total: 0, items: [], warnings: [] });
        }

        // Fetch live prices and stock
        // In a real app, use WHERE id IN (...)
        const ids = items.map(i => i.id);
        // Simple query approach
        const placeholder = ids.map((_, i) => `$${i + 1}`).join(',');
        const query = `SELECT id, price, stock, name, image_url FROM products WHERE id IN (${placeholder})`;

        let dbRows = [];
        try {
            const res = await db.query(query, ids);
            dbRows = res.rows;
        } catch (e) {
            console.error("DB Failed", e);
            throw new Error("Database validation failed");
        }

        let total = 0;
        const validatedItems = [];
        const warnings: string[] = [];

        for (const item of items) {
            const product = dbRows.find((p: any) => p.id === item.id);
            if (!product) continue; // Skip invalid items

            let quantity = item.quantity;

            // Stock Clamp Strategy
            if (quantity > product.stock) {
                quantity = product.stock;
                warnings.push(`Stock limited for ${product.name}: only ${product.stock} available.`);
            }

            const lineTotal = product.price * quantity;
            total += lineTotal;

            validatedItems.push({
                id: product.id,
                name: product.name, // Added
                image_url: product.image_url, // Added
                quantity,
                price: product.price,
                lineTotal
            });
        }

        return NextResponse.json({
            total,
            items: validatedItems,
            warnings
        });

    } catch (error) {
        console.error('Validation Error:', error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
