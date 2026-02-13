import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { EditProductClient } from '@/components/admin/EditProductClient';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    // Defense in Depth: Verify session at page level
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession || adminSession.value !== 'true') {
        redirect('/admin/login');
    }

    const { id } = await params;
    return <EditProductClient id={id} />;
}
