import 'server-only';
import { Pool } from 'pg';

// Note: In a real app we would import env here, but during build env might be missing.
// We should import it but careful about build time errors.
// import { env } from './env'; 

// Use process.env directly for now to avoid circular deps or build issues if env is not fully ready
// but we still want the singleton pattern.

const globalForDb = global as unknown as { db: Pool };

export const db =
    globalForDb.db ||
    new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20, // Connection pool limit
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000, // Fail fast if pool is full
    });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
