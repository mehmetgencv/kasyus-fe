'use client';

import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Başlık */}
            <header className="text-center py-10">
                <h1 className="text-4xl font-bold text-gray-900">Hakkımızda</h1>
                <p className="text-gray-600 mt-2">Kasyus’un hikayesi ve değerleri.</p>
            </header>

            {/* Ana İçerik */}
            <main className="max-w-4xl mx-auto space-y-8">
                {/* Hakkımızda Bölümü */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hakkımızda</h2>
                    <p className="text-gray-700">
                        Kasyus, 2025 yılında kurulmuş bir e-ticaret platformudur. Amacımız, müşterilerimize kaliteli ürünler sunarak
                        güvenilir bir alışveriş deneyimi sağlamak.
                    </p>
                </section>

                {/* Misyon ve Vizyon */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Misyonumuz</h2>
                    <p className="text-gray-700">
                        Müşterilerimize en iyi ürünleri uygun fiyatlarla sunmak ve onların memnuniyetini ön planda tutmak.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vizyonumuz</h2>
                    <p className="text-gray-700">
                        Türkiye’nin lider e-ticaret platformlarından biri olmak ve globale açılmak.
                    </p>
                </section>
            </main>

            {/* Footer - Geliştirici Bilgisi */}
            <footer className="mt-12 text-center py-6 border-t border-gray-200">
                <p className="text-gray-600">
                    Developed by{' '}
                    <Link href="https://www.mehmetgenc.net" className="text-orange-600 hover:underline">
                        Mehmet Genç
                    </Link>
                </p>
            </footer>
        </div>
    );
}