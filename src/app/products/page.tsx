'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useAuth} from "@/contexts/AuthContext";

export interface ImageDto {
    id: number;
    imageUrl: string;
}

export interface ProductDto {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    productType: string;
    sellerId: number;
    sku: string;
    coverImageUrl: string | null;
    imageUrls: ImageDto[];
}

interface ResponseWrapper {
    data: ProductDto[];
    responseDate: string;
    message: string;
    success: boolean;
}

export default function ProductsPage() {

    const { token } = useAuth();
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
    const minioBaseUrl = 'http://localhost:9000/kasyus-products';
    const defaultImage = '/images/empty_image_2.jpg';

    const getImageUrl = (url: string | null): string => {
        if (!url || url === 'empty_image_2.jpg') {
            return defaultImage;
        }
        return url.startsWith('http') ? url : `${minioBaseUrl}/${url}`;
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/product-service/api/v1/products`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const data: ResponseWrapper = await response.json();
            if (data.success) {
                setProducts(data.data || []);
            } else {
                console.error('Ürünler yüklenemedi:', data.message);
                setProducts([]);
            }
        } catch (error) {
            console.error('Ürünleri getirirken hata oluştu:', error);
            setProducts([]);
        }
        setLoading(false);
    };

    const addToCart = async (productId: number, price: number) => {
        if (!token) {
            alert('Sepete eklemek için giriş yapmanız gerekiyor.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/cart-service/api/v1/carts/add`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    quantity: 1,
                    price,
                }),
            });

            if (!response.ok) {
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
    }, []);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = defaultImage;
        console.log('Görsel yüklenemedi, varsayılan kullanıldı:', e.currentTarget.src);
    };


    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6 text-center">Ürünlerimiz</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center">Yükleniyor...</p>
                ) : products.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">Ürün bulunamadı.</p>
                ) : (
                    products.map((product) => {
                        // Kapak görseli ve ek görselleri birleştir
                        const allImages = [
                            { id: 0, imageUrl: product.coverImageUrl || defaultImage },
                            ...product.imageUrls,
                        ];

                        return (
                            <div key={product.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-lg font-semibold text-orange-800 mb-2">
                                    {product.name}
                                </h2>
                                <p className="text-gray-600 mb-2 cursor-pointer" onClick={() => window.location.href = `/products/${product.id}`}>
                                    High-quality {product.name.toLowerCase()} for your needs.
                                </p>
                                <p className="text-orange-600 font-bold mb-4">{product.price.toFixed(2)} TL</p>

                                {/* Kapak Görseli ve Ek Görseller (Carousel) */}
                                <div className="relative h-48 mb-4 cursor-pointer" onClick={() => window.location.href = `/products/${product.id}`}>
                                    <Slider {...sliderSettings}>
                                        {allImages.map((image) => (
                                            <div key={image.id} className="relative w-full h-48">
                                                <Image
                                                    src={getImageUrl(image.imageUrl)}
                                                    alt={`${product.name} - ${image.id}`}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                    onError={handleImageError}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>

                                {/* Sepete Ekle Butonu */}
                                <button
                                    onClick={() => addToCart(product.id, product.price)}
                                    className="block w-full text-center bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                                >
                                    Sepete Ekle
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}