import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing!');
    process.exit(1);
}

// Logic to check and create database
async function ensureDbExists() {
    const dbUrl = new URL(process.env.DATABASE_URL);
    const targetDb = dbUrl.pathname.slice(1);
    // Connect to 'postgres' default db to perform admin actions
    const defaultUrl = process.env.DATABASE_URL.replace(`/${targetDb}`, '/postgres');

    const client = new Pool({ connectionString: defaultUrl });
    try {
        await client.connect();
        // Check if db exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [targetDb]);
        if (res.rowCount === 0) {
            console.log(`Database "${targetDb}" not found. Creating...`);
            // cannot run CREATE DATABASE inside a transaction block, just run it
            await client.query(`CREATE DATABASE "${targetDb}"`);
            console.log(`✅ Database "${targetDb}" created.`);
        } else {
            console.log(`Database "${targetDb}" exists.`);
        }
    } catch (e) {
        if (e.code === '42P04') { // duplicate_database
            console.log(`Database "${targetDb}" already exists.`);
        } else {
            console.error('⚠️ Could not check/create database. Ensure role has createdb privilege.', e.message);
        }
    } finally {
        await client.end();
    }
}

async function main() {
    await ensureDbExists();

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const client = await pool.connect();
    try {
        console.log('🌱 Initializing/Seeding Tables...');

        // 1. Create Products Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price INTEGER NOT NULL, -- in paise/cents
        image_url TEXT NOT NULL,
        stock INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Table "products" ready.');

        // 2. Seed Data
        const products = [
            {
                slug: 'pure-ghee-500ml',
                name: 'Pure Desi Ghee (500ml)',
                description: 'Hand-churned A2 Bilona Ghee in a premium glass jar. Perfect for daily cooking.',
                price: 150000, // ₹1,500.00
                image_url: '/images/product-jar.jpg',
                stock: 50
            },
            {
                slug: 'pure-ghee-1l',
                name: 'Pure Desi Ghee (1L)',
                description: 'Family pack of our signature golden elixir. Best value for regular consumption.',
                price: 280000, // ₹2,800.00
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
