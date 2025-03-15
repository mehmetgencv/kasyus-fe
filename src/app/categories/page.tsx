'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export interface CategoryDto {
  id: number;
  name: string;
}

interface CategoryResponse {
  data: CategoryDto[];
  success: boolean;
  message?: string;
  responseDate?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/product-service/api/v1/categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Kategoriler yüklenemedi: ${response.status} - ${await response.text()}`);
        }

        const data: CategoryResponse = await response.json();
        console.log('Kategoriler:', data);
        if (data.success && data.data) {
          setCategories(data.data);
        } else {
          throw new Error(data.message || 'Kategoriler yüklenemedi');
        }
      } catch (error) {
        console.error('Kategorileri getirirken hata:', error);
        setError(error instanceof Error ? error.message : 'Kategoriler yüklenirken bilinmeyen bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="text-center text-gray-700">Yükleniyor...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          <Link href="/" className="text-blue-600 hover:underline">Kasyus</Link>{' '}
          <span className="text-gray-500">&gt;</span>{' '}
          <Link href="/categories" className="text-blue-600 hover:underline">Kategoriler</Link>
        </h1>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700">Filtreleme</h2>
          <div className="flex gap-4 mt-2">
            <button className="px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-200">
              İlgili Kategoriler
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Önerilen
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
              <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
              </Link>
          ))}
        </div>
        {categories.length === 0 && <p className="text-center text-gray-700">Kategori bulunamadı.</p>}
      </div>
  );
}