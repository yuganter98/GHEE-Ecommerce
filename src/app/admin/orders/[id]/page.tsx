import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OrderDetailClient } from '@/components/admin/OrderDetailClient';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Defense in Depth: Verify session at page level
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession || adminSession.value !== 'true') {
        redirect('/admin/login');
    }

    const { id } = await params;
    return <OrderDetailClient id={id} />;
}
