// src/app/cart.tsx
import React from 'react';

const Cart = () => {
    return (
        <div className="min-h-screen bg-orange-100">
            <header className="bg-orange-500 text-white p-4">
                <h1 className="text-3xl font-bold">Sepetiniz</h1>
            </header>
            <section className="py-8 px-4">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-2xl text-center font-semibold text-orange-600">Ürünleriniz</h3>
                    {/* Cart Items */}
                    {[1, 2].map((_, index) => (
                        <div key={index} className="flex justify-between items-center py-4 border-b">
                            <div className="flex items-center">
                                <img src="/images/product.jpg" alt="Product" className="w-16 h-16 object-cover rounded-lg mr-4" />
                                <span>Ürün {index + 1}</span>
                            </div>
                            <span>₺99.99</span>
                        </div>
                    ))}
                    <div className="mt-6 text-right">
                        <button className="bg-orange-500 text-white py-2 px-4 rounded-lg">Ödeme Yap</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Cart;
