import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    const client = await pool.connect();
    try {
        console.log('🌱 Seeding...');
        const products = [
            {
                slug: 'pure-ghee-500ml',
                name: 'Pure Desi Ghee (500ml)',
                description: 'Hand-churned A2 Bilona Ghee in a premium glass jar. Perfect for daily cooking.',
                price: 150000,
                image_url: '/images/product-jar.jpg',
                stock: 50
            },
            {
                slug: 'pure-ghee-1l',
                name: 'Pure Desi Ghee (1L)',
                description: 'Family pack of our signature golden elixir. Best value for regular consumption.',
                price: 280000,
                image_url: '/images/product-jar.jpg',
                stock: 30
            }
        ];

        for (const p of products) {
            await client.query(`
        INSERT INTO products (slug, name, description, price, image_url, stock)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (slug) DO UPDATE 
        SET name = EXCLUDED.name, 
            price = EXCLUDED.price,
            stock = EXCLUDED.stock,
            image_url = EXCLUDED.image_url;
      `, [p.slug, p.name, p.description, p.price, p.image_url, p.stock]);
        }
        console.log(`✅ Seeded ${products.length} products.`);

    } catch (err) {
        console.error('❌ Error during seeding:', err);
    } finally {
        client.release();
        pool.end();
    }
}

main();
