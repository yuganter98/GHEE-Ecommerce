import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { paramsToSign } = body;

        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!apiSecret) {
            return NextResponse.json({ error: 'Missing Cloudinary Secret' }, { status: 500 });
        }

        // Sort params by key
        const sortedKeys = Object.keys(paramsToSign).sort();

        // Create parameter string: key=value&key=value...
        const paramString = sortedKeys
            .map(key => `${key}=${paramsToSign[key]}`)
            .join('&');

        // Append secret
        const stringToSign = `${paramString}${apiSecret}`;

        // Hash with SHA-1
        const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

        return NextResponse.json({
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        });
    } catch (error) {
        console.error('Signing Error:', error);
        return NextResponse.json({ error: 'Signing failed' }, { status: 500 });
    }
}
