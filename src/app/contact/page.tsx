'use client';

import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Başlık */}
            <header className="text-center py-10">
                <h1 className="text-4xl font-bold text-gray-900">İletişim</h1>
                <p className="text-gray-600 mt-2">Bize ulaşın, sorularınızı bekliyoruz.</p>
            </header>

            {/* Ana İçerik */}
            <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* İletişim Formu */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bize Mesaj Gönderin</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                                Adınız
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Adınızı girin"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                                E-posta
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="E-posta adresinizi girin"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
                                Mesajınız
                            </label>
                            <textarea
                                id="message"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-32"
                                placeholder="Mesajınızı yazın"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-semibold"
                        >
                            Gönder
                        </button>
                    </form>
                </section>

                {/* İletişim Bilgileri */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">İletişim Bilgileri</h2>
                    <ul className="text-gray-700 space-y-4">
                        <li>
                            <strong>Telefon:</strong> +90 000 000 00 00
                        </li>
                        <li>
                            <strong>E-posta:</strong>{' '}
                            <a href="mailto:info@kasyus.com" className="text-orange-600 hover:underline">
                                info@kasyus.com
                            </a>
                        </li>
                        <li>
                            <strong>Adres:</strong> İstanbul, Türkiye
                        </li>
                    </ul>
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