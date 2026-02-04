import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Fetch Order Details
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        const client = await db.connect();
        try {
            // Fetch Order
            const orderRes = await client.query(`
                SELECT * FROM orders WHERE id = $1
            `, [id]);

            if (orderRes.rowCount === 0) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }

            // Fetch Items
            const itemsRes = await client.query(`
                SELECT oi.*, p.name as product_name, p.image_url 
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = $1
            `, [id]);

            return NextResponse.json({
                success: true,
                order: {
                    ...orderRes.rows[0],
                    items: itemsRes.rows
                }
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Order Detail Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// PATCH: Update Order Status
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        const body = await request.json();
        const { status, tracking_id } = body;

        // Valid Statuses
        const VALID_STATUSES = ['COD_PENDING', 'PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!VALID_STATUSES.includes(status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // 1. Get Current Status
            const currentRes = await client.query('SELECT status FROM orders WHERE id = $1', [id]);
            if (currentRes.rowCount === 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }
            const currentStatus = currentRes.rows[0].status;

            // 2. Enforce Transition Rules
            let isValid = false;
            let errorMsg = '';

            // Allow staying in same status (idempotent)
            if (currentStatus === status) {
                await client.query('ROLLBACK');
                return NextResponse.json({ success: true, message: 'Status unchanged' });
            }

            // State Machine
            switch (currentStatus) {
                case 'PENDING': // Razorpay default before webhook
                case 'COD_PENDING':
                case 'PAID':
                    // Can go to CONFIRMED or CANCELLED
                    if (status === 'CONFIRMED' || status === 'CANCELLED') isValid = true;
                    break;
                case 'CONFIRMED':
                    // Can go to SHIPPED or CANCELLED
                    if (status === 'SHIPPED') {
                        if (!tracking_id) errorMsg = 'Tracking ID is required for shipping';
                        else isValid = true;
                    } else if (status === 'CANCELLED') {
                        isValid = true;
                    }
                    break;
                case 'SHIPPED':
                    // Can go to DELIVERED
                    if (status === 'DELIVERED') isValid = true;
                    break;
                case 'DELIVERED':
                case 'CANCELLED':
                    // Terminal states
                    errorMsg = 'Cannot update a completed or cancelled order';
                    break;
                default:
                    // If current status is unknown/legacy
                    if (status === 'CANCELLED') isValid = true; // Always allow cancel fallback?
                    break;
            }

            if (!isValid) {
                await client.query('ROLLBACK');
                return NextResponse.json({
                    error: errorMsg || `Invalid transition from ${currentStatus} to ${status}`
                }, { status: 400 });
            }

            // 3. Perform Update
            let updateQuery = 'UPDATE orders SET status = $1';
            const queryParams: any[] = [status];
            let paramCounter = 2;

            if (status === 'SHIPPED') {
                updateQuery += `, tracking_id = $${paramCounter++}, shipped_at = NOW()`;
                queryParams.push(tracking_id);
            } else if (status === 'DELIVERED') {
                updateQuery += `, delivered_at = NOW()`;
            }

            updateQuery += ` WHERE id = $${paramCounter}`;
            queryParams.push(id);

            await client.query(updateQuery, queryParams);
            await client.query('COMMIT');

            return NextResponse.json({ success: true });

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Update Status Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
