'use client';

import { PaymentMethod } from './page';

export default function PaymentMethodItem({ paymentMethod, setEditingPaymentMethod, refreshPaymentMethods }: {
    paymentMethod: PaymentMethod;
    setEditingPaymentMethod: (paymentMethod: PaymentMethod) => void;
    refreshPaymentMethods: () => void;
}) {
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';

    const handleDelete = async () => {
        await fetch(`${apiUrl}/user-service/api/v1/users/me/payment-methods/${paymentMethod.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        refreshPaymentMethods();
    };

    return (
        <div className="border rounded-lg p-4 shadow-md bg-white">
            <h2 className="font-semibold">{paymentMethod.name}</h2>
            <p>{paymentMethod.provider} (**** {paymentMethod.lastFour})</p>
            <p className="text-sm text-gray-500">Son Kullanım: {paymentMethod.expiryDate}</p>
            <div className="mt-4 flex justify-between">
                <button className="text-red-500 hover:text-red-700" onClick={handleDelete}>🗑 Sil</button>
                <button className="bg-orange-500 text-white px-3 py-1 rounded-md" onClick={() => setEditingPaymentMethod(paymentMethod)}>Düzenle</button>
            </div>
        </div>
    );
}
