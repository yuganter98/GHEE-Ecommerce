import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass',
    },
});

interface OrderItem {
    name: string;
    quantity: number;
    price_at_purchase: number;
    product_id?: number;
}

interface OrderEmailProps {
    orderId: string | number;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    customerAddress: {
        line1: string;
        city: string;
        state: string;
        pincode: string;
    };
    totalAmount: number;
    items: OrderItem[];
    paymentMethod: string;
}

function generateOrderEmailHtml(props: OrderEmailProps): string {
    const { orderId, customerName, totalAmount, items, paymentMethod } = props;
    const formattedTotal = (totalAmount / 100).toFixed(2);

    // Items Row HTML
    const itemsHtml = items.map(item => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; font-size: 14px; color: #374151;">${item.name}</td>
            <td style="padding: 12px; font-size: 14px; color: #374151; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; font-size: 14px; color: #374151; text-align: right;">₹${(item.price_at_purchase / 100).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-top: 40px; margin-bottom: 40px;">
        
        <!-- Header -->
        <div style="background-color: #422006; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Order Placed!</h1>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
            <p style="color: #4b5563; margin-bottom: 24px;">Hi ${customerName},</p>
            <p style="color: #4b5563; margin-bottom: 24px;">Thank you for shopping with us! Your order has been confirmed.</p>

            <!-- Order Summary Card -->
            <div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <div style="margin-bottom: 8px;">
                    <span style="color: #92400e; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">Order Total</span>
                    <div style="color: #78350f; font-size: 24px; font-weight: 700;">₹${formattedTotal}</div>
                </div>
                <div style="display: flex; gap: 20px; font-size: 14px; color: #92400e; margin-top: 12px;">
                    <div>
                        <span style="opacity: 0.8;">Order ID:</span> <strong>#${orderId}</strong>
                    </div>
                    <div>
                        <span style="opacity: 0.8;">Payment:</span> <strong>${paymentMethod}</strong>
                    </div>
                </div>
            </div>

            <p style="color: #111827; font-weight: 500; text-align: center; margin: 24px 0;">
                Items will arrive soon to your doorstep 🚚
            </p>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                    <tr style="background-color: #f3f4f6;">
                        <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Item</th>
                        <th style="padding: 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Qty</th>
                        <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="padding: 12px; text-align: right; font-weight: 600; border-top: 2px solid #e5e7eb;">Total</td>
                        <td style="padding: 12px; text-align: right; font-weight: 700; color: #ea580c; border-top: 2px solid #e5e7eb;">₹${formattedTotal}</td>
                    </tr>
                </tfoot>
            </table>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
                <p>&copy; ${new Date().getFullYear()} Ghee Store. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}

function generateAdminEmailHtml(props: OrderEmailProps): string {
    const { orderId, customerName, customerEmail, customerPhone, customerAddress, totalAmount, items, paymentMethod } = props;
    const formattedTotal = (totalAmount / 100).toFixed(2);

    const itemsHtml = items.map(item => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; font-size: 14px; color: #374151;">${item.name}</td>
            <td style="padding: 12px; font-size: 14px; color: #374151; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; font-size: 14px; color: #374151; text-align: right;">₹${(item.price_at_purchase / 100).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Order Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-top: 40px; margin-bottom: 40px;">
        
        <div style="background-color: #111827; padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.05em;">New Order Received</h1>
        </div>

        <div style="padding: 30px;">
            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 25px;">
                <p style="margin: 0; color: #065f46; font-weight: 500;">
                    Order <strong>#${orderId}</strong> placed by <strong>${customerName}</strong>
                </p>
                <p style="margin: 5px 0 0 0; color: #047857; font-size: 13px;">
                    Amount: ₹${formattedTotal} | Method: ${paymentMethod}
                </p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div>
                    <h3 style="margin: 0 0 10px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 600;">Customer Details</h3>
                    <p style="margin: 0 0 5px 0; color: #111827; font-weight: 600;">${customerName}</p>
                    <p style="margin: 0 0 5px 0; color: #4b5563; font-size: 14px;">${customerEmail || 'No Email'}</p>
                    <p style="margin: 0; color: #4b5563; font-size: 14px;">${customerPhone}</p>
                </div>
                <div>
                    <h3 style="margin: 0 0 10px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 600;">Shipping Address</h3>
                    <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
                        ${customerAddress.line1}<br>
                        ${customerAddress.city}, ${customerAddress.state}<br>
                        ${customerAddress.pincode}
                    </p>
                </div>
            </div>

            <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #111827; font-weight: 600; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="padding: 12px 0; text-align: right; font-weight: 600; font-size: 14px;">Total Amount:</td>
                        <td style="padding: 12px 0; text-align: right; font-weight: 700; color: #111827; font-size: 16px;">₹${formattedTotal}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</body>
</html>
    `;
}

export const EmailService = {
    async sendOrderConfirmation(props: OrderEmailProps) {
        const { orderId, customerEmail, paymentMethod } = props;
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@gheestore.com';

        // 1. Send to Admin (Strict Admin Template)
        try {
            const adminHtml = generateAdminEmailHtml(props);
            await transporter.sendMail({
                from: process.env.SMTP_FROM || 'orders@gheestore.com',
                to: adminEmail,
                subject: `[New Order] #${orderId} - ₹${(props.totalAmount / 100).toFixed(0)}`,
                html: adminHtml
            });
            console.log(`📧 Admin email sent for Order ${orderId}`);
        } catch (e) {
            console.error('❌ Failed to send Admin email:', e);
        }

        // 2. Send to Customer (User Template)
        if (customerEmail) {
            try {
                const userHtml = generateOrderEmailHtml(props);
                await transporter.sendMail({
                    from: process.env.SMTP_FROM || 'orders@gheestore.com',
                    to: customerEmail,
                    subject: `Order Placed! (#${orderId})`,
                    html: userHtml
                });
                console.log(`📧 Customer email sent to ${customerEmail}`);
            } catch (e) {
                console.error('❌ Failed to send Customer email:', e);
            }
        }
    }
};
