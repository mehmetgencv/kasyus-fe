'use client';

import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="text-center py-10">
                <h1 className="text-4xl font-bold text-gray-900">Kullanım Koşulları</h1>
                <p className="text-gray-600 mt-2">Kasyus platformunu kullanmadan önce lütfen bu koşulları okuyun.</p>
            </header>

            <main className="max-w-4xl mx-auto space-y-8">
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Genel Koşullar</h2>
                    <p className="text-gray-700">
                        Bu bölümde kullanım koşulları hakkında genel bilgiler yer alacaktır. Lütfen sonradan detayları
                        doldurun.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kullanıcı Hakları ve Sorumlulukları</h2>
                    <p className="text-gray-700">
                        Kullanıcıların hakları ve sorumlulukları burada tanımlanacaktır. Detaylar eklenmeyi bekliyor.
                    </p>
                </section>
            </main>

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