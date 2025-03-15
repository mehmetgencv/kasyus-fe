'use client';

import { useState } from 'react';
import { Address } from './page';

interface EditAddressFormProps {
    address: Address;
    setEditingAddress: (address: Address | null) => void;
    refreshAddresses: () => void;
}

export default function EditAddressForm({ address, setEditingAddress, refreshAddresses }: EditAddressFormProps) {
    const [form, setForm] = useState<Address>({ ...address });

    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
    const token = localStorage.getItem('token');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`${apiUrl}/user-service/api/v1/users/me/addresses/${address.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });

        refreshAddresses(); // Güncellenen adresi API'den tekrar çekiyoruz
        setEditingAddress(null);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Adresi Düzenle</h2>
            <input name="name" value={form.name} placeholder="Adres Başlığı" className="border p-2 rounded-md w-full mb-4" onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-4">
                <input name="streetAddress" value={form.streetAddress} placeholder="Adres" className="border p-2 rounded-md w-full" onChange={handleChange} required />
                <input name="city" value={form.city} placeholder="Şehir" className="border p-2 rounded-md w-full" onChange={handleChange} required />
                <input name="state" value={form.state} placeholder="Eyalet" className="border p-2 rounded-md w-full" onChange={handleChange} required />
                <input name="postalCode" value={form.postalCode} placeholder="Posta Kodu" className="border p-2 rounded-md w-full" onChange={handleChange} required />
                <input name="country" value={form.country} placeholder="Ülke" className="border p-2 rounded-md w-full" onChange={handleChange} required />
                <input name="phone" value={form.phone} placeholder="Telefon" className="border p-2 rounded-md w-full" onChange={handleChange} required />
            </div>
            <div className="flex justify-between mt-4">
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md">Kaydet</button>
                <button type="button" onClick={() => setEditingAddress(null)} className="bg-gray-400 text-white px-4 py-2 rounded-md">İptal</button>
            </div>
        </form>
    );
}
