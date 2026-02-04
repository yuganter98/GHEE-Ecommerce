import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
    const client = await pool.connect();
    try {
        console.log('🔄 Migrating Orders Table...');

        // Add payment_method
        await client.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'ONLINE';
    `);

        // Ensure customer_details exists (it was in Phase 4 init, but ensuring safety)
        await client.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS customer_details JSONB;
    `);

        console.log('✅ Migration Complete: Added payment_method and verified customer_details.');

    } catch (err) {
        console.error('❌ Migration Error:', err);
    } finally {
        client.release();
        pool.end();
    }
}

main();
