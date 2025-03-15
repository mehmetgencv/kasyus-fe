'use client';

import { useEffect, useState } from 'react';
import PaymentMethodForm from './PaymentMethodForm';
import PaymentMethodItem from './PaymentMethodItem';
import EditPaymentMethodForm from './EditPaymentMethodForm';

export interface PaymentMethod {
    id: string;
    name: string;
    type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_ACCOUNT' | 'DIGITAL_WALLET';
    isDefault: boolean;
    provider: string;
    token: string;
    lastFour: string;
    expiryDate: string;
}

export default function PaymentMethodsPage() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<PaymentMethod | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';

    const fetchPaymentMethods = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/user-service/api/v1/users/me/payment-methods`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setPaymentMethods(data.data || []);

            const defaultMethod = data.data?.find((pm: PaymentMethod) => pm.isDefault);
            setDefaultPaymentMethod(defaultMethod || null);
        } catch (error) {
            console.error("Ödeme yöntemleri yüklenirken hata oluştu:", error);
            setPaymentMethods([]);
            setDefaultPaymentMethod(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    return (
        <div className="p-6 relative">
            <h1 className="text-2xl font-semibold mb-4">Ödeme Yöntemlerim</h1>

            {defaultPaymentMethod && (
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h2 className="text-lg font-semibold">Varsayılan Ödeme Yöntemi</h2>
                    <p>{defaultPaymentMethod.name} - {defaultPaymentMethod.type}</p>
                    <p>{defaultPaymentMethod.provider} (**** {defaultPaymentMethod.lastFour})</p>
                    <p className="text-sm text-gray-500">Son Kullanım: {defaultPaymentMethod.expiryDate}</p>
                </div>
            )}

            <button
                onClick={() => setShowForm(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-md mb-4">
                + Yeni Ödeme Yöntemi Ekle
            </button>

            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl">
                            ✖
                        </button>
                        <PaymentMethodForm refreshPaymentMethods={fetchPaymentMethods} setShowForm={setShowForm} />
                    </div>
                </div>
            )}

            {editingPaymentMethod && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <button
                            onClick={() => setEditingPaymentMethod(null)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl">
                            ✖
                        </button>
                        <EditPaymentMethodForm
                            paymentMethod={editingPaymentMethod}
                            refreshPaymentMethods={fetchPaymentMethods}
                            setEditingPaymentMethod={setEditingPaymentMethod}
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    paymentMethods.map((pm) => (
                        <PaymentMethodItem key={pm.id} paymentMethod={pm} setEditingPaymentMethod={setEditingPaymentMethod} refreshPaymentMethods={fetchPaymentMethods} />
                    ))
                )}
            </div>
        </div>
    );
}
