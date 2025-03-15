'use client';

import { useState } from 'react';
import { Address } from './page';

interface AddressFormProps {
    refreshAddresses: () => void;
    setShowForm: (show: boolean) => void;
}

export default function AddressForm({ refreshAddresses, setShowForm }: AddressFormProps) {
    const [form, setForm] = useState<Omit<Address, 'id'>>({
        name: '',
        type: 'SHIPPING',  // Kullanıcı `SHIPPING` veya `BILLING` seçebilir
        isDefault: false,
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: ''
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
    const token = localStorage.getItem('token');

    // Input değiştiğinde state'i güncelle
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Boş alan kontrolü
        if (!form.name || !form.streetAddress || !form.city || !form.state || !form.postalCode || !form.country || !form.phone) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        const response = await fetch(`${apiUrl}/user-service/api/v1/users/me/addresses`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });

        if (response.ok) {
            refreshAddresses(); // Güncellenmiş adresleri API'den çek
            setShowForm(false);
        } else {
            console.error("Adres eklenirken hata oluştu.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Adres Ekle</h2>

            {/* Adres Başlığı & Türü */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <input name="name" placeholder="Adres Başlığı" className="border p-2 rounded-md w-full" onChange={handleChange} required />
                <select name="type" className="border p-2 rounded-md w-full" onChange={handleChange} value={form.type}>
                    <option value="SHIPPING">Teslimat Adresi</option>
                    <option value="BILLING">Fatura Adresi</option>
                </select>
            </div>

            {/* Adres */}
            <input name="streetAddress" placeholder="Adres" className="border p-2 rounded-md w-full mb-4" onChange={handleChange} required />

            {/* Şehir & Eyalet */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <input name="city" placeholder="Şehir" className="border p-2 rounded-md w-full" onChange={handleChange} required />
                <input name="state" placeholder="Eyalet" className="border p-2 rounded-md w-full" onChange={handleChange} required />
            </div>

            {/* Posta Kodu & Ülke */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <input name="postalCode" placeholder="Posta Kodu" className="border p-2 rounded-md w-full" onChange={handleChange} required />
                <input name="country" placeholder="Ülke" className="border p-2 rounded-md w-full" onChange={handleChange} required />
            </div>

            {/* Telefon */}
            <input name="phone" placeholder="Telefon" className="border p-2 rounded-md w-full mb-4" onChange={handleChange} required />

            {/* Varsayılan Adres Checkbox */}
            <label className="flex items-center space-x-2">
                <input type="checkbox" name="isDefault" className="w-4 h-4" onChange={handleChange} />
                <span>Varsayılan adres yap</span>
            </label>

            {/* Butonlar */}
            <div className="flex justify-between mt-4">
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md">Kaydet</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md">İptal</button>
            </div>
        </form>
    );
}
