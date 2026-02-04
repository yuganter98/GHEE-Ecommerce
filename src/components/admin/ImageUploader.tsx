'use client';

import { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setUploading(true);
        setError('');

        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setUploading(true);
        setError('');

        try {
            // 1. Get Signature
            const timestamp = Math.round((new Date()).getTime() / 1000);
            const paramsToSign = {
                folder: 'kravelab/products',
                timestamp: timestamp,
                upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'
            };

            const signRes = await fetch('/api/admin/upload/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paramsToSign })
            });
            const signData = await signRes.json();

            if (!signData.signature) throw new Error('Failed to sign upload');

            // 2. Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', signData.apiKey);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signData.signature);
            formData.append('folder', 'kravelab/products');
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.secure_url) {
                onChange(data.secure_url);
            } else {
                console.error(data);
                setError(data.error?.message || 'Upload failed');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Network error during upload');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative w-48 h-48 rounded-xl overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt="Product" className="w-full h-full object-contain bg-gray-50" />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                    {!value.includes('cloudinary') && !value.includes('/images/') && (
                        <div className="absolute bottom-0 w-full bg-yellow-500/80 text-white text-xs text-center py-1">
                            Legacy Image
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full max-w-sm">
                    <label className={`
                        flex flex-col items-center justify-center w-full h-48 
                        border-2 border-dashed rounded-xl cursor-pointer 
                        transition-colors
                        ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
                    `}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <Loader size={24} className="animate-spin text-ghee-600 mb-2" />
                            ) : (
                                <Upload size={24} className={error ? 'text-red-400 mb-2' : 'text-gray-400 mb-2'} />
                            )}
                            <p className="text-sm text-gray-500">
                                {uploading ? 'Uploading to Cloud...' : 'Click to upload'}
                            </p>
                        </div>
                        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
                    </label>
                    {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
                </div>
            )}

            <p className="text-xs text-gray-400">
                {value ? 'Click X to remove and upload new.' : 'Supported: JPG, PNG, WEBP (Max 5MB)'}
            </p>
        </div>
    );
}
