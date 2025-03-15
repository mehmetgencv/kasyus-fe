'use client';

import { useEffect, useState } from 'react';
import AddressForm from './AddressForm';
import AddressItem from './AddressItem';
import EditAddressForm from './EditAddressForm';

export interface Address {
    id: string;
    name: string;
    type: 'SHIPPING' | 'BILLING';
    isDefault: boolean;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';

    // API'den adresleri çek
    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/user-service/api/v1/users/me/addresses`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setAddresses(data.data || []);

            // Varsayılan adresi belirle
            const defaultAddr = data.data?.find((addr: Address) => addr.isDefault);
            setDefaultAddress(defaultAddr || null);
        } catch (error) {
            console.error("Adresleri getirirken hata oluştu:", error);
            setAddresses([]);
            setDefaultAddress(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return (
        <div className="p-6 relative">
            <h1 className="text-2xl font-semibold mb-4">Adres Bilgilerim</h1>

            {/* Varsayılan adresi göster */}
            {defaultAddress && (
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h2 className="text-lg font-semibold">Varsayılan Adres</h2>
                    <p>{defaultAddress.name} - {defaultAddress.type === "SHIPPING" ? "Teslimat Adresi" : "Fatura Adresi"}</p>
                    <p>{defaultAddress.streetAddress}, {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.country}</p>
                    <p className="text-sm text-gray-500">{defaultAddress.phone}</p>
                </div>
            )}

            <button
                onClick={() => setShowForm(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-md mb-4">
                + Yeni Adres Ekle
            </button>

            {/* Yeni adres ekleme formu */}
            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl">
                            ✖
                        </button>
                        <AddressForm refreshAddresses={fetchAddresses} setShowForm={setShowForm} />
                    </div>
                </div>
            )}

            {/* Adres düzenleme formu */}
            {editingAddress && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <button
                            onClick={() => setEditingAddress(null)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl">
                            ✖
                        </button>
                        <EditAddressForm
                            address={editingAddress}
                            refreshAddresses={fetchAddresses}
                            setEditingAddress={setEditingAddress}
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    addresses.map((addr) => (
                        <AddressItem key={addr.id} address={addr} setEditingAddress={setEditingAddress} refreshAddresses={fetchAddresses} />
                    ))
                )}
            </div>
        </div>
    );
}
