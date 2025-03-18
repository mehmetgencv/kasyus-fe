'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProducts, addToCart } from '@/utils/api';
import { getImageUrl } from '@/utils/imageUtils';
import { ProductDto } from '@/types/product';
import { ResponseWrapper } from '@/types/response';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
    const { token } = useAuth();
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageSources, setImageSources] = useState<Record<string, string>>({});

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await getProducts(token);
            const data: ResponseWrapper<ProductDto[]> = await response;
            if (data.success) {
                setProducts(data.data || []);

                // Initial image sources setup
                const initialImageSources: Record<string, string> = {};
                data.data.forEach((product) => {
                    const allImages = [
                        { id: 0, imageUrl: product.coverImageUrl || '/images/empty_image_2.jpg' },
                        ...product.imageUrls,
                    ];
                    allImages.forEach((image) => {
                        initialImageSources[`${product.id}-${image.id}`] = getImageUrl(image.imageUrl);
                    });
                });
                setImageSources(initialImageSources);
            } else {
                console.error('Ürünler yüklenemedi:', data.message);
                setProducts([]);
            }
        } catch (error) {
            console.error('Ürünleri getirirken hata oluştu:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId: number, price: number) => {
        if (!token) {
            alert('Sepete eklemek için giriş yapmanız gerekiyor.');
            return;
        }

        try {
            const response = await addToCart(token, productId, price);
            if (response && !response.ok) {
                throw new Error(`Ürün sepete eklenemedi: ${response.status} - ${await response.text()}`);
            }
            alert('Ürün sepete eklendi!');
        } catch (error) {
            console.error('Ürün sepete eklenirken hata:', error);
            alert('Ürün sepete eklenirken bir hata oluştu');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [token]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6 text-center">Ürünlerimiz</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center">Yükleniyor...</p>
                ) : products.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">Ürün bulunamadı.</p>
                ) : (
                    products.map((product: ProductDto) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            imageSources={imageSources}
                            setImageSources={setImageSources}
                            onAddToCart={handleAddToCart}
                        />
                    ))
                )}
            </div>
        </div>
    );
}