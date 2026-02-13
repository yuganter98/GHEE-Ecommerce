import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OrdersClient } from '@/components/admin/OrdersClient';

export default async function AdminOrdersPage() {
    // Defense in Depth: Verify session at page level (Server Side)
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession || adminSession.value !== 'true') {
        redirect('/admin/login');
    }

    return <OrdersClient />;
}
