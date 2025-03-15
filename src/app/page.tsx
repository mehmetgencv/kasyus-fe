'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Ürün ve görsel tipleri
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

export default function HomePage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Tüm görsellerin src değerlerini tutacak bir state
  const [imageSources, setImageSources] = useState<Record<string, string>>({});
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
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/product-service/api/v1/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Ürünler yüklenemedi: ${response.status}`);
      }
      const data: ResponseWrapper = await response.json();
      console.log('API Yanıtı:', data);
      if (data.success && data.data) {
        setProducts(data.data);
        // Ürünler yüklendiğinde görsel kaynaklarını başlat
        const initialImageSources: Record<string, string> = {};
        data.data.forEach((product) => {
          const allImages = [
            { id: 0, imageUrl: product.coverImageUrl || defaultImage },
            ...product.imageUrls,
          ];
          allImages.forEach((image) => {
            initialImageSources[`${product.id}-${image.id}`] = getImageUrl(image.imageUrl);
          });
        });
        setImageSources(initialImageSources);
      } else {
        throw new Error(data.message || 'Ürünler yüklenemedi');
      }
    } catch (error) {
      console.error('Ürünleri getirirken hata:', error);
      setError(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageError = (productId: number, imageId: number) => {
    const key = `${productId}-${imageId}`;
    console.log(`Görsel yüklenemedi: ${imageSources[key]}, varsayılan kullanılıyor`);
    setImageSources((prev) => ({
      ...prev,
      [key]: defaultImage,
    }));
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
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Türkiyenin En Yeni Alışveriş Anlayışı
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
              <p className="col-span-full text-center text-gray-700">Yükleniyor...</p>
          ) : error ? (
              <p className="col-span-full text-center text-red-500">{error}</p>
          ) : products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">Ürün bulunamadı.</p>
          ) : (
              products.map((product) => {
                const allImages = [
                  { id: 0, imageUrl: product.coverImageUrl || defaultImage },
                  ...product.imageUrls,
                ];

                return (
                    <div
                        key={product.id}
                        className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                    >
                      <h2 className="text-lg font-semibold text-orange-800 mb-2">{product.name}</h2>
                      <p
                          className="text-gray-600 mb-2 cursor-pointer"
                          onClick={() => (window.location.href = `/products/${product.id}`)}
                      >
                        High-quality {product.name.toLowerCase()} for your needs.
                      </p>
                      <p className="text-orange-600 font-bold mb-4">{product.price.toFixed(2)} TL</p>

                      <div
                          className="relative h-48 mb-4 cursor-pointer"
                          onClick={() => (window.location.href = `/products/${product.id}`)}
                      >
                        <Slider {...sliderSettings}>
                          {allImages.map((image) => {
                            const imageKey = `${product.id}-${image.id}`;
                            const imgSrc = imageSources[imageKey] || defaultImage;

                            return (
                                <div key={image.id} className="relative w-full h-48">
                                  <Image
                                      src={imgSrc}
                                      alt={`${product.name} - ${image.id}`}
                                      fill
                                      className="object-cover rounded-lg"
                                      onError={() => handleImageError(product.id, image.id)}
                                  />
                                </div>
                            );
                          })}
                        </Slider>
                      </div>

                      <Link
                          href={`/products/${product.id}`}
                          className="block w-full text-center bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                      >
                        Sepete Ekle
                      </Link>
                    </div>
                );
              })
          )}
        </div>
      </div>
  );
}