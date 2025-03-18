'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SellerPortal.module.css';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    description: string;
    coverImageUrl?: string;
    categoryId: number;
}

interface CategoryDto {
    id: number;
    name: string;
}

export default function SellerPortal() {
    const { user, token, isLoading } = useAuth();
    console.log('SellerPortal render - USER:', user);
    console.log('SellerPortal render - Token:', token);
    console.log('SellerPortal render - isLoading:', isLoading);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
    const minioBaseUrl = 'http://localhost:9000/kasyus-products';

    useEffect(() => {
        if (isLoading || !user || (user.role !== 'ROLE_SELLER' && user.role !== 'ROLE_ADMIN')) return;
        fetchCategories();
        fetchProducts();
    }, [user, selectedCategory, isLoading]);

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

    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            const url = selectedCategory
                ? `${apiUrl}/product-service/api/v1/products/category/${selectedCategory}`
                : `${apiUrl}/product-service/api/v1/products`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Ürünler yüklenemedi');
            const data = await response.json();

            const updatedProducts = data.data.map((product: Product) => ({
                ...product,
                stock: 100,
            }));
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Ürünleri yüklerken hata:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const deleteProduct = async (id: number) => {
        if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
        try {
            await fetch(`${apiUrl}/product-service/api/v1/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error('Ürünü silerken hata:', error);
        }
    };

    if (isLoading) {
        return <p className="text-center text-gray-700">Kullanıcı bilgileri yükleniyor...</p>;
    }

    if (!user || (user.role !== 'ROLE_SELLER' && user.role !== 'ROLE_ADMIN')) {
        return <p className="text-center text-red-500">Erişim yetkiniz yok.</p>;
    }

    if (loadingProducts) return <p className="text-center text-gray-700">Ürünler yükleniyor...</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Satıcı Paneli</h1>

            <div className={styles.filterSection}>
                <h2>Kategoriye Göre Filtrele</h2>
                <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                    className={styles.filterSelect}
                >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>

            <Link href="/seller/add-product" className={styles.addButton}>Yeni Ürün Ekle</Link>
            <div className={styles.productList}>
                {products.length === 0 ? (
                    <p className={styles.noProducts}>Ürün bulunamadı.</p>
                ) : (
                    products.map(product => (
                        <div key={product.id} className={styles.productCard}>
                            <Image
                                src={product.coverImageUrl ? `${minioBaseUrl}/${product.coverImageUrl}` : '/placeholder.png'}
                                alt={product.name}
                                width={200}
                                height={150}
                                className="object-contain"
                            />
                            <h3>{product.name}</h3>
                            <p>Fiyat: {product.price} ₺</p>
                            <p>Stok: {product.stock}</p>
                            <div className={styles.actions}>
                                <Link href={`/seller/edit/${product.id}`} className={styles.editButton}>Düzenle</Link>
                                <button onClick={() => deleteProduct(product.id)} className={styles.deleteButton}>Sil</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}