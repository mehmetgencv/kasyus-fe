'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col justify-between">
            {/* Hata Mesajı */}
            <main className="max-w-4xl mx-auto text-center py-20">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-2xl text-gray-600 mb-6">Sayfa Bulunamadı!</p>
                <p className="text-gray-700 mb-8">
                    Üzgünüz, aradığınız sayfa mevcut değil veya taşınmış olabilir. Ana sayfaya dönmeyi deneyin.
                </p>

                {/* Yönlendirme Linkleri */}
                <div className="space-x-4">
                    <Link href="/" className="text-orange-500 hover:underline font-semibold">
                        Ana Sayfaya Dön
                    </Link>
                    <Link href="/contact" className="text-orange-500 hover:underline font-semibold">
                        İletişim
                    </Link>
                </div>
            </main>
        </div>
    );
}