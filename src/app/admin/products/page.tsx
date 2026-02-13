import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProductsClient } from '@/components/admin/ProductsClient';

export default async function AdminProductsPage() {
    // Defense in Depth: Verify session at page level (Server Side)
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession || adminSession.value !== 'true') {
        redirect('/admin/login');
    }

    return <ProductsClient />;
}
