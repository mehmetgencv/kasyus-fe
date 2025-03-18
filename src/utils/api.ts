// utils/api.ts

const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';

export const fetchWithAuth = async (endpoint: string, token: string | null, options: RequestInit = {}) => {
    const headers = {
        Authorization: `Bearer ${token || localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(`${apiUrl}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        throw new Error(`API Hatası: ${response.status} - ${await response.text()}`);
    }
    return response.json();
};

export const getProducts = (token: string | null) => fetchWithAuth('/product-service/api/v1/products', token);

export const addToCart = (token: string | null, productId: number, price: number, quantity: number = 1) =>
    fetchWithAuth('/cart-service/api/v1/carts/add', token, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, price }),
    });