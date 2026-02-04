const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const products = [
    {
        name: "Buffalo Ghee (1L)",
        slug: "buffalo-ghee-1l",
        description: "Pure, hand-churned Bilona Buffalo Ghee. Rich in aroma and traditional taste. Made from free-range milk.",
        price: 150000, // ₹1500
        stock: 50,
        image_url: "https://res.cloudinary.com/dbesx6ijh/image/upload/v1/kravelab/products/buffalo_1l_default"
    },
    {
        name: "Buffalo Ghee (500ml)",
        slug: "buffalo-ghee-500ml",
        description: "The same liquid gold in a compact jar. Perfect for small families.",
        price: 80000, // ₹800
        stock: 40,
        image_url: "https://res.cloudinary.com/dbesx6ijh/image/upload/v1/kravelab/products/buffalo_500ml_default"
    }
];

async function seed() {
    console.log('Connecting...');
    try {
        await client.connect();

        for (const p of products) {
            await client.query(`
            INSERT INTO products (name, slug, description, price, stock, image_url, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, TRUE)
            ON CONFLICT (slug) DO UPDATE 
            SET price = EXCLUDED.price, stock = EXCLUDED.stock;
        `, [p.name, p.slug, p.description, p.price, p.stock, p.image_url]);
            console.log(`✅ Seeded: ${p.name}`);
        }

    } catch (err) {
        console.error('❌ Seed failed:', err);
    } finally {
        await client.end();
    }
}

seed();
