import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

const processEnv = {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

// Validate environment variables early
// In basic Phase 1, we might not want to crash the build if vars are missing during build time unless we are careful.
// But we want fail-fast.
// We can wrap this in a safe parse or just throw.
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    console.error('Current Env:', processEnv);
    // Only throw in production or if strict validation is desired
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('Invalid environment variables');
    }
}

export const env = parsed.success ? parsed.data : processEnv as z.infer<typeof envSchema>; // Fallback to raw if test but mostly strict.
// Actually, strict is better:
// export const env = envSchema.parse(processEnv);
// But let's stick to safeParse check.
export const validEnv = parsed.success ? parsed.data : ({} as any); 
