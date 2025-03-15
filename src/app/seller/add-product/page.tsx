'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../SellerPortal.module.css';

interface Product {
    name: string;
    price: number;
    stock: number;
    description: string;
    categoryId: number;
}

interface CategoryDto {
    id: number;
    name: string;
}

interface ImagePreview {
    file: File;
    previewUrl: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';

export default function AddProduct() {
    const { token } = useAuth();
    const [product, setProduct] = useState<Product>({
        name: '',
        price: 0,
        stock: 100, // Sabit stok
        description: '',
        categoryId: 0,
    });
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [images, setImages] = useState<ImagePreview[]>([]); // Yüklenen görsellerin önizlemesi için
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
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
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [token]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => ({
                file,
                previewUrl: URL.createObjectURL(file),
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length === 0) {
            alert('Lütfen en az bir görsel yükleyin.');
            return;
        }

        try {
            // Önce ürünü kaydet
            const response = await fetch(`${apiUrl}/product-service/api/v1/products`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            if (!response.ok) throw new Error('Ürün eklenemedi');
            const newProduct = await response.json();
            const productId = newProduct.data.id;

            // Görselleri yükle
            const formData = new FormData();
            images.forEach((image, index) => {
                formData.append('images', image.file);
                if (index === 0) {
                    formData.append('coverImageIndex', '0');
                }
            });

            const imageResponse = await fetch(`${apiUrl}/product-service/api/v1/products/${productId}/images`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (!imageResponse.ok) throw new Error('Görseller yüklenemedi');

            router.push('/seller');
        } catch (error) {
            console.error('Ürün eklenirken hata:', error);
            alert('Ürün eklenirken bir hata oluştu.');
        }
    };

    if (loading) {
        return <p className="text-center text-gray-700">Yükleniyor...</p>;
    }

    return (
        <div className={styles.container}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Yeni Ürün Ekle</h1>
                <Link href="/seller" className="text-orange-500 hover:underline text-lg">
                    Geri
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Görsel Yükleme Alanı */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Ürün Görselleri</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {images.length > 0 ? (
                            images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <Image
                                        src={image.previewUrl}
                                        alt={`Preview ${index + 1}`}
                                        width={200}
                                        height={200}
                                        className="object-contain w-full h-48 rounded-lg border border-gray-200"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Henüz görsel eklenmemiş.</p>
                        )}
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 mb-2">Görsel Yükle</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
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
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Ürünü Ekle
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}