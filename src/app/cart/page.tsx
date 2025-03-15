'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock sepet verileri (normalde global state veya API'den gelecek)
const initialCartItems = [
  {
    id: 1,
    name: "Vintage Deri Çanta",
    price: 599.99,
    quantity: 1,
    image: "/images/product.jpg"
  },
  {
    id: 2,
    name: "Modern Sırt Çantası",
    price: 449.99,
    quantity: 2,
    image: "/images/product.jpg"
  }
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-orange-800 mb-4">Sepetiniz</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600 mb-4">Sepetinizde ürün bulunmamaktadır.</p>
            <Link href="/categories" className="btn-primary inline-block">
              Alışverişe Başla
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-orange-800 mb-8">Sepetiniz</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sepet Ürünleri */}
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-orange-500 font-bold">{item.price.toFixed(2)} TL</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="btn-secondary px-2 py-1"
                    >
                      -
                    </button>
                    <span className="mx-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="btn-secondary px-2 py-1"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span>{calculateTotal().toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between">
                  <span>Kargo</span>
                  <span className="text-green-500">Ücretsiz</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Toplam</span>
                    <span>{calculateTotal().toFixed(2)} TL</span>
                  </div>
                </div>
              </div>
              <button className="btn-primary w-full">
                Ödemeye Geç
              </button>
              <Link href="/categories" className="btn-secondary w-full mt-2 text-center block">
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 