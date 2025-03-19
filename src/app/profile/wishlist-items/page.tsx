'use client';

import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import { WishlistItemCreateRequest, WishlistItemResponse } from '@/types/wishlist';

export default function WishlistItemsPage() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItemResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState<WishlistItemCreateRequest>({
        productId: '',
        productName: '',
    });
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';

    const fetchWishlistItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/user-service/api/v1/users/me/wishlist-items`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                setWishlistItems(data.data || []);
            } else {
                console.error('Wishlist items yüklenemedi:', data.message);
                setWishlistItems([]);
            }
        } catch (error) {
            console.error('Wishlist items yüklenirken hata oluştu:', error);
            setWishlistItems([]);
        }
        setLoading(false);
    };

    const addWishlistItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/user-service/api/v1/users/me/wishlist-items`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
            const data = await response.json();
            if (data.success) {
                fetchWishlistItems();
                setShowAddForm(false);
                setNewItem({ productId: '', productName: '' });
            } else {
                console.error('Wishlist öğesi eklenemedi:', data.message);
            }
        } catch (error) {
            console.error('Wishlist öğesi eklenirken hata:', error);
        }
    };

    const deleteWishlistItem = async (itemId: string) => {
        try {
            const response = await fetch(`${apiUrl}/user-service/api/v1/users/me/wishlist-items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                fetchWishlistItems();
            } else {
                console.error('Wishlist öğesi silinemedi:', data.message);
            }
        } catch (error) {
            console.error('Wishlist öğesi silinirken hata:', error);
        }
    };

    useEffect(() => {
        fetchWishlistItems();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col justify-between">
            <main className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">İstek Listem</h1>

                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md mb-4"
                >
                    + Yeni Ürün Ekle
                </button>

                {showAddForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
                            >
                                ✖
                            </button>
                            <form onSubmit={addWishlistItem} className="space-y-4">
                                <div>
                                    <label htmlFor="productId" className="block text-gray-700 font-medium mb-1">
                                        Ürün ID
                                    </label>
                                    <input
                                        type="text"
                                        id="productId"
                                        value={newItem.productId}
                                        onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Ürün ID girin"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="productName" className="block text-gray-700 font-medium mb-1">
                                        Ürün Adı
                                    </label>
                                    <input
                                        type="text"
                                        id="productName"
                                        value={newItem.productName}
                                        onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Ürün adını girin"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-semibold"
                                >
                                    Ekle
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {loading ? (
                        <p className="text-center">Yükleniyor...</p>
                    ) : wishlistItems.length === 0 ? (
                        <p className="text-center text-gray-500">İstek listenizde henüz ürün yok.</p>
                    ) : (
                        wishlistItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold">{item.productName}</p>
                                    <p className="text-sm text-gray-500">ID: {item.productId}</p>
                                </div>
                                <button
                                    onClick={() => deleteWishlistItem(item.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                                >
                                    Sil
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}