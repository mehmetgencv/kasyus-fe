'use client';

import { Address } from './page';

export default function AddressItem({ address, setEditingAddress, refreshAddresses }: {
    address: Address,
    setEditingAddress: (address: Address) => void;
    refreshAddresses: () => void;
}) {
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';

    const handleDelete = async () => {
        await fetch(`${apiUrl}/user-service/api/v1/users/me/addresses/${address.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        refreshAddresses(); // Silme sonrası sayfayı güncelle
    };

    return (
        <div className="border rounded-lg p-4 shadow-md bg-white">
            <h2 className="font-semibold">{address.name}</h2>
            <p>{address.streetAddress}, {address.city}, {address.state}, {address.country}</p>
            <p className="text-sm text-gray-500">{address.phone}</p>
            <div className="mt-4 flex justify-between">
                <button className="text-red-500 hover:text-red-700" onClick={handleDelete}>🗑 Sil</button>
                <button className="bg-orange-500 text-white px-3 py-1 rounded-md" onClick={() => setEditingAddress(address)}>Adresi Düzenle</button>
            </div>
        </div>
    );
}
