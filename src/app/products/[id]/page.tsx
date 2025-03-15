'use client';

import { use, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import { FaHeart, FaStar } from 'react-icons/fa';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export interface ImageDto {
    id: number;
    imageUrl: string;
}

export interface ProductDto {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    categoryId: number;
    productType: string;
    sellerId: number;
    sku: string;
    coverImageUrl: string | null;
    imageUrls: ImageDto[];
    rating?: number;
    reviewCount?: number;
}

interface ApiResponse {
    data: ProductDto | null;
    success: boolean;
    message?: string;
    responseDate?: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [product, setProduct] = useState<ProductDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const sliderRef = useRef<Slider | null>(null); // Slider referansı
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
    const minioBaseUrl = 'http://localhost:9000/kasyus-products';
    const defaultImage = `${minioBaseUrl}/empty_image_2.jpg`;

    const getImageUrl = (url: string | null): string => {
        return url && url !== 'empty_image_2.jpg' ? `${minioBaseUrl}/${url}` : defaultImage;
    };

    const fetchProduct = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!resolvedParams.id) {
                throw new Error('Ürün ID’si tanımsız');
            }
            console.log('Fetching product with ID:', resolvedParams.id);
            const response = await fetch(`${apiUrl}/product-service/api/v1/products/${resolvedParams.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API hatası: ${response.status} - ${errorText || 'Bilinmeyen hata'}`);
            }

            const data: ApiResponse = await response.json();
            console.log('API Response:', data);

            if (!data.success || !data.data) {
                throw new Error(data.message || 'Ürün yüklenemedi');
            }

            setProduct(data.data);
        } catch (error) {
            console.error('Ürün yüklenirken hata:', error);
            setError(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [resolvedParams.id]);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = defaultImage;
        console.log('Görsel yüklenemedi, varsayılan kullanıldı:', e.currentTarget.src);
    };

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: true,
        afterChange: (index: number) => setSelectedImageIndex(index),
    };

    const handleThumbnailClick = (index: number) => {
        setSelectedImageIndex(index);
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index); // Carousel'i seçilen indekse götür
        }
    };

    if (loading) return <div className="text-center p-6">Yükleniyor...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
    if (!product) return <div className="text-center p-6 text-red-500">Ürün bulunamadı</div>;

    const allImages = [
        { id: 0, imageUrl: product.coverImageUrl || defaultImage },
        ...product.imageUrls,
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sol Taraf: Görseller */}
                <div className="space-y-4">
                    {/* Ana Görsel (Carousel) */}
                    <div className="relative h-96 rounded-lg overflow-hidden shadow-md">
                        <Slider {...sliderSettings} ref={sliderRef}>
                            {allImages.map((image) => (
                                <div key={image.id} className="relative w-full h-96">
                                    <Image
                                        src={getImageUrl(image.imageUrl)}
                                        alt={`${product.name} - Görsel ${image.id}`}
                                        fill
                                        className="object-cover"
                                        onError={handleImageError}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>

                    {/* Thumbnail Görseller */}
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                        {allImages.map((image, index) => (
                            <div
                                key={image.id}
                                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer ${
                                    selectedImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                                }`}
                                onClick={() => handleThumbnailClick(index)}
                            >
                                <Image
                                    src={getImageUrl(image.imageUrl)}
                                    alt={`${product.name} - Thumbnail ${image.id}`}
                                    fill
                                    className="object-cover"
                                    onError={handleImageError}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sağ Taraf: Ürün Bilgileri */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                    {/* Puan ve Yorum */}
                    <div className="flex items-center space-x-2 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < (product.rating || 4) ? 'text-yellow-500' : 'text-gray-300'} />
                        ))}
                        <span className="text-gray-600 ml-2">{product.reviewCount || 125} Yorum</span>
                    </div>

                    {/* Fiyat ve İndirim */}
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-orange-600">{product.price.toFixed(2)} TL</p>
                        {product.originalPrice && (
                            <>
                                <p className="text-gray-500 line-through">{product.originalPrice.toFixed(2)} TL</p>
                                <span className="text-green-600 font-semibold">
                  %{((1 - product.price / product.originalPrice) * 100).toFixed(0)} İndirim
                </span>
                            </>
                        )}
                    </div>

                    {/* Satıcı ve Teslimat */}
                    <div className="border-t border-b py-4">
                        <p className="text-gray-700">
                            Satıcı: <span className="text-orange-600 font-semibold">Kasyus Store</span>
                        </p>
                        <p className="text-gray-700">
                            Teslimat: <span className="text-green-600 font-semibold">Hızlı Teslimat</span>
                        </p>
                    </div>

                    {/* Seçenekler (Renk) */}
                    <div className="space-y-2">
                        <p className="text-gray-800 font-semibold">Renk Seçimi:</p>
                        <div className="flex space-x-2">
                            {['Siyah', 'Beyaz', 'Mavi'].map((color) => (
                                <button
                                    key={color}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Butonlar */}
                    <div className="flex space-x-4">
                        <button className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-semibold">
                            Sepete Ekle
                        </button>
                        <button className="p-3 border rounded-lg hover:bg-gray-100">
                            <FaHeart className="text-gray-600 text-xl" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Alt Kısım: Ürün Açıklaması ve Ek Detaylar */}
            <div className="mt-12 space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ürün Açıklaması</h2>
                    <p className="text-gray-700 leading-relaxed">{product.description || 'Ürün açıklaması mevcut değil.'}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Teknik Özellikler</h2>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                        <li>Kategori: {product.productType}</li>
                        <li>Marka: Kasyus</li>
                        <li>Garanti: 2 Yıl</li>
                        <li>Stok Kodu: {product.sku}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Kullanıcı Yorumları</h2>
                    <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center space-x-2 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < 4 ? 'text-yellow-500' : 'text-gray-300'} />
                                ))}
                            </div>
                            <p className="text-gray-700 mt-2">Harika bir ürün, çok memnun kaldım!</p>
                            <p className="text-gray-500 text-sm mt-1">Ahmet Y. - 12 Mart 2025</p>
                        </div>
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center space-x-2 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < 3 ? 'text-yellow-500' : 'text-gray-300'} />
                                ))}
                            </div>
                            <p className="text-gray-700 mt-2">Fiyatına göre iyi, ama teslimat biraz gecikti.</p>
                            <p className="text-gray-500 text-sm mt-1">Ayşe K. - 10 Mart 2025</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}