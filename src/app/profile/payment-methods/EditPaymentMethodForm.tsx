'use client';

import { useState } from 'react';
import { PaymentMethod } from './page';

const paymentTypes = ['CREDIT_CARD', 'DEBIT_CARD', 'BANK_ACCOUNT', 'DIGITAL_WALLET'];

export default function EditPaymentMethodForm({ paymentMethod, refreshPaymentMethods, setEditingPaymentMethod }: {
    paymentMethod: PaymentMethod;
    refreshPaymentMethods: () => void;
    setEditingPaymentMethod: (paymentMethod: PaymentMethod | null) => void;
}) {
    const [form, setForm] = useState<PaymentMethod>({ ...paymentMethod });

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

        const response = await fetch(`${apiUrl}/user-service/api/v1/users/me/payment-methods/${paymentMethod.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });

        if (response.ok) {
            refreshPaymentMethods();
            setEditingPaymentMethod(null);
        } else {
            console.error("Ödeme yöntemi güncellenirken hata oluştu.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Ödeme Yöntemini Düzenle</h2>

            <input name="name" value={form.name} placeholder="Ödeme Yöntemi Adı" className="border p-2 rounded-md w-full mb-4" onChange={handleChange} required />

            <select name="type" className="border p-2 rounded-md w-full mb-4" onChange={handleChange} value={form.type}>
                {paymentTypes.map(type => (
                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
            </select>

            <input name="provider" value={form.provider} placeholder="Banka/Ödeme Sağlayıcı" className="border p-2 rounded-md w-full mb-4" onChange={handleChange} required />
            <input name="lastFour" value={form.lastFour} placeholder="Son 4 Hane" className="border p-2 rounded-md w-full mb-4" onChange={handleChange} required />
            <input name="expiryDate" value={form.expiryDate} placeholder="Son Kullanım Tarihi (YYYY-MM)" className="border p-2 rounded-md w-full mb-4" type="month" onChange={handleChange} required />

            <label className="flex items-center space-x-2">
                <input type="checkbox" name="isDefault" checked={form.isDefault} className="w-4 h-4" onChange={handleChange} />
                <span>Varsayılan olarak ayarla</span>
            </label>

            <div className="flex justify-between mt-4">
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md">Güncelle</button>
                <button type="button" onClick={() => setEditingPaymentMethod(null)} className="bg-gray-400 text-white px-4 py-2 rounded-md">İptal</button>
            </div>
        </form>
    );
}
