'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface CartItemDto {
  productId: number;
  quantity: number;
  price: string;
  name?: string;
  coverImageUrl?: string | null;
}

interface ProductDto {
  id: number;
  name: string;
  coverImageUrl: string | null;
}

interface CartData {
  items: CartItemDto[];
  totalPrice: string;
}

interface CartResponse {
  data: CartData | null;
  responseDate: string;
  message: string;
  success: boolean;
}

interface ProductResponse {
  data: ProductDto | null;
  success: boolean;
  message?: string;
  responseDate?: string;
}

export default function CartPage() {
  const {token } = useAuth();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<Map<number, ProductDto>>(new Map());
  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
  const minioBaseUrl = 'http://localhost:9000/kasyus-products';
  const defaultImage = '/images/empty_image_2.jpg';

  const getImageUrl = (url: string | null): string => {
    if (!url || url === 'empty_image_2.jpg') {
      return defaultImage;
    }
    return url.startsWith('http') ? url : `${minioBaseUrl}/${url}`;
  };

  const fetchProductDetails = async (productId: number): Promise<ProductDto | null> => {
    try {
      const response = await fetch(`${apiUrl}/product-service/api/v1/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Ürün detayları alınamadı (${productId}): ${response.status}`);
        return null;
      }

      const data: ProductResponse = await response.json();
      if (data.success && data.data) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error(`Ürün detayları alınırken hata (${productId}):`, error);
      return null;
    }
  };

  const fetchCart = async () => {
    if (!token) {
      setError('Giriş yapmanız gerekiyor.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/cart-service/api/v1/carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Sepet yüklenemedi: ${response.status} - ${await response.text()}`);
      }

      const data: CartResponse = await response.json();
      console.log('Sepet Yanıtı:', data);

      if (!data.success) {
        throw new Error(data.message || 'Sepet yüklenemedi');
      }

      if (!data.data) {
        console.warn('Sepet verisi null geldi');
        setCart({ items: [], totalPrice: '0' });
        return;
      }

      if (!Array.isArray(data.data.items)) {
        console.warn('Sepet öğeleri geçersiz:', data.data.items);
        throw new Error('Sepet öğeleri geçersiz');
      }

      setCart(data.data);

      const productDetailsMap = new Map<number, ProductDto>();
      const productIds = data.data.items.map((item) => item.productId);
      for (const productId of productIds) {
        if (!productDetailsMap.has(productId)) {
          const product = await fetchProductDetails(productId);
          if (product) {
            productDetailsMap.set(productId, product);
          }
        }
      }
      setProductDetails(productDetailsMap);
    } catch (error) {
      console.error('Sepeti getirirken hata:', error);
      setError(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu');
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (productId: number, quantity: number) => {
    try {
      const response = await fetch(`${apiUrl}/cart-service/api/v1/carts/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          price: cart?.items?.find((item) => item.productId === productId)?.price,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ürün güncellenemedi: ${response.status} - ${await response.text()}`);
      }

      await fetchCart();
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error);
      setError('Ürün güncellenirken bir hata oluştu');
    }
  };

  const removeItem = async (productId: number) => {
    try {
      const response = await fetch(`${apiUrl}/cart-service/api/v1/carts/remove?productId=${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Ürün kaldırılamadı: ${response.status} - ${await response.text()}`);
      }

      await fetchCart();
    } catch (error) {
      console.error('Ürün kaldırılırken hata:', error);
      setError('Ürün kaldırılırken bir hata oluştu');
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${apiUrl}/cart-service/api/v1/carts/clear`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Sepet temizlenemedi: ${response.status} - ${await response.text()}`);
      }

      setCart(null);
      setProductDetails(new Map());
    } catch (error) {
      console.error('Sepet temizlenirken hata:', error);
      setError('Sepet temizlenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  if (loading) return <p className="col-span-full text-center text-gray-700">Yükleniyor...</p>;
  if (error) return <p className="col-span-full text-center text-red-500">{error}</p>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
        <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-2xl font-semibold mb-4">Sepetinizde ürün bulunmamaktadır.</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Alışverişe Başla
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Sepetim</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sepet Öğeleri */}
          <div className="lg:col-span-3 space-y-6">
            {cart.items.map((item) => {
              const product = productDetails.get(item.productId);
              const itemPrice = parseFloat(item.price);
              const totalItemPrice = itemPrice * item.quantity;

              return (
                  <div
                      key={item.productId}
                      className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex items-center space-x-4"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                          src={getImageUrl(product?.coverImageUrl || defaultImage)}
                          alt={product?.name || 'Ürün'}
                          fill
                          className="object-cover rounded-lg"
                          onError={(e) => (e.currentTarget.src = defaultImage)}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product?.name || 'Bilinmeyen Ürün'}</h3>
                      <p className="text-gray-600 text-sm mt-1">Ürün Kodu: #{item.productId}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                              onClick={() => updateItem(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-gray-900 font-medium">{item.quantity}</span>
                          <button
                              onClick={() => updateItem(item.productId, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                        >
                          Ürünü Kaldır
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-600 text-lg font-bold absolute top-4 right-4">{totalItemPrice.toFixed(2)} TL</p>
                    </div>
                  </div>
              );
            })}
            <button
                onClick={clearCart}
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-semibold transition-colors duration-200 mt-4"
            >
              Sepeti Temizle
            </button>
          </div>

          {/* Ödeme Özeti */}
          <div className="lg:col-span-1 sticky top-6 self-start">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ödeme Özeti</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Ara Toplam</span>
                  <span>{parseFloat(cart.totalPrice).toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Kargo</span>
                  <span>Ücretsiz</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-lg mt-4 border-t pt-4">
                  <span>Toplam</span>
                  <span>{parseFloat(cart.totalPrice).toFixed(2)} TL</span>
                </div>
              </div>
              <Link
                  href="/checkout"
                  className="block w-full mt-6 bg-orange-500 text-white text-center py-3 rounded-lg hover:bg-orange-600 font-semibold transition-colors duration-200"
              >
                Alışverişi Tamamla
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}