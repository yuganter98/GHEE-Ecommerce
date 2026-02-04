import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function verify() {
    try {
        const res = await pool.query('SELECT count(*) FROM products');
        console.log(`✅ VERIFICATION SUCCESS: Found ${res.rows[0].count} products in database.`);
        if (res.rows[0].count == 0) console.warn('⚠️  Warning: Table exists but is empty.');
    } catch (e) {
        console.error('❌ VERIFICATION FAILED:', e.message);
    } finally {
        pool.end();
    }
}

verify();
