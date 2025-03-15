'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../SellerPortal.module.css';

interface Product {
    id?: number;
    name: string;
    price: number;
    stock: number;
    description: string;
    categoryId: number;
    imageUrls?: (string | { imageUrl: string })[];
}

interface CategoryDto {
    id: number;
    name: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
const minioBaseUrl = 'http://localhost:9000/kasyus-products';

// Görsel URL'sini oluşturma fonksiyonu
const getImageUrl = (url: string | { imageUrl: string } | null): string => {
    if (!url) return '/placeholder.png';
    if (typeof url === 'string') {
        return url.startsWith('http') ? url : `${minioBaseUrl}/${url}`;
    }
    return url.imageUrl.startsWith('http') ? url.imageUrl : `${minioBaseUrl}/${url.imageUrl}`;
};

export default function EditProduct() {
    const { token } = useAuth();
    const [product, setProduct] = useState<Product>({
        name: '',
        price: 0,
        stock: 100,
        description: '',
        categoryId: 0,
        imageUrls: [],
    });
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${apiUrl}/product-service/api/v1/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Ürün yüklenemedi');
                const data = await response.json();
                console.log('Raw Backend Response:', data);
                const fetchedProduct = {
                    id: data.data.id,
                    name: data.data.name || '',
                    price: data.data.price ?? 0,
                    stock: 100,
                    description: data.data.description || '',
                    categoryId: data.data.categoryId ?? 0,
                    imageUrls: Array.isArray(data.data.imageUrls)
                        ? data.data.imageUrls.map((item: string | { imageUrl: string }) => {
                            return typeof item === 'string' ? item : (item.imageUrl || item.toString());
                        })
                        : [data.data.coverImageUrl].filter(Boolean),
                };
                console.log('Processed Image URLs:', fetchedProduct.imageUrls);
                setProduct(fetchedProduct);
            } catch (error) {
                console.error('Ürün yüklenirken hata:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch(`${apiUrl}/product-service/api/v1/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Kategoriler yüklenemedi');
                const data = await response.json();
                setCategories(data.data);
            } catch (error) {
                console.error('Kategorileri yüklerken hata:', error);
            }
        };

        Promise.all([fetchProduct(), fetchCategories()]).finally(() => setLoading(false));
    }, [id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/product-service/api/v1/products/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            if (!response.ok) throw new Error('Ürün güncellenemedi');
            router.push('/seller');
        } catch (error) {
            console.error('Ürün güncellenirken hata:', error);
        }
    };

    const deleteProduct = async () => {
        if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
        try {
            await fetch(`${apiUrl}/product-service/api/v1/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            router.push('/seller');
        } catch (error) {
            console.error('Ürünü silerken hata:', error);
        }
    };

    const uploadImage = async (file: File, index?: number) => {
        const formData = new FormData();
        formData.append('images', file);
        formData.append('coverImageIndex', index?.toString() || '0');

        try {
            const response = await fetch(`${apiUrl}/product-service/api/v1/products/${id}/images`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!response.ok) throw new Error('Görsel yüklenemedi');
            const updatedProduct = await response.json();
            console.log('Updated Product after Image Upload:', updatedProduct);
            setProduct({
                ...product,
                imageUrls: updatedProduct.imageUrls || [updatedProduct.coverImageUrl],
            });
        } catch (error) {
            console.error('Görsel yüklerken hata:', error);
        }
    };

    const deleteImage = async (imageIndex: number) => {
        try {
            await fetch(`${apiUrl}/product-service/api/v1/products/${id}/images/${imageIndex}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setProduct({
                ...product,
                imageUrls: product.imageUrls?.filter((_, idx) => idx !== imageIndex),
            });
        } catch (error) {
            console.error('Görsel silinirken hata:', error);
        }
    };

    if (loading) {
        return <p className="text-center text-gray-700">Ürün yükleniyor...</p>;
    }

    return (
        <div className={styles.container}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Ürünü Düzenle</h1>
                <Link href="/seller" className="text-orange-500 hover:underline text-lg">
                    Geri
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Görsel Galeri */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Ürün Görselleri</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {product.imageUrls && product.imageUrls.length > 0 ? (
                            product.imageUrls.map((url, index) => {
                                const fullUrl = getImageUrl(url);
                                console.log(`Image ${index + 1} URL:`, fullUrl);
                                return (
                                    <div key={index} className="relative group">
                                        <Image
                                            src={fullUrl}
                                            alt={`Product Image ${index + 1}`}
                                            width={200}
                                            height={200}
                                            className="object-contain w-full h-48 rounded-lg border border-gray-200"
                                            onError={(e) => console.error(`Failed to load image ${index + 1}:`, fullUrl)}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => deleteImage(index)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600"
                                                >
                                                    Sil
                                                </button>
                                                <label className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 cursor-pointer">
                                                    Değiştir
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => e.target.files && uploadImage(e.target.files[0], index)}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500">Henüz görsel eklenmemiş.</p>
                        )}
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 mb-2">Yeni Görsel Ekle</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
                            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                        />
                    </div>
                </div>

                {/* Form Alanı */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Ürün Adı</label>
                            <input
                                type="text"
                                value={product.name}
                                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Fiyat (₺)</label>
                            <input
                                type="number"
                                value={product.price}
                                onChange={(e) => setProduct({ ...product, price: Number(e.target.value) || 0 })}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Açıklama</label>
                            <textarea
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                rows={4}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Kategori</label>
                            <select
                                value={product.categoryId}
                                onChange={(e) => setProduct({ ...product, categoryId: Number(e.target.value) })}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            >
                                <option value="">Kategori Seçin</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Güncelle
                            </button>
                            <button
                                type="button"
                                onClick={deleteProduct}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Sil
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}