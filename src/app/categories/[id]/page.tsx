'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

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
}

export interface CategoryDto {
  id: number;
  name: string;
}

interface ProductResponse {
  data: ProductDto[];
  success: boolean;
  message?: string;
  responseDate?: string;
}

interface CategoryResponse {
  data: CategoryDto;
  success: boolean;
  message?: string;
  responseDate?: string;
}

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); // params'i React.use() ile unwrap ediyoruz
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [category, setCategory] = useState<CategoryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());
  const [filter, setFilter] = useState('recommended'); // Varsayılan filtre
  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
  const minioBaseUrl = 'http://localhost:9000/kasyus-products';
  const defaultImage = '/images/empty_image_2.jpg';

  const getImageUrl = async (url: string | null): Promise<string> => {
    if (!url || url === 'empty_image_2.jpg') return defaultImage;

    const fullUrl = `${minioBaseUrl}/${url}`;
    try {
      const response = await fetch(fullUrl, { method: 'HEAD' });
      if (!response.ok) {
        console.warn(`Görsel bulunamadı (${fullUrl}): ${response.status}, varsayılan kullanılacak`);
        return defaultImage;
      }
      return fullUrl;
    } catch (error) {
      console.error('Görsel kontrol hatası:', error);
      return defaultImage;
    }
  };

  const preloadImages = async (products: ProductDto[]) => {
    const imageMap = new Map<string, string>();
    for (const product of products) {
      const allImages = [
        { id: 0, imageUrl: product.coverImageUrl || defaultImage },
        ...product.imageUrls,
      ];
      for (const image of allImages) {
        const key = `${product.id}-${image.id}`;
        const imgSrc = await getImageUrl(image.imageUrl);
        imageMap.set(key, imgSrc);
        console.log(`Ön yüklenen görsel: ${key} -> ${imgSrc}`);
      }
    }
    setImageUrls(imageMap);
  };

  const applyFilter = (products: ProductDto[]): ProductDto[] => {
    switch (filter) {
      case 'lowestPrice':
        return [...products].sort((a, b) => a.price - b.price);
      case 'highestPrice':
        return [...products].sort((a, b) => b.price - a.price);
      case 'mostSold':
        return [...products].sort((a, b) => (b.sku.length || 0) - (a.sku.length || 0)); // Örnek, backend'den satış verisi gelmeli
      case 'mostFavorited':
        return [...products].sort((a, b) => (b.sellerId || 0) - (a.sellerId || 0)); // Örnek, favori sayısı için
      case 'newest':
        return [...products].sort((a, b) => (b.id || 0) - (a.id || 0)); // ID ile yeni ürünleri simüle ediyoruz
      case 'mostReviewed':
        return [...products].sort((a, b) => (b.sku.length || 0) - (a.sku.length || 0)); // Örnek, değerlendirme sayısı için
      default:
        return products; // Önerilen (default)
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`${apiUrl}/product-service/api/v1/categories/${resolvedParams.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Kategori yüklenemedi: ${response.status} - ${await response.text()}`);
        }

        const data: CategoryResponse = await response.json();
        console.log('Kategori:', data);
        if (data.success && data.data) {
          setCategory(data.data);
        } else {
          throw new Error(data.message || 'Kategori yüklenemedi');
        }
      } catch (error) {
        console.error('Kategoriyi getirirken hata:', error);
        setError(error instanceof Error ? error.message : 'Kategori yüklenirken bilinmeyen bir hata oluştu');
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/product-service/api/v1/products?categoryId=${resolvedParams.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Ürünler yüklenemedi: ${response.status} - ${await response.text()}`);
        }

        const data: ProductResponse = await response.json();
        console.log('Ürünler API Cevabı:', data); // Tam cevabı log'lama
        if (data.success && data.data) {
          // Backend'den gelen ürünleri categoryId ile filtreleme
          const filteredProducts = data.data.filter(product => product.categoryId === parseInt(resolvedParams.id));
          setProducts(filteredProducts);
          await preloadImages(filteredProducts);
        } else {
          throw new Error(data.message || 'Ürünler yüklenemedi');
        }
      } catch (error) {
        console.error('Ürünleri getirirken hata:', error);
        setError(error instanceof Error ? error.message : 'Ürünler yüklenirken bilinmeyen bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    Promise.all([fetchCategory(), fetchProducts()]).catch(() => {
      setError('Veriler yüklenirken bir hata oluştu');
      setLoading(false);
    });
  }, [resolvedParams.id]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultImage;
    console.log('Görsel yüklenemedi, varsayılan kullanıldı:', e.currentTarget.src);
  };

  const filteredProducts = applyFilter(products);

  if (loading) return <p className="text-center text-gray-700">Yükleniyor...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex items-center mb-4">
          <div className="category-header">
            <h1 className="text-base font-semibold text-gray-800">
              <Link href="/" className="text-gray-600 hover:underline">Kasyus</Link>{' '}
              <span className="text-gray-500">{' > '}</span>{' '}
              <Link href={`/categories/${resolvedParams.id}`} className="text-black hover:underline">
                {category ? category.name : 'Kategori'}
              </Link>
            </h1>
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          "{category ? category.name : 'Kategori'}" araması için {products.length} sonuç listeleniyor
        </p>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700">Filtreleme</h2>
          <div className="flex gap-4 mt-2 flex-wrap">
            <button
                className={`px-4 py-2 ${filter === 'recommended' ? 'bg-orange-500 text-white' : 'bg-white border text-gray-700'} rounded-lg hover:bg-gray-200`}
                onClick={() => setFilter('recommended')}
            >
              Önerilen
            </button>
            <button
                className={`px-4 py-2 ${filter === 'lowestPrice' ? 'bg-orange-500 text-white' : 'bg-white border text-gray-700'} rounded-lg hover:bg-gray-200`}
                onClick={() => setFilter('lowestPrice')}
            >
              En Düşük Fiyat
            </button>
            <button
                className={`px-4 py-2 ${filter === 'highestPrice' ? 'bg-orange-500 text-white' : 'bg-white border text-gray-700'} rounded-lg hover:bg-gray-200`}
                onClick={() => setFilter('highestPrice')}
            >
              En Yüksek Fiyat
            </button>
            <button
                className={`px-4 py-2 ${filter === 'mostSold' ? 'bg-orange-500 text-white' : 'bg-white border text-gray-700'} rounded-lg hover:bg-gray-200`}
                onClick={() => setFilter('mostSold')}
            >
              En Çok Satan
            </button>
            <button
                className={`px-4 py-2 ${filter === 'mostFavorited' ? 'bg-orange-500 text-white' : 'bg-white border text-gray-700'} rounded-lg hover:bg-gray-200`}
                onClick={() => setFilter('mostFavorited')}
            >
              En Favoriler
            </button>
            <button
                className={`px-4 py-2 ${filter === 'newest' ? 'bg-orange-500 text-white' : 'bg-white border text-gray-700'} rounded-lg hover:bg-gray-200`}
                onClick={() => setFilter('newest')}
            >
              En Yeniler
            </button>
            <button
                className={`px-4 py-2 ${filter === 'mostReviewed' ? 'bg-orange-500 text-white' : 'bg-white border text-gray-700'} rounded-lg hover:bg-gray-200`}
                onClick={() => setFilter('mostReviewed')}
            >
              En Çok Değerlendirilen
            </button>
          </div>
        </div>
        {products.length === 0 ? (
            <p className="text-center text-gray-700">Bu kategoride ürün bulunamadı.</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const allImages = [
                  { id: 0, imageUrl: product.coverImageUrl || defaultImage },
                  ...product.imageUrls,
                ];
                const key = `${product.id}-0`;
                const imgSrc = imageUrls.get(key) || defaultImage;
                return (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-48">
                        <Image
                            src={imgSrc}
                            alt={product.name}
                            fill
                            className="object-cover"
                            onError={handleImageError}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{product.description.substring(0, 50)}...</p>
                        <p className="text-orange-600 font-bold mt-2">{product.price.toFixed(2)} TL</p>
                        {product.originalPrice && (
                            <span className="text-green-600 text-sm">
                      %{((1 - product.price / product.originalPrice) * 100).toFixed(0)} İndirim
                    </span>
                        )}
                        <Link
                            href={`/products/${product.id}`}
                            className="block mt-2 bg-orange-500 text-white text-center py-2 rounded-lg hover:bg-orange-600"
                        >
                          Sepete Ekle
                        </Link>
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}