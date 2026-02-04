'use client';


import { useState } from 'react';

// Simplified Input if shadcn one doesn't exist yet
function SimpleInput({ label, error, ...props }: any) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label} {props.required && '*'}</label>
            <input
                className={`border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-ghee-500 transition-all ${error ? 'border-red-500' : 'border-gray-200'}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}

export function GuestDetailsForm({ formData, setFormData, errors }: any) {
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev: any) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-serif font-bold text-ghee-900 border-b pb-4">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SimpleInput label="Full Name" name="name" value={formData.name} onChange={handleChange} required error={errors.name} />
                <SimpleInput label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required placeholder="9876543210" error={errors.phone} />
            </div>
            <SimpleInput label="Email Address" name="email" value={formData.email} onChange={handleChange} required placeholder="Required for order confirmation" type="email" error={errors.email} />

            <h3 className="text-xl font-serif font-bold text-ghee-900 border-b pb-4 pt-4">Delivery Address</h3>
            <SimpleInput label="Street Address" name="address.line1" value={formData.address.line1} onChange={handleChange} required error={errors['address.line1']} />

            <div className="grid grid-cols-2 gap-4">
                <SimpleInput label="City" name="address.city" value={formData.address.city} onChange={handleChange} required error={errors['address.city']} />
                <SimpleInput label="Pincode" name="address.pincode" value={formData.address.pincode} onChange={handleChange} required error={errors['address.pincode']} />
            </div>
            <SimpleInput label="State" name="address.state" value={formData.address.state} onChange={handleChange} required error={errors['address.state']} />
        </div>
    );
}
