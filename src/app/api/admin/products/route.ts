import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation Schema
const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.number().int().min(1, 'Price must be greater than 0'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    image_url: z.string().url(),
    is_active: z.boolean().default(true),
});

// GET: List All Products
export async function GET() {
    try {
        const client = await db.connect();
        try {
            const result = await client.query(`
                SELECT * FROM products ORDER BY id ASC
            `);
            return NextResponse.json({ success: true, products: result.rows });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('List Products Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// POST: Create New Product
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = productSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.message }, { status: 400 });
        }

        const { name, description, price, stock, image_url, is_active } = validation.data;

        // Validations
        if (!image_url.startsWith('https://')) {
            return NextResponse.json({ error: 'Image URL must be HTTPS' }, { status: 400 });
        }
        if (!image_url.includes('cloudinary.com')) {
            return NextResponse.json({ error: 'Only Cloudinary images allowed' }, { status: 400 });
        }

        const client = await db.connect();
        try {
            // Generate Slug
            let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            // Uniqueness Check
            let counter = 0;
            let finalSlug = slug;
            while (true) {
                const slugCheck = await client.query('SELECT 1 FROM products WHERE slug = $1', [finalSlug]);
                if (slugCheck.rowCount === 0) break;
                counter++;
                finalSlug = `${slug}-${counter}`;
            }

            const result = await client.query(`
                INSERT INTO products (name, slug, description, price, stock, image_url, is_active)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `, [name, finalSlug, description || '', price, stock, image_url, is_active]);

            return NextResponse.json({ success: true, product: result.rows[0] });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Create Product Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
