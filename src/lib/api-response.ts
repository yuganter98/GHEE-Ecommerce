import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    errors?: Record<string, string[]>;
};

export function apiResponse<T>(data: T, status = 200) {
    return NextResponse.json({ success: true, data }, { status });
}

export function apiError(error: unknown, status = 500) {
    console.error('API Error:', error);

    if (error instanceof ZodError) {
        return NextResponse.json(
            { success: false, error: 'Validation Error', errors: error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    if (error instanceof Error) {
        // In production, we might want to hide the message for internal server errors
        // but useful for Phase 1 debugging.
        return NextResponse.json({ success: false, error: error.message }, { status });
    }

    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status });
}
