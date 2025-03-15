'use client';

import { useState } from 'react';
import { PaymentMethod } from './page';

const paymentTypes = ['CREDIT_CARD', 'DEBIT_CARD', 'BANK_ACCOUNT', 'DIGITAL_WALLET'];

export default function PaymentMethodForm({ refreshPaymentMethods, setShowForm }: {
    refreshPaymentMethods: () => void;
    setShowForm: (show: boolean) => void;
}) {
    const [form, setForm] = useState<Omit<PaymentMethod, 'id'>>({
        name: '',
        type: 'CREDIT_CARD',
        isDefault: false,
        provider: '',
        token: '',
        lastFour: '',
        expiryDate: ''
    });

    const [error, setError] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
    const token = localStorage.getItem('token');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/user-service/api/v1/users/me/payment-methods`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ödeme yöntemi eklenirken API hatası oluştu.');
            }

            refreshPaymentMethods();
            setShowForm(false);
        } catch (err: any) {
            console.error('Ödeme yöntemi eklenirken hata oluştu:', err);
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Yeni Ödeme Yöntemi Ekle</h2>

            {error && <p className="text-red-500">{error}</p>}

            <input name="name" placeholder="Ödeme Yöntemi Adı" className="border p-2 rounded-md w-full mb-4" onChange={handleChange} required />

            <select name="type" className="border p-2 rounded-md w-full mb-4" onChange={handleChange} value={form.type}>
                {paymentTypes.map(type => (
                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
            </select>

            <input name="provider" placeholder="Banka/Ödeme Sağlayıcı" className="border p-2 rounded-md w-full mb-4" onChange={handleChange} required />
            <input name="lastFour" placeholder="Son 4 Hane" className="border p-2 rounded-md w-full mb-4" onChange={handleChange} required />
            <input name="expiryDate" placeholder="Son Kullanım Tarihi (YYYY-MM)" className="border p-2 rounded-md w-full mb-4" type="month" onChange={handleChange} required />

            <label className="flex items-center space-x-2">
                <input type="checkbox" name="isDefault" className="w-4 h-4" onChange={handleChange} />
                <span>Varsayılan olarak ayarla</span>
            </label>

            <div className="flex justify-between mt-4">
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md">Kaydet</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md">İptal</button>
            </div>
        </form>
    );
}
