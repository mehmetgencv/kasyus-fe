'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProducts, addToCart } from '@/utils/api';
import { getImageUrl, defaultImage } from '@/utils/imageUtils';
import { ProductDto } from '@/types/product';
import { ResponseWrapper } from '@/types/response';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageSources, setImageSources] = useState<Record<string, string>>({});

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts(token);
      const data: ResponseWrapper<ProductDto[]> = response;
      console.log('API Yanıtı:', data);
      if (data.success && data.data) {
        setProducts(data.data);

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

  const handleAddToCart = async (productId: number, price: number) => {
    if (!token) {
      alert('Sepete eklemek için giriş yapmanız gerekiyor.');
      return;
    }

    try {
      await addToCart(token, productId, price);
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